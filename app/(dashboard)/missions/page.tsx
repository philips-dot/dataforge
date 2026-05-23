'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { MISSIONS } from '@/data/missions'
import { LESSONS } from '@/data/lessons'
import { useUserStore } from '@/store/user-store'
import { ArrowRight, Check } from 'lucide-react'
import type { Difficulty } from '@/types'

const DIFF_LABELS: Record<Difficulty, string> = { beginner: 'Débutant', intermediate: 'Intermédiaire', advanced: 'Avancé' }
const DIFF_COLORS: Record<Difficulty, string> = { beginner: '#10b981', intermediate: '#f59e0b', advanced: '#ef4444' }

const DOMAIN_COLORS: Record<string, string> = {
  'Marketing Analytics': '#6366f1',
  'Data Engineering': '#8b5cf6',
  'Data Analytics': '#06b6d4',
}

export default function MissionsPage() {
  const { completedMissions, currentMission } = useUserStore()
  const [filter, setFilter] = useState<'all' | 'available' | 'done'>('all')
  const [diffFilter, setDiffFilter] = useState<'all' | Difficulty>('all')

  const filtered = MISSIONS.filter(m => {
    const isDone = completedMissions.includes(m.id)
    const isActive = currentMission?.missionId === m.id
    if (filter === 'done' && !isDone) return false
    if (filter === 'available' && isDone) return false
    if (diffFilter !== 'all' && m.difficulty !== diffFilter) return false
    return true
  })

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f8fafc', margin: 0, marginBottom: 8 }}>Missions</h1>
        <p style={{ color: '#94a3b8', fontSize: 15, margin: 0, lineHeight: 1.7 }}>
          Situations réelles simulées. Brief Slack urgent, données réelles, deadline business.{' '}
          <strong style={{ color: '#e2e8f0' }}>Exactement comme en entreprise.</strong>
        </p>
      </motion.div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {(['all', 'available', 'done'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '7px 16px', borderRadius: 99, border: `1px solid ${filter === f ? '#6366f1' : 'rgba(255,255,255,0.08)'}`,
            background: filter === f ? 'rgba(99,102,241,0.15)' : 'transparent',
            color: filter === f ? '#6366f1' : '#64748b', fontSize: 13, fontWeight: filter === f ? 700 : 400, cursor: 'pointer',
          }}>
            {f === 'all' ? 'Toutes' : f === 'available' ? 'Disponibles' : 'Complétées'}
          </button>
        ))}
        <div style={{ width: 1, background: 'rgba(255,255,255,0.06)', margin: '0 4px' }} />
        {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(d => (
          <button key={d} onClick={() => setDiffFilter(d)} style={{
            padding: '7px 16px', borderRadius: 99, border: `1px solid ${diffFilter === d ? '#6366f1' : 'rgba(255,255,255,0.08)'}`,
            background: diffFilter === d ? 'rgba(99,102,241,0.15)' : 'transparent',
            color: diffFilter === d ? '#6366f1' : '#64748b', fontSize: 13, fontWeight: diffFilter === d ? 700 : 400, cursor: 'pointer',
          }}>
            {d === 'all' ? 'Tous niveaux' : DIFF_LABELS[d]}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 20 }}>
        {filtered.map((mission, i) => {
          const isDone = completedMissions.includes(mission.id)
          const isActive = currentMission?.missionId === mission.id
          const domainColor = DOMAIN_COLORS[mission.domain] ?? '#6366f1'
          const recLessons = mission.recommendedLessons.map(lid => LESSONS.find(l => l.id === lid)).filter(Boolean)
          const totalXP = Object.values(mission.xpReward).reduce((a,b) => a+(b??0), 0)

          return (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}
              style={{
                background: isActive ? 'rgba(239,68,68,0.04)' : isDone ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isActive ? 'rgba(239,68,68,0.25)' : isDone ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 18, padding: '24px', position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 99,
                    background: 'rgba(239,68,68,0.15)', color: '#ef4444',
                  }}>{mission.jiraTicket.priority}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
                    background: `${domainColor}20`, color: domainColor,
                  }}>{mission.domain}</span>
                </div>
                {isDone && (
                  <div style={{ background: '#10b981', color: '#fff', borderRadius: 99, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={14} />
                  </div>
                )}
                {isActive && (
                  <div style={{ background: '#ef4444', color: '#fff', borderRadius: 99, padding: '3px 10px', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                    EN COURS
                  </div>
                )}
              </div>

              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', margin: '0 0 10px' }}>
                {mission.title.fr}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, margin: '0 0 16px' }}>
                {mission.description.fr}
              </p>

              {/* Company + meta */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
                <span style={{ fontSize: 12, color: '#64748b' }}>🏢 {mission.company.name} ({mission.company.sector})</span>
              </div>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 16 }}>
                <span style={{ fontSize: 12, color: DIFF_COLORS[mission.difficulty], fontWeight: 600 }}>⚡ {DIFF_LABELS[mission.difficulty]}</span>
                <span style={{ fontSize: 12, color: '#64748b' }}>⏱ {mission.estimatedMinutes} min</span>
                <span style={{ fontSize: 12, color: '#6366f1', fontWeight: 700 }}>+{totalXP} XP</span>
              </div>

              {/* Recommended lessons */}
              {recLessons.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                  <span style={{ fontSize: 12, color: '#64748b' }}>Prérequis conseillés :</span>
                  {mission.recommendedLessons.map(lid => (
                    <span key={lid} style={{
                      fontSize: 11, fontWeight: 700, color: '#6366f1',
                      background: 'rgba(99,102,241,0.12)', padding: '2px 8px', borderRadius: 99,
                    }}>{lid.toUpperCase()}</span>
                  ))}
                </div>
              )}

              {/* CTA */}
              <Link href={`/missions/${mission.id}`} style={{ textDecoration: 'none' }}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{
                  background: isDone
                    ? 'rgba(16,185,129,0.15)'
                    : isActive
                    ? 'linear-gradient(135deg,#ef4444,#dc2626)'
                    : 'linear-gradient(135deg,#6366f1,#4f46e5)',
                  color: isDone ? '#10b981' : '#fff',
                  fontWeight: 700, fontSize: 14,
                  padding: '12px 0', borderRadius: 10, textAlign: 'center',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  {isDone ? <><Check size={16} /> Revoir la mission</> :
                   isActive ? <>Continuer la mission <ArrowRight size={16} /></> :
                   <>Démarrer la mission <ArrowRight size={16} /></>}
                </motion.div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
