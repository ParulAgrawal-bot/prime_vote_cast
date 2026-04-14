import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// 1. Define your protected routes
const isProtectedRoute = createRouteMatcher(["/results(.*)", "/vote_now(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // 2. If the route matches our list, enforce authentication
  if (isProtectedRoute(req)) {
    await auth.protect(); 
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}