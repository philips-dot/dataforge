'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SlackMsg { id: number; author: string; avatar: string; role: string; time: string; content: string; urgent?: boolean; mentionsYou?: boolean }
interface JiraTicket { id: string; priority: 'P0' | 'P1' | 'P2'; title: string; assignee: string; status: 'todo' | 'inprogress' | 'review' | 'done' }

const INITIAL_MESSAGES: SlackMsg[] = [
  { id: 1, author: 'Marie Dupont', avatar: 'MD', role: 'Head of Marketing', time: '09:14', content: "Quelqu'un peut vérifier nos conversions de ce matin ? Quelque chose semble étrange.", urgent: false },
  { id: 2, author: 'Lucas Martin', avatar: 'LM', role: 'CTO', time: '09:22', content: "Déploiement v2.4.1 ce matin à 8h. Tout s'est bien passé côté infra.", urgent: false },
  { id: 3, author: 'Sophie Chen', avatar: 'SC', role: 'Head of Growth', time: '09:31', content: "@data-analyst peux-tu jeter un oeil au funnel mobile ? On dirait que ça chute.", urgent: false, mentionsYou: true },
]

const AUTO_MESSAGES: SlackMsg[] = [
  { id: 100, author: 'Thomas Bernard', avatar: 'TB', role: 'CFO', time: '', content: "Facture GCP du mois : $23 400. C'est 3× le budget. Explication SVP.", urgent: true },
  { id: 101, author: 'Marie Dupont', avatar: 'MD', role: 'Head of Marketing', time: '', content: "@data-analyst j'ai besoin du taux de conversion par device pour ma présentation à 14h.", mentionsYou: true },
  { id: 102, author: 'Alex Nguyen', avatar: 'AN', role: 'Head of Data', time: '', content: "Standup dans 15 min ! Préparez vos updates.", urgent: false },
  { id: 103, author: 'Lucas Martin', avatar: 'LM', role: 'CTO', time: '', content: "Le pipeline dbt de 3h a planté. Quelqu'un regarde ?", urgent: true },
  { id: 104, author: 'Sophie Chen', avatar: 'SC', role: 'Head of Growth', time: '', content: "@data-analyst le dashboard CAC est down depuis hier. Board meeting demain.", mentionsYou: true, urgent: true },
]

const INITIAL_TICKETS: JiraTicket[] = [
  { id: 'DA-412', priority: 'P0', title: 'Analyser chute conversion semaine 47', assignee: 'Toi', status: 'todo' },
  { id: 'DA-401', priority: 'P1', title: 'Dashboard CAC/LTV Q4', assignee: 'Toi', status: 'inprogress' },
  { id: 'DA-398', priority: 'P1', title: 'Rapport hebdo Head of Growth', assignee: 'Toi', status: 'review' },
  { id: 'DA-390', priority: 'P2', title: 'Migration BigQuery → Partitioning', assignee: 'Sophie C.', status: 'done' },
  { id: 'DA-385', priority: 'P2', title: 'Audit requêtes coûteuses', assignee: 'Toi', status: 'done' },
]

const CHANNELS = ['#general', '#data-team', '#incidents', '#stakeholders']
const PRIORITY_COLORS = { P0: '#ef4444', P1: '#f97316', P2: '#f59e0b' }
const STATUS_LABELS = { todo: 'À faire', inprogress: 'En cours', review: 'En revue', done: 'Terminé' }

function getTime() {
  const d = new Date()
  return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
}

export default function CompanyPage() {
  const [channel, setChannel] = useState('#data-team')
  const [messages, setMessages] = useState<SlackMsg[]>(INITIAL_MESSAGES)
  const [tickets, setTickets] = useState<JiraTicket[]>(INITIAL_TICKETS)
  const [msgIdx, setMsgIdx] = useState(0)
  const [dragOver, setDragOver] = useState<string | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      if (msgIdx < AUTO_MESSAGES.length) {
        const newMsg = { ...AUTO_MESSAGES[msgIdx], time: getTime() }
        setMessages(prev => [...prev, newMsg])
        setMsgIdx(i => i + 1)
      }
    }, 8000)
    return () => clearInterval(interval)
  }, [msgIdx])

  const moveTicket = (ticketId: string, newStatus: JiraTicket['status']) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t))
  }

  const statusCols: JiraTicket['status'][] = ['todo', 'inprogress', 'review', 'done']

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1200, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#f8fafc', margin: 0, marginBottom: 4 }}>Mon entreprise</h1>
        <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>Simulation d&apos;environnement de travail réel.</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Slack Panel */}
        <div style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 600 }}>
          {/* Slack header */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#e2e8f0', marginBottom: 10 }}>ShopStream · Slack</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CHANNELS.map(ch => (
                <button key={ch} onClick={() => setChannel(ch)} style={{
                  padding: '4px 10px', borderRadius: 99, border: 'none', cursor: 'pointer', fontSize: 12,
                  background: channel === ch ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.04)',
                  color: channel === ch ? '#6366f1' : '#64748b', fontWeight: channel === ch ? 700 : 400,
                }}>{ch}</button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <AnimatePresence>
              {messages.map(msg => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex', gap: 10,
                    background: msg.mentionsYou ? 'rgba(99,102,241,0.08)' : msg.urgent ? 'rgba(239,68,68,0.05)' : 'transparent',
                    borderRadius: 8, padding: msg.mentionsYou || msg.urgent ? '8px' : '0',
                    borderLeft: msg.mentionsYou ? '2px solid #6366f1' : msg.urgent ? '2px solid #ef4444' : 'none',
                    paddingLeft: msg.mentionsYou || msg.urgent ? 10 : 0,
                  }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 6, flexShrink: 0,
                    background: msg.urgent ? 'rgba(239,68,68,0.3)' : msg.mentionsYou ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: 11, color: '#fff',
                  }}>{msg.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: 3 }}>
                      <span style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 13 }}>{msg.author}</span>
                      <span style={{ color: '#475569', fontSize: 11, marginLeft: 6 }}>{msg.time}</span>
                      {msg.urgent && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 800, color: '#ef4444', background: 'rgba(239,68,68,0.15)', padding: '1px 5px', borderRadius: 99 }}>URGENT</span>}
                      {msg.mentionsYou && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 800, color: '#6366f1', background: 'rgba(99,102,241,0.15)', padding: '1px 5px', borderRadius: 99 }}>@toi</span>}
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Jira Board */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', height: 600, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#e2e8f0' }}>Jira Board · Sprint actuel</div>
          </div>

          <div style={{ flex: 1, overflowX: 'auto', padding: '16px', display: 'flex', gap: 12 }}>
            {statusCols.map(status => (
              <div key={status}
                onDragOver={e => { e.preventDefault(); setDragOver(status) }}
                onDragLeave={() => setDragOver(null)}
                onDrop={e => {
                  const ticketId = e.dataTransfer.getData('ticketId')
                  if (ticketId) moveTicket(ticketId, status)
                  setDragOver(null)
                }}
                style={{
                  minWidth: 180, flex: 1,
                  background: dragOver === status ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${dragOver === status ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 12, padding: '12px',
                  transition: 'background 0.2s, border-color 0.2s',
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                  {STATUS_LABELS[status]} ({tickets.filter(t => t.status === status).length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {tickets.filter(t => t.status === status).map(ticket => (
                    <motion.div
                      key={ticket.id}
                      draggable
                      onDragStart={e => e.dataTransfer.setData('ticketId', ticket.id)}
                      layout
                      whileHover={{ scale: 1.02 }}
                      style={{
                        background: ticket.priority === 'P0' ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${ticket.priority === 'P0' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: 8, padding: '10px', cursor: 'grab',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{
                          fontSize: 10, fontWeight: 800, padding: '1px 6px', borderRadius: 99,
                          background: `${PRIORITY_COLORS[ticket.priority]}22`, color: PRIORITY_COLORS[ticket.priority],
                        }}>{ticket.priority}</span>
                        <span style={{ fontSize: 10, color: '#475569' }}>{ticket.id}</span>
                      </div>
                      <p style={{ fontSize: 12, color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>{ticket.title}</p>
                      <div style={{ marginTop: 6, fontSize: 10, color: '#475569' }}>👤 {ticket.assignee}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '8px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: '#475569' }}>
            💡 Glisse les tickets entre les colonnes
          </div>
        </div>
      </div>
    </div>
  )
}
