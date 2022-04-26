import cx from 'classnames'

type IProps = {
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export default function Button({
  children,
  type = 'button',
  className,
}: IProps) {
  return (
    <button
      type={type}
      className={cx(
        'rounded-md bg-blue-500 py-2 px-3 text-sm font-semibold text-white shadow shadow-blue-500/50 hover:bg-blue-600 focus:outline-none focus-visible:shadow-none focus-visible:ring-1 focus-visible:ring-offset-2 active:shadow-none active:ring-1 active:ring-offset-2',
        className,
      )}
    >
      {children}
    </button>
  )
}
