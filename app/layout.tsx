import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'DataForge — Devenez un professionnel data',
  description: 'La plateforme qui vous transforme en professionnel data opérationnel.',
}

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!publishableKey) {
    return (
      <html lang="fr">
        <body>{children}</body>
      </html>
    )
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/home"
      afterSignUpUrl="/home"
    >
      <html lang="fr">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
