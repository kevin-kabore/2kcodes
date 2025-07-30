import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const walletSchema = z.object({
  walletAddress: z.string().regex(
    /^(0x[a-fA-F0-9]{40}|[1-9A-HJ-NP-Za-km-z]{32,44})$/,
    'Invalid wallet address'
  ),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { walletAddress } = walletSchema.parse(body)

    // Check if wallet is already linked to another account
    const existingUser = await db.user.findFirst({
      where: {
        walletAddress,
        NOT: { id: session.user.id },
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'This wallet is already linked to another account' },
        { status: 400 }
      )
    }

    // Update user with wallet address
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: { walletAddress },
      select: {
        id: true,
        username: true,
        email: true,
        walletAddress: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error linking wallet:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Remove wallet address from user
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: { walletAddress: null },
      select: {
        id: true,
        username: true,
        email: true,
        walletAddress: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error unlinking wallet:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}