import { createClerkClient } from '@clerk/backend'
import { createClerkRequest } from '@clerk/backend/internal'

let _clerkClient: ReturnType<typeof createClerkClient> | null = null
function getClerkClient() {
  if (!_clerkClient) {
    _clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY!,
      publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY!,
    })
  }
  return _clerkClient
}

interface ServerAuthResult {
  userId: string | null
}

export async function getServerAuth(request: Request): Promise<ServerAuthResult> {
  try {
    const clerkRequest = createClerkRequest(new Request(request.url, {
      headers: request.headers,
      method: request.method,
    }))
    const requestState = await getClerkClient().authenticateRequest(clerkRequest, {
      acceptsToken: 'any',
    })
    const authObj = requestState.toAuth()
    const userId = authObj && 'userId' in authObj ? (authObj as { userId: string }).userId : null
    return { userId }
  } catch (err) {
    console.error('[auth] error:', err)
    return { userId: null }
  }
}
