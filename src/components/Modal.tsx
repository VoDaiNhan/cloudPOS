import { useCallback, useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface ModalProps {
  children: ReactNode
  onClose?: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  closeOnBackdrop?: boolean
  showCloseButton?: boolean
  title?: string
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-5xl',
}

export const Modal = ({
  children,
  onClose,
  size = 'xl',
  closeOnBackdrop = true,
  showCloseButton = false,
  title,
}: ModalProps) => {
  const navigate = useNavigate()

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose()
    } else {
      navigate(-1)
    }
  }, [onClose, navigate])

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handleKey)
    // Prevent body scroll
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleClose])

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={closeOnBackdrop ? handleClose : undefined}
      />

      {/* Panel */}
      <div
        className={`relative w-full ${sizeClasses[size]} max-h-[90vh] bg-white dark:bg-slate-950 rounded-2xl shadow-2xl shadow-black/20 flex flex-col overflow-hidden animate-scale-in`}
        style={{ animation: 'modalIn 0.2s ease-out' }}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
            {title && (
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {title}
              </h2>
            )}
            <button
              onClick={handleClose}
              className="ml-auto size-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}
