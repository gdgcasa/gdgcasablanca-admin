import * as Ract from 'react'

export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = Ract.useState(value)
  Ract.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  return debouncedValue
}
