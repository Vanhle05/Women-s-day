import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pen, Save, Check, RotateCcw } from 'lucide-react';
import storageService from '../services/storageService';

const WISH_MAX_LENGTH = 200;
const fast = [0.16, 1, 0.3, 1];
const wishLabels = [
  { number: '01', prompt: 'Điều ước thứ nhất...' },
  { number: '02', prompt: 'Điều ước thứ hai...' },
  { number: '03', prompt: 'Điều ước thứ ba...' },
];

export default function WishesPage({ addToast }) {
  const navigate = useNavigate();
  const [wishes, setWishes] = useState([null, null, null]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [savedAnimation, setSavedAnimation] = useState(null);

  useEffect(() => {
    const saved = storageService.getWishes();
    if (saved && Array.isArray(saved) && saved.length === 3) setWishes(saved);
  }, []);

  const startEditing = (i) => { setEditingIndex(i); setEditText(wishes[i] || ''); };
  const cancelEditing = () => { setEditingIndex(null); setEditText(''); };

  const saveWish = (i) => {
    if (!editText.trim()) return;
    const w = [...wishes]; w[i] = editText.trim();
    setWishes(w); storageService.saveWishes(w, i);
    setEditingIndex(null); setEditText('');
    setSavedAnimation(i); setTimeout(() => setSavedAnimation(null), 1200);
    if (addToast) addToast('Điều ước đã được lưu lại 💌');
  };

  const resetWish = (i) => {
    const w = [...wishes]; w[i] = null;
    setWishes(w); storageService.saveWishes(w);
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center"
      style={{ padding: '32px 24px' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.button className="fixed btn-secondary z-20" style={{ top: 24, left: 24 }}
        onClick={() => navigate('/')}
        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, ease: fast }}
        whileTap={{ scale: 0.95 }} aria-label="Quay về trang chính">
        <ArrowLeft size={16} /><span style={{ fontSize: 12 }}>Quay lại</span>
      </motion.button>

      <motion.div className="text-center" style={{ marginTop: 72, marginBottom: 48 }}
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: fast }}>
        <h1 className="heading-serif" style={{ fontSize: 'clamp(28px, 5vw, 48px)', color: '#292522', marginBottom: 16 }}>
          3 Điều Ước
        </h1>
        <p className="max-w-md mx-auto" style={{ fontSize: 14, opacity: 0.35 }}>
          Hãy ước gì em mún trong năm nay
        </p>
      </motion.div>

      <div className="w-full" style={{ maxWidth: 540 }}>
        {wishLabels.map((label, index) => (
          <motion.div
            key={index}
            className="liquid-glass-card specular-shine wish-card"
            style={{ padding: '36px 36px 32px', marginBottom: 20 }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: fast, delay: 0.05 + index * 0.06 }}
          >
            <div className="flex items-center" style={{ gap: 16, marginBottom: 20 }}>
              <span className="heading-serif" style={{ fontSize: 28, color: 'rgba(216,167,167,0.35)' }}>
                {label.number}
              </span>
              <div className="flex-1" style={{ height: 1, background: 'rgba(41,37,34,0.05)' }} />
              {wishes[index] && editingIndex !== index && (
                <div className="flex" style={{ gap: 4 }}>
                  <button onClick={() => startEditing(index)}
                    style={{ padding: 8, borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', transition: 'background 0.1s' }}
                    className="hover:bg-white/10" aria-label="Sửa">
                    <Pen size={13} style={{ opacity: 0.3 }} />
                  </button>
                  <button onClick={() => resetWish(index)}
                    style={{ padding: 8, borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', transition: 'background 0.1s' }}
                    className="hover:bg-white/10" aria-label="Xoá">
                    <RotateCcw size={13} style={{ opacity: 0.3 }} />
                  </button>
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {editingIndex === index ? (
                <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
                  <textarea value={editText} onChange={(e) => setEditText(e.target.value)}
                    placeholder={label.prompt} maxLength={WISH_MAX_LENGTH} rows={3}
                    className="input-glass resize-none" style={{ fontSize: 14, marginBottom: 16 }} autoFocus />
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: 11, opacity: 0.2 }}>{editText.length}/{WISH_MAX_LENGTH}</span>
                    <div className="flex" style={{ gap: 12 }}>
                      <button onClick={cancelEditing} className="btn-secondary" style={{ fontSize: 12, padding: '10px 20px' }}>Hủy</button>
                      <button onClick={() => saveWish(index)} disabled={!editText.trim()}
                        className="btn-primary" style={{ fontSize: 12, padding: '10px 20px' }}>
                        <Save size={13} /> Lưu
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : wishes[index] ? (
                <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }} className="relative">
                  <p style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(41,37,34,0.65)' }}>"{wishes[index]}"</p>
                  {savedAnimation === index && (
                    <motion.div className="absolute" style={{ right: -8, top: -8 }}
                      initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2, ease: fast }}>
                      <div className="flex items-center justify-center"
                        style={{ width: 28, height: 28, borderRadius: 14, background: 'rgba(201,145,143,0.2)' }}>
                        <Check size={13} color="#C9918F" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.button key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  onClick={() => startEditing(index)} className="w-full text-left cursor-pointer group"
                  style={{ padding: '16px 0', background: 'none', border: 'none' }}>
                  <p className="group-hover:opacity-45" style={{ fontSize: 14, opacity: 0.25, fontStyle: 'italic', transition: 'opacity 0.12s' }}>
                    {label.prompt}
                  </p>
                  <p className="group-hover:opacity-30" style={{ fontSize: 12, opacity: 0.15, marginTop: 6, transition: 'opacity 0.12s' }}>
                    Nhấn để viết
                  </p>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
