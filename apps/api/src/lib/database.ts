import { PrismaClient } from '@prisma/client'

declare global {
  // Allow global `var` declarations
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

const prisma =
  globalThis.__prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}

export default prisma
