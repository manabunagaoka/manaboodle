import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check environment variables
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      checks: {
        DATABASE_URL: {
          exists: !!process.env.DATABASE_URL,
          value: process.env.DATABASE_URL 
            ? `${process.env.DATABASE_URL.substring(0, 40)}...` 
            : 'NOT SET',
          length: process.env.DATABASE_URL?.length || 0
        },
        NEXTAUTH_URL: {
          exists: !!process.env.NEXTAUTH_URL,
          value: process.env.NEXTAUTH_URL || 'NOT SET'
        },
        NEXTAUTH_SECRET: {
          exists: !!process.env.NEXTAUTH_SECRET,
          value: process.env.NEXTAUTH_SECRET 
            ? `${process.env.NEXTAUTH_SECRET.substring(0, 10)}...` 
            : 'NOT SET'
        }
      }
    }

    // Try to import Prisma
    try {
      const { PrismaClient } = await import('@prisma/client')
      diagnostics.prisma = {
        imported: true,
        clientVersion: PrismaClient.prototype?.constructor?.name || 'unknown'
      }

      // Try to connect
      try {
        const prisma = new PrismaClient()
        await prisma.$connect()
        diagnostics.database = {
          connected: true,
          message: 'Successfully connected to database'
        }
        await prisma.$disconnect()
      } catch (dbError: any) {
        diagnostics.database = {
          connected: false,
          error: dbError.message,
          code: dbError.code
        }
      }
    } catch (prismaError: any) {
      diagnostics.prisma = {
        imported: false,
        error: prismaError.message
      }
    }

    return NextResponse.json(diagnostics, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'Diagnostic check failed', 
        message: error.message 
      },
      { status: 500 }
    )
  }
}
