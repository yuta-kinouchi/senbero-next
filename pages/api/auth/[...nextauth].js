// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Here you should check the credentials against your database
        // This is just a simple example
        if (credentials.email === "user@example.com" && credentials.password === "password") {
          return { id: 1, name: "J Smith", email: "jsmith@example.com" }
        } else {
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session(session, token) {
      session.user.id = token.id
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
})