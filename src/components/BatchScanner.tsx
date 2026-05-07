import { useState, useRef } from 'react'
import type { BatchScanResult } from '../types/batch'
import { parseGS1Barcode, isGS1Barcode } from '../utils/gs1Parser'

interface BatchScannerProps {
  onScanSuccess: (result: BatchScanResult) => void
  onScanError?: (error: string) => void
  placeholder?: string
  className?: string
}

export const BatchScanner = ({
  onScanSuccess,
  onScanError,
  placeholder = 'Quét mã vạch hoặc nhập số lô...',
  className = '',
}: BatchScannerProps) => {
  const [scanValue, setScanValue] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleScan = () => {
    if (!scanValue.trim()) {
      onScanError?.('Vui lòng nhập mã vạch hoặc số lô')
      return
    }

    setIsScanning(true)

    // Simulate scanning delay
    setTimeout(() => {
      // Check if it's a GS1 barcode
      if (isGS1Barcode(scanValue)) {
        const parsed = parseGS1Barcode(scanValue)
        
        if (parsed) {
          const result: BatchScanResult = {
            success: true,
            parsedData: {
              gtin: parsed.gtin,
              batchNumber: parsed.batchNumber,
              expiryDate: parsed.expiryDate,
              serialNumber: parsed.serialNumber,
            },
          }
          
          onScanSuccess(result)
          setScanValue('')
        } else {
          onScanError?.('Không thể phân tích mã vạch GS1')
        }
      } else {
        // Treat as batch number
        const result: BatchScanResult = {
          success: true,
          parsedData: {
            batchNumber: scanValue,
          },
        }
        
        onScanSuccess(result)
        setScanValue('')
      }

      setIsScanning(false)
    }, 300)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleScan()
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          barcode_scanner
        </span>
        <input
          ref={inputRef}
          type="text"
          value={scanValue}
          onChange={(e) => setScanValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isScanning}
          className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-11 pr-24 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none disabled:bg-slate-100 dark:disabled:bg-slate-800"
        />
        <button
          onClick={handleScan}
          disabled={isScanning || !scanValue.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-black hover:bg-primary/90 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-1"
        >
          {isScanning ? (
            <>
              <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
              Đang quét...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
              Quét
            </>
          )}
        </button>
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
        <span className="material-symbols-outlined text-sm text-blue-500">info</span>
        <span>Hỗ trợ: Mã vạch GS1-128, số lô thông thường, hoặc quét bằng máy quét</span>
      </div>
    </div>
  )
}
