import { GetServerSideProps } from 'next'

import DefaultHead from '@/components/default-head'
import HomeScreen from '@/components/screens/home-screen'
import getUidFromTokenContext from 'src/utils/get-uid-from-token-context'

export default function HomeV2() {
  return (
    <div className='text-slate-900'>
      <DefaultHead />

      <HomeScreen />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const uid = await getUidFromTokenContext(context)

  if (uid) {
    return {
      redirect: {
        destination: '/events',
        permanent: false,
      },
    }
  }

  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  }
}
