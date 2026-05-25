'use client'

import { useState, useCallback } from 'react'

export interface SqlResult {
  rows: Record<string, unknown>[]
  rowCount: number
  bytesProcessed: number
  costUSD: number
  executionMs: number
  error?: string
}

export function useSQLLive() {
  const [result, setResult] = useState<SqlResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [lastQuery, setLastQuery] = useState('')

  const runQuery = useCallback(async (query: string, lessonId?: string) => {
    if (!query.trim()) return
    setIsRunning(true)
    setLastQuery(query)
    setResult(null)
    try {
      const res = await fetch('/api/bigquery/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, lessonId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setResult({
          rows: [],
          rowCount: 0,
          bytesProcessed: 0,
          costUSD: 0,
          executionMs: 0,
          error: data.error ?? 'Erreur inconnue',
        })
      } else {
        setResult(data)
      }
    } catch {
      setResult({
        rows: [],
        rowCount: 0,
        bytesProcessed: 0,
        costUSD: 0,
        executionMs: 0,
        error: 'Erreur réseau — vérifie ta connexion.',
      })
    } finally {
      setIsRunning(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setLastQuery('')
  }, [])

  return { result, isRunning, lastQuery, runQuery, reset }
}
