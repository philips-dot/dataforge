'use client'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { SignInButton } from '@clerk/nextjs'

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
})

const avatars = [
  { initials: 'YB', color: '#8b5cf6' },
  { initials: 'TK', color: '#6366f1' },
  { initials: 'LM', color: '#06b6d4' },
  { initials: 'AS', color: '#10b981' },
  { initials: 'RM', color: '#f59e0b' },
]

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#050508',
        paddingTop: 96,
        paddingBottom: 80,
      }}
    >
      {/* Styles globaux injectés */}
      <style>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          50% { transform: translate(14px, 14px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.04); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(24px) scale(0.97); }
        }
        @keyframes pulseBullet {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.6; }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.3), 0 0 40px rgba(99,102,241,0.1); }
          50% { box-shadow: 0 0 30px rgba(99,102,241,0.5), 0 0 60px rgba(99,102,241,0.2); }
        }
        @media (max-width: 768px) {
          .hero-title { font-size: 36px !important; }
          .hero-ctas { flex-direction: column !important; align-items: stretch !important; }
          .hero-cta-primary, .hero-cta-secondary { width: 100% !important; justify-content: center !important; }
        }
      `}</style>

      {/* Grille de points animée */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          animation: 'gridMove 20s ease-in-out infinite',
          willChange: 'transform',
          pointerEvents: 'none',
        }}
      />

      {/* Orbe 1 — indigo, centré en haut */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* Orbe 2 — violet, bas gauche, floating */}
      <div
        style={{
          position: 'absolute',
          bottom: 200,
          left: '10%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'float1 8s ease-in-out infinite',
          willChange: 'transform',
          pointerEvents: 'none',
        }}
      />

      {/* Orbe 3 — cyan, bas droite, floating */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          right: '5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'float2 10s ease-in-out infinite',
          willChange: 'transform',
          pointerEvents: 'none',
        }}
      />

      {/* Contenu central */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: 800,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 32,
        }}
      >
        {/* Badge pill */}
        <motion.div {...fadeUp(0)}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: 999,
              padding: '8px 18px',
              fontSize: 14,
              color: 'rgba(255,255,255,0.80)',
              fontWeight: 500,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#6366f1',
                display: 'inline-block',
                animation: 'pulseBullet 2s ease-in-out infinite',
                willChange: 'transform',
              }}
            />
            La plateforme qui te prépare au vrai monde data
          </div>
        </motion.div>

        {/* Titre */}
        <motion.div {...fadeUp(0.1)} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <h1
            className="hero-title"
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.05,
              margin: 0,
              color: 'rgba(255,255,255,0.95)',
            }}
          >
            Les écoles t&apos;apprennent à coder.
          </h1>
          <h1
            className="hero-title"
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.05,
              margin: 0,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Nous t&apos;apprenons à avoir un impact.
          </h1>
        </motion.div>

        {/* Sous-titre */}
        <motion.p
          {...fadeUp(0.2)}
          style={{
            fontSize: 19,
            color: 'rgba(255,255,255,0.60)',
            maxWidth: 600,
            margin: 0,
            lineHeight: 1.65,
          }}
        >
          Cours fondamentaux ancrés dans la réalité business. Tickets urgents à traiter comme en vrai.
          Mentor IA disponible 24h/24. Tu sors opérationnel — pas juste certifié.
        </motion.p>

        {/* CTAs */}
        <motion.div {...fadeUp(0.3)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: '100%' }}>
          <div
            className="hero-ctas"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap', width: '100%' }}
          >
            {/* CTA Primaire */}
            <SignInButton mode="modal">
              <motion.button
                className="hero-cta-primary"
                whileHover={{ translateY: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  border: '1px solid rgba(99,102,241,0.4)',
                  color: 'white',
                  borderRadius: 12,
                  padding: '14px 28px',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer',
                  animation: 'glowPulse 3s ease-in-out infinite',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                Commencer gratuitement — aucune carte requise →
              </motion.button>
            </SignInButton>

            {/* CTA Secondaire */}
            <motion.button
              className="hero-cta-secondary"
              whileHover={{ translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.80)',
                borderRadius: 12,
                padding: '14px 24px',
                fontSize: 16,
                fontWeight: 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                whiteSpace: 'nowrap',
              }}
            >
              <Play size={16} style={{ color: '#6366f1', fill: '#6366f1' }} />
              Voir une vraie leçon&nbsp;&nbsp;(3 min)
            </motion.button>
          </div>

          {/* Mention sous CTAs */}
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
            Accès immédiat · Annulation en 1 clic
          </p>
        </motion.div>

        {/* Social proof */}
        <motion.div
          {...fadeUp(0.4)}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
        >
          {/* Avatars */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {avatars.map((avatar, i) => (
              <div
                key={avatar.initials}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: avatar.color,
                  border: '2px solid #050508',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'white',
                  marginLeft: i === 0 ? 0 : -10,
                  zIndex: avatars.length - i,
                  position: 'relative',
                }}
              >
                {avatar.initials}
              </div>
            ))}
          </div>

          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.60)', margin: 0, fontWeight: 500 }}>
            Rejoins{' '}
            <span style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 700 }}>2 340</span>{' '}
            futurs data professionals actifs cette semaine
          </p>

          {/* Étoiles */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#f59e0b', fontSize: 16, letterSpacing: 2 }}>★★★★★</span>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.60)' }}>
              <span style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 700 }}>4.9</span>/5
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
