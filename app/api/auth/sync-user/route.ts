import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { user } = await req.json()

    if (!user?.userId) {
      return NextResponse.json(
        { error: 'Invalid user data' },
        { status: 400 }
      )
    }

    // Check if user already exists
    let dbUser = await db.user.findUnique({
      where: { id: user.userId }
    })

    if (!dbUser) {
      // Create new user
      dbUser = await db.user.create({
        data: {
          id: user.userId,
          email: user.email || null,
          username: user.alias || user.email?.split('@')[0] || `user_${user.userId.slice(0, 8)}`,
          walletAddress: user.verifiedCredentials?.[0]?.address || null,
        }
      })
    } else {
      // Update existing user with latest info
      dbUser = await db.user.update({
        where: { id: user.userId },
        data: {
          email: user.email || dbUser.email,
          username: user.alias || dbUser.username,
          walletAddress: user.verifiedCredentials?.[0]?.address || dbUser.walletAddress,
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: dbUser.id,
        email: dbUser.email,
        username: dbUser.username,
        walletAddress: dbUser.walletAddress,
      }
    })
  } catch (error) {
    console.error('Error syncing user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}