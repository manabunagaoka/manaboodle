import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, classCode, affiliation } = body

    // Validate required fields
    if (!email || !password || !name || !affiliation) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate .edu email
    if (!email.endsWith('.edu')) {
      return NextResponse.json(
        { error: 'Please use a valid .edu email address' },
        { status: 400 }
      )
    }

    // Validate class code if provided
    if (classCode) {
      const validCodes = ['T565', 'T566', 'T595']
      if (!validCodes.includes(classCode.toUpperCase())) {
        return NextResponse.json(
          { error: 'Invalid class code. Valid codes: T565, T566, T595' },
          { status: 400 }
        )
      }
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.harvardUser.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password with bcrypt (10 rounds)
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new Harvard user
    const newUser = await prisma.harvardUser.create({
      data: {
        email,
        password: hashedPassword,
        name,
        classCode: classCode || null,
        affiliation,
      },
      select: {
        id: true,
        email: true,
        name: true,
        classCode: true,
        affiliation: true,
        createdAt: true,
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        user: newUser
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error during registration' },
      { status: 500 }
    )
  }
}
