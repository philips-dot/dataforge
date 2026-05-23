'use client'
import { useState, use } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { getMission } from '@/data/missions'
import { useUserStore } from '@/store/user-store'
import { useToastStore } from '@/store/toast-store'
import { notFound } from 'next/navigation'

function analyzeMissionInput(input: string, step: { validation?: { requiredKeywords?: string[]; minScore?: number } }): { ok: boolean; message: string } {
  if (input.trim().length < 30) return { ok: false, message: "Complète ta réponse (minimum 30 caractères)." }
  if (step.validation?.requiredKeywords) {
    for (const kw of step.validation.requiredKeywords) {
      if (!input.toLowerCase().includes(kw.toLowerCase())) {
        return { ok: false, message: `Pense à mentionner : "${kw}"` }
      }
    }
  }
  return { ok: true, message: '✓ Bonne réponse !' }
}

function analyzeSqlStep(sql: string, step: { validation?: { maxCostUSD?: number; minScore?: number } }): { ok: boolean; message: string; score: number } {
  const hasSelectStar = /SELECT\s+\*/i.test(sql)
  const hasPartition = /_PARTITIONDATE/i.test(sql)
  const hasWhere = /WHERE/i.test(sql)
  let score = 40
  if (!hasSelectStar) score += 25
  if (hasPartition) score += 25
  if (hasWhere) score += 10
  if (sql.trim().length < 20) return { ok: false, message: "Écris ta requête SQL.", score: 0 }
  const minScore = step.validation?.minScore ?? 60
  if (score < minScore) return { ok: false, message: `Score ${score}/100 — objectif : ${minScore}/100. Améliore ta requête.`, score }
  return { ok: true, message: `Score : ${score}/100 ✓`, score }
}

export default function MissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const mission = getMission(id)
  if (!mission) notFound()

  const router = useRouter()
  const { setCurrentMission, markMissionComplete, currentMission } = useUserStore()
  const { addToast } = useToastStore()

  const [phase, setPhase] = useState<'brief' | 'active' | 'complete'>(
    currentMission?.missionId === id ? 'active' : 'brief'
  )
  const [stepIndex, setStepIndex] = useState(currentMission?.missionId === id ? currentMission.stepIndex : 0)
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [feedbacks, setFeedbacks] = useState<Record<string, { ok: boolean; message: string }>>({})
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [elapsed, setElapsed] = useState(38)

  const currentStep = mission.steps[stepIndex]
  const totalXP = Object.values(mission.xpReward).reduce((a, b) => a + (b ?? 0), 0)

  const startMission = () => {
    setCurrentMission(id, 0)
    setPhase('active')
  }

  const validateStep = () => {
    const input = inputs[currentStep.id] ?? ''
    let result: { ok: boolean; message: string }

    if (currentStep.type === 'write_sql' || currentStep.type === 'analyze_cost') {
      const sqlResult = analyzeSqlStep(input, currentStep)
      result = { ok: sqlResult.ok, message: sqlResult.message }
    } else {
      result = analyzeMissionInput(input, currentStep)
    }

    setFeedbacks(prev => ({ ...prev, [currentStep.id]: result }))

    if (result.ok) {
      const newCompleted = [...completedSteps, currentStep.id]
      setCompletedSteps(newCompleted)
      setScore(prev => prev + currentStep.xpReward)

      if (stepIndex < mission.steps.length - 1) {
        setTimeout(() => {
          const next = stepIndex + 1
          setStepIndex(next)
          setCurrentMission(id, next)
        }, 800)
      } else {
        setTimeout(() => {
          markMissionComplete(id, mission.xpReward)
          for (const [skill, amount] of Object.entries(mission.xpReward)) {
            if (amount) addToast({ message: `+${amount} XP ${skill}`, skill: skill as 'sql' | 'business', amount })
          }
          setPhase('complete')
        }, 800)
      }
    }
  }

  if (phase === 'brief') {
    return (
      <div style={{ padding: '32px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <button onClick={() => router.push('/missions')} style={{
          background: 'none', border: 'none', cursor: 'pointer', color: '#64748b',
          display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, marginBottom: 24,
        }}>
          <ArrowLeft size={14} /> Toutes les missions
        </button>

        {/* KPI Alert */}
        {mission.kpiAlerts && mission.kpiAlerts.map(kpi => (
          <motion.div key={kpi.metric} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{
            background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: 12, padding: '14px 20px', marginBottom: 24,
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <span style={{ fontSize: 20 }}>🚨</span>
            <div>
              <span style={{ color: '#ef4444', fontWeight: 800, fontSize: 14 }}>{kpi.metric} : {kpi.value}%</span>
              <span style={{ color: '#94a3b8', fontSize: 13, marginLeft: 8 }}>vs {kpi.previousValue}% la semaine dernière</span>
              <span style={{ color: '#ef4444', fontWeight: 700, marginLeft: 8 }}>{kpi.changePercent}%</span>
            </div>
          </motion.div>
        ))}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28 }}>
          {/* Left */}
          <div>
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#ef4444', background: 'rgba(239,68,68,0.15)', padding: '3px 10px', borderRadius: 99 }}>
                {mission.jiraTicket.priority}
              </span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#f8fafc', margin: '12px 0 8px' }}>{mission.title.fr}</h1>
            <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.8, marginBottom: 24 }}>{mission.situation.fr}</p>

            {/* Slack panel */}
            <div style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden', marginBottom: 24 }}>
              <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 12, color: '#64748b' }}>
                #data-team · ShopStream
              </div>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {mission.slackMessages.map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                    style={{ display: 'flex', gap: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                      background: msg.isUrgent ? 'rgba(239,68,68,0.3)' : 'rgba(99,102,241,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 12, color: '#fff',
                    }}>{msg.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: 3 }}>
                        <span style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 13 }}>{msg.author}</span>
                        <span style={{ color: '#64748b', fontSize: 11, marginLeft: 8 }}>{msg.role}</span>
                        <span style={{ color: '#475569', fontSize: 11, marginLeft: 8 }}>{msg.time}</span>
                        {msg.isUrgent && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 800, color: '#ef4444', background: 'rgba(239,68,68,0.15)', padding: '1px 6px', borderRadius: 99 }}>URGENT</span>}
                      </div>
                      <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{msg.content.fr}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={startMission} style={{
              background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
              color: '#fff', fontWeight: 800, fontSize: 16,
              padding: '16px 48px', borderRadius: 12, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10,
              boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
            }}>
              Démarrer la mission <ArrowRight size={20} />
            </motion.button>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Ticket */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px' }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>TICKET JIRA</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#ef4444', background: 'rgba(239,68,68,0.15)', padding: '2px 8px', borderRadius: 99 }}>{mission.jiraTicket.priority}</span>
                <span style={{ fontSize: 12, color: '#64748b' }}>{mission.jiraTicket.id}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.5 }}>{mission.jiraTicket.title.fr}</div>
            </div>

            {/* Deliverable */}
            <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 14, padding: '20px' }}>
              <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 700, marginBottom: 8 }}>LIVRABLE ATTENDU</div>
              <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{mission.expectedDeliverable.fr}</p>
            </div>

            {/* Constraint */}
            <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 14, padding: '20px' }}>
              <div style={{ fontSize: 11, color: '#ef4444', fontWeight: 700, marginBottom: 8 }}>⏰ CONTRAINTE</div>
              <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{mission.businessConstraint.fr}</p>
            </div>

            {/* XP */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px' }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 10 }}>RÉCOMPENSES</div>
              {Object.entries(mission.xpReward).filter(([,v]) => v).map(([skill, amount]) => (
                <div key={skill} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: '#94a3b8', textTransform: 'capitalize' }}>{skill}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#6366f1' }}>+{amount} XP</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'complete') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{
          background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: 24, padding: '48px', textAlign: 'center', maxWidth: 480,
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#f8fafc', marginBottom: 8 }}>Mission accomplie !</h2>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', margin: '20px 0', flexWrap: 'wrap' }}>
            {Object.entries(mission.xpReward).filter(([,v]) => v).map(([skill, amount]) => (
              <span key={skill} style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1', fontWeight: 800, fontSize: 15, padding: '6px 16px', borderRadius: 99 }}>
                +{amount} XP {skill}
              </span>
            ))}
          </div>
          <div style={{ color: '#94a3b8', fontSize: 14, marginBottom: 8 }}>
            Score : {Math.min(100, Math.round((score / totalXP) * 100))}/100
          </div>
          <div style={{ color: '#64748b', fontSize: 13, marginBottom: 32 }}>
            Temps : {elapsed} min (objectif : {mission.estimatedMinutes} min)
          </div>

          <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, padding: '16px', marginBottom: 28, textAlign: 'left' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#6366f1', marginBottom: 8 }}>INSIGHT SENIOR</div>
            <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{mission.solution.seniorInsight.fr}</p>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={() => router.push('/missions')} style={{
              background: 'rgba(255,255,255,0.06)', color: '#94a3b8',
              padding: '12px 24px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700,
            }}>
              Toutes les missions
            </button>
            <button onClick={() => router.push('/home')} style={{
              background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff',
              padding: '12px 24px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              Accueil <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Active phase
  const progressPct = ((completedSteps.length) / mission.steps.length) * 100
  const stepFeedback = feedbacks[currentStep.id]
  const input = inputs[currentStep.id] ?? ''

  return (
    <div style={{ padding: '24px 40px', maxWidth: 900, margin: '0 auto' }}>
      {/* Progress bar */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8' }}>
            Étape {stepIndex + 1}/{mission.steps.length}
          </span>
          <span style={{ fontSize: 13, color: '#64748b' }}>{mission.title.fr}</span>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
          <motion.div
            animate={{ width: `${progressPct}%` }}
            style={{ height: '100%', background: 'linear-gradient(90deg,#6366f1,#06b6d4)', borderRadius: 99 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={stepIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
          {/* Step card */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px', marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: 'rgba(99,102,241,0.2)', border: '2px solid #6366f1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, color: '#6366f1', fontSize: 15,
              }}>{stepIndex + 1}</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                  {currentStep.type === 'read_context' ? '📖 Analyse du contexte' :
                   currentStep.type === 'write_sql' ? '💻 Écriture SQL' :
                   currentStep.type === 'analyze_cost' ? '💰 Analyse des coûts' : '✍️ Communication'}
                </div>
                <p style={{ color: '#e2e8f0', fontSize: 15, lineHeight: 1.7, margin: 0 }}>{currentStep.instructions.fr}</p>
              </div>
            </div>

            <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 700, marginBottom: 4 }}>POURQUOI C&apos;EST IMPORTANT</div>
              <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{currentStep.businessRationale.fr}</p>
            </div>

            {/* Input */}
            <textarea
              value={input}
              onChange={e => {
                setInputs(prev => ({ ...prev, [currentStep.id]: e.target.value }))
                setFeedbacks(prev => ({ ...prev, [currentStep.id]: undefined as never }))
              }}
              placeholder={
                currentStep.type === 'write_sql' || currentStep.type === 'analyze_cost'
                  ? '-- Écris ta requête SQL ici...\nSELECT'
                  : 'Écris ta réponse ici...'
              }
              style={{
                width: '100%', minHeight: currentStep.type.includes('sql') ? 180 : 120,
                background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.08)',
                color: '#e2e8f0', borderRadius: 10, padding: '14px',
                fontFamily: currentStep.type.includes('sql') ? "'Fira Code','Courier New',monospace" : 'inherit',
                fontSize: 13, lineHeight: 1.8, resize: 'vertical',
                outline: 'none', boxSizing: 'border-box',
              }}
            />

            {stepFeedback && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} style={{
                marginTop: 10, padding: '10px 14px', borderRadius: 8,
                background: stepFeedback.ok ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${stepFeedback.ok ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                color: stepFeedback.ok ? '#10b981' : '#ef4444',
                fontSize: 13, fontWeight: 600,
              }}>
                {stepFeedback.message}
              </motion.div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={validateStep} style={{
              background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
              color: '#fff', fontWeight: 700, fontSize: 15,
              padding: '14px 36px', borderRadius: 12, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              {stepIndex < mission.steps.length - 1 ? <>Valider cette étape <ArrowRight size={18} /></> : <>Terminer la mission <Check size={18} /></>}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
