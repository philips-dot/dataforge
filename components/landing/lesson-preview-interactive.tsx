'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type TabId = 'alerte' | 'pourquoi' | 'concept' | 'pratique' | 'roi';

const TABS: { id: TabId; label: string }[] = [
  { id: 'alerte', label: 'Alerte' },
  { id: 'pourquoi', label: 'Pourquoi' },
  { id: 'concept', label: 'Concept' },
  { id: 'pratique', label: 'Pratique' },
  { id: 'roi', label: 'ROI' },
];

// ---------- TAB: ALERTE ----------
function TabAlerte() {
  return (
    <div>
      {/* Slack panel */}
      <div
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12,
          overflow: 'hidden',
          marginBottom: 20,
        }}
      >
        {/* Slack header */}
        <div
          style={{
            padding: '10px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            fontSize: 13,
            color: 'var(--text-secondary)',
            fontWeight: 500,
          }}
        >
          #data-team · 09:14
        </div>
        {/* Message */}
        <div
          style={{
            padding: 16,
            background: 'rgba(255,255,255,0.03)',
            borderLeft: '3px solid #ef4444',
            margin: 12,
            borderRadius: '0 8px 8px 0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0,
              }}
            >
              TB
            </div>
            <div>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>
                Thomas Bernard
              </span>
              <span
                style={{
                  marginLeft: 8,
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  background: 'rgba(239,68,68,0.15)',
                  padding: '2px 6px',
                  borderRadius: 4,
                }}
              >
                CFO
              </span>
            </div>
          </div>
          <p
            style={{
              margin: 0,
              color: 'var(--text-secondary)',
              fontSize: 14,
              lineHeight: 1.65,
            }}
          >
            La facture BigQuery de novembre vient de tomber :{' '}
            <strong style={{ color: '#ef4444' }}>$23 400</strong>. Budget prévu : $5 000.
            Quelqu&apos;un peut m&apos;expliquer ce dépassement ? J&apos;ai un board dans 2h.
          </p>
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <span
          style={{
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.25)',
            color: '#ef4444',
            padding: '6px 14px',
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          Impact financier : $18 400 de dépassement
        </span>
        <span
          style={{
            background: '#ef4444',
            color: '#fff',
            padding: '6px 14px',
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 600,
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        >
          Urgence : CRITIQUE
        </span>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.65; }
        }
      `}</style>
    </div>
  );
}

// ---------- TAB: POURQUOI ----------
function TabPourquoi() {
  return (
    <div>
      <h3
        style={{
          margin: '0 0 14px',
          fontSize: 20,
          fontWeight: 600,
          color: 'var(--text-primary)',
        }}
      >
        Pourquoi BigQuery facture-t-il autant ?
      </h3>
      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: 14,
          lineHeight: 1.7,
          marginBottom: 24,
        }}
      >
        BigQuery facture au volume de données <em>scannées</em>, pas à la complexité de ta
        requête. Un <code style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: 4 }}>SELECT *</code> sur
        une table de 500 Go te coûte autant que de lire 500 Go — même si tu
        n&apos;as besoin que de 5 colonnes. Les data analysts juniors ignorent souvent ce
        mécanisme et génèrent des coûts exponentiels sans s&apos;en rendre compte.
      </p>

      {/* Comparison table */}
      <div
        style={{
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '10px 16px',
              background: 'rgba(239,68,68,0.08)',
              borderRight: '1px solid rgba(255,255,255,0.08)',
              fontSize: 12,
              fontWeight: 600,
              color: '#ef4444',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Junior
          </div>
          <div
            style={{
              padding: '10px 16px',
              background: 'rgba(99,102,241,0.08)',
              fontSize: 12,
              fontWeight: 600,
              color: '#6366f1',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Pro
          </div>

          {/* Row 1 */}
          <div
            style={{
              padding: '14px 16px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              borderRight: '1px solid rgba(255,255,255,0.06)',
              color: 'var(--text-secondary)',
              fontSize: 14,
            }}
          >
            <span style={{ color: '#ef4444', marginRight: 6 }}>✗</span> SELECT *
          </div>
          <div
            style={{
              padding: '14px 16px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              color: 'var(--text-secondary)',
              fontSize: 14,
            }}
          >
            <span style={{ color: '#6366f1', marginRight: 6 }}>✓</span> 5 colonnes ciblées
          </div>

          {/* Row 2 */}
          <div
            style={{
              padding: '14px 16px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              borderRight: '1px solid rgba(255,255,255,0.06)',
              color: 'var(--text-secondary)',
              fontSize: 14,
            }}
          >
            <span style={{ color: '#ef4444', marginRight: 6 }}>✗</span> $14.20 / requête
          </div>
          <div
            style={{
              padding: '14px 16px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              color: 'var(--text-secondary)',
              fontSize: 14,
            }}
          >
            <span style={{ color: '#6366f1', marginRight: 6 }}>✓</span> $0.18 / requête
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- TAB: CONCEPT ----------
function TabConcept() {
  const codeStyle: React.CSSProperties = {
    fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace',
    fontSize: 13,
    lineHeight: 1.75,
    color: '#e6edf3',
    margin: 0,
    padding: '16px 20px',
    whiteSpace: 'pre',
  };

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        {/* Before */}
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#ef4444',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            AVANT (Junior)
          </div>
          <div
            style={{
              background: '#0d1117',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.07)',
              overflow: 'hidden',
            }}
          >
            <pre style={codeStyle}>{`SELECT *
FROM orders
WHERE created_at >= '2024-01-01'`}</pre>
          </div>
        </div>

        {/* After */}
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#6366f1',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            APRÈS (Pro)
          </div>
          <div
            style={{
              background: '#0d1117',
              borderRadius: 12,
              border: '1px solid rgba(99,102,241,0.35)',
              overflow: 'hidden',
            }}
          >
            <pre style={codeStyle}>{`SELECT order_id, user_id,
       amount, status, created_at
FROM orders
WHERE _PARTITIONDATE >= '2024-01-01'`}</pre>
          </div>
        </div>
      </div>

      {/* Cost comparison */}
      <div
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12,
          padding: '16px 20px',
        }}
      >
        <div style={{ marginBottom: 10 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 13, color: '#ef4444', fontWeight: 500 }}>
              Coût AVANT
            </span>
            <span style={{ fontSize: 13, color: '#ef4444', fontWeight: 600 }}>$5.00</span>
          </div>
          <div
            style={{
              height: 8,
              background: '#ef4444',
              borderRadius: 4,
              width: '100%',
              opacity: 0.7,
            }}
          />
        </div>
        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 13, color: '#10b981', fontWeight: 500 }}>
              Coût APRÈS
            </span>
            <span style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>$0.05</span>
          </div>
          <div
            style={{
              height: 8,
              background: '#10b981',
              borderRadius: 4,
              width: '1%',
              opacity: 0.8,
            }}
          />
        </div>
        <div
          style={{
            textAlign: 'center',
            fontSize: 14,
            fontWeight: 600,
            color: '#10b981',
          }}
        >
          Économie : -99% · $4.95 par requête
        </div>
      </div>
    </div>
  );
}

// ---------- TAB: PRATIQUE ----------
function TabPratique() {
  const code = `SELECT *
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN products p ON o.product_id = p.id
WHERE o.created_at >= '2024-01-01'`;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 20 }}>
      {/* Editor */}
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--text-secondary)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Éditeur de requête
        </div>
        <div
          style={{
            background: '#0d1117',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            padding: '14px 16px',
            marginBottom: 14,
          }}
        >
          <pre
            style={{
              fontFamily: 'ui-monospace, monospace',
              fontSize: 13,
              color: '#e6edf3',
              margin: 0,
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
            }}
          >
            {code}
          </pre>
        </div>
        <button
          style={{
            width: '100%',
            padding: '11px 0',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none',
            borderRadius: 10,
            color: '#fff',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          Analyser ma requête
        </button>
      </div>

      {/* Results */}
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--text-secondary)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Résultat
        </div>
        {/* Score */}
        <div
          style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.15)',
            borderRadius: 12,
            padding: '16px',
            marginBottom: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: '#ef4444',
              lineHeight: 1,
            }}
          >
            34<span style={{ fontSize: 18, color: 'var(--text-muted)' }}>/100</span>
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            3 anti-patterns détectés
          </div>
        </div>

        {/* Anti-patterns */}
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            'SELECT * détecté',
            'Pas de filtre de partition',
            'Pas de LIMIT',
          ].map((item, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'rgba(239,68,68,0.05)',
                border: '1px solid rgba(239,68,68,0.10)',
                borderRadius: 8,
                padding: '10px 14px',
                fontSize: 13,
                color: 'var(--text-secondary)',
              }}
            >
              <span style={{ color: '#ef4444', fontWeight: 700 }}>✗</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ---------- TAB: ROI ----------
function TabROI({ active }: { active: boolean }) {
  const targets = [99, 4950, 59400];
  const labels = ['-99% de coût SQL par requête', '$4 950/mois économisés', '$59 400/an économisés'];
  const prefixes = ['-', '$', '$'];
  const suffixes = ['%', '', ''];

  const [counts, setCounts] = useState([0, 0, 0]);

  useEffect(() => {
    if (!active) return;
    const duration = 1200;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounts(targets.map((t) => Math.round(t * ease)));
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <div>
      {/* Metrics */}
      <div
        style={{
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: 16,
          padding: '24px',
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 20,
          }}
        >
          {counts.map((val, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: '#10b981',
                  lineHeight: 1.1,
                  marginBottom: 6,
                }}
              >
                {prefixes[i]}
                {val.toLocaleString('fr-FR')}
                {suffixes[i]}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {labels[i]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Separator */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          marginBottom: 20,
        }}
      />

      {/* Quote */}
      <p
        style={{
          fontSize: 13,
          color: 'var(--text-secondary)',
          marginBottom: 12,
          fontWeight: 500,
        }}
      >
        Ce que tu peux dire en entretien :
      </p>
      <blockquote
        style={{
          margin: '0 0 24px',
          padding: '16px 20px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          fontStyle: 'italic',
          color: 'var(--text-secondary)',
          fontSize: 14,
          lineHeight: 1.7,
        }}
      >
        «&nbsp;J&apos;ai optimisé des requêtes BigQuery en réduisant le coût de scan de 99%,
        représentant ~$60k d&apos;économies annuelles pour l&apos;équipe.&nbsp;»
      </blockquote>

      {/* CTA */}
      <button
        style={{
          width: '100%',
          padding: '13px 0',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          border: 'none',
          borderRadius: 12,
          color: '#fff',
          fontWeight: 600,
          fontSize: 15,
          cursor: 'pointer',
          letterSpacing: '0.02em',
        }}
      >
        Leçon suivante →
      </button>
    </div>
  );
}

// ---------- MAIN COMPONENT ----------
export function LessonPreviewInteractive() {
  const [activeTab, setActiveTab] = useState<TabId>('alerte');

  const filledCount = 2;

  function renderContent() {
    switch (activeTab) {
      case 'alerte':
        return <TabAlerte />;
      case 'pourquoi':
        return <TabPourquoi />;
      case 'concept':
        return <TabConcept />;
      case 'pratique':
        return <TabPratique />;
      case 'roi':
        return <TabROI active={activeTab === 'roi'} />;
    }
  }

  return (
    <section style={{ padding: '80px 24px', background: 'var(--bg-base)' }}>
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          background: 'rgba(15,15,26,0.8)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 24,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 0 80px rgba(99,102,241,0.08)',
          overflow: 'hidden',
        }}
      >
        {/* Mockup Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            background: 'rgba(255,255,255,0.03)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
            DataForge — Leçon 2 · SQL Cost Awareness
          </span>

          {/* Progress pills */}
          <div style={{ display: 'flex', gap: 8 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: i < filledCount ? '#6366f1' : 'rgba(255,255,255,0.15)',
                }}
              />
            ))}
          </div>

          <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
            08:34 ⏱
          </span>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            flexWrap: 'wrap',
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '7px 16px',
                borderRadius: 20,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                transition: 'all 0.2s ease',
                background: activeTab === tab.id ? '#6366f1' : 'transparent',
                color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    'rgba(255,255,255,0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '28px 24px', minHeight: 320 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
