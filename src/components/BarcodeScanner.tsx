import { useState, useRef, useEffect } from 'react'

interface BarcodeScannerProps {
  onScan: (barcode: string) => void
  placeholder?: string
  autoFocus?: boolean
}

export const BarcodeScanner = ({
  onScan,
  placeholder = 'Quét mã vạch hoặc nhập mã đơn hàng',
  autoFocus = true,
}: BarcodeScannerProps) => {
  const [value, setValue] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const scanTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)

    // Phát hiện quét mã vạch (nhập nhanh)
    if (!isScanning && newValue.length > 0) {
      setIsScanning(true)
    }

    // Clear timeout cũ
    if (scanTimeoutRef.current !== null) {
      window.clearTimeout(scanTimeoutRef.current)
    }

    // Nếu nhập xong (không có ký tự mới trong 100ms), xử lý
    scanTimeoutRef.current = window.setTimeout(() => {
      setIsScanning(false)
      if (newValue.trim()) {
        handleScan(newValue.trim())
      }
    }, 100)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      e.preventDefault()
      if (scanTimeoutRef.current !== null) {
        window.clearTimeout(scanTimeoutRef.current)
      }
      setIsScanning(false)
      handleScan(value.trim())
    }
  }

  const handleScan = (code: string) => {
    onScan(code)
    setValue('')
    // Focus lại để quét tiếp
    window.setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  const handleManualScan = () => {
    if (value.trim()) {
      handleScan(value.trim())
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-2xl">
          {isScanning ? 'qr_code_scanner' : 'barcode_reader'}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-14 pr-24 py-4 text-base font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
        />
        {isScanning && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="flex items-center gap-2 text-primary">
              <div className="size-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-xs font-bold">Đang quét...</span>
            </div>
          </div>
        )}
        {!isScanning && value && (
          <button
            onClick={handleManualScan}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all"
          >
            Tìm
          </button>
        )}
      </div>

      {/* Hints */}
      <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
          <span>Quét mã vạch sản phẩm</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">receipt</span>
          <span>Hoặc nhập mã đơn hàng (VD: HD-2024-001)</span>
        </div>
      </div>
    </div>
  )
}
