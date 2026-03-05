import type { SelectHTMLAttributes } from 'react'

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  icon?: string
  options: { value: string; label: string }[]
}

export const SelectField = ({
  label,
  icon,
  options,
  className = '',
  id,
  ...props
}: SelectFieldProps) => {
  const selectId = id || props.name || label.toLowerCase().replace(/\s/g, '-')

  return (
    <div>
      <label
        htmlFor={selectId}
        className="block text-sm font-semibold text-slate-700 mb-2"
      >
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#1c43a6] transition-colors">
            <span className="material-symbols-outlined">{icon}</span>
          </div>
        )}
        <select
          id={selectId}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-10 py-[14px] bg-slate-50 border border-slate-200 rounded-lg text-[15px] focus:ring-2 focus:ring-[#1c43a6]/20 focus:border-[#1c43a6] outline-none appearance-none transition-all text-slate-900 cursor-pointer ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
          <span className="material-symbols-outlined">expand_more</span>
        </div>
      </div>
    </div>
  )
}
