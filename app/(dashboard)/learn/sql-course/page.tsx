'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useUserStore } from '@/store/user-store'
import { SQL_MODULES, TRACK_META } from '@/data/sql-course'

export default function SQLCoursePage() {
  const completedLessons = useUserStore(s => s.completedLessons)

  const completedCount = SQL_MODULES.filter(m => completedLessons.includes(m.id)).length
  const earnedXP = SQL_MODULES
    .filter(m => completedLessons.includes(m.id))
    .reduce((acc, m) => acc + (m.xpReward.sql ?? 0) + (m.xpReward.business ?? 0), 0)
  const progressPct = Math.round((completedCount / SQL_MODULES.length) * 100)
  const totalMinutes = SQL_MODULES.reduce((s, m) => s + m.estimatedMinutes, 0)
  const estimatedHours = Math.round(totalMinutes / 60 * 10) / 10

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 900, margin: '0 auto' }}>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Link href="/learn" style={{ fontSize: 12, color: '#475569', textDecoration: 'none' }}>
            ← Catalogue
          </Link>
          <span style={{ color: '#334155', fontSize: 12 }}>/</span>
          <span style={{ fontSize: 12, color: '#64748b' }}>SQL & Coûts BigQuery</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 32 }}>🎯</span>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: '#f8fafc', margin: 0 }}>
                {TRACK_META.title}
              </h1>
              <span style={{
                fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 99,
                background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8',
              }}>
                Intermédiaire
              </span>
            </div>
            <p style={{ color: '#64748b', fontSize: 14, margin: 0, maxWidth: 600, lineHeight: 1.6 }}>
              {TRACK_META.description}
            </p>
          </div>

          {/* Stats */}
          <div style={{
            flexShrink: 0, background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14,
            padding: '16px 20px', textAlign: 'center', minWidth: 160,
          }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#f8fafc' }}>
              {completedCount}/{SQL_MODULES.length}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 10 }}>modules complétés</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#6366f1' }}>
              {earnedXP} / {TRACK_META.totalXP} XP
            </div>
          </div>
        </div>

        {/* Barre de progression globale */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: '#64748b' }}>Progression</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#6366f1' }}>{progressPct}%</span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #6366f1, #818cf8)', borderRadius: 99 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 11, color: '#475569' }}>
            <span>⏱ ~{estimatedHours}h au total</span>
            <span>📊 {SQL_MODULES.length} modules</span>
            <span>🆓 {TRACK_META.freeModules} gratuits</span>
          </div>
        </div>
      </motion.div>

      {/* ── Liste des modules ────────────────────────────────────────── */}
      <motion.div variants={container} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {SQL_MODULES.map((module, idx) => {
          const isCompleted = completedLessons.includes(module.id)
          const isUnlocked = !module.isPremium && (idx === 0 || completedLessons.includes(SQL_MODULES[idx - 1].id))
          const isPremiumLocked = module.isPremium
          const isAccessible = isUnlocked && !isPremiumLocked
          const isNext = !isCompleted && isAccessible

          return (
            <motion.div key={module.id} variants={item}>
              <Link
                href={isAccessible ? `/learn/sql-course/${module.id}` : '#'}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  background: isNext
                    ? 'rgba(99,102,241,0.06)'
                    : isCompleted
                      ? 'rgba(34,197,94,0.04)'
                      : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isNext
                    ? 'rgba(99,102,241,0.25)'
                    : isCompleted
                      ? 'rgba(34,197,94,0.15)'
                      : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 14, padding: '16px 20px',
                  opacity: (!isAccessible && !isCompleted) ? 0.45 : 1,
                  cursor: isAccessible ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s',
                }}>
                  {/* Numéro / état */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: isCompleted
                      ? 'rgba(34,197,94,0.15)'
                      : isNext
                        ? 'rgba(99,102,241,0.15)'
                        : 'rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: isCompleted ? 18 : 15,
                    fontWeight: 800,
                    color: isCompleted ? '#22c55e' : isNext ? '#818cf8' : '#475569',
                  }}>
                    {isCompleted ? '✓' : isPremiumLocked ? '👑' : !isUnlocked ? '🔒' : `${module.order}`}
                  </div>

                  {/* Contenu */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: isCompleted ? '#86efac' : isNext ? '#e2e8f0' : '#64748b' }}>
                        {module.title}
                      </span>
                      {isNext && (
                        <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 99, background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>
                          SUIVANT
                        </span>
                      )}
                      {isPremiumLocked && (
                        <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 99, background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
                          PRO
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
                      {module.concept.headline}
                    </div>
                  </div>

                  {/* Meta */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>⏱ {module.estimatedMinutes} min</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#6366f1' }}>
                      +{(module.xpReward.sql ?? 0) + (module.xpReward.business ?? 0)} XP
                    </div>
                    {isAccessible && !isCompleted && (
                      <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>
                        Démarrer →
                      </div>
                    )}
                    {isCompleted && (
                      <div style={{ fontSize: 11, color: '#22c55e', marginTop: 4 }}>
                        Complété ✓
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>

      {/* ── Footer info ─────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        style={{ marginTop: 32, padding: '16px 20px', background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: 12 }}>
        <div style={{ fontSize: 12, color: '#6366f1', fontWeight: 700, marginBottom: 6 }}>⚡ DuckDB WASM — 100% navigateur</div>
        <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.6 }}>
          Chaque requête tourne dans ton navigateur via DuckDB WASM sur des données ShopStream simulées. Tu vois les coûts BigQuery simulés, les anti-patterns détectés, le score en temps réel. Même logique qu&apos;en entreprise, zéro coût.
        </p>
      </motion.div>
    </div>
  )
}
