export function parseCookie(str: string): Record<string, string> {
  if (!str) {
    return {}
  }

  return str
    .split(';')
    .map((v) => v.split('='))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim())
      return acc
    }, {})
}
