// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak"
import type { Session, Account } from "next-auth"
import type { JWT } from "next-auth/jwt"

type ExtendedSession = Session & { accessToken?: string; user: Session['user'] & { id?: string } }
type ExtendedJWT = JWT & { accessToken?: string; refreshToken?: string; idToken?: string }

const authOptions = {
  providers: [
    KeycloakProvider({
      clientId: "nextjs-app",
      clientSecret: "", // public client → no secret
      issuer: process.env.NEXT_PUBLIC_ISSUER,
    }),
  ],
  callbacks: {
    async jwt({ token, account }: { token: JWT; account?: Account | null }) {
      const t = token as ExtendedJWT
      if (account) {
        t.accessToken = account.access_token
        t.refreshToken = account.refresh_token
        t.idToken = account.id_token
      }
      return t
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      const s = session as ExtendedSession
      const t = token as ExtendedJWT
      s.accessToken = t.accessToken as string
      s.user.id = t.sub as string
      return s
    },
  },
  pages: {
    signIn: "/login",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }