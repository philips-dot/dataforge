'use client'
import { motion } from 'framer-motion'
import { Counter } from '@/components/ui/counter'

interface Stat {
  prefix: string
  value: number
  suffix: string
  label: string
  sublabel: string
  gradient: boolean
}

const stats: Stat[] = [
  {
    prefix: '$',
    value: 4200,
    suffix: '',
    label: 'économisés par mois',
    sublabel: 'en optimisant vos requêtes BigQuery',
    gradient: true,
  },
  {
    prefix: '',
    value: 94,
    suffix: '%',
    label: 'décrochent un poste',
    sublabel: 'en moins de 4 mois après DataForge',
    gradient: true,
  },
  {
    prefix: '',
    value: 80,
    suffix: '+',
    label: 'leçons & missions',
    sublabel: 'disponibles dès maintenant',
    gradient: true,
  },
  {
    prefix: '',
    value: 8,
    suffix: ' sec',
    label: 'pour comprendre',
    sublabel: "l'impact business de chaque concept",
    gradient: true,
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

export function StatsSection() {
  return (
    <section
      id="stats"
      style={{
        backgroundColor: '#0a0a12',
        padding: '96px 24px',
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
          .stat-number {
            font-size: 42px !important;
          }
        }
        .stat-card:hover {
          border-color: rgba(99,102,241,0.3) !important;
          transform: translateY(-4px);
          transition: border-color 0.3s, transform 0.3s;
        }
        .stat-card {
          transition: border-color 0.3s, transform 0.3s;
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* En-tête de section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6366f1', marginBottom: 12 }}>
            Résultats mesurables
          </p>
          <h2 style={{ fontSize: 40, fontWeight: 700, color: 'rgba(255,255,255,0.95)', margin: 0, lineHeight: 1.15 }}>
            Des chiffres qui parlent d&apos;eux-mêmes
          </h2>
        </motion.div>

        {/* Grille de stats */}
        <motion.div
          className="stats-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
          }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={cardVariants}
              className="stat-card"
              style={{
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16,
                padding: 32,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
              {/* Chiffre animé */}
              <div
                className="stat-number"
                style={{
                  fontSize: 56,
                  fontWeight: 800,
                  lineHeight: 1,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                <Counter
                  from={0}
                  to={stat.value}
                  duration={2.2}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </div>

              {/* Label */}
              <p style={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.60)', margin: 0, lineHeight: 1.4 }}>
                {stat.label}
              </p>

              {/* Sublabel */}
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0, lineHeight: 1.5 }}>
                {stat.sublabel}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
