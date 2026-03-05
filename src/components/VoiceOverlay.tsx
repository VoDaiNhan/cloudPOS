import { useEffect } from 'react'

interface VoiceOverlayProps {
  isOpen: boolean
  onClose: () => void
  subtitle?: string
  onResult?: (text: string) => void
  simulatedResult?: string
}

const VoiceOverlay = ({ isOpen, onClose, subtitle, onResult, simulatedResult }: VoiceOverlayProps) => {
  useEffect(() => {
    if (!isOpen) return
    const timer = setTimeout(() => {
      if (onResult && simulatedResult) {
        onResult(simulatedResult)
      }
      onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [isOpen, onClose, onResult, simulatedResult])

  if (!isOpen) return null

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm dark:bg-slate-900/90 rounded-xl animate-fade-in">
      <style>{`
        @keyframes pulse-red {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 14px rgba(239, 68, 68, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>
      <div
        className="mb-6 flex size-20 items-center justify-center rounded-full bg-red-500 text-white"
        style={{ animation: 'pulse-red 1.8s infinite' }}
      >
        <span className="material-symbols-outlined text-4xl">mic</span>
      </div>
      <p className="text-lg font-bold text-slate-800 dark:text-white">Đang lắng nghe...</p>
      {subtitle && (
        <p className="mt-2 text-sm text-slate-500 text-center max-w-xs">{subtitle}</p>
      )}
      <div className="mt-4 flex items-center gap-1.5">
        <div className="w-1 h-4 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="w-1 h-6 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }}></div>
        <div className="w-1 h-8 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        <div className="w-1 h-5 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.45s' }}></div>
        <div className="w-1 h-7 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
        <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.75s' }}></div>
        <div className="w-1 h-6 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.9s' }}></div>
      </div>
      <button
        onClick={onClose}
        className="mt-8 rounded-full border border-slate-200 px-6 py-2 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 transition-colors"
      >
        Hủy bỏ
      </button>
    </div>
  )
}

export default VoiceOverlay
