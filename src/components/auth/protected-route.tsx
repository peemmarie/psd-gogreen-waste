import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { ROUTES } from '~/constants/routes'
import { auth } from '~/lib/auth'

type ProtectedRouteProps = {
  children: React.ReactNode
}

export async function ProtectedRoute({ children }: ProtectedRouteProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) redirect(ROUTES.LOGIN)

  return <>{children}</>
}
