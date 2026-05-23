import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

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

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
}
