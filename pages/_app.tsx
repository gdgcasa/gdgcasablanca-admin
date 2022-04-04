import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'

import { AuthProvider } from '@/lib/auth'

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <SWRConfig
        value={{ fetcher: (url) => fetch(url).then((res) => res.json()) }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </AuthProvider>
  )
}

export default MyApp
