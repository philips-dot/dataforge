import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#060a10',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <SignIn
        appearance={{
          variables: {
            colorPrimary: '#6366f1',
            colorBackground: '#0d1117',
            colorText: '#f8fafc',
            colorInputBackground: '#161b22',
            colorInputText: '#f8fafc',
            borderRadius: '12px',
          },
          elements: {
            card: { border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' },
            headerTitle: { color: '#f8fafc', fontWeight: 800 },
            headerSubtitle: { color: '#64748b' },
            socialButtonsBlockButton: { border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' },
            formFieldLabel: { color: '#94a3b8' },
            footerActionLink: { color: '#6366f1' },
          },
        }}
      />
    </div>
  )
}
