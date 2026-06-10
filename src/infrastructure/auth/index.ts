import { createClerkClient } from '@clerk/backend'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const SECRET_KEY = (typeof process !== 'undefined' && process.env?.CLERK_SECRET_KEY) as string | undefined

export const clerkClient = createClerkClient({
  secretKey: SECRET_KEY,
  publishableKey: PUBLISHABLE_KEY,
})

interface ServerAuthResult {
  userId: string | null
}

export async function getServerAuth(request: Request): Promise<ServerAuthResult> {
  try {
    const authState = await clerkClient.authenticateRequest(request)
    const auth = authState.toAuth()
    if (auth && 'userId' in auth) {
      return { userId: auth.userId }
    }
    return { userId: null }
  } catch {
    return { userId: null }
  }
}
