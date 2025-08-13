import { NextRequest } from 'next/server'
import { db } from '@/lib/db'

/**
 * Get the authenticated user from Dynamic's JWT token
 * This replaces NextAuth's auth() function for API routes
 */
export async function getAuthenticatedUser(req: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.slice(7)
    
    // Verify the JWT token with Dynamic's API
    const response = await fetch('https://app.dynamic.xyz/api/v0/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DYNAMIC_API_KEY}`, // You'll need to add this
      },
      body: JSON.stringify({ token }),
    })

    if (!response.ok) {
      return null
    }

    const { user } = await response.json()
    
    // Get the user from our database
    const dbUser = await db.user.findUnique({
      where: { id: user.userId }
    })

    return dbUser
  } catch (error) {
    console.error('Error verifying Dynamic token:', error)
    return null
  }
}

/**
 * Alternative approach: Use Dynamic's client-side user info
 * This is simpler but requires the client to send user info
 */
export async function getUserFromRequestBody(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId } = body
    
    if (!userId) {
      return null
    }

    const user = await db.user.findUnique({
      where: { id: userId }
    })

    return user
  } catch (error) {
    console.error('Error getting user from request:', error)
    return null
  }
}