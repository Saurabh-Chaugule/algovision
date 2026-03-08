import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  // log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'], <-- Enable detailed logging in development
  log: ['error'], // <-- Keep logging minimal in production
});

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
