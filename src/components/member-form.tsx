import equal from 'fast-deep-equal/es6/react'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

import Input from './input'

const defaultInitialState = {
  email: '',
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
  const [editImage, setEditImage] = React.useState(!initialState?.photo)
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

    // .trim() works here because we're not setting the value back to the input
    // Otherwise the user wouldn't be able to add spaces
    let value: string | File = event.currentTarget.value.trim()
    if (event.currentTarget.type === 'file') {
      value = event.currentTarget.files[0]
    }

    setFormDataState((prevData) => ({ ...prevData, [name]: value }))
  }

  const nothingChanged = React.useMemo(
    () => equal(initialState, formDataState),
    [initialState, formDataState],
  )

  return (
    <form onSubmit={handleSubmit}>
      <div className='flex max-w-sm flex-col items-start gap-y-4'>
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
          id='email'
          name='email'
          label='Email:'
          placeholder='me@mail.com'
          type='email'
          inputProps={{
            autoComplete: 'off',
            onChange: handleChangle,
            required: true,
            defaultValue: initialState?.email,
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

        {!editImage && typeof initialState?.photo === 'string' ? (
          <>
            <Image src={initialState?.photo} alt='' width={176} height={176} />
            <button type='button' onClick={() => setEditImage(true)}>
              Edit Photo
            </button>
          </>
        ) : (
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

      <div className='mt-6 flex flex-wrap items-baseline gap-4 md:mt-8'>
        <button
          type='submit'
          disabled={loading || nothingChanged}
          className={
            'rounded bg-teal-600 px-4 py-2 text-white transition-colors hover:bg-teal-800 disabled:bg-teal-400 disabled:text-teal-600'
          }
        >
          {initialState?.firstname ? 'Update member' : 'Add member'}
        </button>

        {!initialState?.firstname ? null : (
          <>
            <Link href='/members'>
              <a
                className={`rounded border border-current px-4 py-2 transition-colors ${
                  loading
                    ? 'text-teal-300'
                    : 'text-teal-600 hover:bg-teal-100 hover:text-teal-800'
                }`}
              >
                Cancel
              </a>
            </Link>
            {nothingChanged ? null : (
              <span className='text-slate-600'>You have unsaved changes</span>
            )}
          </>
        )}
      </div>
    </form>
  )
}
