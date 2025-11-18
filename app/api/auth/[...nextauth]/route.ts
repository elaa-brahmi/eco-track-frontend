// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
            KeycloakProvider({
              clientId: process.env.KEYCLOAK_ID as string ,
              clientSecret: process.env.KEYCLOAK_SECRET as string ,
              issuer: process.env.KEYCLOAK_ISSUER,
            }),
          ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        token.idToken = account.id_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      return session
    }
  }
})