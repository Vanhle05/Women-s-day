import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Toast({ toasts, onRemove }) {
  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`toast-item ${toast.type === 'error' ? 'toast-error' : ''}`}
            style={{
              padding: '12px 22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
              borderRadius: '9999px',
              background: toast.type === 'error'
                ? 'rgba(216, 167, 167, 0.45)'
                : 'rgba(255, 255, 255, 0.45)',
              border: toast.type === 'error'
                ? '1px solid rgba(216, 167, 167, 0.5)'
                : '1px solid rgba(255, 255, 255, 0.45)',
              backdropFilter: 'blur(24px) saturate(1.4)',
              WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
              boxShadow: '0 12px 32px rgba(41, 37, 34, 0.1), 0 4px 12px rgba(41, 37, 34, 0.05)',
            }}
          >
            <span
              className="toast-message"
              style={{
                flex: 1,
                fontSize: '14.5px',
                fontWeight: 500,
                color: '#292522',
                lineHeight: 1.45,
                marginRight: '6px',
              }}
            >
              {toast.message}
            </span>
            <button
              onClick={() => onRemove(toast.id)}
              className="toast-close-btn"
              aria-label="Đóng thông báo"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(41, 37, 34, 0.06)',
                cursor: 'pointer',
                flexShrink: 0,
                padding: 0,
              }}
            >
              <X size={14} strokeWidth={2.2} color="#292522" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
