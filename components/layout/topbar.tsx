'use client'
import { usePathname } from 'next/navigation'
import { Bell, Flame } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { useUserStore } from '@/store/user-store'
import { getTotalXP, getLevelInfo } from '@/types'

const BREADCRUMBS: Record<string, string> = {
  '/home': 'Accueil',
  '/learn': 'Fondamentaux',
  '/missions': 'Missions',
  '/playground': 'SQL Playground',
  '/mentor': 'Mentor IA',
  '/progress': 'Ma progression',
  '/company': 'Mon entreprise',
}

export function Topbar() {
  const pathname = usePathname()
  const { xp, streak } = useUserStore()
  const totalXP = getTotalXP(xp)
  const lvlInfo = getLevelInfo(totalXP)

  const segment = '/' + (pathname.split('/')[1] ?? '')
  const breadcrumb = BREADCRUMBS[segment] ?? 'DataForge'

  const xpInLevel = totalXP - lvlInfo.minXP
  const xpNeeded = lvlInfo.maxXP - lvlInfo.minXP

  return (
    <header style={{
      height: 56,
      background: 'rgba(10,10,18,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 16,
      position: 'sticky',
      top: 0,
      zIndex: 30,
    }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: 15, fontWeight: 600, color: '#f8fafc', minWidth: 120 }}>
        {breadcrumb}
      </div>

      {/* XP bar */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
        <span style={{
          fontSize: 11, fontWeight: 700, color: '#6366f1',
          background: 'rgba(99,102,241,0.15)', padding: '2px 8px', borderRadius: 99,
        }}>
          Niv.{lvlInfo.level}
        </span>
        <div style={{ width: 160, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${lvlInfo.progress}%`,
            background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
            borderRadius: 99,
            transition: 'width 0.6s ease',
          }} />
        </div>
        <span style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>
          {xpInLevel.toLocaleString()} / {xpNeeded.toLocaleString()} XP
        </span>
        <span style={{ fontSize: 11, color: '#64748b' }}>→ {lvlInfo.level < 6 ? getLevelInfo(lvlInfo.maxXP).title : 'Max'}</span>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {streak > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Flame size={16} color="#f97316" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#f97316' }}>{streak}</span>
          </div>
        )}
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 4 }}>
          <Bell size={18} />
        </button>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  )
}
