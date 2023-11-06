import { cloneElement } from 'react'
import { TbLoader2 } from 'react-icons/tb'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

export type TCustomClickableProps = {
  label: string
  leftIcon?: JSX.Element
  rightIcon?: JSX.Element
  variant?: 'outlined' | 'contained'
  disabled?: boolean
  loading?: boolean
  flat?: boolean
  leftIconFilled?: boolean
  rightIconFilled?: boolean
}

export type TClickableProps = TCustomClickableProps & React.ComponentProps<'div'>

type TLoadingProps = {
  flat?: boolean
}

const Loading = ({ flat }: TLoadingProps) => {
  return (
    <div className="flex justify-center w-full">
      <TbLoader2 className={StyleHelper.mergeStyles('animate-spin', { 'w-6 h-6': !flat, 'w-5 h-5': flat })} />
    </div>
  )
}

const Outline = ({
  leftIcon,
  label,
  disabled = false,
  leftIconFilled = true,
  rightIconFilled = true,
  flat = false,
  rightIcon,
  loading = false,
  ...props
}: TClickableProps) => {
  const { className: leftIconClassName = '', ...leftIconProps } = leftIcon ? leftIcon.props : {}
  const { className: rightIconClassName = '', ...rightIconProps } = rightIcon ? rightIcon.props : {}

  const buildIconClassName = (className: string, filled: boolean) => {
    return StyleHelper.mergeStyles(
      ' object-contain ',
      {
        'w-6 h-6': !flat,
        'w-5 h-5': flat,
        'fill-neon group-aria-[disabled=true]:fill-gray-100/50': filled,
        'stroke-neon group-aria-[disabled=true]:stroke-gray-100/50': !filled,
      },
      className
    )
  }

  return (
    <div
      {...props}
      aria-disabled={disabled ?? loading}
      className={StyleHelper.mergeStyles(
        'group flex items-center w-full border text-center rounded py-3 px-5 gap-x-2.5 cursor-pointer transition-colors aria-[disabled=false]:text-neon aria-[disabled=false]:border-neon aria-[disabled=false]:hover:bg-gray-200/15 aria-[disabled=true]:border-gray-100/50 aria-[disabled=true]:text-gray-100/50 aria-[disabled=true]:cursor-not-allowed',
        { 'h-12 text-sm': !flat },
        { 'h-8 text-xs': flat },
        props.className
      )}
    >
      {!loading ? (
        <>
          {leftIcon &&
            cloneElement(leftIcon, {
              className: buildIconClassName(leftIconClassName, leftIconFilled),
              ...leftIconProps,
            })}

          <span className="flex-grow font-medium whitespace-nowrap">{label}</span>

          {rightIcon &&
            cloneElement(rightIcon, {
              className: buildIconClassName(rightIconClassName, rightIconFilled),
              ...rightIconProps,
            })}
        </>
      ) : (
        <Loading flat={flat} />
      )}
    </div>
  )
}

const Contained = ({
  leftIcon,
  rightIcon,
  label,
  disabled = false,
  leftIconFilled = true,
  rightIconFilled = true,
  loading = false,
  flat = false,
  ...props
}: TClickableProps) => {
  const { className: leftIconClassName = '', ...leftIconProps } = leftIcon ? leftIcon.props : {}
  const { className: rightIconClassName = '', ...rightIconProps } = rightIcon ? rightIcon.props : {}

  const buildIconClassName = (className: string, filled: boolean) => {
    return StyleHelper.mergeStyles(
      'object-contain ',
      {
        'w-6 h-6': !flat,
        'w-5 h-5': flat,
        'fill-neon group-aria-[disabled=true]:fill-gray-100/50': filled,
        'stroke-neon group-aria-[disabled=true]:stroke-gray-100/50': !filled,
      },
      className
    )
  }

  return (
    <div
      aria-disabled={disabled ?? loading}
      className={StyleHelper.mergeStyles(
        'flex items-center text-center w-full py-3 px-5 gap-x-2.5 transition-colors rounded',
        'aria-[disabled=true]:bg-gray-200/30 aria-[disabled=true]:text-gray-100/50 aria-[disabled=true]:cursor-not-allowed',
        'aria-[disabled=false]:cursor-pointer aria-[disabled=false]:bg-gradient-to-t aria-[disabled=false]:from-gray-800 aria-[disabled=false]:to-gray-600 aria-[disabled=false]:text-neon aria-[disabled=false]:shadow-[4px_8px_20px_0px_rgba(18,21,23,0.40),inset_1px_1px_0px_0px_rgba(214,210,210,0.14),inset_-1px_-1px_0px_0px_rgba(0,0,0,0.32)] aria-[disabled=false]:hover:from-gray-600 aria-[disabled=false]:hover:to-gray-600',
        { 'h-12 text-sm': !flat },
        { 'h-8 text-xs': flat },
        props.className
      )}
    >
      {!loading ? (
        <>
          {leftIcon &&
            cloneElement(leftIcon, {
              className: buildIconClassName(leftIconClassName, leftIconFilled),
              ...leftIconProps,
            })}

          <span className="flex-grow font-medium whitespace-nowrap">{label}</span>

          {rightIcon &&
            cloneElement(rightIcon, {
              className: buildIconClassName(rightIconClassName, rightIconFilled),
              ...rightIconProps,
            })}
        </>
      ) : (
        <Loading flat={flat} />
      )}
    </div>
  )
}

export const Clickable = (props: TClickableProps) => {
  return props.variant === 'outlined' ? <Outline {...props} /> : <Contained {...props} />
}
