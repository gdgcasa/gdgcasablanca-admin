import * as React from 'react'

type IProps = {
  label?: string
  description?: string
  id?: string
  name?: string
  type?: string
  placeholder?: string
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  className?: string
}

export default function Input({
  label,
  description,
  placeholder,
  name,
  id,
  type = 'text',
  inputProps,
  className,
}: IProps) {
  return (
    <div
      className={['flex w-full flex-col', className].filter(Boolean).join(' ')}
    >
      {!label ? null : (
        <label htmlFor={id} className='mb-1 self-start md:mb-2'>
          <div className='text-gray-700'>{label}</div>
          <div className='text-sm text-gray-800'>{description}</div>
        </label>
      )}
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        name={name}
        {...inputProps}
        className='rounded border border-gray-500 px-2 py-1 text-lg hover:border-gray-700 focus:border-gray-900'
        aria-label={label}
      />
    </div>
  )
}
