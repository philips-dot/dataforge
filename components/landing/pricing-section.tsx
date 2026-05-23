'use client';

import { SignInButton } from '@clerk/nextjs';
import { motion, useInView } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useRef } from 'react';

interface Feature {
  text: string;
  included: boolean;
}

const freeFeatures: Feature[] = [
  { text: '3 premières leçons', included: true },
  { text: '1 mission démo', included: true },
  { text: 'SQL Playground (10 analyses/jour)', included: true },
  { text: '5 messages Mentor/jour', included: true },
  { text: 'Accès complet aux parcours', included: false },
  { text: "Mode entretien", included: false },
  { text: 'Missions avancées', included: false },
];

const proFeatures: Feature[] = [
  { text: 'Tous les parcours fondamentaux', included: true },
  { text: 'Toutes les missions (30+)', included: true },
  { text: 'Mentor IA illimité', included: true },
  { text: "Mode simulation d'entretien", included: true },
  { text: 'SQL Playground illimité', included: true },
  { text: 'Nouvelles leçons chaque semaine', included: true },
  { text: 'Accès à vie aux leçons suivies', included: true },
];

const teamFeatures: Feature[] = [
  { text: 'Tout Pro pour chaque apprenant', included: true },
  { text: 'Dashboard admin et suivi de cohorte', included: true },
  { text: 'Intégration LMS (SCORM)', included: true },
  { text: 'Facture entreprise', included: true },
  { text: 'Onboarding dédié', included: true },
  { text: 'SLA et support prioritaire', included: true },
];

function FeatureRow({ feature }: { feature: Feature }) {
  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        fontSize: 14,
        color: feature.included ? 'var(--text-secondary)' : 'var(--text-muted)',
        lineHeight: 1.5,
      }}
    >
      {feature.included ? (
        <Check
          size={15}
          color="#10b981"
          strokeWidth={2.5}
          style={{ flexShrink: 0, marginTop: 2 }}
        />
      ) : (
        <X
          size={15}
          color="rgba(255,255,255,0.2)"
          strokeWidth={2.5}
          style={{ flexShrink: 0, marginTop: 2 }}
        />
      )}
      {feature.text}
    </li>
  );
}

export function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: 'var(--bg-surface)',
        padding: '120px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <h2
            style={{
              fontSize: 'clamp(26px, 4.5vw, 38px)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '0 0 12px',
              lineHeight: 1.2,
            }}
          >
            Investis dans ta carrière.
          </h2>
          <p style={{ fontSize: 18, color: 'var(--text-secondary)', margin: 0 }}>
            Retour sur investissement moyen :{' '}
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              47× en première année.
            </span>
          </p>
        </motion.div>

        {/* Plans grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
            alignItems: 'start',
          }}
        >
          {/* FREE */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.2, ease: 'easeOut' }}
            style={{
              background: 'var(--bg-glass)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid var(--border-default)',
              borderRadius: 20,
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 8,
                }}
              >
                Pour découvrir
              </div>
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  lineHeight: 1,
                }}
              >
                Gratuit
              </div>
            </div>

            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                flex: 1,
              }}
            >
              {freeFeatures.map((f, i) => (
                <FeatureRow key={i} feature={f} />
              ))}
            </ul>

            <SignInButton mode="modal">
              <button
                style={{
                  width: '100%',
                  padding: '13px 24px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    'rgba(255,255,255,0.05)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    'rgba(255,255,255,0.35)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    'rgba(255,255,255,0.2)';
                }}
              >
                Commencer gratuitement
              </button>
            </SignInButton>
          </motion.div>

          {/* PRO */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.3, ease: 'easeOut' }}
            style={{
              background: 'var(--bg-glass)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(99,102,241,0.5)',
              borderRadius: 20,
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              position: 'relative',
              transform: 'scale(1.03)',
              boxShadow: '0 0 60px rgba(99,102,241,0.12)',
            }}
          >
            {/* "Le plus choisi" badge */}
            <div
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                borderRadius: 100,
                padding: '4px 12px',
                fontSize: 11,
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '0.05em',
              }}
            >
              Le plus choisi
            </div>

            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#8b5cf6',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 8,
                }}
              >
                Pro
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span
                  style={{
                    fontSize: 48,
                    fontWeight: 800,
                    lineHeight: 1,
                    background:
                      'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  29€
                </span>
                <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>/ mois</span>
              </div>
              <div
                style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}
              >
                ou 290€/an · 2 mois offerts
              </div>
              <div
                style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}
              >
                Essai gratuit 7 jours · Sans engagement
              </div>
            </div>

            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                flex: 1,
              }}
            >
              {proFeatures.map((f, i) => (
                <FeatureRow key={i} feature={f} />
              ))}
            </ul>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <SignInButton mode="modal">
                <button
                  style={{
                    width: '100%',
                    padding: '15px 24px',
                    borderRadius: 12,
                    border: 'none',
                    background:
                      'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: '#ffffff',
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 0 30px rgba(99,102,241,0.35)',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      '0 0 50px rgba(99,102,241,0.55)';
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      '0 0 30px rgba(99,102,241,0.35)';
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      'translateY(0)';
                  }}
                >
                  Démarrer l&apos;essai gratuit →
                </button>
              </SignInButton>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                  lineHeight: 1.5,
                }}
              >
                Annulation en 1 clic · Accès immédiat · Aucune carte avant 7 jours
              </p>
            </div>
          </motion.div>

          {/* TEAM */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.4, ease: 'easeOut' }}
            style={{
              background: 'var(--bg-glass)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid var(--border-default)',
              borderRadius: 20,
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 8,
                }}
              >
                Pour les écoles et entreprises
              </div>
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  lineHeight: 1,
                }}
              >
                Sur devis
              </div>
            </div>

            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                flex: 1,
              }}
            >
              {teamFeatures.map((f, i) => (
                <FeatureRow key={i} feature={f} />
              ))}
            </ul>

            <a
              href="mailto:contact@dataforge.io"
              style={{
                display: 'block',
                width: '100%',
                padding: '13px 24px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'transparent',
                color: 'var(--text-primary)',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center',
                textDecoration: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  'rgba(255,255,255,0.05)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  'rgba(255,255,255,0.35)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  'rgba(255,255,255,0.2)';
              }}
            >
              Nous contacter
            </a>
          </motion.div>
        </div>

        {/* Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.55, ease: 'easeOut' }}
          style={{
            marginTop: 48,
            padding: 24,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border-default)',
            borderRadius: 16,
            textAlign: 'center',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 15,
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
            }}
          >
            🛡 <strong style={{ color: 'var(--text-primary)' }}>Satisfait ou remboursé 7 jours</strong> — Si DataForge ne te convient pas, on te rembourse
            intégralement. Pas de question. Pas de démarche compliquée.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
