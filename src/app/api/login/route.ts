import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const { email, password } = await request.json()
  
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    return new Response(JSON.stringify({ error: 'Usuário não encontrado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    return new Response(JSON.stringify({ error: 'Senha incorreta' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { password: _, ...userWithoutPassword } = user

  return new Response(JSON.stringify(userWithoutPassword), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}