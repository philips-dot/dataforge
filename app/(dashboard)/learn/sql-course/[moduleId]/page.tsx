'use client'

import { useParams, useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { LessonSplitView } from '@/components/learn/lesson-split-view'
import { getSqlModule, getNextModule, SQL_MODULES } from '@/data/sql-course'
import { useUserStore } from '@/store/user-store'

export default function SQLModulePage() {
  const params = useParams()
  const router = useRouter()
  const moduleId = params.moduleId as string

  const module = getSqlModule(moduleId)
  if (!module) return notFound()

  const nextModule = getNextModule(module.order)
  const completedLessons = useUserStore(s => s.completedLessons)

  const isCompleted = completedLessons.includes(moduleId)
  const moduleIndex = SQL_MODULES.findIndex(m => m.id === moduleId)
  const totalModules = SQL_MODULES.length
  const totalXP = (module.xpReward.sql ?? 0) + (module.xpReward.business ?? 0) + (module.xpReward.optimization ?? 0)

  const handleComplete = () => {
    if (nextModule && !nextModule.isPremium) {
      setTimeout(() => router.push(`/learn/sql-course/${nextModule.id}`), 800)
    } else {
      setTimeout(() => router.push('/learn/sql-course'), 800)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>

      {/* ── Header compact ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(255,255,255,0.02)',
          flexShrink: 0,
        }}
      >
        {/* Breadcrumb */}
        <Link href="/learn/sql-course" style={{ fontSize: 12, color: '#475569', textDecoration: 'none', flexShrink: 0 }}>
          ← SQL & Coûts BigQuery
        </Link>
        <span style={{ color: '#334155', fontSize: 12 }}>/</span>
        <span style={{
          fontSize: 12, color: '#94a3b8', fontWeight: 600,
          flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          Module {module.order} — {module.title}
        </span>

        {/* Progression + meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          {/* Barre de progression des modules */}
          <div style={{ display: 'flex', gap: 3 }}>
            {SQL_MODULES.map((m, i) => (
              <div key={m.id} style={{
                width: 20, height: 4, borderRadius: 99,
                background: completedLessons.includes(m.id)
                  ? '#22c55e'
                  : i === moduleIndex
                    ? '#6366f1'
                    : 'rgba(255,255,255,0.08)',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
          <span style={{ fontSize: 11, color: '#475569' }}>
            {moduleIndex + 1}/{totalModules}
          </span>
          <span style={{ fontSize: 11, color: '#475569' }}>⏱ {module.estimatedMinutes} min</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1' }}>
            +{totalXP} XP
          </span>
          {isCompleted && (
            <span style={{
              fontSize: 11, fontWeight: 700, color: '#22c55e',
              background: 'rgba(34,197,94,0.1)', padding: '3px 10px', borderRadius: 99,
            }}>
              ✓ Complété
            </span>
          )}
        </div>
      </motion.div>

      {/* ── Split view ──────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <LessonSplitView
          module={module}
          onComplete={handleComplete}
        />
      </div>
    </div>
  )
}
