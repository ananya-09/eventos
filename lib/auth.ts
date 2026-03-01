import type { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'

if (!process.env.GITHUB_CLIENT_ID) {
  throw new Error('Missing required environment variable: GITHUB_CLIENT_ID')
}
if (!process.env.GITHUB_CLIENT_SECRET) {
  throw new Error('Missing required environment variable: GITHUB_CLIENT_SECRET')
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
}
