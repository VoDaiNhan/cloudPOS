import type { InputHTMLAttributes } from 'react'

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: string
  suffix?: string
  prefix?: string
  endIcon?: string
  onEndIconClick?: () => void
}

export const InputField = ({
  label,
  icon,
  suffix,
  prefix,
  endIcon,
  onEndIconClick,
  className = '',
  id,
  ...props
}: InputFieldProps) => {
  const inputId = id || props.name || label.toLowerCase().replace(/\s/g, '-')

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-sm font-semibold text-slate-700 mb-2"
      >
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
            <span className="material-symbols-outlined">{icon}</span>
          </div>
        )}
        {prefix && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 font-medium whitespace-nowrap">
            {prefix}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full ${icon || prefix ? (prefix ? 'pl-12' : 'pl-10') : 'pl-4'} ${endIcon || suffix ? (suffix ? 'pr-32' : 'pr-12') : 'pr-4'} py-[14px] bg-slate-50 border border-slate-200 rounded-lg text-[15px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 placeholder:text-slate-400 ${className}`}
          {...props}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400 font-medium">
            {suffix}
          </div>
        )}
        {endIcon && (
          <button
            type="button"
            onClick={onEndIconClick}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">{endIcon}</span>
          </button>
        )}
      </div>
    </div>
  )
}
