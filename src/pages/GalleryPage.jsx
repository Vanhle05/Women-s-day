import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import siteConfig from '../config/siteConfig';

const fast = [0.16, 1, 0.3, 1];

export default function GalleryPage() {
  const navigate = useNavigate();
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [errorImages, setErrorImages] = useState({});
  const { gallery } = siteConfig;
  const isLightboxOpen = lightboxIndex !== null;

  const openLightbox = (i) => { if (!errorImages[i]) setLightboxIndex(i); };
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % gallery.length);
  }, [lightboxIndex, gallery.length]);

  const goPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length);
  }, [lightboxIndex, gallery.length]);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', handleKey); document.body.style.overflow = ''; };
  }, [isLightboxOpen, goNext, goPrev]);

  const getGridStyle = (size) => {
    switch (size) {
      case 'large': return 'col-span-2 row-span-2 md:col-span-2 md:row-span-2';
      case 'medium': return 'col-span-1 row-span-1 md:col-span-1 md:row-span-2';
      default: return 'col-span-1 row-span-1';
    }
  };

  return (
    <motion.div className="min-h-screen" style={{ padding: '32px 24px 48px' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}>

      <motion.button className="fixed btn-secondary z-20" style={{ top: 24, left: 24 }}
        onClick={() => navigate('/')}
        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, ease: fast }}
        whileTap={{ scale: 0.95 }} aria-label="Quay về trang chính">
        <ArrowLeft size={16} /><span style={{ fontSize: 12 }}>Quay lại</span>
      </motion.button>

      <motion.div className="text-center" style={{ marginTop: 72, marginBottom: 40 }}
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: fast }}>
        <h1 className="heading-serif" style={{ fontSize: 'clamp(28px, 5vw, 48px)', color: '#292522', marginBottom: 16 }}>
          Chúng ta
        </h1>
        <p style={{ fontSize: 14, opacity: 0.35 }}>Qua các năm</p>
      </motion.div>

      <div className="mx-auto" style={{ maxWidth: 1000 }}>
        <div className="gallery-grid grid grid-cols-2 md:grid-cols-3" style={{ gap: 16, gridAutoRows: 'minmax(150px, auto)' }}>
          {gallery.map((item, index) => (
            <motion.div key={index}
              className={`relative rounded-2xl overflow-hidden cursor-pointer group ${getGridStyle(item.size)}`}
              style={{ border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 4px 16px rgba(41,37,34,0.06)' }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: fast, delay: 0.03 * index }}
              whileTap={{ scale: 0.97, transition: { duration: 0.08 } }}
              onClick={() => openLightbox(index)}>
              {!errorImages[index] ? (
                <>
                  {!loadedImages[index] && <div className="absolute inset-0 animate-pulse" style={{ background: 'rgba(216,195,165,0.2)' }} />}
                  <img src={item.src} alt={item.caption || `Ảnh ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105"
                    style={{ transition: 'transform 0.25s ease', opacity: loadedImages[index] ? 1 : 0 }}
                    loading="lazy"
                    onLoad={() => setLoadedImages(p => ({ ...p, [index]: true }))}
                    onError={() => setErrorImages(p => ({ ...p, [index]: true }))} />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    style={{ background: 'linear-gradient(to top, rgba(41,37,34,0.3) 0%, transparent 50%)', transition: 'opacity 0.15s' }} />
                  {item.caption && (
                    <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100"
                      style={{ padding: 16, transition: 'opacity 0.15s' }}>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{item.caption}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'rgba(216,195,165,0.1)' }}>
                  <ImageOff size={24} style={{ opacity: 0.2, marginBottom: 8 }} />
                  <p style={{ fontSize: 12, opacity: 0.25 }}>Chưa có ảnh</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {gallery.length === 0 && (
          <div className="text-center" style={{ padding: '80px 0' }}>
            <ImageOff size={32} className="mx-auto" style={{ opacity: 0.2, marginBottom: 16 }} />
            <p style={{ fontSize: 14, opacity: 0.35 }}>Chưa có ảnh nào. Thêm ảnh vào siteConfig.js nhé!</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)' }}
              onClick={closeLightbox} />
            <button onClick={closeLightbox} className="absolute z-10 hover:bg-white/10"
              style={{ top: 24, right: 24, padding: 12, borderRadius: 24, background: 'none', border: 'none', cursor: 'pointer', transition: 'background 0.1s' }}
              aria-label="Đóng">
              <X size={24} color="white" />
            </button>
            {gallery.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); goPrev(); }} className="absolute z-10 hover:bg-white/10"
                  style={{ left: 16, padding: 16, borderRadius: 24, background: 'none', border: 'none', cursor: 'pointer', transition: 'background 0.1s' }}
                  aria-label="Ảnh trước"><ChevronLeft size={28} color="white" /></button>
                <button onClick={(e) => { e.stopPropagation(); goNext(); }} className="absolute z-10 hover:bg-white/10"
                  style={{ right: 16, padding: 16, borderRadius: 24, background: 'none', border: 'none', cursor: 'pointer', transition: 'background 0.1s' }}
                  aria-label="Ảnh sau"><ChevronRight size={28} color="white" /></button>
              </>
            )}
            <motion.div key={lightboxIndex} className="relative z-10"
              style={{ maxWidth: '90vw', maxHeight: '85vh' }}
              initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.2, ease: fast }}>
              <img src={gallery[lightboxIndex]?.src} alt={gallery[lightboxIndex]?.caption || 'Photo'}
                className="rounded-lg" style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain' }} />
              {gallery[lightboxIndex]?.caption && (
                <p className="text-center" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, marginTop: 20 }}>
                  {gallery[lightboxIndex].caption}
                </p>
              )}
              <p className="text-center" style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, marginTop: 8 }}>
                {lightboxIndex + 1} / {gallery.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
