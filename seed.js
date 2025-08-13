/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hashedPasswordAdmin = await bcrypt.hash('@2025_admin', 10)
  const hashedPasswordUser = await bcrypt.hash('@_user_2025', 10)

  await prisma.user.upsert({
    where: { email: 'angiocardiolitoral@gmail.com' },
    update: {},
    create: {
      email: 'angiocardiolitoral@gmail.com',
      password: hashedPasswordAdmin,
      role: 'ADMIN',
    },
  })

  await prisma.user.upsert({
    where: { email: 'user@angiocardiolitoral' },
    update: {},
    create: {
      email: 'user@angiocardiolitoral',
      password: hashedPasswordUser,
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
