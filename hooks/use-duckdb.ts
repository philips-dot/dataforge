'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export interface AntiPattern {
  type: 'select_star' | 'no_filter' | 'cartesian_join'
  severity: 'warning' | 'critical'
  message: string
  tip: string
}

export interface QueryResult {
  columns: string[]
  rows: Record<string, unknown>[]
  rowCount: number
  executionMs: number
  simulatedGB: number
  simulatedCostUSD: number
  score: number
  antiPatterns: AntiPattern[]
  error?: string
}

// Tailles simulées (comme si c'était BigQuery en production)
const TABLE_SIZES_GB: Record<string, number> = {
  orders:   800,
  sessions: 1200,
  users:    50,
}

function detectAntiPatterns(sql: string): { patterns: AntiPattern[]; penalty: number } {
  const patterns: AntiPattern[] = []
  let penalty = 1

  if (/SELECT\s+\*/i.test(sql)) {
    patterns.push({
      type: 'select_star',
      severity: 'critical',
      message: 'SELECT * détecté — toutes les colonnes sont scannées',
      tip: 'Liste uniquement les colonnes dont tu as besoin. Coût ×3 sur BigQuery réel.',
    })
    penalty *= 3
  }

  // Pas de WHERE ni de ON (pas de filtre du tout)
  if (!/WHERE\s/i.test(sql) && !/\bON\s/i.test(sql)) {
    patterns.push({
      type: 'no_filter',
      severity: 'critical',
      message: 'Pas de filtre WHERE — scan complet de la table',
      tip: 'Ajoute WHERE date >= ... pour limiter le scan. Coût ×8 sur BigQuery réel.',
    })
    penalty *= 8
  }

  // JOIN sans ON ni USING
  if (/\bJOIN\b/i.test(sql) && !/\bON\b/i.test(sql) && !/\bUSING\b/i.test(sql)) {
    patterns.push({
      type: 'cartesian_join',
      severity: 'critical',
      message: 'JOIN sans condition ON — produit cartésien probable',
      tip: 'Ajoute ON table1.id = table2.id. Sans ça : n × m lignes retournées. Coût ×20.',
    })
    penalty *= 20
  }

  return { patterns, penalty }
}

function computeScore(sql: string, costUSD: number): number {
  let score = 100
  if (/SELECT\s+\*/i.test(sql))          score -= 35
  if (!/WHERE\s/i.test(sql))             score -= 30
  if (/\bJOIN\b/i.test(sql) && !/\bON\b/i.test(sql) && !/\bUSING\b/i.test(sql)) score -= 40
  if (costUSD > 5.0)                     score -= 20
  if (costUSD > 1.0)                     score -= 10
  return Math.max(0, score)
}

// Adapte la syntaxe BigQuery → DuckDB
function adaptSQL(sql: string): string {
  return sql
    // _PARTITIONDATE → date
    .replace(/_PARTITIONDATE/g, 'date')
    // CURRENT_DATE() → CURRENT_DATE
    .replace(/CURRENT_DATE\s*\(\s*\)/g, 'CURRENT_DATE')
    // DATE_SUB(CURRENT_DATE, INTERVAL n DAY) → CURRENT_DATE - INTERVAL 'n' DAY
    .replace(/DATE_SUB\s*\(\s*CURRENT_DATE\s*,\s*INTERVAL\s+(\d+)\s+DAY\s*\)/gi,
             "(CURRENT_DATE - INTERVAL '$1' DAY)")
    // CURRENT_DATE - 1 → CURRENT_DATE - INTERVAL '1' DAY
    .replace(/CURRENT_DATE\s*-\s*(\d+)/g, "(CURRENT_DATE - INTERVAL '$1' DAY)")
    // DATE_TRUNC('month', ...) → DATE_TRUNC('month', ...)  ← DuckDB compatible
    // COUNTIF → COUNT(CASE WHEN ... THEN 1 END) (approximation)
    .replace(/COUNTIF\s*\(\s*(.+?)\s*\)/gi, 'COUNT(CASE WHEN $1 THEN 1 END)')
    // ::int → ::INTEGER (DuckDB)
    .replace(/::int\b/gi, '::INTEGER')
    // NULLIF pattern OK pour DuckDB
}

// Singleton global pour éviter plusieurs instanciations
let globalDB: unknown = null
let globalConn: unknown = null
let initPromise: Promise<void> | null = null

async function initDuckDB(): Promise<void> {
  if (globalConn) return

  const duckdb = await import('@duckdb/duckdb-wasm')
  const BUNDLES = duckdb.getJsDelivrBundles()
  const bundle = await duckdb.selectBundle(BUNDLES)

  const workerUrl = URL.createObjectURL(
    new Blob(
      [`importScripts("${bundle.mainWorker}");`],
      { type: 'application/javascript' }
    )
  )

  const worker = new Worker(workerUrl)
  const logger = new duckdb.ConsoleLogger(duckdb.LogLevel.WARNING)
  const db = new duckdb.AsyncDuckDB(logger, worker)
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker)

  const conn = await db.connect()

  // DuckDB-WASM tourne dans le navigateur : il faut d'abord
  // télécharger les fichiers via fetch(), les enregistrer dans
  // le système de fichiers virtuel de DuckDB, puis les lire.
  const files = ['orders.json', 'sessions.json', 'users.json']
  await Promise.all(files.map(async (file) => {
    const res = await fetch(`/data/${file}`)
    if (!res.ok) throw new Error(`Impossible de charger ${file} (${res.status})`)
    const buffer = await res.arrayBuffer()
    await db.registerFileBuffer(file, new Uint8Array(buffer))
  }))

  await conn.query(`CREATE TABLE IF NOT EXISTS orders   AS SELECT * FROM read_json_auto('orders.json')`)
  await conn.query(`CREATE TABLE IF NOT EXISTS sessions AS SELECT * FROM read_json_auto('sessions.json')`)
  await conn.query(`CREATE TABLE IF NOT EXISTS users    AS SELECT * FROM read_json_auto('users.json')`)

  globalDB = db
  globalConn = conn
}

export function useDuckDB() {
  const [isReady, setIsReady] = useState(false)
  const [initError, setInitError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    if (!initPromise) {
      initPromise = initDuckDB()
    }

    initPromise
      .then(() => {
        if (mountedRef.current) setIsReady(true)
      })
      .catch(err => {
        if (mountedRef.current) {
          setInitError(err instanceof Error ? err.message : 'Erreur DuckDB')
        }
        initPromise = null
      })

    return () => { mountedRef.current = false }
  }, [])

  const runQuery = useCallback(async (rawSQL: string): Promise<QueryResult> => {
    if (!globalConn) {
      return {
        columns: [], rows: [], rowCount: 0, executionMs: 0,
        simulatedGB: 0, simulatedCostUSD: 0, score: 0,
        antiPatterns: [], error: 'Base de données non encore prête — réessaie dans 1 seconde.',
      }
    }

    // Bloquer les requêtes d'écriture
    if (/\b(INSERT|UPDATE|DELETE|DROP\s+TABLE|CREATE\s+TABLE|ALTER|TRUNCATE|MERGE)\b/i.test(rawSQL)) {
      return {
        columns: [], rows: [], rowCount: 0, executionMs: 0,
        simulatedGB: 0, simulatedCostUSD: 0, score: 0, antiPatterns: [],
        error: 'Seules les requêtes SELECT sont autorisées sur DataForge.',
      }
    }

    const adaptedSQL = adaptSQL(rawSQL)
    const { patterns, penalty } = detectAntiPatterns(rawSQL)

    // Calculer le coût simulé avant d'exécuter
    const tableMatches = [...rawSQL.matchAll(/\b(?:FROM|JOIN)\s+(\w+)/gi)]
    const tables = tableMatches.map(m => m[1].toLowerCase())
    const baseGB = tables.reduce((sum, t) => sum + (TABLE_SIZES_GB[t] ?? 100), 0) || 800
    const simulatedGB = Math.round(baseGB * penalty)
    const simulatedCostUSD = parseFloat(((simulatedGB / 1000) * 6.25).toFixed(4))

    const start = performance.now()
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const conn = globalConn as any
      const result = await conn.query(adaptedSQL)
      const executionMs = Math.round(performance.now() - start)

      const columns: string[] = result.schema.fields.map((f: { name: string }) => f.name)
      const rawRows = result.toArray()

      // Sérialiser proprement (BigInt, Date, Buffer → string)
      const rows: Record<string, unknown>[] = rawRows.slice(0, 100).map((row: Record<string, unknown>) => {
        const out: Record<string, unknown> = {}
        for (const col of columns) {
          const v = row[col]
          if (v === null || v === undefined) {
            out[col] = null
          } else if (typeof v === 'bigint') {
            out[col] = Number(v)
          } else if (v instanceof Date) {
            out[col] = v.toISOString().split('T')[0]
          } else if (typeof v === 'object' && v !== null && 'toString' in v) {
            out[col] = v.toString()
          } else {
            out[col] = v
          }
        }
        return out
      })

      const score = computeScore(rawSQL, simulatedCostUSD)

      return {
        columns,
        rows,
        rowCount: result.numRows,
        executionMs,
        simulatedGB,
        simulatedCostUSD,
        score,
        antiPatterns: patterns,
      }
    } catch (err) {
      return {
        columns: [], rows: [], rowCount: 0,
        executionMs: Math.round(performance.now() - start),
        simulatedGB, simulatedCostUSD, score: 0,
        antiPatterns: patterns,
        error: err instanceof Error ? err.message : 'Erreur SQL inconnue',
      }
    }
  }, [])

  return { isReady, initError, runQuery }
}
