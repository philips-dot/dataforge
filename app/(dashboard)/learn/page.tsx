'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Terminal, TrendingUp, GitBranch, Lock, ArrowRight, Check } from 'lucide-react'
import { TRACKS } from '@/data/tracks'
import { LESSONS } from '@/data/lessons'
import { useUserStore } from '@/store/user-store'
import type { Track } from '@/types'

const ICON_MAP: Record<string, React.ReactNode> = {
  'terminal': <Terminal size={24} />,
  'trending-up': <TrendingUp size={24} />,
  'git-branch': <GitBranch size={24} />,
}

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  indigo: { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.25)', text: '#6366f1', badge: 'rgba(99,102,241,0.15)' },
  emerald: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', text: '#10b981', badge: 'rgba(16,185,129,0.15)' },
  violet: { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.25)', text: '#8b5cf6', badge: 'rgba(139,92,246,0.15)' },
}

const DIFF_LABELS: Record<string, string> = { beginner: 'DÉBUTANT', intermediate: 'INTERMÉDIAIRE', advanced: 'AVANCÉ' }

function TrackCard({ track, completedCount }: { track: Track; completedCount: number }) {
  const c = COLOR_MAP[track.color]
  const lessons = LESSONS.filter(l => l.trackId === track.id)
  const progress = Math.round((completedCount / track.lessonCount) * 100)
  const isStarted = completedCount > 0
  const isComplete = completedCount >= track.lessonCount

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: `0 12px 40px ${c.bg}` }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${isStarted ? c.border : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 18,
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        cursor: track.isPremium ? 'default' : 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'box-shadow 0.3s, border-color 0.3s',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: c.bg, color: c.text,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {ICON_MAP[track.icon]}
        </div>
        {track.isPremium && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f59e0b', fontSize: 12, fontWeight: 700 }}>
            <Lock size={13} /> PRO
          </div>
        )}
        {isComplete && (
          <div style={{ background: '#10b981', color: '#fff', borderRadius: 99, padding: '4px 12px', fontSize: 11, fontWeight: 700 }}>
            ✓ Complété
          </div>
        )}
      </div>

      {/* Title + meta */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: c.text, letterSpacing: 1, marginBottom: 6 }}>
          {DIFF_LABELS[track.difficulty]} · {track.estimatedHours}h · {track.lessonCount} leçons
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', margin: 0, marginBottom: 8 }}>
          {track.title.fr}
        </h3>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
          &ldquo;{track.description.fr}&rdquo;
        </p>
      </div>

      {/* Outcomes */}
      <div style={{ margin: '16px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Après ce parcours, tu peux :
        </div>
        {track.outcomeStatement.fr.split(', ').slice(0, 3).map((out, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#cbd5e1' }}>
            <span style={{ color: c.text, flexShrink: 0 }}>→</span>
            <span>{out}</span>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {track.skills.map(s => (
          <span key={s} style={{
            fontSize: 11, fontWeight: 700, color: c.text,
            background: c.badge, padding: '3px 10px', borderRadius: 99,
          }}>{s}</span>
        ))}
      </div>

      {/* Progress bar */}
      {isStarted && !track.isPremium && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: '#64748b' }}>{completedCount}/{track.lessonCount} leçons</span>
            <span style={{ fontSize: 12, color: c.text, fontWeight: 700 }}>{progress}%</span>
          </div>
          <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ height: '100%', background: `linear-gradient(90deg, ${c.text}, #06b6d4)`, borderRadius: 99 }}
            />
          </div>
        </div>
      )}

      {/* CTA */}
      {track.isPremium ? (
        <div style={{
          background: 'rgba(245,158,11,0.1)', color: '#f59e0b',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 10, padding: '12px 0',
          textAlign: 'center', fontSize: 14, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <Lock size={14} /> Passer Pro pour débloquer
        </div>
      ) : (
        <Link href={`/learn/${track.id}`} style={{ textDecoration: 'none' }}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{
            background: isStarted
              ? `linear-gradient(135deg, ${c.text}, #4f46e5)`
              : 'rgba(255,255,255,0.06)',
            color: isStarted ? '#fff' : '#94a3b8',
            borderRadius: 10, padding: '12px 0',
            textAlign: 'center', fontSize: 14, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            {isComplete ? (
              <><Check size={16} /> Revoir le parcours</>
            ) : isStarted ? (
              <>Continuer <ArrowRight size={16} /></>
            ) : (
              <>Commencer — c&apos;est gratuit <ArrowRight size={16} /></>
            )}
          </motion.div>
        </Link>
      )}
    </motion.div>
  )
}

export default function LearnPage() {
  const { completedLessons } = useUserStore()

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f8fafc', margin: 0, marginBottom: 8 }}>
          Fondamentaux
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 16, margin: 0, maxWidth: 540, lineHeight: 1.7 }}>
          Les bases, expliquées comme en entreprise.{' '}
          Chaque concept ancré dans son impact business réel.
        </p>
      </motion.div>

      {/* Track grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {TRACKS.map((track, i) => {
          const done = completedLessons.filter(lid => {
            const lesson = LESSONS.find(l => l.id === lid)
            return lesson?.trackId === track.id
          }).length
          return (
            <motion.div key={track.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <TrackCard track={track} completedCount={done} />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
