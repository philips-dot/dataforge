'use client'

import { useState, useCallback } from 'react'
import { SQLEditorLive } from './sql-editor-live'
import { LessonPhaseViewer } from './lesson-phase-viewer'
import { useUserStore } from '@/store/user-store'
import type { SqlModule } from '@/data/sql-course'
import type { QueryResult } from '@/hooks/use-duckdb'

interface LessonSplitViewProps {
  module: SqlModule
  onComplete: () => void
}

export function LessonSplitView({ module, onComplete }: LessonSplitViewProps) {
  const [mobileTab, setMobileTab] = useState<'cours' | 'editeur'>('cours')
  const [solutionVisible, setSolutionVisible] = useState(false)
  const [lastResult, setLastResult] = useState<QueryResult | null>(null)

  const markLessonComplete = useUserStore(s => s.markLessonComplete)

  const maxCostUSD = module.practice.validationRules.find(r => r.type === 'cost_under')?.value ?? 1.0
  const minScore   = module.practice.validationRules.find(r => r.type === 'sql_score')?.value ?? 65
  const hints      = module.practice.hints.map(h => h.fr)
  const totalXP    = (module.xpReward.sql ?? 0) + (module.xpReward.business ?? 0) + (module.xpReward.optimization ?? 0)

  const handleValidated = useCallback((sql: string) => {
    markLessonComplete(
      module.id,
      {
        sql:          module.xpReward.sql ?? 0,
        business:     module.xpReward.business ?? 0,
      },
      module.title,
    )
    onComplete()
  }, [module, markLessonComplete, onComplete])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Tabs mobile ─────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(255,255,255,0.02)',
        flexShrink: 0,
      }}>
        {(['cours', 'editeur'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            style={{
              flex: 1, padding: '10px 0', border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 600, background: 'transparent',
              color: mobileTab === tab ? '#e2e8f0' : '#475569',
              borderBottom: mobileTab === tab ? '2px solid #6366f1' : '2px solid transparent',
              transition: 'all 0.15s',
            }}
          >
            {tab === 'cours' ? '📚 Cours' : '⚡ SQL Live'}
          </button>
        ))}
      </div>

      {/* ── Layout split ────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* GAUCHE — 5 phases pédagogiques (45%) */}
        <div style={{
          width: '45%', minWidth: 300,
          overflowY: 'auto',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          display: mobileTab === 'editeur' ? 'none' : 'block',
        }}
          className="split-left"
        >
          <LessonPhaseViewer
            module={module}
            result={lastResult}
            solutionVisible={solutionVisible}
            onShowSolution={() => setSolutionVisible(true)}
          />
        </div>

        {/* DROITE — Éditeur DuckDB (55%) */}
        <div style={{
          flex: 1,
          display: mobileTab === 'cours' ? 'none' : 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
          className="split-right"
        >
          {/* Bandeau tables disponibles */}
          <div style={{
            padding: '6px 12px', flexShrink: 0,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.02)',
          }}>
            <span style={{ fontSize: 11, color: '#334155' }}>Tables : </span>
            {[
              { name: 'orders', rows: 200, gb: 800 },
              { name: 'sessions', rows: 400, gb: 1200 },
              { name: 'users', rows: 100, gb: 50 },
            ].map((t, i) => (
              <span key={t.name}>
                {i > 0 && <span style={{ color: '#1e293b' }}> · </span>}
                <code style={{ fontSize: 11, color: '#818cf8' }}>{t.name}</code>
                <span style={{ fontSize: 10, color: '#1e293b' }}> ({t.rows} lignes · {t.gb} GB simulés)</span>
              </span>
            ))}
          </div>

          <SQLEditorLive
            moduleId={module.id}
            starterSQL={module.practice.starterCode}
            maxCostUSD={maxCostUSD}
            minScore={minScore}
            hints={hints}
            onValidated={handleValidated}
            onResult={setLastResult}
          />
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .split-left  { display: block !important; }
          .split-right { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
