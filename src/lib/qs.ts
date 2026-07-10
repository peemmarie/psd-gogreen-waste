import qs from 'qs'

export function parseToJson(queryString: string) {
  return qs.parse(queryString)
}

export function stringify(json: Record<string, unknown>) {
  return qs.stringify(json)
}
