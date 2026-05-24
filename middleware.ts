import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/home(.*)',
  '/learn(.*)',
  '/missions(.*)',
  '/playground(.*)',
  '/mentor(.*)',
  '/progress(.*)',
  '/company(.*)',
  '/dashboard(.*)',
])

const isPublicOnlyRoute = createRouteMatcher(['/'])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  // Si l'utilisateur est connecté et visite la landing page → rediriger vers /home
  if (userId && isPublicOnlyRoute(req)) {
    return NextResponse.redirect(new URL('/home', req.url))
  }

  // Protéger les routes privées
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
}
