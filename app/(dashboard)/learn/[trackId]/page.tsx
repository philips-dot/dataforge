'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Lock, Play, Clock } from 'lucide-react'
import { TRACKS } from '@/data/tracks'
import { getLessonsForTrack } from '@/data/lessons'
import { useUserStore } from '@/store/user-store'
import { use } from 'react'

const DIFF_LABELS: Record<string, string> = { beginner: 'Débutant', intermediate: 'Intermédiaire', advanced: 'Avancé' }
const COLOR_MAP: Record<string, { text: string; glow: string; bar: string }> = {
  indigo: { text: '#6366f1', glow: 'rgba(99,102,241,0.2)', bar: 'linear-gradient(90deg,#6366f1,#06b6d4)' },
  emerald: { text: '#10b981', glow: 'rgba(16,185,129,0.2)', bar: 'linear-gradient(90deg,#10b981,#06b6d4)' },
  violet: { text: '#8b5cf6', glow: 'rgba(139,92,246,0.2)', bar: 'linear-gradient(90deg,#8b5cf6,#6366f1)' },
}

const XP_SKILL_COLORS: Record<string, string> = { sql: '#6366f1', business: '#10b981', optimization: '#06b6d4', python: '#8b5cf6', dashboard: '#f59e0b' }

export default function TrackPage({ params }: { params: Promise<{ trackId: string }> }) {
  const { trackId } = use(params)
  const track = TRACKS.find(t => t.id === trackId)
  if (!track) notFound()

  const lessons = getLessonsForTrack(trackId)
  const { completedLessons, currentLesson, xp } = useUserStore()
  const c = COLOR_MAP[track.color]

  const completedInTrack = lessons.filter(l => completedLessons.includes(l.id)).length
  const progress = Math.round((completedInTrack / lessons.length) * 100)
  const estimatedRemaining = lessons.filter(l => !completedLessons.includes(l.id)).reduce((a, l) => a + l.estimatedMinutes, 0)

  // XP earned in track skills
  const trackSkills = Object.entries(lessons.reduce((acc, l) => {
    for (const [k, v] of Object.entries(l.xpReward)) {
      acc[k] = (acc[k] ?? 0) + (v ?? 0)
    }
    return acc
  }, {} as Record<string, number>)).slice(0, 3)

  return (
    <div style={{ padding: '32px 40px', maxWidth: 960, margin: '0 auto' }}>
      {/* Back */}
      <Link href="/learn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 13, marginBottom: 24 }}>
        <ArrowLeft size={14} /> Tous les parcours
      </Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, color: c.text,
            background: c.glow, padding: '4px 12px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: 1,
          }}>
            {DIFF_LABELS[track.difficulty]} · {lessons.length} leçons · {track.estimatedHours}h
          </span>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f8fafc', margin: '0 0 12px' }}>
          {track.title.fr}
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 15, margin: 0, fontStyle: 'italic', lineHeight: 1.7, maxWidth: 600 }}>
          &ldquo;{track.outcomeStatement.fr}&rdquo;
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 32 }}>

        {/* Lesson timeline */}
        <div>
          <div style={{ position: 'relative' }}>
            {/* vertical line */}
            <div style={{
              position: 'absolute', left: 17, top: 20, bottom: 20, width: 2,
              background: 'rgba(255,255,255,0.06)',
            }} />
            <div style={{
              position: 'absolute', left: 17, top: 20, width: 2,
              height: `${progress}%`,
              background: c.bar,
              transition: 'height 0.8s ease',
            }} />

            {lessons.map((lesson, i) => {
              const isCompleted = completedLessons.includes(lesson.id)
              const isCurrent = currentLesson?.lessonId === lesson.id
              const isNext = !isCompleted && lessons.slice(0, i).every(l => completedLessons.includes(l.id))
              const isLocked = !isCompleted && !isNext

              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{ display: 'flex', gap: 16, marginBottom: 12, alignItems: 'flex-start' }}
                >
                  {/* Dot */}
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    background: isCompleted ? c.text : isCurrent ? c.glow : isNext ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                    border: `2px solid ${isCompleted ? c.text : isCurrent ? c.text : isNext ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', zIndex: 2,
                    boxShadow: isCurrent ? `0 0 16px ${c.glow}` : 'none',
                  }}>
                    {isCompleted ? <Check size={15} color="#fff" /> :
                     isLocked ? <Lock size={13} color="#475569" /> :
                     <Play size={13} color={c.text} />}
                  </div>

                  {/* Card */}
                  <Link href={isLocked ? '#' : `/learn/${trackId}/${lesson.id}`} style={{ textDecoration: 'none', flex: 1 }}>
                    <motion.div
                      whileHover={!isLocked ? { x: 4 } : {}}
                      style={{
                        background: isCurrent
                          ? `rgba(99,102,241,0.08)`
                          : isNext
                          ? 'rgba(255,255,255,0.04)'
                          : 'rgba(255,255,255,0.02)',
                        border: isCurrent ? `1px solid ${c.text}30` : '1px solid transparent',
                        borderRadius: 12, padding: '14px 18px',
                        cursor: isLocked ? 'default' : 'pointer',
                        opacity: isLocked ? 0.4 : 1,
                        boxShadow: isCurrent ? `inset 0 0 20px ${c.glow}` : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, fontWeight: isNext || isCurrent ? 700 : 500, color: isLocked ? '#475569' : '#e2e8f0', marginBottom: 4 }}>
                            {lesson.title.fr}
                          </div>
                          {isLocked && (
                            <div style={{ fontSize: 12, color: '#475569' }}>
                              🔒 Disponible après la leçon {i}
                            </div>
                          )}
                          {isCompleted && (
                            <div style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>✓ Complétée</div>
                          )}
                          {isNext && !isCurrent && (
                            <div style={{ fontSize: 12, color: c.text, fontWeight: 600 }}>▶ Disponible</div>
                          )}
                          {isCurrent && (
                            <div style={{ fontSize: 12, color: c.text, fontWeight: 700 }}>▶ En cours</div>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, marginLeft: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748b', fontSize: 12 }}>
                            <Clock size={12} /> {lesson.estimatedMinutes} min
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: c.text }}>
                            +{Object.values(lesson.xpReward).reduce((a,b)=>a+(b??0),0)} XP
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 16, padding: '24px',
            position: 'sticky', top: 80,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 16 }}>
              Tes progrès dans ce parcours
            </div>

            {trackSkills.map(([skill, totalPossible]) => {
              const earned = xp[skill as keyof typeof xp] ?? 0
              const pct = Math.min(100, Math.round((earned / totalPossible) * 100))
              return (
                <div key={skill} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1', textTransform: 'capitalize' }}>{skill}</span>
                    <span style={{ fontSize: 12, color: XP_SKILL_COLORS[skill] ?? '#6366f1' }}>{earned} XP</span>
                  </div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      style={{ height: '100%', background: XP_SKILL_COLORS[skill] ?? '#6366f1', borderRadius: 99 }}
                    />
                  </div>
                </div>
              )
            })}

            <div style={{ marginTop: 20, padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', marginBottom: 4 }}>
                {completedInTrack}/{lessons.length} leçons complétées
              </div>
              {estimatedRemaining > 0 && (
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  ~{estimatedRemaining} min restantes
                </div>
              )}
            </div>

            {/* Next lesson CTA */}
            {(() => {
              const nextLesson = lessons.find(l => !completedLessons.includes(l.id))
              return nextLesson ? (
                <Link href={`/learn/${trackId}/${nextLesson.id}`} style={{ textDecoration: 'none' }}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{
                    marginTop: 16,
                    background: c.bar,
                    color: '#fff', fontWeight: 700, fontSize: 14,
                    padding: '12px 16px', borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    cursor: 'pointer',
                  }}>
                    {completedInTrack === 0 ? 'Commencer' : 'Continuer'} <ArrowRight size={16} />
                  </motion.div>
                </Link>
              ) : null
            })()}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
