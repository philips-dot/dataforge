'use client';

import { motion } from 'framer-motion';

const othersItems = [
  'Te montrent la syntaxe SQL sans dire pourquoi ça coûte de l\'argent',
  'Utilisent des datasets Kaggle déconnectés de la réalité',
  'Ne te préparent pas aux vraies pressions (deadline, manager, board)',
  'Tu valides un quiz, pas un livrable business',
  'Aucun feedback sur l\'impact financier de ton code',
];

const dataforgeItems = [
  'Chaque concept expliqué par ce qu\'il coûte de ne pas le maîtriser',
  'Datasets simulés d\'entreprises réalistes (e-commerce, fintech, SaaS)',
  'Brief Slack urgent, ticket Jira P0, deadline board meeting dans 2h',
  'Tu livres un vrai diagnostic business, pas juste une requête qui tourne',
  'Coût BigQuery affiché en $ après chaque requête que tu écris',
];

function XIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export function DifferentiationSection() {
  return (
    <section
      style={{
        padding: '100px 24px',
        background: 'var(--bg-base)',
      }}
    >
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: 64 }}
      >
        <h2
          style={{
            fontSize: 40,
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Ce que les autres formations ne font pas.
        </h2>
        <p
          style={{
            marginTop: 16,
            fontSize: 18,
            color: 'var(--text-secondary)',
          }}
        >
          Et qui fait toute la différence le premier lundi en poste.
        </p>
      </motion.div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))',
          gap: 24,
          maxWidth: 960,
          margin: '0 auto',
        }}
      >
        {/* LEFT — Les autres */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            background: 'rgba(239,68,68,0.05)',
            border: '1px solid rgba(239,68,68,0.12)',
            borderRadius: 20,
            padding: 40,
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <XIcon />
            <span
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              Les autres formations
            </span>
          </div>

          {/* Items */}
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {othersItems.map((item, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '16px 0',
                  borderBottom:
                    i < othersItems.length - 1
                      ? '1px solid rgba(239,68,68,0.08)'
                      : 'none',
                }}
              >
                <span
                  style={{
                    color: '#ef4444',
                    fontWeight: 700,
                    fontSize: 16,
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  ✗
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.55 }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* RIGHT — DataForge */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.20)',
            borderRadius: 20,
            padding: 40,
            boxShadow: '0 0 40px rgba(99,102,241,0.08)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <CheckCircleIcon />
            <span
              style={{
                fontSize: 18,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              DataForge
            </span>
          </div>

          {/* Items */}
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {dataforgeItems.map((item, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '16px 0',
                  borderBottom:
                    i < dataforgeItems.length - 1
                      ? '1px solid rgba(99,102,241,0.08)'
                      : 'none',
                }}
              >
                <span
                  style={{
                    color: '#6366f1',
                    fontWeight: 700,
                    fontSize: 16,
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  ✓
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.55 }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
