'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { parseToJson, stringify } from '~/lib/qs'

type UseNavigateProps = {
  parentPath?: string
}

export function useNavigate(props?: UseNavigateProps) {
  const router = useRouter()
  const spr = useSearchParams().toString()
  const pathname = usePathname()

  function navigate(
    addonQs?: Record<string, unknown>,
    {
      path,
      scroll,
    }: {
      path?: string
      scroll: boolean
    } = { path: undefined, scroll: false }
  ) {
    const qsParams = stringify({
      ...parseToJson(spr),
      ...(addonQs || {}),
    })

    const parent = props?.parentPath ?? pathname
    const sub = path ? `/${path}` : ''
    const params = qsParams ? `?${qsParams}` : ''

    router.replace(`${parent}${sub}${params}`, { scroll })
  }

  function rPush(path?: string) {
    const parent = props?.parentPath ?? pathname
    const sub = path ? `/${path}` : ''

    router.push(`${parent}${sub}`)
  }

  return { navigate, rPush }
}
