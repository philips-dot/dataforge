'use client'
import { motion } from 'framer-motion'
import { useUserStore } from '@/store/user-store'
import { getTotalXP, getLevelInfo, ALL_BADGES, LEVELS } from '@/types'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Area, AreaChart, CartesianGrid } from 'recharts'

const SKILL_LABELS: Record<string, string> = { sql: 'SQL', business: 'Business', optimization: 'Optimisation', python: 'Python', dashboard: 'Dashboard' }
const LEADERBOARD = [
  { name: 'Sophie M.', xp: 1240, rank: 1 },
  { name: 'Thomas K.', xp: 980, rank: 2 },
  { name: 'Yasmine B.', xp: 870, rank: 3 },
  { name: 'Romain D.', xp: 760, rank: 4 },
  { name: 'Clara N.', xp: 720, rank: 5 },
]

function generateXPHistory(xp: number): Array<{ date: string; xp: number }> {
  const days = 30
  const data = []
  for (let i = days; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    const dayLabel = `${d.getDate()}/${d.getMonth() + 1}`
    const progress = (days - i) / days
    data.push({ date: dayLabel, xp: Math.round(xp * progress * (0.8 + Math.random() * 0.2)) })
  }
  return data
}

export default function ProgressPage() {
  const { xp, streak, completedLessons, completedMissions, unlockedBadges } = useUserStore()
  const totalXP = getTotalXP(xp)
  const lvl = getLevelInfo(totalXP)

  const radarData = Object.entries(xp).map(([k, v]) => ({ subject: SKILL_LABELS[k] ?? k, A: v, fullMark: 500 }))
  const xpHistory = generateXPHistory(totalXP)

  const userRank = 12
  const userXPThisWeek = totalXP > 0 ? Math.min(totalXP, 650) : 0

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1000, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f8fafc', margin: 0, marginBottom: 8 }}>Ma progression</h1>
      </motion.div>

      {/* Level */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{
        background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)',
        borderRadius: 18, padding: '28px', marginBottom: 24,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#f8fafc', marginBottom: 4 }}>
              Niveau {lvl.level} · {lvl.title}
            </div>
            <div style={{ fontSize: 14, color: '#94a3b8' }}>
              Il vous manque <strong style={{ color: '#6366f1' }}>{(lvl.maxXP - totalXP).toLocaleString()} XP</strong> pour atteindre {lvl.level < 6 ? LEVELS[lvl.level]?.title : 'le maximum'}
            </div>
          </div>
          <div style={{ fontSize: 48 }}>🏅</div>
        </div>
        <div style={{ height: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${lvl.progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ height: '100%', background: 'linear-gradient(90deg,#6366f1,#06b6d4)', borderRadius: 99 }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 13, color: '#6366f1', fontWeight: 700 }}>{(totalXP - lvl.minXP).toLocaleString()} / {(lvl.maxXP - lvl.minXP).toLocaleString()} XP</span>
          <span style={{ fontSize: 13, color: '#64748b' }}>{Math.round(lvl.progress)}%</span>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Radar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 18, padding: '24px',
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', marginBottom: 16 }}>Radar des compétences</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
              <Radar name="XP" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* XP Curve */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 18, padding: '24px',
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', marginBottom: 16 }}>XP cumulé — 30 jours</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={xpHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} interval={6} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0a0a12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e2e8f0' }} />
              <Area type="monotone" dataKey="xp" stroke="#6366f1" fill="url(#xpGrad)" strokeWidth={2} />
              <defs>
                <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Badges */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 18, padding: '24px', marginBottom: 24,
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', marginBottom: 18 }}>Badges</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}>
          {ALL_BADGES.map(badge => {
            const unlocked = unlockedBadges.includes(badge.id)
            return (
              <motion.div key={badge.id} whileHover={{ scale: 1.05 }} style={{
                background: unlocked ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${unlocked ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: 12, padding: '16px', textAlign: 'center',
                opacity: unlocked ? 1 : 0.4, cursor: 'default',
              }}>
                <div style={{ fontSize: 28, marginBottom: 6, filter: unlocked ? 'none' : 'grayscale(100%)' }}>
                  {unlocked ? badge.icon : '🔒'}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: unlocked ? '#e2e8f0' : '#475569' }}>
                  {badge.name}
                </div>
                <div style={{ fontSize: 10, color: '#475569', marginTop: 3, lineHeight: 1.4 }}>
                  {badge.description}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Leaderboard */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 18, padding: '24px',
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', marginBottom: 18 }}>Classement cette semaine</div>
        {[...LEADERBOARD, { name: 'Toi', xp: userXPThisWeek, rank: userRank }]
          .sort((a, b) => b.xp - a.xp)
          .slice(0, 6)
          .map((player, i) => {
            const isMe = player.name === 'Toi'
            const medals = ['🥇', '🥈', '🥉']
            return (
              <div key={player.name} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 0', borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                background: isMe ? 'rgba(99,102,241,0.08)' : 'transparent',
                borderRadius: isMe ? 8 : 0, paddingLeft: isMe ? 12 : 0, paddingRight: isMe ? 12 : 0,
              }}>
                <span style={{ fontSize: 18, width: 28 }}>{i < 3 ? medals[i] : `${i + 1}.`}</span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: isMe ? 800 : 500, color: isMe ? '#f8fafc' : '#cbd5e1' }}>
                  {player.name} {isMe ? '← toi' : ''}
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: isMe ? '#6366f1' : '#64748b' }}>
                  +{player.xp.toLocaleString()} XP
                </span>
              </div>
            )
          })}
      </motion.div>
    </div>
  )
}
