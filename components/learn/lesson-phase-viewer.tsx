'use client'

import { motion } from 'framer-motion'
import type { SqlModule } from '@/data/sql-course'
import type { QueryResult } from '@/hooks/use-duckdb'

const URGENCY = {
  low:      { bg: 'rgba(34,197,94,0.06)',  border: 'rgba(34,197,94,0.2)',  text: '#22c55e', label: 'INFO' },
  medium:   { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)', text: '#f59e0b', label: 'MOYEN' },
  high:     { bg: 'rgba(239,68,68,0.07)',  border: 'rgba(239,68,68,0.25)', text: '#ef4444', label: 'URGENT' },
  critical: { bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.4)',  text: '#ef4444', label: '🔴 CRITIQUE' },
}

interface LessonPhaseViewerProps {
  module: SqlModule
  result: QueryResult | null
  solutionVisible: boolean
  onShowSolution: () => void
}

export function LessonPhaseViewer({ module, result, solutionVisible, onShowSolution }: LessonPhaseViewerProps) {
  const urgency = URGENCY[module.businessAlert.urgency]
  const { slackMessage } = module.businessAlert

  const maxCostUSD = module.practice.validationRules.find(r => r.type === 'cost_under')?.value ?? 1.0
  const minScore   = module.practice.validationRules.find(r => r.type === 'sql_score')?.value ?? 65

  const isValidated = Boolean(
    result && !result.error &&
    result.simulatedCostUSD <= maxCostUSD &&
    result.score >= minScore
  )

  const ratio = Math.round(module.concept.costBefore / module.concept.costAfter)

  return (
    <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── PHASE 1 : Alerte Business ─────────────────────────────── */}
      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: '#334155', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
          Phase 1 — Contexte business
        </div>
        <div style={{ background: urgency.bg, border: `1px solid ${urgency.border}`, borderRadius: 12, padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 6, flexShrink: 0,
              background: slackMessage.color + '25',
              border: `1px solid ${slackMessage.color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, color: slackMessage.color,
            }}>
              {slackMessage.initials}
            </div>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>{slackMessage.author}</span>
              <span style={{ fontSize: 10, color: '#475569', marginLeft: 6 }}>{slackMessage.role}</span>
              <span style={{ fontSize: 10, color: '#334155', marginLeft: 6 }}>{slackMessage.time}</span>
            </div>
            <span style={{
              marginLeft: 'auto', fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 99,
              background: urgency.border, color: urgency.text, flexShrink: 0,
            }}>
              {urgency.label}
            </span>
          </div>
          <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.65, margin: 0 }}>
            &ldquo;{slackMessage.text}&rdquo;
          </p>
        </div>
        <div style={{ marginTop: 8, padding: '7px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: 10, color: '#334155' }}>💼 </span>
          <span style={{ fontSize: 11, color: '#475569' }}>{module.businessAlert.financialImpact}</span>
        </div>
      </motion.section>

      {/* ── PHASE 2 : Concept SQL ─────────────────────────────────── */}
      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: '#334155', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
          Phase 2 — Concept SQL
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', margin: '0 0 8px', lineHeight: 1.5 }}>
            {module.concept.headline}
          </p>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.7 }}>
            {module.concept.explanation}
          </p>
        </div>
      </motion.section>

      {/* ── PHASE 3 : Avant / Après ───────────────────────────────── */}
      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: '#334155', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
          Phase 3 — Impact coût · avant / après
        </div>
        <div style={{ marginBottom: 10, padding: '8px 12px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.12)', borderRadius: 8 }}>
          <span style={{ fontSize: 10, color: '#f59e0b', fontWeight: 700 }}>💰 </span>
          <span style={{ fontSize: 11, color: '#fcd34d' }}>{module.concept.costWarning}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* Avant */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', letterSpacing: 0.5 }}>❌ Junior</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#ef4444' }}>${module.concept.costBefore.toFixed(2)}</span>
            </div>
            <div style={{ background: '#0a0e14', borderRadius: 8, padding: '9px 11px', border: '1px solid rgba(239,68,68,0.15)' }}>
              <pre style={{ fontSize: 10, color: '#fca5a5', margin: 0, whiteSpace: 'pre-wrap', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6 }}>
                {module.concept.beforeCode}
              </pre>
            </div>
          </div>
          {/* Après */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: '#22c55e', textTransform: 'uppercase', letterSpacing: 0.5 }}>✓ Senior</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#22c55e' }}>${module.concept.costAfter.toFixed(2)}</span>
            </div>
            <div style={{ background: '#0a0e14', borderRadius: 8, padding: '9px 11px', border: '1px solid rgba(34,197,94,0.15)' }}>
              <pre style={{ fontSize: 10, color: '#86efac', margin: 0, whiteSpace: 'pre-wrap', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6 }}>
                {module.concept.afterCode}
              </pre>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 2, background: 'linear-gradient(90deg, #ef4444, #22c55e)', borderRadius: 99 }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#22c55e', flexShrink: 0 }}>×{ratio} moins cher</span>
        </div>
      </motion.section>

      {/* ── PHASE 4 : Exercice ────────────────────────────────────── */}
      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.20 }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: '#334155', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
          Phase 4 — Exercice pratique
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px' }}>
          <p style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 600, margin: '0 0 6px', lineHeight: 1.5 }}>
            {module.practice.instructions}
          </p>
          <p style={{ fontSize: 11, color: '#475569', margin: '0 0 12px', lineHeight: 1.6 }}>
            📋 {module.practice.businessContext}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11 }}>
              <span style={{ color: '#f59e0b', fontWeight: 700 }}>$</span>
              <span style={{ color: '#64748b' }}>Coût simulé cible : &lt; <strong style={{ color: '#fcd34d' }}>${maxCostUSD}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11 }}>
              <span style={{ color: '#6366f1', fontWeight: 700 }}>★</span>
              <span style={{ color: '#64748b' }}>Score minimum : <strong style={{ color: '#818cf8' }}>{minScore}/100</strong></span>
            </div>
          </div>

          {/* Barre de score live */}
          {result && !result.error && (
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 10, color: '#334155' }}>Score actuel</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: result.score >= minScore ? '#22c55e' : '#f59e0b' }}>
                  {result.score}/100
                </span>
              </div>
              <div style={{ height: 5, background: 'rgba(255,255,255,0.04)', borderRadius: 99, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.score}%` }}
                  style={{
                    height: '100%', borderRadius: 99,
                    background: result.score >= minScore ? '#22c55e' : result.score >= 40 ? '#f59e0b' : '#ef4444',
                  }}
                />
              </div>
              <div style={{ marginTop: 6, display: 'flex', gap: 12, fontSize: 10 }}>
                <span style={{ color: result.simulatedCostUSD <= maxCostUSD ? '#22c55e' : '#ef4444' }}>
                  ${result.simulatedCostUSD.toFixed(2)} simulé
                </span>
                <span style={{ color: '#334155' }}>{result.executionMs}ms DuckDB</span>
              </div>
            </div>
          )}
        </div>

        {/* Voir la solution */}
        {!solutionVisible && (
          <button
            onClick={onShowSolution}
            style={{
              marginTop: 6, width: '100%', padding: '7px',
              background: 'transparent', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 8, color: '#334155', fontSize: 11, cursor: 'pointer',
            }}
          >
            Voir la solution ↓
          </button>
        )}
        {solutionVisible && (
          <div style={{ marginTop: 8, background: '#0a0e14', borderRadius: 10, padding: '12px', border: '1px solid rgba(34,197,94,0.12)' }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: '#22c55e', marginBottom: 6, letterSpacing: 1 }}>✓ SOLUTION OPTIMISÉE</div>
            <pre style={{ fontSize: 11, color: '#7dd3fc', margin: 0, whiteSpace: 'pre-wrap', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6 }}>
              {module.concept.afterCode}
            </pre>
          </div>
        )}
      </motion.section>

      {/* ── PHASE 5 : ROI Debrief ─────────────────────────────────── */}
      {isValidated && (
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: '#334155', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
            Phase 5 — ROI & Phrase d&apos;entretien
          </div>
          <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: '16px' }}>
            <div style={{ display: 'flex', gap: 20, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#22c55e' }}>-{module.roiDebrief.savingsPercent}%</div>
                <div style={{ fontSize: 10, color: '#475569' }}>coûts</div>
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#22c55e' }}>${module.roiDebrief.monthlySavingsUSD.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: '#475569' }}>économisés/mois</div>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 9, color: '#334155', marginBottom: 5 }}>💬 CE QUE TU DIS EN ENTRETIEN</div>
              <p style={{ fontSize: 12, color: '#86efac', fontStyle: 'italic', margin: 0, lineHeight: 1.65 }}>
                {module.roiDebrief.interviewTalkingPoint}
              </p>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  )
}
