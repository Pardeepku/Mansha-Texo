import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4">
      <AnimatePresence>
        {toasts.map((toast) => {
          let Icon = CheckCircle2;
          let borderClass = 'border-emerald-500/30 bg-white text-emerald-950';
          let iconClass = 'text-[#257335]';

          if (toast.type === 'error') {
            Icon = AlertCircle;
            borderClass = 'border-red-500/30 bg-white text-red-950';
            iconClass = 'text-red-600';
          } else if (toast.type === 'warning') {
            Icon = AlertTriangle;
            borderClass = 'border-amber-500/30 bg-white text-amber-950';
            iconClass = 'text-[#EB7344]';
          } else if (toast.type === 'info') {
            Icon = Info;
            borderClass = 'border-blue-500/30 bg-white text-blue-950';
            iconClass = 'text-blue-600';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              layout
              className={`pointer-events-auto p-4 rounded-xl shadow-xl border ${borderClass} flex items-start gap-3 relative backdrop-blur-md`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconClass}`} />
              <div className="flex-1 pr-4">
                <h4 className="text-sm font-semibold tracking-tight">{toast.title}</h4>
                {toast.message && (
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-md transition-colors cursor-pointer"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
