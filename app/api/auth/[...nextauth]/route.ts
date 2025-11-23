import NextAuth from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak"

export const authOptions = {
  providers: [
    KeycloakProvider({
      clientId: "nextjs-app",
      clientSecret: "",
      issuer: process.env.NEXT_PUBLIC_ISSUER,
    }),
  ],

  session: {
    strategy: "jwt" as const,
    maxAge: 60 * 60, // 1 hour
  },

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.idToken = account.id_token
        token.expiresAt = Date.now() + (account.expires_in as number) * 1000
        token.roles = account.access_token
          ? JSON.parse(atob(account.access_token.split(".")[1])).realm_access?.roles || []
          : []
      }

      if (token.expiresAt && Date.now() > (token.expiresAt as number) - 60 * 1000) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_ISSUER}/protocol/openid-connect/token`,
            {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                client_id: "nextjs-app",
                grant_type: "refresh_token",
                refresh_token: token.refreshToken as string,
              }),
            }
          )

          if (!response.ok) throw new Error("Refresh failed")

          const refreshed = await response.json()

          return {
            ...token,
            accessToken: refreshed.access_token,
            refreshToken: refreshed.refresh_token ?? token.refreshToken,
            idToken: refreshed.id_token ?? token.idToken,
            expiresAt: Date.now() + refreshed.expires_in * 1000,
            roles: refreshed.access_token
              ? JSON.parse(atob(refreshed.access_token.split(".")[1])).realm_access?.roles || []
              : token.roles,
          }
        } catch (error) {
          console.error("Token refresh failed:", error)
          return { ...token, error: "RefreshTokenError" } 
        }
      }

      return token
    },

    async session({ session, token }: any) {
      session.accessToken = token.accessToken
      session.error = token.error
      session.user.id = token.sub as string
      session.user.roles = token.roles || [] 
      return session
    },
  },

  pages: {
    signIn: "/auth",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }