import Head from 'next/head'

type IProps = { title?: string; description?: string }

export default function DefaultHead({ title, description }: IProps) {
  return (
    <Head>
      <title>{title ? `${title} | ` : ''}GDG Casablanca admin</title>
      <meta
        name='description'
        content={description ?? 'GDG Casablanca admin'}
      />
      <link rel='icon' href='/icon.png' type='image/png' />
    </Head>
  )
}
