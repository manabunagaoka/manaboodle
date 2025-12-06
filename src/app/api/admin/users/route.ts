import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Simple admin password check (in production, use proper auth)
    const adminPassword = request.headers.get('x-admin-password')
    
    if (adminPassword !== 'harvard2024') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch all users (excluding password)
    const users = await prisma.manaboodleUser.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        classCode: true,
        affiliation: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    console.error('Error fetching users:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Simple admin password check
    const adminPassword = request.headers.get('x-admin-password')
    
    if (adminPassword !== 'harvard2024') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Delete the user
    await prisma.manaboodleUser.delete({
      where: { id: userId },
    })

    return NextResponse.json(
      { success: true, message: 'User deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
