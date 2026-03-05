import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  fullWidth?: boolean
  loading?: boolean
  icon?: string
}

export const Button = ({
  children,
  variant = 'primary',
  fullWidth = false,
  loading = false,
  icon,
  disabled,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles =
    'py-[14px] px-6 font-bold rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer text-[15px]'

  const variants = {
    primary:
      'bg-[#1c43a6] hover:bg-[#152f7a] text-white shadow-lg shadow-[#1c43a6]/20',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-700',
    outline:
      'bg-transparent border-2 border-[#1c43a6] text-[#1c43a6] hover:bg-[#1c43a6]/5',
  }

  const widthStyle = fullWidth ? 'w-full' : ''
  const disabledStyle =
    disabled || loading ? 'opacity-50 cursor-not-allowed active:scale-100' : ''

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${disabledStyle} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
          <span>Đang xử lý...</span>
        </>
      ) : (
        <>
          <span>{children}</span>
          {icon && <span className="material-symbols-outlined text-xl">{icon}</span>}
        </>
      )}
    </button>
  )
}
