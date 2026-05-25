import { NextRequest, NextResponse } from 'next/server'
import { BigQuery } from '@google-cloud/bigquery'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'

// Initialiser BigQuery avec le service account depuis les variables d'env
function getBigQuery() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON manquant dans les variables d\'environnement')
  return new BigQuery({
    projectId: process.env.BIGQUERY_PROJECT_ID ?? 'dataforge-learning',
    credentials: JSON.parse(raw),
  })
}

const bodySchema = z.object({
  query: z.string().min(1).max(5000),
  lessonId: z.string().optional(),
})

// 320 Go max par requête (~$2 au tarif BigQuery)
const MAX_BYTES = Number(process.env.BIGQUERY_MAX_BYTES_PER_QUERY ?? 343597383680)
const DATASET = process.env.BIGQUERY_DATASET ?? 'training_data'
const PROJECT = process.env.BIGQUERY_PROJECT_ID ?? 'dataforge-learning'
const LOCATION = process.env.BIGQUERY_LOCATION ?? 'EU'

// Remplace les noms de tables nus (orders, sessions, users) par le chemin complet
function resolveTableRefs(query: string): string {
  return query
    .replace(/`?dataforge-learning\.training_data\./g, `\`${PROJECT}.${DATASET}.`)
    .replace(/\bFROM\s+(orders|sessions|users)\b/gi, `FROM \`${PROJECT}.${DATASET}.$1\``)
    .replace(/\bJOIN\s+(orders|sessions|users)\b/gi, `JOIN \`${PROJECT}.${DATASET}.$1\``)
}

export async function POST(req: NextRequest) {
  try {
    // Vérifier l'authentification
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await req.json()
    const { query, lessonId } = bodySchema.parse(body)

    // Bloquer les requêtes d'écriture
    const forbidden = /\b(INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE|MERGE)\b/i
    if (forbidden.test(query)) {
      return NextResponse.json(
        { error: 'Seules les requêtes SELECT sont autorisées sur la plateforme.' },
        { status: 400 }
      )
    }

    const bigquery = getBigQuery()
    const resolvedQuery = resolveTableRefs(query)

    // Dry run — estimer le coût avant d'exécuter
    let bytesEstimated = 0
    try {
      const [dryRunJob] = await bigquery.createQueryJob({
        query: resolvedQuery,
        dryRun: true,
        location: LOCATION,
      })
      bytesEstimated = Number(dryRunJob.metadata.statistics.totalBytesProcessed ?? 0)
    } catch (dryErr: unknown) {
      // Si le dry run échoue (erreur SQL), renvoyer l'erreur directement
      const msg = dryErr instanceof Error ? dryErr.message : 'Erreur de syntaxe SQL'
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    if (bytesEstimated > MAX_BYTES) {
      const gb = (bytesEstimated / 1024 / 1024 / 1024).toFixed(1)
      return NextResponse.json({
        error: `Requête trop coûteuse : ${gb} Go estimés (limite : ${(MAX_BYTES / 1024 / 1024 / 1024).toFixed(0)} Go). 💡 Filtre la partition avec WHERE _PARTITIONDATE = CURRENT_DATE.`,
        estimatedBytes: bytesEstimated,
      }, { status: 400 })
    }

    // Exécuter la vraie requête
    const [job] = await bigquery.createQueryJob({
      query: resolvedQuery,
      location: LOCATION,
      maximumBytesBilled: String(MAX_BYTES),
    })

    const [rows] = await job.getQueryResults({ maxResults: 100 })
    const [metadata] = await job.getMetadata()

    const bytesProcessed = Number(metadata.statistics?.totalBytesProcessed ?? 0)
    const startTime = Number(metadata.statistics?.startTime ?? 0)
    const endTime = Number(metadata.statistics?.endTime ?? 0)
    const costUSD = (bytesProcessed / 1e12) * 6.25

    // Sérialiser les BigQuery types (BigInt, Date, etc.)
    const serialized = rows.map((row: Record<string, unknown>) => {
      const out: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(row)) {
        if (v && typeof v === 'object' && 'value' in v) {
          out[k] = (v as { value: unknown }).value
        } else if (typeof v === 'bigint') {
          out[k] = Number(v)
        } else {
          out[k] = v
        }
      }
      return out
    })

    return NextResponse.json({
      rows: serialized,
      rowCount: serialized.length,
      bytesProcessed,
      costUSD: Number(costUSD.toFixed(6)),
      executionMs: endTime - startTime,
      lessonId,
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erreur BigQuery inconnue'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
