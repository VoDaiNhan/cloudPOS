import type { ReactNode } from 'react'

export const SetupLayout = ({ children, hideFooter }: { children: ReactNode, hideFooter?: boolean }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 overflow-x-hidden font-sans">
      {/* Simple Header */}
      <header className="flex h-16 sm:h-20 items-center px-4 sm:px-8 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 text-primary">
          <div className="size-8 sm:size-10 flex items-center justify-center bg-primary rounded-lg sm:rounded-xl text-white shadow-md">
            <span className="material-symbols-outlined font-bold text-xl sm:text-2xl">cloud_done</span>
          </div>
          <h2 className="text-slate-900 text-lg sm:text-xl font-black leading-tight tracking-tight uppercase">
            CloudPOS
          </h2>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>

      {/* Simple Footer */}
      {!hideFooter && (
        <footer className="py-6 border-t border-slate-200 text-center bg-white/50">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            <a href="#" className="hover:text-primary transition-colors">Hỗ trợ</a>
            <a href="#" className="hover:text-primary transition-colors">Hướng dẫn</a>
            <a href="#" className="hover:text-primary transition-colors">Điều khoản</a>
          </div>
          <p className="text-slate-400 text-[10px] tracking-[0.2em] uppercase font-bold">
            © 2026 CLOUDPOS ECOSYSTEM
          </p>
        </footer>
      )}
    </div>
  )
}
