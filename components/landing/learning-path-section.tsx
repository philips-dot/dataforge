'use client';

import { motion, useInView } from 'framer-motion';
import { Compass, Target, Brain, GitBranch, Trophy } from 'lucide-react';
import { useRef } from 'react';

const steps = [
  {
    number: '01',
    label: 'DÉCOUVRIR',
    period: 'Semaine 1-2',
    icon: Compass,
    color: '#6366f1',
    borderColor: '#6366f1',
    points: [
      'SQL et BigQuery fondamentaux',
      'Comprendre la facturation au volume',
      'Première requête optimisée : -90% de coût',
    ],
  },
  {
    number: '02',
    label: 'PRATIQUER',
    period: 'Semaine 3-4',
    icon: Target,
    color: '#8b5cf6',
    borderColor: '#8b5cf6',
    points: [
      'Premier ticket en situation réelle',
      'Analyser une chute de conversion',
      'Livrer un diagnostic business complet',
    ],
  },
  {
    number: '03',
    label: 'APPROFONDIR',
    period: 'Mois 2',
    icon: Brain,
    color: '#06b6d4',
    borderColor: '#06b6d4',
    points: [
      'Data Modelling, dbt, pipelines',
      'Métriques business : CAC, LTV, churn',
      'Mode entretien avec le Mentor IA',
    ],
  },
  {
    number: '04',
    label: 'SE SPÉCIALISER',
    period: 'Mois 3',
    icon: GitBranch,
    color: '#10b981',
    borderColor: '#10b981',
    points: [
      'Choix de ta voie : Analytics ou Engineering',
      'Missions avancées par domaine',
      'Portfolio de livrables réels',
    ],
  },
  {
    number: '05',
    label: 'DÉCROCHER UN POSTE',
    period: 'Mois 4',
    icon: Trophy,
    color: '#f59e0b',
    borderColor: '#f59e0b',
    highlighted: true,
    points: [
      "Simulation d'entretien technique",
      'Revue de CV par le Mentor',
      "94% des diplômés en poste en <4 mois",
    ],
  },
];

export function LearningPathSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: 'var(--bg-base)',
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
            'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative' }}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 80 }}
        >
          <h2
            style={{
              fontSize: 'clamp(28px, 5vw, 40px)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Un parcours clair. Des compétences{' '}
            <span
              style={{
                background:
                  'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              mesurables.
            </span>
          </h2>
        </motion.div>

        {/* Timeline container */}
        <div ref={timelineRef} style={{ position: 'relative', paddingLeft: 48 }}>
          {/* Vertical line */}
          <div
            style={{
              position: 'absolute',
              left: 15,
              top: 24,
              bottom: 24,
              width: 2,
              background: 'rgba(255,255,255,0.08)',
              borderRadius: 1,
            }}
          />
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.3 }}
            style={{
              position: 'absolute',
              left: 15,
              top: 24,
              bottom: 24,
              width: 2,
              background:
                'linear-gradient(to bottom, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
              borderRadius: 1,
              transformOrigin: 'top',
            }}
          />

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: 0.4 + i * 0.15,
                    ease: 'easeOut',
                  }}
                  style={{ position: 'relative' }}
                >
                  {/* Circle on timeline */}
                  <div
                    style={{
                      position: 'absolute',
                      left: -48,
                      top: 24,
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'var(--bg-elevated)',
                      border: `2px solid ${step.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2,
                    }}
                  >
                    <Icon size={14} color={step.color} strokeWidth={2} />
                  </div>

                  {/* Card */}
                  <div
                    style={{
                      background: 'var(--bg-glass)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      border: step.highlighted
                        ? `1px solid rgba(245,158,11,0.35)`
                        : '1px solid var(--border-default)',
                      borderLeft: `3px solid ${step.borderColor}`,
                      borderRadius: 16,
                      padding: '24px 24px 24px 32px',
                      position: 'relative',
                      boxShadow: step.highlighted
                        ? `0 0 40px rgba(245,158,11,0.08)`
                        : 'none',
                    }}
                  >
                    {/* Header row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        marginBottom: 16,
                        flexWrap: 'wrap',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          color: step.color,
                          textTransform: 'uppercase',
                        }}
                      >
                        {step.label}
                      </span>

                      {/* Period pill */}
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: step.color,
                          background: `${step.color}18`,
                          border: `1px solid ${step.color}30`,
                          borderRadius: 100,
                          padding: '3px 10px',
                        }}
                      >
                        {step.period}
                      </span>
                    </div>

                    {/* Points */}
                    <ul
                      style={{
                        margin: 0,
                        padding: 0,
                        listStyle: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                      }}
                    >
                      {step.points.map((point, j) => (
                        <li
                          key={j}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 10,
                            fontSize: 15,
                            color: 'var(--text-secondary)',
                            lineHeight: 1.5,
                          }}
                        >
                          <span
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: '50%',
                              background: step.color,
                              marginTop: 7,
                              flexShrink: 0,
                            }}
                          />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
