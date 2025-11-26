// Test database connection
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
})

async function testConnection() {
  try {
    console.log('Testing database connection...')
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set ✓' : 'Not set ✗')
    
    // Try to connect
    await prisma.$connect()
    console.log('✓ Database connection successful!')
    
    // Try to query ManaboodleUser table
    const userCount = await prisma.manaboodleUser.count()
    console.log(`✓ ManaboodleUser table accessible. Current count: ${userCount}`)
    
    // List all tables
    const tables = await prisma.$queryRaw`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `
    console.log('✓ Available tables:', tables)
    
  } catch (error) {
    console.error('✗ Database connection failed!')
    console.error('Error:', error.message)
    console.error('Full error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
