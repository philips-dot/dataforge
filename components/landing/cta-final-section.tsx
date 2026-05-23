'use client';

import { SignInButton } from '@clerk/nextjs';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function CtaFinalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: 'var(--bg-base)',
        padding: '160px 24px',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* Gradient background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Orb 1 */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      {/* Orb 2 */}
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />
      {/* Orb 3 */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 900,
          height: 900,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="2" width="8" height="8" rx="2" fill="white" opacity="0.9" />
              <rect x="12" y="2" width="8" height="8" rx="2" fill="white" opacity="0.6" />
              <rect x="2" y="12" width="8" height="8" rx="2" fill="white" opacity="0.6" />
              <rect x="12" y="12" width="8" height="8" rx="2" fill="white" opacity="0.4" />
            </svg>
          </div>
          <span
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            DataForge
          </span>
        </motion.div>

        {/* H2 */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.18 }}
          style={{
            fontSize: 'clamp(36px, 7vw, 52px)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.15,
            margin: '0 0 20px',
          }}
        >
          Ton premier poste data t&apos;attend.
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.26 }}
          style={{
            fontSize: 20,
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            margin: '0 0 48px',
          }}
        >
          Commence à travailler comme un professionnel data — dès aujourd&apos;hui, en 8 minutes.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.34 }}
          style={{ marginBottom: 16 }}
        >
          <SignInButton mode="modal">
            <button
              style={{
                padding: '20px 48px',
                fontSize: 18,
                fontWeight: 700,
                borderRadius: 14,
                border: 'none',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: '#ffffff',
                cursor: 'pointer',
                animation: 'pulse-glow 2.5s ease-in-out infinite',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.03)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              }}
            >
              Commencer gratuitement — 0€, accès immédiat →
            </button>
          </SignInButton>
        </motion.div>

        {/* Sub-CTA text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.42 }}
          style={{
            fontSize: 14,
            color: 'var(--text-muted)',
            margin: '0 0 48px',
          }}
        >
          Aucune carte bancaire · Annulation en 1 clic · 2 340 étudiants actifs
        </motion.p>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 24,
          }}
        >
          {[
            '🔒 Paiement sécurisé Stripe',
            '★ 4.9/5 avis vérifiés',
            '🇫🇷 Équipe basée en France',
          ].map((badge) => (
            <span
              key={badge}
              style={{
                fontSize: 13,
                color: 'var(--text-muted)',
                fontWeight: 500,
              }}
            >
              {badge}
            </span>
          ))}
        </motion.div>
      </div>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 30px rgba(99, 102, 241, 0.35);
          }
          50% {
            box-shadow: 0 0 60px rgba(99, 102, 241, 0.5), 0 0 100px rgba(139, 92, 246, 0.25);
          }
        }
      `}</style>
    </section>
  );
}
