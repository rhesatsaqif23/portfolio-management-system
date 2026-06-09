import { createClerkClient } from '@clerk/backend'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const SECRET_KEY = (typeof process !== 'undefined' && process.env?.CLERK_SECRET_KEY) as string | undefined

export const clerkClient = createClerkClient({
  secretKey: SECRET_KEY,
  publishableKey: PUBLISHABLE_KEY,
})

export async function getServerAuth(request: Request) {
  try {
    const authState = await clerkClient.authenticateRequest(request)
    return authState.toAuth()
  } catch {
    return { userId: null, sessionId: null, getToken: undefined, claims: null }
  }
}
