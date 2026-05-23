'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
export default function MentorPage() {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 800, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f8fafc', marginBottom: 8 }}>Mentor IA</h1>
        <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 32 }}>Ton coach data personnel, disponible 24h/24.</p>
        <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16, padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
          <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 20 }}>Le mentor IA arrive bientôt. En attendant, utilise les indices dans chaque leçon.</p>
          <Link href="/missions" style={{ textDecoration: 'none', background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', padding: '12px 28px', borderRadius: 10, fontWeight: 700, fontSize: 14 }}>
            Voir les missions →
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
