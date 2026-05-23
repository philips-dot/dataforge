'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ---------- ICONS ----------
function BookOpenIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#8b5cf6"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6366f1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

// ---------- PHASE PILLS ----------
function PhasePills() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % 5);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 20 }}>
      {[1, 2, 3, 4, 5].map((phase, i) => (
        <div
          key={phase}
          style={{
            padding: '6px 14px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            transition: 'all 0.4s ease',
            background:
              i === active
                ? 'rgba(139,92,246,0.25)'
                : 'rgba(255,255,255,0.04)',
            border:
              i === active
                ? '1px solid rgba(139,92,246,0.50)'
                : '1px solid rgba(255,255,255,0.08)',
            color: i === active ? '#c4b5fd' : 'var(--text-muted)',
          }}
        >
          Phase {phase}
        </div>
      ))}
    </div>
  );
}

// ---------- SLACK TYPING SIMULATION ----------
const SLACK_MESSAGE =
  '@data-analyst conversion -23% depuis lundi, board dans 2h, j\'ai besoin d\'une explication';

function SlackTyping() {
  const [displayed, setDisplayed] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (charIndex < SLACK_MESSAGE.length) {
      const timeout = setTimeout(() => {
        setDisplayed((prev) => prev + SLACK_MESSAGE[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 38);
      return () => clearTimeout(timeout);
    } else {
      // Reset after 6s
      const reset = setTimeout(() => {
        setDisplayed('');
        setCharIndex(0);
      }, 6000);
      return () => clearTimeout(reset);
    }
  }, [charIndex]);

  return (
    <div
      style={{
        background: 'rgba(99,102,241,0.08)',
        borderLeft: '3px solid #6366f1',
        borderRadius: 8,
        padding: '12px 16px',
        marginTop: 20,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 700,
            color: '#fff',
            flexShrink: 0,
          }}
        >
          MD
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
          Marie D. (Head of Marketing)
        </span>
      </div>
      <p
        style={{
          margin: 0,
          fontSize: 13,
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          minHeight: '2.5em',
        }}
      >
        {displayed}
        {charIndex < SLACK_MESSAGE.length && (
          <span
            style={{
              display: 'inline-block',
              width: 2,
              height: '1em',
              background: '#6366f1',
              marginLeft: 2,
              verticalAlign: 'text-bottom',
              animation: 'blink 0.8s step-end infinite',
            }}
          />
        )}
      </p>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ---------- TAG LIST ----------
function TagList({ tags, color }: { tags: string[]; color: string }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
      {tags.map((tag) => (
        <span
          key={tag}
          style={{
            padding: '4px 12px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 500,
            background: `${color}14`,
            border: `1px solid ${color}30`,
            color,
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

// ---------- MAIN COMPONENT ----------
export function TwoPillarsSection() {
  return (
    <section style={{ padding: '100px 24px', background: 'var(--bg-surface)' }}>
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
            lineHeight: 1.25,
          }}
        >
          Deux approches. Un seul objectif :{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            te rendre opérationnel.
          </span>
        </h2>
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
        {/* CARD 1 — FONDAMENTAUX */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: 20,
            padding: 40,
          }}
        >
          {/* Badge */}
          <div style={{ marginBottom: 20 }}>
            <span
              style={{
                padding: '5px 14px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase' as const,
                background: 'rgba(139,92,246,0.15)',
                border: '1px solid rgba(139,92,246,0.30)',
                color: '#c4b5fd',
              }}
            >
              PILIER 1
            </span>
          </div>

          {/* Icon + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <BookOpenIcon />
            <h3
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Fondamentaux
            </h3>
          </div>

          <p
            style={{
              margin: '0 0 14px',
              fontSize: 15,
              fontWeight: 500,
              color: 'var(--text-secondary)',
            }}
          >
            Comprendre avant de faire.
          </p>

          <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Chaque leçon démarre par un contexte business réel : pourquoi cette compétence
            coûte de l&apos;argent quand elle manque, et combien. Tu construis des bases solides
            en SQL, Python et analytics — pas pour valider un quiz, mais pour être autonome
            face à un problème d&apos;entreprise.
          </p>

          {/* Stats */}
          <p style={{ fontSize: 13, fontWeight: 600, color: '#8b5cf6', margin: '0 0 4px' }}>
            12 parcours · 80+ leçons
          </p>
          <TagList
            tags={['SQL', 'BigQuery', 'Python', 'Business Metrics', 'Analytics Engineering', 'Data Engineering']}
            color="#8b5cf6"
          />

          {/* Phase pills animation */}
          <PhasePills />
        </motion.div>

        {/* CARD 2 — MISSIONS */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 20,
            padding: 40,
            boxShadow: '0 0 40px rgba(99,102,241,0.06)',
          }}
        >
          {/* Badge */}
          <div style={{ marginBottom: 20 }}>
            <span
              style={{
                padding: '5px 14px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase' as const,
                background: 'rgba(99,102,241,0.15)',
                border: '1px solid rgba(99,102,241,0.30)',
                color: '#a5b4fc',
              }}
            >
              PILIER 2
            </span>
          </div>

          {/* Icon + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <BriefcaseIcon />
            <h3
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Missions (Tickets)
            </h3>
          </div>

          <p
            style={{
              margin: '0 0 14px',
              fontSize: 15,
              fontWeight: 500,
              color: 'var(--text-secondary)',
            }}
          >
            Travailler sous pression réelle.
          </p>

          <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Des tickets Jira fictifs — mais ultra-réalistes. Deadline imminente, manager qui
            attend, données imparfaites. Tu dois livrer un diagnostic business complet, pas
            juste une requête qui tourne. Chaque mission est notée sur l&apos;impact, pas sur
            la syntaxe.
          </p>

          {/* Stats */}
          <p style={{ fontSize: 13, fontWeight: 600, color: '#6366f1', margin: '0 0 4px' }}>
            30+ missions · progressives
          </p>
          <TagList
            tags={['E-commerce', 'Fintech', 'SaaS', 'Marketing', 'Data Engineering', 'Analytics', 'BI']}
            color="#6366f1"
          />

          {/* Slack typing simulation */}
          <SlackTyping />
        </motion.div>
      </div>
    </section>
  );
}
