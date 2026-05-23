export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#050508',
      color: '#ffffff',
      fontFamily: 'sans-serif',
    }}>
      <h1 style={{ fontSize: '6rem', margin: 0, color: '#6366f1' }}>404</h1>
      <p style={{ fontSize: '1.25rem', color: '#94a3b8', marginTop: '1rem' }}>
        Cette page n&apos;existe pas.
      </p>
      <a href="/" style={{
        marginTop: '2rem',
        padding: '0.75rem 2rem',
        background: '#6366f1',
        color: '#fff',
        borderRadius: '0.5rem',
        textDecoration: 'none',
        fontWeight: 600,
      }}>
        Retour à l&apos;accueil
      </a>
    </div>
  )
}
