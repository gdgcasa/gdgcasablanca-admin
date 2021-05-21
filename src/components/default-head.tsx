import Head from 'next/head'

type IProps = { title: string; description?: string }

export default function DefaultHead({ title, description }: IProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name='description' content={description ?? title} />
      <link rel='icon' href='/favicon.ico' />
    </Head>
  )
}
