import { useState, useRef, useEffect } from 'react'

interface SmartDiscountInputProps {
  value: number
  type: 'percent' | 'fixed'
  maxAmount?: number
  onApply: (value: number, type: 'percent' | 'fixed') => void
  placeholder?: string
  className?: string
  label?: string // New: để phân biệt giảm giá sản phẩm vs hóa đơn
  showTypeIndicator?: boolean // New: hiển thị badge loại giảm giá
}

interface Suggestion {
  display: string
  value: number
  type: 'percent' | 'fixed'
  label: string
}

export const SmartDiscountInput = ({
  value,
  type,
  maxAmount,
  onApply,
  placeholder = '0',
  className = '',
  label,
  showTypeIndicator = true,
}: SmartDiscountInputProps) => {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Generate smart suggestions based on input
  const generateSuggestions = (input: string): Suggestion[] => {
    const num = parseFloat(input.replace(/\D/g, ''))
    if (!num || isNaN(num)) return []

    const suggestions: Suggestion[] = []

    // Percent suggestions
    if (num <= 100) {
      suggestions.push({
        display: `${num}%`,
        value: num,
        type: 'percent',
        label: 'Giảm theo phần trăm',
      })
    }

    // Decimal percent (for numbers like 0.5, 0.8)
    if (num < 10) {
      const decimalPercent = num / 10
      suggestions.push({
        display: `${decimalPercent}%`,
        value: decimalPercent,
        type: 'percent',
        label: 'Giảm phần trăm nhỏ',
      })
    }

    // Fixed amount suggestions (thousands)
    if (num < 1000) {
      const thousands = num * 1000
      suggestions.push({
        display: `${thousands.toLocaleString('vi-VN')}đ`,
        value: thousands,
        type: 'fixed',
        label: 'Giảm theo số tiền',
      })
    }

    // Fixed amount (ten thousands)
    if (num < 100) {
      const tenThousands = num * 10000
      suggestions.push({
        display: `${tenThousands.toLocaleString('vi-VN')}đ`,
        value: tenThousands,
        type: 'fixed',
        label: 'Giảm số tiền lớn hơn',
      })
    }

    // Fixed amount (hundred thousands)
    if (num < 10) {
      const hundredThousands = num * 100000
      suggestions.push({
        display: `${hundredThousands.toLocaleString('vi-VN')}đ`,
        value: hundredThousands,
        type: 'fixed',
        label: 'Giảm số tiền rất lớn',
      })
    }

    // Direct amount (as entered)
    if (num >= 1000) {
      suggestions.push({
        display: `${num.toLocaleString('vi-VN')}đ`,
        value: num,
        type: 'fixed',
        label: 'Số tiền chính xác',
      })
    }

    // Filter out suggestions that exceed max amount for percent type
    return suggestions.filter((s) => {
      if (s.type === 'percent') return s.value <= 100
      if (maxAmount && s.type === 'fixed') return s.value <= maxAmount
      return true
    })
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d.]/g, '')
    setInputValue(raw)

    if (raw) {
      const newSuggestions = generateSuggestions(raw)
      setSuggestions(newSuggestions)
      setShowSuggestions(newSuggestions.length > 0)
      setSelectedIndex(0)
    } else {
      setShowSuggestions(false)
      setSuggestions([])
    }
  }

  // Apply suggestion
  const applySuggestion = (suggestion: Suggestion) => {
    onApply(suggestion.value, suggestion.type)
    setInputValue('')
    setShowSuggestions(false)
    inputRef.current?.blur()
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter' && inputValue) {
        // Direct enter without suggestions - apply as percent if <= 100, else as fixed
        const num = parseFloat(inputValue.replace(/\D/g, ''))
        if (!isNaN(num)) {
          const type = num <= 100 ? 'percent' : 'fixed'
          onApply(num, type)
          setInputValue('')
          setShowSuggestions(false)
          inputRef.current?.blur()
        }
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % suggestions.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length)
        break
      case 'Enter':
        e.preventDefault()
        if (suggestions[selectedIndex]) {
          applySuggestion(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setInputValue('')
        inputRef.current?.blur()
        break
    }
  }

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Display current value
  const displayValue = value > 0 
    ? type === 'percent' 
      ? `${value}%` 
      : `${value.toLocaleString('vi-VN')}đ`
    : ''

  // Calculate actual discount amount for display
  const actualDiscountAmount = value > 0 && maxAmount
    ? type === 'percent'
      ? Math.round(maxAmount * value / 100)
      : Math.min(value, maxAmount)
    : 0

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={showSuggestions ? inputValue : displayValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setInputValue('')
            if (value > 0) {
              const suggestions = generateSuggestions(value.toString())
              setSuggestions(suggestions)
              setShowSuggestions(suggestions.length > 0)
            }
          }}
          placeholder={placeholder}
          className="w-full text-right rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
        />

        {/* Type Indicator Badge */}
        {showTypeIndicator && value > 0 && !showSuggestions && (
          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
              type === 'percent' 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
            }`}>
              <span className="material-symbols-outlined text-[10px]">
                {type === 'percent' ? 'percent' : 'payments'}
              </span>
              {type === 'percent' ? 'Phần trăm' : 'Tiền mặt'}
            </span>
          </div>
        )}

        {/* Actual Discount Amount Display */}
        {actualDiscountAmount > 0 && !showSuggestions && (
          <div className="absolute -bottom-5 right-0 text-[10px] font-bold text-rose-500">
            -{actualDiscountAmount.toLocaleString('vi-VN')}đ
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full min-w-[200px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl overflow-hidden"
        >
          <div className="py-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${suggestion.value}`}
                onClick={() => applySuggestion(suggestion)}
                className={`w-full px-3 py-2 text-left transition-colors ${
                  index === selectedIndex
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm">{suggestion.display}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {suggestion.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">keyboard</span>
              ↑↓ Di chuyển • Enter Chọn • Esc Hủy
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
