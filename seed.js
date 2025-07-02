/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('123', 10)

  await prisma.user.upsert({
    where: { email: 'angiocardiolitoral@gmail.com' },
    update: {},
    create: {
      email: 'angiocardiolitoral@gmail.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  await prisma.user.upsert({
    where: { email: 'user@angiocardiolitoral' },
    update: {},
    create: {
      email: 'user@angiocardiolitoral',
      password: hashedPassword,
      role: 'USER',
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
