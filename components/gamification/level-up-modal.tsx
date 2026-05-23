'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserStore } from '@/store/user-store'
import { LEVELS } from '@/types'

export function LevelUpModal() {
  const { showLevelUp, levelUpFrom, levelUpTo, clearLevelUp } = useUserStore()

  const fromLevel = LEVELS.find(l => l.level === levelUpFrom)
  const toLevel = LEVELS.find(l => l.level === levelUpTo)

  return (
    <AnimatePresence>
      {showLevelUp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(5,5,8,0.92)',
            backdropFilter: 'blur(16px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={clearLevelUp}
        >
          {/* Confetti */}
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: `${30 + Math.random() * 40}vw`, y: '-5vh', rotate: 0, opacity: 1 }}
              animate={{ y: '105vh', rotate: 720, opacity: 0 }}
              transition={{ duration: 2.5 + Math.random() * 1.5, delay: Math.random() * 0.8 }}
              style={{
                position: 'absolute',
                width: 10, height: 10,
                borderRadius: Math.random() > 0.5 ? '50%' : 2,
                background: ['#6366f1','#06b6d4','#10b981','#f59e0b','#ef4444','#8b5cf6'][Math.floor(Math.random() * 6)],
                pointerEvents: 'none',
              }}
            />
          ))}

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: '#0a0a12',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: 24, padding: '48px',
              textAlign: 'center', maxWidth: 440,
              boxShadow: '0 24px 80px rgba(99,102,241,0.2)',
            }}
          >
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎊</div>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: '#f8fafc', margin: '0 0 8px' }}>
              Niveau supérieur !
            </h2>

            {/* Levels */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, margin: '24px 0' }}>
              <div style={{
                background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 20px',
                color: '#64748b', fontWeight: 700, fontSize: 14,
              }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>📊</div>
                Niv.{levelUpFrom}
                <div style={{ fontSize: 12, marginTop: 2 }}>{fromLevel?.title}</div>
              </div>
              <motion.div
                animate={{ x: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
                style={{ fontSize: 24, color: '#6366f1' }}
              >→</motion.div>
              <div style={{
                background: 'rgba(99,102,241,0.2)',
                border: '2px solid #6366f1',
                borderRadius: 12, padding: '12px 20px',
                color: '#818cf8', fontWeight: 800, fontSize: 14,
                boxShadow: '0 0 24px rgba(99,102,241,0.3)',
              }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>🏆</div>
                Niv.{levelUpTo}
                <div style={{ fontSize: 12, marginTop: 2 }}>{toLevel?.title}</div>
              </div>
            </div>

            <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 8 }}>
              Tu es maintenant <strong style={{ color: '#f8fafc' }}>{toLevel?.title}</strong>
            </p>

            <div style={{ margin: '20px 0', textAlign: 'left' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 10 }}>COMPÉTENCES DÉBLOQUÉES</div>
              {levelUpTo >= 5 && <div style={{ fontSize: 13, color: '#cbd5e1', marginBottom: 6 }}>→ Mode simulation d&apos;entretien</div>}
              <div style={{ fontSize: 13, color: '#cbd5e1', marginBottom: 6 }}>→ Missions avancées</div>
              <div style={{ fontSize: 13, color: '#cbd5e1' }}>→ Accès aux parcours premium</div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clearLevelUp}
              style={{
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: '#fff', fontWeight: 800, fontSize: 16,
                padding: '14px 40px', borderRadius: 12, border: 'none', cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
              }}
            >
              Continuer →
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
