import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { LiquidGlassCard } from '../components/ui/liquid-notification';

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => (
            <LiquidGlassCard
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              blurIntensity="lg"
              shadowIntensity="sm"
              glowIntensity="sm"
              borderRadius="16px"
              className={`pointer-events-auto relative overflow-hidden flex items-start gap-3 p-4
                ${
                  toast.type === 'success'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : toast.type === 'error'
                    ? 'bg-red-50 text-red-900 border border-red-200'
                    : 'bg-blue-50 text-blue-900 border border-blue-200'
                }
              `}
            >
              <div className="shrink-0 mt-0.5 z-40 relative">
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
              </div>
              
              <div className="flex-1 flex-col z-40 relative">
                <p className="text-sm font-semibold leading-relaxed text-gray-900">
                  {toast.message}
                </p>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors z-40 relative"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </LiquidGlassCard>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
