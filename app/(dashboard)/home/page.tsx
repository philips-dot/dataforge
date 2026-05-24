'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { useUserStore } from '@/store/user-store'
import { LESSONS } from '@/data/lessons'
import { MISSIONS } from '@/data/missions'
import { TRACKS } from '@/data/tracks'
import { getTotalXP, getLevelInfo, ALL_BADGES } from '@/types'
import { ArrowRight, Zap, BookOpen, Trophy, Target } from 'lucide-react'
import { useEffect } from 'react'

const SKILL_COLORS: Record<string, string> = {
  sql: '#6366f1', business: '#10b981', optimization: '#06b6d4', python: '#8b5cf6', dashboard: '#f59e0b',
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (h < 1) return "À l'instant"
  if (h < 24) return `Il y a ${h}h`
  if (d === 1) return 'Hier'
  return `Il y a ${d}j`
}

export default function HomePage() {
  const { user } = useUser()
  const { xp, streak, completedLessons, completedMissions, currentLesson, currentMission, updateStreak, recentActivity } = useUserStore()
  const firstName = user?.firstName ?? 'toi'
  const totalXP = getTotalXP(xp)
  const lvl = getLevelInfo(totalXP)

  useEffect(() => { updateStreak() }, [])

  // Find continue lesson
  const continueLesson = currentLesson
    ? LESSONS.find(l => l.id === currentLesson.lessonId)
    : LESSONS.find(l => !completedLessons.includes(l.id))

  const continueTrack = continueLesson ? TRACKS.find(t => t.id === continueLesson.trackId) : null

  // Active mission
  const activeMission = currentMission ? MISSIONS.find(m => m.id === currentMission.missionId) : null
  const activeMissionStepsLeft = activeMission ? activeMission.steps.length - (currentMission?.stepIndex ?? 0) : 0

  // Recommended mission
  const recommendedMission = MISSIONS.find(m => !completedMissions.includes(m.id))

  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }
  const item = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }

  return (
    <div style={{ padding: '32px 40px', maxWidth: 900, margin: '0 auto' }}>
      <motion.div variants={stagger} initial="hidden" animate="visible">

        {/* Bloc A — Accueil */}
        <motion.div variants={item} style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f8fafc', margin: 0, marginBottom: 6 }}>
            Bonjour {firstName}. 🎯
          </h1>
          {streak > 0 ? (
            <p style={{ color: '#f97316', margin: 0, fontSize: 15, fontWeight: 500 }}>
              🔥 Tu es à <strong>{streak} jour{streak > 1 ? 's' : ''}</strong> de suite. Continue !
            </p>
          ) : (
            <p style={{ color: '#94a3b8', margin: 0, fontSize: 15 }}>
              👋 Commence ta série aujourd&apos;hui.
            </p>
          )}
        </motion.div>

        {/* Bloc B — Mission active alert */}
        {activeMission && (
          <motion.div variants={item} style={{ marginBottom: 24 }}>
            <Link href={`/missions/${activeMission.id}`} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ scale: 1.01 }}
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 12,
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 20 }}>🚨</span>
                <div style={{ flex: 1 }}>
                  <span style={{ color: '#ef4444', fontWeight: 700, fontSize: 14 }}>Mission en cours :</span>
                  <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: 14, marginLeft: 8 }}>{activeMission.title.fr}</span>
                  <span style={{ color: '#94a3b8', fontSize: 13, marginLeft: 8 }}>— {activeMissionStepsLeft} étape{activeMissionStepsLeft > 1 ? 's' : ''} restante{activeMissionStepsLeft > 1 ? 's' : ''}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ef4444', fontWeight: 600, fontSize: 14 }}>
                  Continuer <ArrowRight size={15} />
                </div>
              </motion.div>
            </Link>
          </motion.div>
        )}

        {/* Bloc C — Continuer */}
        <motion.div variants={item} style={{ marginBottom: 24 }}>
          {continueLesson && continueTrack ? (
            <Link href={`/learn/${continueLesson.trackId}/${continueLesson.id}`} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ scale: 1.01, boxShadow: '0 0 0 1px rgba(99,102,241,0.4)' }}
                style={{
                  background: 'rgba(99,102,241,0.06)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: 16,
                  padding: '24px 28px',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: 'rgba(99,102,241,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
                  }}>
                    {continueTrack.color === 'indigo' ? '💻' : continueTrack.color === 'emerald' ? '📊' : '🔧'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: '#6366f1', fontWeight: 600, marginBottom: 4 }}>
                      {continueLesson.trackId === completedLessons[completedLessons.length - 1]?.split('-')[0] ? 'Continuer' : 'Commencer'}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 4 }}>{continueTrack.title.fr}</div>
                    <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>
                      Leçon {continueLesson.order} sur {continueTrack.lessonCount} &middot; &ldquo;{continueLesson.title.fr}&rdquo;
                    </div>

                    {/* Progress bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${(completedLessons.filter(l => l.startsWith(continueLesson.trackId.slice(0,3))).length / continueTrack.lessonCount) * 100}%`,
                          background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
                          borderRadius: 99,
                        }} />
                      </div>
                      <span style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>
                        {completedLessons.filter(l => l.startsWith(continueLesson.trackId.slice(0,3))).length}/{continueTrack.lessonCount} leçons
                      </span>
                    </div>

                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      ⏱ {continueLesson.estimatedMinutes} min &middot; +{Object.values(continueLesson.xpReward).reduce((a,b) => a+(b??0), 0)} XP
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6366f1', fontWeight: 700, fontSize: 14, alignSelf: 'center' }}>
                    Continuer <ArrowRight size={16} />
                  </div>
                </div>
              </motion.div>
            </Link>
          ) : (
            <Link href="/learn" style={{ textDecoration: 'none' }}>
              <div style={{
                border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 16, padding: '24px 28px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Aucun parcours en cours</div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>Commence par les fondamentaux SQL — gratuit, 8 min pour la première leçon</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6366f1', fontWeight: 700, fontSize: 14 }}>
                  Voir les parcours <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          )}
        </motion.div>

        {/* Bloc D — Stats */}
        <motion.div variants={item} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { value: totalXP.toLocaleString(), label: 'XP total', icon: '⚡' },
            { value: `Niv. ${lvl.level}`, label: lvl.title, icon: '🏅' },
            { value: completedLessons.length, label: 'leçons complétées', icon: '📚' },
            { value: completedMissions.length, label: 'mission réussie', icon: '🎯' },
          ].map((stat, i) => (
            <motion.div key={i} whileHover={{ y: -2 }} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 14,
              padding: '18px 16px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{stat.icon}</div>
              <div style={{
                fontSize: 22, fontWeight: 800,
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                marginBottom: 4,
              }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bloc E — Mission recommandée */}
        {recommendedMission && (
          <motion.div variants={item} style={{ marginBottom: 24 }}>
            <Link href={`/missions/${recommendedMission.id}`} style={{ textDecoration: 'none' }}>
              <motion.div whileHover={{ scale: 1.005 }} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                padding: '24px 28px',
                cursor: 'pointer',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <span style={{
                      fontSize: 10, fontWeight: 800, color: '#6366f1', letterSpacing: 1,
                      background: 'rgba(99,102,241,0.15)', padding: '3px 10px', borderRadius: 99,
                      textTransform: 'uppercase',
                    }}>Recommandé</span>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginTop: 10 }}>
                      {recommendedMission.title.fr}
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(239,68,68,0.15)',
                    color: '#ef4444',
                    fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 99, whiteSpace: 'nowrap',
                  }}>P0</div>
                </div>
                <p style={{ color: '#94a3b8', fontSize: 14, margin: '0 0 16px', lineHeight: 1.6 }}>
                  {recommendedMission.description.fr}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: '#64748b' }}>
                    🏢 {recommendedMission.company.name} ({recommendedMission.company.sector})
                  </span>
                  <span style={{ fontSize: 12, color: '#64748b' }}>
                    ⚡ {recommendedMission.difficulty === 'intermediate' ? 'Intermédiaire' : recommendedMission.difficulty === 'beginner' ? 'Débutant' : 'Avancé'}
                  </span>
                  <span style={{ fontSize: 12, color: '#64748b' }}>⏱ {recommendedMission.estimatedMinutes} min</span>
                  <span style={{ fontSize: 12, color: '#6366f1', fontWeight: 600 }}>
                    +{Object.values(recommendedMission.xpReward).reduce((a,b) => a+(b??0), 0)} XP
                  </span>
                </div>
                {recommendedMission.recommendedLessons.length > 0 && (
                  <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>Leçons recommandées :</span>
                    {recommendedMission.recommendedLessons.map(lid => (
                      <span key={lid} style={{
                        fontSize: 11, fontWeight: 700, color: '#6366f1',
                        background: 'rgba(99,102,241,0.15)', padding: '2px 8px', borderRadius: 99,
                      }}>{lid.toUpperCase()}</span>
                    ))}
                  </div>
                )}
                <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    color: '#fff', fontWeight: 700, fontSize: 14,
                    padding: '10px 24px', borderRadius: 10,
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    Démarrer la mission <ArrowRight size={16} />
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        )}

        {/* Bloc F — Activité récente */}
        {recentActivity.length > 0 && (
          <motion.div variants={item}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
              Activité récente
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recentActivity.slice(0, 6).map(entry => (
                <div key={entry.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <span style={{ fontSize: 16 }}>
                    {entry.type === 'lesson' ? '✓' : entry.type === 'badge' ? '🏆' : entry.type === 'mission' ? '⚡' : '🔥'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 13, color: '#e2e8f0' }}>{entry.label}</span>
                  </div>
                  {entry.xp && entry.skill && (
                    <span style={{ fontSize: 12, fontWeight: 700, color: SKILL_COLORS[entry.skill] ?? '#6366f1' }}>
                      +{entry.xp} XP
                    </span>
                  )}
                  <span style={{ fontSize: 11, color: '#475569', whiteSpace: 'nowrap' }}>
                    {timeAgo(entry.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
