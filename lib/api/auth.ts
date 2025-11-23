import { getToken } from 'next-auth/jwt'
import { getSession } from 'next-auth/react'
import { NextApiRequest } from 'next'
import { isServer } from './constants'



export const fetchToken = async (serverRequest?: NextApiRequest): Promise<string | null> => {
  if (isServer && serverRequest) {
    //console.log("fetchToken");
    //console.log("serverRequest headers:", serverRequest.headers);
    //console.log("serverRequest cookie:", serverRequest.headers?.cookie);

    const sessionToken = await getToken({
      req: serverRequest,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: "next-auth.session-token", // explicitly set
    })
    //console.log('Server-side sessionToken:', sessionToken)
    return sessionToken ? String(sessionToken) : null
  }

  if (!isServer) {
    const session = await getSession()
    //console.log('Client-side session:', session)
    //console.log('token from auth.ts:', session?.accessToken)
    return session?.accessToken ?? null
  }
  //console.log('No session context available')
  return null
}

/* export const getServerSession = async () => {
  return await auth()
}
 */