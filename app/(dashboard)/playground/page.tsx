'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
export default function PlaygroundPage() {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 800, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f8fafc', marginBottom: 8 }}>SQL Playground</h1>
        <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 32 }}>Écris et teste tes requêtes SQL directement dans le navigateur.</p>
        <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 16, padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔧</div>
          <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 20 }}>Le playground interactif BigQuery arrive bientôt.</p>
          <Link href="/learn" style={{ textDecoration: 'none', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', padding: '12px 28px', borderRadius: 10, fontWeight: 700, fontSize: 14 }}>
            Continuer les leçons →
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
