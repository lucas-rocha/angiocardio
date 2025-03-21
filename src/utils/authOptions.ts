/* eslint-disable @typescript-eslint/no-unused-expressions */
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

interface UserProps {
  email: string;
  password: string;
  role: string
}

const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: {label: 'password', type: 'password'}
      },

      async authorize(credentials) {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password
          })
        })

        const user = await response.json()

        if(user && response.ok) {
          return user
        }
        
        return null
        
      }
    })
  ],
  pages: {
    signIn: '/'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user; // Adiciona o usuário completo ao token
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as UserProps; // Aqui, estamos afirmando que o tipo é UserProps
      return session;
    },
  }
}

export default nextAuthOptions