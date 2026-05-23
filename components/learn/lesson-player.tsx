'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import type { Lesson } from '@/types'
import { useUserStore } from '@/store/user-store'
import { useToastStore } from '@/store/toast-store'
import { getTotalXP, getLevelInfo } from '@/types'

// ─── SQL Analyzer ────────────────────────────────────────────────────
function analyzeSql(sql: string, starterCode: string): { cost: number; score: number; issues: string[]; savings: number } {
  const hasSelectStar = /SELECT\s+\*/i.test(sql)
  const hasPartitionFilter = /_PARTITIONDATE|_PARTITION_DATE/i.test(sql)
  const hasWhereClause = /WHERE/i.test(sql) || /CURRENT_DATE/i.test(sql)
  const hasGroupBy = /GROUP\s+BY/i.test(sql)
  const hasSpecificCols = !hasSelectStar

  let baseCost = 8.50
  let score = 30
  const issues: string[] = []

  if (hasSelectStar) {
    issues.push('SELECT * détecté — scanne toutes les colonnes inutilement')
  } else {
    score += 25
    baseCost *= 0.15
  }

  if (!hasPartitionFilter) {
    issues.push("Pas de filtre _PARTITIONDATE — scanne toute la table historique")
  } else {
    score += 30
    baseCost *= 0.08
  }

  if (!hasWhereClause && !hasPartitionFilter) {
    issues.push('Pas de filtre WHERE — scan complet de la table')
  } else if (hasWhereClause) {
    score += 10
    baseCost *= 0.7
  }

  if (sql.trim().length < 20 || sql.includes('-- À toi')) {
    return { cost: 8.50, score: 0, issues: ["Écris ta requête d'abord !"], savings: 0 }
  }

  score = Math.max(0, Math.min(100, score))
  baseCost = Math.max(0.02, baseCost)
  const savings = Math.round(((8.50 - baseCost) / 8.50) * 100)

  return { cost: baseCost, score, issues, savings }
}

// ─── Animated Counter ────────────────────────────────────────────────
function AnimatedNumber({ to, prefix = '', suffix = '' }: { to: number; prefix?: string; suffix?: string }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const duration = 1800
    const tick = () => {
      const elapsed = Date.now() - start
      const pct = Math.min(1, elapsed / duration)
      const ease = 1 - Math.pow(1 - pct, 3)
      setVal(Math.round(to * ease))
      if (pct < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [to])
  return <span>{prefix}{val.toLocaleString()}{suffix}</span>
}

// ─── Phase 1: Business Alert ─────────────────────────────────────────
function PhaseAlert({ lesson, onNext }: { lesson: Lesson; onNext: () => void }) {
  const { businessAlert } = lesson
  const [typed, setTyped] = useState('')
  const msg = businessAlert.slackMessage.content.fr
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      i++
      setTyped(msg.slice(0, i))
      if (i >= msg.length) clearInterval(interval)
    }, 18)
    return () => clearInterval(interval)
  }, [msg])

  const urgencyColor = businessAlert.urgency === 'critical' ? '#ef4444' : '#f97316'

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 680, margin: '0 auto' }}>
      <div style={{
        background: 'rgba(239,68,68,0.04)',
        border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: 16, padding: '28px',
        marginBottom: 24,
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20,
          background: `${urgencyColor}22`, border: `1px solid ${urgencyColor}44`,
          borderRadius: 99, padding: '4px 14px',
        }}>
          <span style={{ fontSize: 16 }}>🚨</span>
          <span style={{ fontSize: 11, fontWeight: 800, color: urgencyColor, textTransform: 'uppercase', letterSpacing: 1 }}>
            ALERTE BUSINESS — URGENCE {businessAlert.urgency === 'critical' ? 'CRITIQUE' : 'ÉLEVÉE'}
          </span>
        </div>

        {/* Slack card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12, padding: '20px', marginBottom: 20,
          fontFamily: 'monospace',
        }}>
          <div style={{ color: '#64748b', fontSize: 12, marginBottom: 14 }}>
            #data-team &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {businessAlert.slackMessage.time}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 8, flexShrink: 0,
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 13, color: '#fff',
            }}>{businessAlert.slackMessage.avatar}</div>
            <div>
              <div style={{ marginBottom: 4 }}>
                <span style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 14 }}>{businessAlert.slackMessage.author}</span>
                <span style={{ color: '#64748b', fontSize: 12, marginLeft: 8 }}>{businessAlert.slackMessage.role}</span>
              </div>
              <div style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.7, fontFamily: 'inherit' }}>
                {typed}<span style={{ animation: 'blink 1s infinite' }}>|</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div style={{ background: 'rgba(239,68,68,0.08)', borderRadius: 10, padding: '14px' }}>
            <div style={{ fontSize: 11, color: '#ef4444', fontWeight: 700, marginBottom: 4 }}>Impact financier</div>
            <div style={{ fontSize: 14, color: '#f8fafc' }}>{businessAlert.financialImpact.fr}</div>
          </div>
          <div style={{ background: 'rgba(239,68,68,0.08)', borderRadius: 10, padding: '14px' }}>
            <div style={{ fontSize: 11, color: '#ef4444', fontWeight: 700, marginBottom: 4 }}>Coût de l&apos;ignorance</div>
            <div style={{ fontSize: 14, color: '#f8fafc' }}>{businessAlert.costOfIgnorance.fr}</div>
          </div>
        </div>

        <p style={{ color: '#94a3b8', fontSize: 14, margin: 0, lineHeight: 1.7 }}>
          Ce que tu vas apprendre à éviter dans cette leçon.
        </p>
      </div>

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onNext} style={{
        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        color: '#fff', fontWeight: 700, fontSize: 15,
        padding: '14px 32px', borderRadius: 12, border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 10, margin: '0 auto',
      }}>
        Comprendre pourquoi <ArrowRight size={18} />
      </motion.button>
    </motion.div>
  )
}

// ─── Phase 2: Why It Matters ─────────────────────────────────────────
function PhaseWhy({ lesson, onNext }: { lesson: Lesson; onNext: () => void }) {
  const { whyItMatters } = lesson
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 680, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc', marginBottom: 20 }}>
        Pourquoi tu dois maîtriser ça.
      </h2>
      <p style={{ color: '#cbd5e1', fontSize: 15, lineHeight: 1.8, marginBottom: 24 }}>
        {whyItMatters.businessLogic.fr}
      </p>

      {/* Real world example */}
      <div style={{
        background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)',
        borderRadius: 12, padding: '20px', marginBottom: 24,
      }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
          Exemple réel d&apos;entreprise
        </div>
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
          {whyItMatters.realWorldExample.fr}
        </p>
      </div>

      {/* Junior vs Pro */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
        <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 12, padding: '18px' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#ef4444', marginBottom: 10 }}>✗ Junior</div>
          <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{whyItMatters.proVsJunior.junior.fr}</p>
        </div>
        <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 12, padding: '18px' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#10b981', marginBottom: 10 }}>✓ Pro</div>
          <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{whyItMatters.proVsJunior.pro.fr}</p>
        </div>
      </div>

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onNext} style={{
        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        color: '#fff', fontWeight: 700, fontSize: 15,
        padding: '14px 32px', borderRadius: 12, border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 10, margin: '0 auto',
      }}>
        Voir le concept <ArrowRight size={18} />
      </motion.button>
    </motion.div>
  )
}

// ─── Phase 3: Concept ────────────────────────────────────────────────
function PhaseConcept({ lesson, onNext }: { lesson: Lesson; onNext: () => void }) {
  const [tab, setTab] = useState<'before' | 'after'>('before')
  const { concept } = lesson

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 760, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc', marginBottom: 8 }}>{concept.headline.fr}</h2>
      <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>{concept.explanation.fr}</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['before', 'after'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13,
            background: tab === t
              ? t === 'before' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'
              : 'rgba(255,255,255,0.04)',
            color: tab === t
              ? t === 'before' ? '#ef4444' : '#10b981'
              : '#64748b',
          }}>
            {t === 'before' ? '🔴 AVANT — Junior' : '🟢 APRÈS — Pro'}
          </button>
        ))}
      </div>

      {/* Code block */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, x: tab === 'after' ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          style={{
            background: '#0d0d1a', border: `1px solid ${tab === 'before' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`,
            borderRadius: 12, overflow: 'hidden', marginBottom: 16,
          }}
        >
          <div style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 12, color: '#64748b' }}>
            SQL
          </div>
          <pre style={{ padding: '20px', margin: 0, color: '#e2e8f0', fontSize: 13, lineHeight: 1.8, overflowX: 'auto', fontFamily: "'Fira Code', 'Courier New', monospace" }}>
            {(tab === 'before' ? concept.beforeExample : concept.afterExample).code}
          </pre>
          <div style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 13, color: '#94a3b8' }}>
            {(tab === 'before' ? concept.beforeExample : concept.afterExample).explanation.fr}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Cost comparison */}
      {concept.costBefore > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ marginBottom: 10, fontSize: 13, fontWeight: 700, color: '#94a3b8' }}>Comparaison du coût</div>
          {[
            { label: 'AVANT', value: concept.costBefore, color: '#ef4444' },
            { label: 'APRÈS', value: concept.costAfter, color: '#10b981' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: row.color, width: 50 }}>{row.label}</span>
              <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: row.label === 'AVANT' ? '100%' : `${(row.value / concept.costBefore) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  style={{ height: '100%', background: row.color, borderRadius: 99 }}
                />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: row.color, width: 60, textAlign: 'right' }}>
                ${row.value.toFixed(2)}
              </span>
            </div>
          ))}
          <div style={{ fontSize: 13, color: '#10b981', fontWeight: 700, marginTop: 8 }}>
            Économie : -{Math.round(((concept.costBefore - concept.costAfter) / concept.costBefore) * 100)}% · ${(concept.costBefore - concept.costAfter).toFixed(2)} par exécution
          </div>
        </div>
      )}

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onNext} style={{
        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        color: '#fff', fontWeight: 700, fontSize: 15,
        padding: '14px 32px', borderRadius: 12, border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 10, margin: '0 auto',
      }}>
        À toi de jouer <ArrowRight size={18} />
      </motion.button>
    </motion.div>
  )
}

// ─── Phase 4: Practice ───────────────────────────────────────────────
function PhasePractice({ lesson, onNext }: { lesson: Lesson; onNext: () => void }) {
  const { practice } = lesson
  const [code, setCode] = useState(practice.starterCode)
  const [result, setResult] = useState<ReturnType<typeof analyzeSql> | null>(null)
  const [revealedHints, setRevealedHints] = useState<number[]>([])
  const [analyzing, setAnalyzing] = useState(false)

  const validationRule = practice.validationRules.find(r => r.type === 'cost_under') ??
    practice.validationRules.find(r => r.type === 'sql_score')
  const maxCost = validationRule?.type === 'cost_under' ? Number(validationRule.value) : 0.30
  const minScore = practice.validationRules.find(r => r.type === 'sql_score')?.value
    ? Number(practice.validationRules.find(r => r.type === 'sql_score')!.value) : 70

  const analysis = result
  const isValid = analysis && analysis.cost <= maxCost && analysis.score >= minScore

  const analyze = async () => {
    setAnalyzing(true)
    await new Promise(r => setTimeout(r, 600))
    setResult(analyzeSql(code, practice.starterCode))
    setAnalyzing(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f8fafc', marginBottom: 8 }}>Pratique</h2>
      <div style={{
        background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)',
        borderRadius: 10, padding: '12px 16px', marginBottom: 20,
      }}>
        <p style={{ color: '#f59e0b', fontSize: 13, margin: 0, fontWeight: 600 }}>
          🏢 {practice.businessContext.fr}
        </p>
      </div>
      <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>{practice.instructions.fr}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, marginBottom: 20 }}>
        {/* Editor */}
        <div>
          <div style={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 12, color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
              <span>SQL Editor</span>
              <span>Objectif : max ${maxCost}/exec</span>
            </div>
            <textarea
              value={code}
              onChange={e => { setCode(e.target.value); setResult(null) }}
              style={{
                width: '100%', minHeight: 220, background: 'transparent', border: 'none', outline: 'none',
                color: '#e2e8f0', fontFamily: "'Fira Code','Courier New',monospace", fontSize: 13,
                lineHeight: 1.8, padding: '16px', resize: 'vertical', boxSizing: 'border-box',
              }}
              spellCheck={false}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={analyze} disabled={analyzing}
            style={{
              marginTop: 10, width: '100%',
              background: analyzing ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.8)',
              color: '#fff', fontWeight: 700, fontSize: 14,
              padding: '12px', borderRadius: 10, border: 'none', cursor: 'pointer',
            }}
          >
            {analyzing ? '⏳ Analyse en cours...' : '▶ Analyser ma requête'}
          </motion.button>
        </div>

        {/* Feedback */}
        <div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Coût estimé</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: analysis ? (analysis.cost <= maxCost ? '#10b981' : '#ef4444') : '#64748b' }}>
                  ${analysis ? analysis.cost.toFixed(2) : '?.??'}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Score SQL</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: analysis ? (analysis.score >= minScore ? '#10b981' : '#f59e0b') : '#64748b' }}>
                  {analysis ? analysis.score : '—'}/100
                </div>
              </div>
            </div>

            {analysis && analysis.issues.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                {analysis.issues.map((issue, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 12, color: '#ef4444' }}>
                    <span>🔴</span><span>{issue}</span>
                  </div>
                ))}
              </div>
            )}

            {analysis && analysis.issues.length === 0 && (
              <div style={{ color: '#10b981', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                ✓ Aucun anti-pattern détecté !
              </div>
            )}

            {/* Hints */}
            <div>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, marginBottom: 8 }}>INDICES</div>
              {practice.hints.map((hint, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  <button
                    onClick={() => setRevealedHints(h => h.includes(i) ? h : [...h, i])}
                    style={{
                      background: revealedHints.includes(i) ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 8, padding: '8px 12px', width: '100%', cursor: 'pointer',
                      textAlign: 'left', color: '#94a3b8', fontSize: 12,
                    }}
                  >
                    {revealedHints.includes(i) ? hint.fr : `💡 Indice ${i + 1} — cliquer pour révéler`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Validate */}
      <motion.button
        whileHover={isValid ? { scale: 1.02 } : {}}
        whileTap={isValid ? { scale: 0.98 } : {}}
        onClick={isValid ? onNext : undefined}
        style={{
          background: isValid ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.06)',
          color: isValid ? '#fff' : '#475569',
          fontWeight: 700, fontSize: 15,
          padding: '14px 40px', borderRadius: 12, border: 'none',
          cursor: isValid ? 'pointer' : 'not-allowed',
          display: 'flex', alignItems: 'center', gap: 10, margin: '0 auto',
          transition: 'background 0.3s',
        }}
      >
        {isValid ? <>✓ Valider et voir le ROI <ArrowRight size={18} /></> : `Objectif : coût < $${maxCost} et score ≥ ${minScore}/100`}
      </motion.button>
    </motion.div>
  )
}

// ─── Phase 5: ROI Debrief ────────────────────────────────────────────
function PhaseROI({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  const { roiDebrief } = lesson
  const [confetti, setConfetti] = useState(false)
  useEffect(() => { setConfetti(true) }, [])

  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} style={{ maxWidth: 680, margin: '0 auto', position: 'relative' }}>
      {confetti && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: `${20 + Math.random() * 60}vw`, y: '-5vh', rotate: 0, opacity: 1 }}
              animate={{ y: '105vh', rotate: 720, opacity: 0 }}
              transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5 }}
              style={{
                position: 'absolute',
                width: 8, height: 8,
                borderRadius: Math.random() > 0.5 ? '50%' : 2,
                background: ['#6366f1','#06b6d4','#10b981','#f59e0b','#ef4444','#8b5cf6'][Math.floor(Math.random() * 6)],
              }}
            />
          ))}
        </div>
      )}

      <div style={{
        background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)',
        borderRadius: 20, padding: '36px', marginBottom: 24, textAlign: 'center',
      }}>
        <div style={{ fontSize: 20, marginBottom: 16 }}>🎯 Tu viens de maîtriser une compétence qui vaut</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { value: roiDebrief.savingsPercent, prefix: '-', suffix: '%', label: 'de coût SQL par requête' },
            { value: roiDebrief.monthlySavingsUSD, prefix: '$', suffix: '/mois', label: 'économisés' },
            { value: roiDebrief.annualSavingsUSD, prefix: '$', suffix: '/an', label: 'économisés pour l\'entreprise' },
          ].map((stat, i) => (
            <div key={i}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#10b981', marginBottom: 4 }}>
                <AnimatedNumber to={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{
          background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)',
          borderRadius: 12, padding: '20px', marginBottom: 24, textAlign: 'left',
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            Ce que tu peux dire en entretien
          </div>
          <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
            {roiDebrief.interviewTalkingPoint.fr}
          </p>
        </div>

        <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>
          {roiDebrief.careerImpactStatement.fr}
        </p>
      </div>

      {/* XP earned */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
        {Object.entries(lesson.xpReward).map(([skill, amount]) => (
          <span key={skill} style={{
            fontSize: 13, fontWeight: 700, padding: '6px 16px', borderRadius: 99,
            background: 'rgba(99,102,241,0.15)', color: '#6366f1',
          }}>
            +{amount} XP {skill.charAt(0).toUpperCase() + skill.slice(1)}
          </span>
        ))}
      </div>

      {/* Next teaser */}
      <div style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12, padding: '16px 20px', marginBottom: 24,
        fontSize: 13, color: '#94a3b8', lineHeight: 1.6,
      }}>
        <strong style={{ color: '#e2e8f0' }}>Prochaine leçon :</strong> {roiDebrief.nextLessonTeaser.fr}
      </div>

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onComplete} style={{
        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        color: '#fff', fontWeight: 700, fontSize: 16,
        padding: '16px 48px', borderRadius: 12, border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 10, margin: '0 auto',
        boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
      }}>
        Leçon suivante <ArrowRight size={20} />
      </motion.button>
    </motion.div>
  )
}

// ─── Main Player ─────────────────────────────────────────────────────
const PHASES = ['Alerte', 'Pourquoi', 'Concept', 'Pratique', 'Résultats']

export function LessonPlayer({ lesson, trackId }: { lesson: Lesson; trackId: string }) {
  const [phase, setPhase] = useState(0)
  const router = useRouter()
  const { markLessonComplete, setCurrentLesson, clearCurrentLesson, xp, completedLessons } = useUserStore()
  const { addToast } = useToastStore()

  useEffect(() => {
    setCurrentLesson(lesson.id, phase)
  }, [phase])

  const next = useCallback(() => setPhase(p => Math.min(4, p + 1)), [])

  const handleComplete = useCallback(() => {
    const prevTotal = getTotalXP(xp)
    const prevLevel = getLevelInfo(prevTotal).level
    markLessonComplete(lesson.id, lesson.xpReward, lesson.title.fr)
    clearCurrentLesson()

    const gainedXP = Object.entries(lesson.xpReward)
    for (const [skill, amount] of gainedXP) {
      if (amount) {
        addToast({
          message: `+${amount} XP ${skill.charAt(0).toUpperCase() + skill.slice(1)}`,
          subMessage: lesson.title.fr,
          skill: skill as 'sql' | 'business' | 'optimization',
          amount,
        })
      }
    }
    router.push(`/learn/${trackId}`)
  }, [lesson, markLessonComplete, clearCurrentLesson, router, trackId, xp, addToast])

  const progress = ((phase + 1) / 5) * 100

  return (
    <div style={{ minHeight: '100vh', background: '#050508' }}>
      {/* Top bar */}
      <div style={{
        height: 56, borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', padding: '0 32px', gap: 20,
        background: 'rgba(10,10,18,0.9)', backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 20,
      }}>
        <button onClick={() => router.push(`/learn/${trackId}`)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14,
        }}>
          <ArrowLeft size={16} /> Retour
        </button>

        <div style={{ flex: 1 }}>
          {/* Phase dots */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {PHASES.map((name, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: i < phase ? '#6366f1' : i === phase ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.06)',
                  border: `2px solid ${i <= phase ? '#6366f1' : 'rgba(255,255,255,0.1)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: i < phase ? '#fff' : i === phase ? '#6366f1' : '#475569',
                }}>
                  {i < phase ? '✓' : i + 1}
                </div>
                {i < 4 && <div style={{ width: 24, height: 2, background: i < phase ? '#6366f1' : 'rgba(255,255,255,0.06)' }} />}
              </div>
            ))}
          </div>
          {/* Progress bar */}
          <div style={{ width: '100%', height: 2, background: 'rgba(255,255,255,0.06)', marginTop: 8 }}>
            <motion.div
              style={{ height: '100%', background: 'linear-gradient(90deg,#6366f1,#06b6d4)', transformOrigin: 'left' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <div style={{ fontSize: 13, color: '#64748b', minWidth: 80, textAlign: 'right' }}>
          Phase {phase + 1}/5
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '48px 40px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {phase === 0 && <PhaseAlert lesson={lesson} onNext={next} />}
            {phase === 1 && <PhaseWhy lesson={lesson} onNext={next} />}
            {phase === 2 && <PhaseConcept lesson={lesson} onNext={next} />}
            {phase === 3 && <PhasePractice lesson={lesson} onNext={next} />}
            {phase === 4 && <PhaseROI lesson={lesson} onComplete={handleComplete} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  )
}
