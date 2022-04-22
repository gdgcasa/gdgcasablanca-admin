import cx from 'classnames'
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
      className={cx('flex w-full', className, {
        'flex-col': !['checkbox'].includes(type),
        'items-center gap-3': ['checkbox'].includes(type),
      })}
    >
      {!label ? null : (
        <label
          htmlFor={id}
          className={cx('self-start', {
            'mb-1 md:mb-2': !['checkbox'].includes(type),
            'order-2 cursor-pointer': ['checkbox'].includes(type),
          })}
        >
          <div className='text-gray-700'>{label}</div>
          {!description ? null : (
            <div className='text-sm text-gray-800'>{description}</div>
          )}
        </label>
      )}
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        name={name}
        {...inputProps}
        className={cx({
          'rounded border border-gray-500 px-2 py-1 text-lg hover:border-gray-700 focus:border-gray-900':
            !['checkbox'].includes(type),
          'h-5 w-5 cursor-pointer appearance-none rounded border border-slate-400 checked:border-blue-600 checked:bg-blue-600 focus:outline-none focus:ring-2':
            ['checkbox'].includes(type),
        })}
        aria-label={label}
      />
    </div>
  )
}
