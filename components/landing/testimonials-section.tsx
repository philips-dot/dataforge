'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface Testimonial {
  initials: string;
  avatarBg: string;
  avatarText: string;
  name: string;
  role: string;
  quote: string;
  badge: string;
}

const testimonials: Testimonial[] = [
  {
    initials: 'YB',
    avatarBg: '#8b5cf6',
    avatarText: '#ffffff',
    name: 'Yasmine Belkacem',
    role: 'Ex-Master BI · Maintenant Data Analyst @Nexify · CDI',
    quote:
      "Avant DataForge je savais écrire du SQL. Après, je savais POURQUOI je l'écrivais et ce que ça coûtait si je le faisais mal. C'est exactement ce que le recruteur voulait entendre.",
    badge: '✓ Poste décroché 6 semaines après DataForge',
  },
  {
    initials: 'TK',
    avatarBg: '#6366f1',
    avatarText: '#ffffff',
    name: 'Thomas Kaboré',
    role: 'Ex-Marketing · Maintenant Analytics Engineer @Stackpulse',
    quote:
      "La simulation d'urgence Slack m'a mieux préparé que 6 mois de cours théoriques. Le premier vrai ticket en entreprise, j'avais déjà vécu ça. J'ai géré ça comme un senior.",
    badge: '✓ Reconversion réussie en 4 mois',
  },
  {
    initials: 'LM',
    avatarBg: '#06b6d4',
    avatarText: '#000000',
    name: 'Léa Marchetti',
    role: 'Ex-Bootcamp · Maintenant Junior Data Engineer @Flowbase',
    quote:
      "Le fait que chaque leçon commence par 'ça coûte $X à l'entreprise' a changé ma façon de penser. J'ai été la seule candidate à parler d'optimisation de coûts en entretien. J'ai été prise.",
    badge: '✓ +40% de salaire vs ancien poste',
  },
];

function StarRating() {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: '#f59e0b', fontSize: 16 }}>
          ★
        </span>
      ))}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  index,
  isInView,
}: {
  testimonial: Testimonial;
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.2 + index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      style={{
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--border-default)',
        borderRadius: 20,
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        cursor: 'default',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'rgba(99,102,241,0.45)';
        el.style.boxShadow = '0 0 40px rgba(99,102,241,0.08)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'var(--border-default)';
        el.style.boxShadow = 'none';
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Avatar */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: testimonial.avatarBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 16,
            color: testimonial.avatarText,
            flexShrink: 0,
          }}
        >
          {testimonial.initials}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            {testimonial.name}
          </span>
          <span
            style={{
              fontSize: 12,
              color: 'var(--text-muted)',
              lineHeight: 1.4,
            }}
          >
            {testimonial.role}
          </span>
        </div>
      </div>

      <StarRating />

      {/* Quote */}
      <p
        style={{
          margin: 0,
          fontSize: 16,
          fontStyle: 'italic',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          flex: 1,
        }}
      >
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(16,185,129,0.12)',
          border: '1px solid rgba(16,185,129,0.25)',
          borderRadius: 100,
          padding: '6px 14px',
          fontSize: 13,
          fontWeight: 600,
          color: '#10b981',
          alignSelf: 'flex-start',
        }}
      >
        {testimonial.badge}
      </div>
    </motion.div>
  );
}

export function TestimonialsSection() {
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
      {/* Background accent */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(139,92,246,0.07) 0%, transparent 65%)',
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
            Ils ont décroché leur premier poste data.
          </h2>
          <p
            style={{
              fontSize: 18,
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Pas grâce à un diplôme de plus. Grâce à la pratique.
          </p>
        </motion.div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
          }}
        >
          {testimonials.map((t, i) => (
            <TestimonialCard
              key={t.name}
              testimonial={t}
              index={i}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
