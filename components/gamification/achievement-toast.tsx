'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { useToastStore } from '@/store/toast-store'

const SKILL_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  sql:          { bg: 'rgba(99,102,241,0.15)',  border: 'rgba(99,102,241,0.4)',  text: '#818cf8' },
  business:     { bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.4)',  text: '#34d399' },
  optimization: { bg: 'rgba(6,182,212,0.15)',   border: 'rgba(6,182,212,0.4)',   text: '#22d3ee' },
  python:       { bg: 'rgba(139,92,246,0.15)',  border: 'rgba(139,92,246,0.4)',  text: '#a78bfa' },
  dashboard:    { bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.4)',  text: '#fbbf24' },
}

const DEFAULT_COLORS = { bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.4)', text: '#818cf8' }

export function AchievementToast() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <AnimatePresence>
        {toasts.map(toast => {
          const c = toast.skill ? (SKILL_COLORS[toast.skill] ?? DEFAULT_COLORS) : DEFAULT_COLORS
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              onClick={() => removeToast(toast.id)}
              style={{
                background: c.bg,
                border: `1px solid ${c.border}`,
                borderRadius: 14,
                padding: '14px 18px',
                minWidth: 220,
                maxWidth: 300,
                cursor: 'pointer',
                backdropFilter: 'blur(12px)',
                boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${c.border}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: c.border,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                }}>⚡</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: c.text }}>{toast.message}</div>
                  {toast.subMessage && (
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{toast.subMessage}</div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
