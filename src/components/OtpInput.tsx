import { useRef, type KeyboardEvent, type ClipboardEvent } from 'react'

interface OtpInputProps {
  length?: number
  value: string[]
  onChange: (value: string[]) => void
}

export const OtpInput = ({ length = 6, value, onChange }: OtpInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return

    const newValue = [...value]
    newValue[index] = digit.slice(-1)
    onChange(newValue)

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (pastedData) {
      const newValue = [...value]
      pastedData.split('').forEach((char, i) => {
        newValue[i] = char
      })
      onChange(newValue)
      const focusIndex = Math.min(pastedData.length, length - 1)
      inputRefs.current[focusIndex]?.focus()
    }
  }

  return (
    <div className="flex justify-between gap-2 max-w-[320px] mx-auto">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          placeholder="-"
          className="w-10 h-12 text-center text-xl font-bold border-2 border-slate-200 rounded-lg bg-white focus:border-[#1c43a6] outline-none transition-all"
        />
      ))}
    </div>
  )
}
