import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete } from 'lucide-react';
import siteConfig from '../config/siteConfig';
import storageService from '../services/storageService';
import ScratchCard from '../components/ScratchCard';

const errorMessages = [
  'Hmm, sai bố rồi',
  'Nữa rồi đó',
  'Ê',
  'Khó chưaaa',
  'Bít thế nào đựt em',
];

const PIN_LENGTH = siteConfig.password.length;

export default function AccessPage({ onUnlock }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showScratchCard, setShowScratchCard] = useState(false);
  const isSubmittingRef = useRef(false);

  // Xoá hoàn toàn dữ liệu failedAttempts cũ trong localStorage nếu có
  useEffect(() => {
    storageService.remove('failedAttempts');
  }, []);

  const showScratch = showScratchCard;

  const handleSubmit = useCallback((currentPin) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    const correct = siteConfig.trimPassword ? siteConfig.password.trim() : siteConfig.password;

    if (currentPin === correct) {
      setIsUnlocking(true);
      storageService.remove('failedAttempts');
      setTimeout(() => onUnlock(), 500);
    } else {
      setFailedAttempts(prev => {
        const next = prev + 1;
        // ĐÚNG 5 LẦN SAI MỚI HIỆN THẺ CÀO
        if (next >= siteConfig.maxAttempts) {
          setShowScratchCard(true);
        }
        const msgIndex = Math.min(next - 1, errorMessages.length - 1);
        setError(errorMessages[msgIndex]);
        return next;
      });

      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
        setPin('');
        isSubmittingRef.current = false;
      }, 350);
    }
  }, [onUnlock]);

  const handleDigit = useCallback((digit) => {
    if (isUnlocking || isSubmittingRef.current) return;
    setPin(prev => {
      if (prev.length >= PIN_LENGTH) return prev;
      const next = prev + digit;
      setError('');
      return next;
    });
  }, [isUnlocking]);

  const handleDelete = useCallback(() => {
    if (isUnlocking || isSubmittingRef.current) return;
    setPin(prev => prev.slice(0, -1));
  }, [isUnlocking]);

  // Auto-submit when PIN is full length
  useEffect(() => {
    if (pin.length === PIN_LENGTH && !isSubmittingRef.current) {
      handleSubmit(pin);
    }
  }, [pin, handleSubmit]);

  // Keyboard support
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleDigit, handleDelete]);


  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-10 overflow-y-auto"
      style={{ padding: 'clamp(10px, 2.5vw, 24px)' }}
      initial={{ opacity: 0 }}
      animate={isUnlocking ? { opacity: 0, scale: 1.06 } : { opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className={`liquid-glass-strong rounded-2xl sm:rounded-3xl w-full overflow-hidden specular-shine access-fade-in ${isShaking ? 'access-shake' : ''}`}
        style={{ maxWidth: 920 }}
        onAnimationEnd={(e) => {
          if (e.animationName === 'shake') setIsShaking(false);
        }}
      >
        <div className="flex flex-row items-stretch min-h-[380px] sm:min-h-[460px] md:min-h-[520px]">
          {/* Left — Photo */}
          <div
            className="w-[38%] sm:w-[42%] md:w-[45%] relative overflow-hidden access-fade-in-delay-1 access-photo-section shrink-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${siteConfig.couplePhoto})`,
                filter: 'contrast(0.95) saturate(0.9)',
              }}
            />
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(135deg, rgba(216,195,165,0.15) 0%, transparent 50%, rgba(216,167,167,0.1) 100%)',
            }} />
            <div className="absolute inset-0 flex items-end" style={{ padding: 'clamp(12px, 2.5vw, 32px)' }}>
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(to top, rgba(41,37,34,0.65) 0%, transparent 60%)',
              }} />
              <p
                className="relative access-caption-in"
                style={{ fontFamily: 'var(--font-hand)', fontSize: 'clamp(12px, 1.8vw, 17px)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.3 }}
              >
                {siteConfig.coupleCaption}
              </p>
            </div>
          </div>

          {/* Right — PIN Pad */}
          <div
            className="w-[62%] sm:w-[58%] md:w-[55%] flex flex-col justify-center access-pinpad-section"
            style={{ padding: 'clamp(16px, 3.5vw, 44px) clamp(12px, 3.5vw, 48px)' }}
          >
            <div className="access-fade-in-delay-3">
              <AnimatePresence>
                {showScratch && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, scale: 0.96 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{ marginBottom: 16, overflow: 'hidden' }}
                  >
                    <ScratchCard password={siteConfig.password} onComplete={() => { }} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* PIN Dots Display */}
              <div
                className="flex items-center justify-center"
                style={{ gap: 'clamp(10px, 1.8vw, 16px)', marginBottom: 'clamp(4px, 1vw, 8px)' }}
              >
                {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                  <div
                    key={i}
                    className={`pin-dot ${i < pin.length ? 'pin-dot-filled' : ''}`}
                  />
                ))}
              </div>

              {/* Error / Hint */}
              <div style={{ height: 'clamp(24px, 3.5vw, 32px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AnimatePresence mode="wait">
                  <motion.p
                    key="error"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    style={{ fontSize: 'clamp(11px, 1.3vw, 12px)', color: '#C9918F', textAlign: 'center' }}
                  >
                    {error}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Number Pad */}
              <div className="numpad-grid">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((key, keyIdx) => {
                  if (key === '') {
                    return <div key={keyIdx} className="numpad-placeholder" aria-hidden="true" />;
                  }
                  if (key === 'del') {
                    return (
                      <button
                        key={keyIdx}
                        onClick={handleDelete}
                        className="numpad-btn-ghost"
                        aria-label="Xoá"
                      >
                        <Delete size={18} strokeWidth={1.5} style={{ opacity: 0.45 }} />
                      </button>
                    );
                  }
                  return (
                    <button
                      key={keyIdx}
                      onClick={() => handleDigit(key)}
                      className="numpad-btn"
                      aria-label={key}
                    >
                      {key}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

