'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { useDuckDB } from '@/hooks/use-duckdb'
import type { QueryResult } from '@/hooks/use-duckdb'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: 13 }}>
      Chargement de l&apos;éditeur…
    </div>
  ),
})

interface SQLEditorLiveProps {
  starterSQL: string
  maxCostUSD: number
  minScore: number
  hints: string[]
  moduleId: string
  onValidated: (sql: string) => void
  onResult?: (result: QueryResult) => void
}

export function SQLEditorLive({
  starterSQL, maxCostUSD, minScore, hints, moduleId, onValidated, onResult,
}: SQLEditorLiveProps) {
  const [sql, setSQL] = useState(starterSQL)
  const [result, setResult] = useState<QueryResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [hintIndex, setHintIndex] = useState(-1)
  const { isReady, initError, runQuery } = useDuckDB()

  // Reset quand on change de module
  useEffect(() => {
    setSQL(starterSQL)
    setResult(null)
    setHintIndex(-1)
  }, [moduleId, starterSQL])

  const handleRun = useCallback(async () => {
    if (!isReady || isRunning) return
    setIsRunning(true)
    const r = await runQuery(sql)
    setResult(r)
    onResult?.(r)
    setIsRunning(false)
  }, [isReady, isRunning, runQuery, sql])

  // Raccourci Ctrl+Enter / Cmd+Enter
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        handleRun()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleRun])

  const isValid = Boolean(
    result && !result.error &&
    result.simulatedCostUSD <= maxCostUSD &&
    result.score >= minScore
  )

  // Couleur du coût simulé
  const costColor = !result || result.error ? '#64748b'
    : result.simulatedCostUSD > 5 ? '#ef4444'
    : result.simulatedCostUSD > 1 ? '#f59e0b'
    : '#22c55e'

  const scoreColor = !result ? '#64748b'
    : result.score >= 80 ? '#22c55e'
    : result.score >= 60 ? '#f59e0b'
    : '#ef4444'

  if (initError) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 24, color: '#ef4444', fontSize: 13 }}>
        Erreur DuckDB : {initError}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#060a10' }}>

      {/* ── Header éditeur ───────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 12px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(255,255,255,0.02)',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 11, color: '#334155', fontWeight: 600 }}>SQL</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: isReady ? '#22c55e' : '#f59e0b',
          }} />
          <span style={{ fontSize: 11, color: '#475569' }}>
            {isReady ? 'DuckDB prêt' : 'Chargement…'}
          </span>
        </div>
        <span style={{ fontSize: 10, color: '#334155' }}>⌘↵ pour exécuter</span>
      </div>

      {/* ── Monaco Editor ────────────────────────────────────────── */}
      <div style={{ height: 200, flexShrink: 0 }}>
        <MonacoEditor
          language="sql"
          value={sql}
          onChange={v => setSQL(v ?? '')}
          theme="vs-dark"
          onMount={(_, monaco) => {
            monaco.editor.defineTheme('df-dark', {
              base: 'vs-dark',
              inherit: true,
              rules: [
                { token: 'keyword', foreground: '818cf8', fontStyle: 'bold' },
                { token: 'string', foreground: '86efac' },
                { token: 'comment', foreground: '475569', fontStyle: 'italic' },
                { token: 'number', foreground: 'fcd34d' },
                { token: 'operator', foreground: '94a3b8' },
              ],
              colors: {
                'editor.background': '#0d1117',
                'editor.lineHighlightBackground': '#161b22',
                'editorLineNumber.foreground': '#2d3748',
                'editorLineNumber.activeForeground': '#64748b',
                'editorCursor.foreground': '#6366f1',
                'editor.selectionBackground': '#6366f130',
              },
            })
            monaco.editor.setTheme('df-dark')
          }}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            padding: { top: 12, bottom: 12 },
            wordWrap: 'on',
            renderLineHighlight: 'line',
            smoothScrolling: true,
            quickSuggestions: { other: true, comments: false, strings: false },
          }}
        />
      </div>

      {/* ── Barre d'actions ──────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        padding: '8px 12px',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(255,255,255,0.02)',
        flexShrink: 0,
      }}>
        {/* Bouton Exécuter */}
        <button
          onClick={handleRun}
          disabled={!isReady || isRunning}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '7px 14px', borderRadius: 8, border: 'none', cursor: isRunning ? 'wait' : 'pointer',
            background: isRunning ? 'rgba(99,102,241,0.4)' : '#6366f1',
            color: '#fff', fontSize: 13, fontWeight: 700,
            opacity: (!isReady || isRunning) ? 0.6 : 1,
            transition: 'all 0.15s',
            flexShrink: 0,
          }}
        >
          {isRunning
            ? <><span style={{ display: 'inline-block', animation: 'df-spin 1s linear infinite' }}>⏳</span> Exécution…</>
            : '▶ Exécuter'}
        </button>

        {/* Métriques */}
        {result && !result.error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: costColor }}>
                ${result.simulatedCostUSD.toFixed(2)}
              </div>
              <div style={{ fontSize: 9, color: '#334155' }}>simulé</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#64748b' }}>{result.simulatedGB} Go</div>
              <div style={{ fontSize: 9, color: '#334155' }}>scannés</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#64748b' }}>{result.executionMs}ms</div>
              <div style={{ fontSize: 9, color: '#334155' }}>DuckDB</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: scoreColor }}>{result.score}/100</div>
              <div style={{ fontSize: 9, color: '#334155' }}>score</div>
            </div>
          </div>
        )}

        {/* Bouton indice */}
        {hints.length > 0 && (
          <button
            onClick={() => setHintIndex(i => Math.min(i + 1, hints.length - 1))}
            disabled={hintIndex >= hints.length - 1}
            style={{
              marginLeft: 'auto', fontSize: 11, fontWeight: 600,
              color: hintIndex >= hints.length - 1 ? '#334155' : '#6366f1',
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            💡 Indice {Math.min(hintIndex + 2, hints.length)}/{hints.length}
          </button>
        )}

        {/* Bouton Valider */}
        <AnimatePresence>
          {isValid && (
            <motion.button
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              onClick={() => onValidated(sql)}
              style={{
                padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: '#fff', fontSize: 13, fontWeight: 700,
                flexShrink: 0,
              }}
            >
              ✓ Valider →
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Indice affiché ───────────────────────────────────────── */}
      <AnimatePresence>
        {hintIndex >= 0 && hints[hintIndex] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              padding: '8px 12px', fontSize: 12, flexShrink: 0,
              color: '#818cf8',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(99,102,241,0.05)',
            }}
          >
            💡 {hints[hintIndex]}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Anti-patterns ────────────────────────────────────────── */}
      <AnimatePresence>
        {result?.antiPatterns && result.antiPatterns.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: '8px 12px', flexShrink: 0,
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', flexDirection: 'column', gap: 4,
            }}
          >
            {result.antiPatterns.map((ap, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 11 }}>
                <span>{ap.severity === 'critical' ? '🔴' : '🟡'}</span>
                <span style={{ color: ap.severity === 'critical' ? '#fca5a5' : '#fcd34d', fontWeight: 600 }}>
                  {ap.message}
                </span>
                <span style={{ color: '#475569', marginLeft: 4 }}>→ {ap.tip}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Erreur SQL ───────────────────────────────────────────── */}
      {result?.error && (
        <div style={{
          margin: 10, padding: '10px 12px', borderRadius: 8, flexShrink: 0,
          background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', marginBottom: 4 }}>⚠ ERREUR SQL</div>
          <pre style={{ fontSize: 11, color: '#fca5a5', margin: 0, whiteSpace: 'pre-wrap', fontFamily: "'JetBrains Mono', monospace" }}>
            {result.error}
          </pre>
        </div>
      )}

      {/* ── Tableau de résultats ─────────────────────────────────── */}
      {result?.rows && result.rows.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ position: 'sticky', top: 0, background: '#0d1117', zIndex: 1 }}>
                {result.columns.map(col => (
                  <th key={col} style={{
                    textAlign: 'left', padding: '7px 12px',
                    color: '#64748b', fontWeight: 600, fontSize: 11,
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    whiteSpace: 'nowrap',
                  }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  {result.columns.map(col => (
                    <td key={col} style={{
                      padding: '6px 12px', color: '#cbd5e1',
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                      whiteSpace: 'nowrap',
                    }}>
                      {row[col] === null
                        ? <span style={{ color: '#334155' }}>NULL</span>
                        : typeof row[col] === 'boolean'
                          ? <span style={{ color: row[col] ? '#86efac' : '#fca5a5' }}>{String(row[col])}</span>
                          : String(row[col] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '6px 12px', fontSize: 10, color: '#334155', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            {result.rowCount > 100
              ? `100 premières lignes sur ${result.rowCount}`
              : `${result.rowCount} ligne${result.rowCount > 1 ? 's' : ''}`}
            {' · '}DuckDB WASM · données ShopStream
          </div>
        </motion.div>
      )}

      {/* ── Placeholder vide ─────────────────────────────────────── */}
      {!result && !isRunning && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#2d3748' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>▶</div>
          <div style={{ fontSize: 13 }}>Lance la requête pour voir les résultats</div>
          <div style={{ fontSize: 11, marginTop: 4, color: '#1e293b' }}>⌘↵ ou Ctrl+↵</div>
        </div>
      )}

      <style>{`@keyframes df-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
