import * as React from 'react'

type IProps = {
  label: string
  id?: string
  name?: string
  type?: string
  placeholder?: string
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

export default function Input({
  label,
  placeholder,
  name,
  id,
  type = 'text',
  inputProps,
}: IProps) {
  return (
    <div className='flex flex-col w-full'>
      <label htmlFor={id} className='font-bold mb-1 md:mb-2 self-start'>
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        name={name}
        {...inputProps}
        className='p-2 text-lg rounded border border-gray-500 hover:border-gray-700 focus:border-gray-900'
      />
    </div>
  )
}
