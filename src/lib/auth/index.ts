import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'

import { serverFetchApiWithConfig } from '~/lib/axios'

const accessTokenPlugin = {
  endpoints: {
    signInWithAccessToken: {
      body: {
        accessToken: 'string',
      },
      handler: async (ctx: any) => {
        const { accessToken } = ctx.body

        try {
          // Call external backend to validate token and get user profile
          const profile = await serverFetchApiWithConfig<any>({
            config: {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
            path: '/auth/profile-from-jwt',
          })

          // Construct user object from profile
          // Adjust fields based on your actual profile structure
          const user = {
            createdAt: new Date(),
            email: profile.email,
            emailVerified: true,
            id: profile.sub || profile.id,
            image: profile.empPicture || profile.profilePicture,
            name: profile.name || `${profile.firstName} ${profile.lastName}`,
            updatedAt: new Date(),
            // Store other fields if needed, might need 'additionalFields' in user config
          }

          // Create session
          const session = await ctx.context.internalAdapter.createSession(
            user.id,
            ctx.request
          )

          // Set session cookie
          await ctx.setSessionCookie(session.session)

          return ctx.json({
            session: session.session,
            success: true,
            user,
          })
        } catch {
          return ctx.json(
            {
              message: 'Internal server error',
              success: false,
            },
            { status: 500 }
          )
        }
      },
      method: 'POST',
    },
  },
  id: 'accessToken',
}

export const auth = betterAuth({
  database: null, // Stateless mode by default if no database adapter provided, but explicity setting null is clearer if supported or just omit it.
  // better-auth generally requires a database connection even for "stateless" session features unless configured otherwise strictly for JWT.
  // However, for purely stateless where we trust the external token, we might need a dummy adapter or just use secondary storage/memory if we want better-auth to manage sessions internally.
  // BUT, since we want JWT sessions (stateless), we rely on the session config.

  // Ideally better-auth expects *some* storage for schemas unless we are very careful.
  // Let's use `memory` storage for now if we don't have a real DB,
  // OR since we are just bridging, we might not strictly need it if we only use the custom endpoint and JWT strategy.
  // Let's try without database first given the requirement helper.

  plugins: [
    nextCookies(),
    // @ts-expect-error - simpler inline plugin for now
    accessTokenPlugin,
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 30,
    },
    expiresIn: 60 * 30, // 30 minutes
    updateAge: 60 * 5, // 5 minutes
  },
})
