import Link from 'next/link'
import * as React from 'react'
import Input from './input'

const defaultInitialState = {
  firstname: '',
  url: '',
  lastname: '',
  occupation: '',
  photo: null,
}

type IProps = {
  onSubmit: (member: Member) => void
  initialState?: Member
}

export default function MemberForm({ onSubmit, initialState }: IProps) {
  const [formDataState, setFormDataState] = React.useState<Member>(
    initialState || defaultInitialState,
  )
  const [loading, setLoading] = React.useState(false)

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault()
    setLoading(true)
    const ct = event.currentTarget

    try {
      await onSubmit(formDataState)

      ct.reset()
      setFormDataState(initialState)
    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }

  function handleChangle(event: React.FormEvent<HTMLInputElement>) {
    const name = event.currentTarget.name

    let value: string | File = event.currentTarget.value
    if (event.currentTarget.type === 'file') {
      value = event.currentTarget.files[0]
    }

    setFormDataState((prevData) => ({ ...prevData, [name]: value }))
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className='flex flex-col gap-y-4 items-start max-w-sm'>
        <Input
          id='firstname'
          name='firstname'
          label='First name:'
          placeholder='First name:'
          inputProps={{
            autoComplete: 'off',
            onChange: handleChangle,
            required: true,
            defaultValue: initialState?.firstname,
          }}
        />

        <Input
          id='lastname'
          name='lastname'
          label='Last name:'
          placeholder='Last name:'
          inputProps={{
            autoComplete: 'off',
            onChange: handleChangle,
            required: true,
            defaultValue: initialState?.lastname,
          }}
        />

        <Input
          id='occupation'
          name='occupation'
          label='What do you do?'
          placeholder='Engineer, student, PhD'
          inputProps={{
            autoComplete: 'off',
            onChange: handleChangle,
            required: true,
            defaultValue: initialState?.occupation,
          }}
        />

        <Input
          id='url'
          name='url'
          type='url'
          label='Social media link:'
          description='(include "https")'
          placeholder='facebook.com/..., twitter.com/...'
          inputProps={{
            autoComplete: 'off',
            onChange: handleChangle,
            defaultValue: initialState?.url,
          }}
        />

        {initialState?.photo ? null : (
          <Input
            id='photo'
            name='photo'
            label='Profile photo:'
            type='file'
            inputProps={{
              autoComplete: 'off',
              accept: 'image/*',
              onChange: handleChangle,
              required: true,
            }}
          />
        )}
      </div>

      <div className='flex gap-x-2 mt-6 md:mt-8'>
        <button
          type='submit'
          disabled={loading}
          className={`px-4 py-2 rounded text-white transition-colors ${
            loading ? 'bg-green-300' : 'bg-green-600 hover:bg-green-800'
          }`}
        >
          {initialState?.firstname ? 'Update member' : 'Add member'}
        </button>

        {!initialState?.firstname ? null : (
          <Link href='/members'>
            <a
              className={`px-4 py-2 rounded transition-colors ${
                loading
                  ? 'text-green-300'
                  : 'text-green-600 hover:text-green-800 hover:bg-green-100'
              }`}
            >
              Cancel
            </a>
          </Link>
        )}
      </div>
    </form>
  )
}
