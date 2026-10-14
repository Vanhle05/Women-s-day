import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  X,
  ChevronLeft,
  ChevronRight,
  Orbit,
  Grid,
  Sparkles,
  Heart,
  ImageOff
} from 'lucide-react';
import siteConfig from '../config/siteConfig';

const fast = [0.16, 1, 0.3, 1];

export default function GalleryPage() {
  const navigate = useNavigate();
  const { gallery = [] } = siteConfig;

  // View mode: '3d' (scattered cosmos) or 'grid' (scrollable bento grid)
  const [viewMode, setViewMode] = useState('3d');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [errorImages, setErrorImages] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // References for direct DOM transform (ZERO lag, 60-120fps GPU hardware acceleration)
  const carouselRef = useRef(null);
  const canvasRef = useRef(null);
  const isLightboxOpen = lightboxIndex !== null;

  // 3D angles held in refs to avoid React re-rendering churn on every mousemove
  const anglesRef = useRef({
    yaw: 0,
    pitch: 0,
    vx: 0,
    vy: 0,
  });

  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    totalDist: 0,
  });

  const gridTouchRef = useRef({
    startX: 0,
    startY: 0,
    hasMoved: false,
  });

  // Check mobile width
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ── Precompute scattered 3D celestial coordinates for each photo ──
  // Distributes 19 photos across 360° horizontally & vertically in 3D space
  const scatteredPhotos = useMemo(() => {
    const N = Math.max(gallery.length, 1);
    const baseDist = isMobile ? 480 : 760;
    const tiers = [-26, -10, 8, 24];

    return gallery.map((item, index) => {
      const tierIndex = index % tiers.length;
      const baseElev = tiers[tierIndex];

      const goldenOffset = (index * (360 / N) + (tierIndex * 47)) % 360;
      const jitterAzimuth = Math.sin(index * 13.7) * 14;
      const jitterElev = Math.cos(index * 29.3) * 6;

      const azimuth = (goldenOffset + jitterAzimuth + 360) % 360;
      const elevation = Math.max(-36, Math.min(36, baseElev + jitterElev));

      const distVariance = ((index % 3) - 1) * (isMobile ? 35 : 70);
      const distance = baseDist + distVariance;
      const roll = Math.sin(index * 7.9) * 6;

      return {
        ...item,
        originalIndex: index,
        azimuth,
        elevation,
        distance,
        roll,
      };
    });
  }, [gallery, isMobile]);

  // ── Direct GPU Transform Loop (No React re-render lag) ──
  useEffect(() => {
    if (viewMode !== '3d') return;
    let animId;

    const updateTransform = () => {
      const angles = anglesRef.current;
      const drag = dragRef.current;

      if (!drag.isDragging) {
        // Friction decay on momentum
        if (Math.abs(angles.vx) > 0.005 || Math.abs(angles.vy) > 0.005) {
          angles.vx *= 0.93;
          angles.vy *= 0.93;
          angles.yaw += angles.vx;
          angles.pitch = Math.max(-36, Math.min(36, angles.pitch + angles.vy));
        }
      }

      if (carouselRef.current) {
        carouselRef.current.style.transform = `rotateX(${angles.pitch.toFixed(2)}deg) rotateY(${angles.yaw.toFixed(2)}deg)`;
      }

      animId = requestAnimationFrame(updateTransform);
    };

    animId = requestAnimationFrame(updateTransform);
    return () => cancelAnimationFrame(animId);
  }, [viewMode]);

  // ── High Performance Canvas Cosmos (Lightweight, 60fps) ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 100 lightweight stars
    const stars = Array.from({ length: 100 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.02 + 0.005,
      color: ['#FFFFFF', '#FFEBEB', '#FFF5E4', '#E8DDFF', '#D8A7A7'][Math.floor(Math.random() * 5)],
    }));

    // Meteors
    const meteors = [];
    let lastMeteor = Date.now();

    const spawnMeteor = () => {
      meteors.push({
        x: Math.random() * w * 0.8 + w * 0.1,
        y: Math.random() * h * 0.4,
        len: Math.random() * 80 + 40,
        spd: Math.random() * 8 + 6,
        alpha: 1,
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      // Deep space gradient
      const bg = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.8);
      bg.addColorStop(0, '#150D24');
      bg.addColorStop(0.55, '#0B0715');
      bg.addColorStop(1, '#050308');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Draw stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.alpha += s.speed;
        if (s.alpha > 0.95 || s.alpha < 0.2) s.speed = -s.speed;
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Shooting star
      if (Date.now() - lastMeteor > 3500 && Math.random() < 0.3) {
        spawnMeteor();
        lastMeteor = Date.now();
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.spd * 0.7;
        m.y += m.spd * 0.7;
        m.alpha -= 0.02;

        if (m.alpha <= 0) {
          meteors.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = `rgba(255, 235, 225, ${m.alpha})`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(m.x - m.len * 0.7, m.y - m.len * 0.7);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // ── Drag & Touch Handlers (Only active in 3D mode) ──
  const handlePointerDown = (e) => {
    if (viewMode !== '3d' || isLightboxOpen) return;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;

    dragRef.current = {
      isDragging: true,
      startX: clientX,
      startY: clientY,
      lastX: clientX,
      lastY: clientY,
      totalDist: 0,
    };
    anglesRef.current.vx = 0;
    anglesRef.current.vy = 0;
  };

  const handlePointerMove = (e) => {
    const drag = dragRef.current;
    if (!drag.isDragging || viewMode !== '3d') return;

    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;

    const dx = clientX - drag.lastX;
    const dy = clientY - drag.lastY;

    drag.totalDist += Math.hypot(dx, dy);

    const rotSpeedX = isMobile ? 0.32 : 0.22;
    const rotSpeedY = isMobile ? 0.22 : 0.16;

    const angles = anglesRef.current;
    angles.yaw += dx * rotSpeedX;
    angles.pitch = Math.max(-36, Math.min(36, angles.pitch - dy * rotSpeedY));

    angles.vx = dx * rotSpeedX;
    angles.vy = -dy * rotSpeedY;

    drag.lastX = clientX;
    drag.lastY = clientY;
  };

  const handlePointerUp = () => {
    dragRef.current.isDragging = false;
  };

  // Lightbox handlers
  const openLightbox = (i) => {
    if (dragRef.current.totalDist > 8) return;
    setLightboxIndex(i);
  };

  const handleGridTouchStart = (e) => {
    const touch = e.touches[0];
    gridTouchRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      hasMoved: false,
    };
  };

  const handleGridTouchMove = (e) => {
    const touch = e.touches[0];
    const dist = Math.hypot(
      touch.clientX - gridTouchRef.current.startX,
      touch.clientY - gridTouchRef.current.startY
    );
    if (dist > 8) {
      gridTouchRef.current.hasMoved = true;
    }
  };

  const handleGridCardClick = (index) => {
    if (gridTouchRef.current.hasMoved) return;
    setLightboxIndex(index);
  };

  const closeLightbox = () => setLightboxIndex(null);

  const goNext = useCallback(() => {
    if (lightboxIndex === null || gallery.length === 0) return;
    setLightboxIndex((lightboxIndex + 1) % gallery.length);
  }, [lightboxIndex, gallery.length]);

  const goPrev = useCallback(() => {
    if (lightboxIndex === null || gallery.length === 0) return;
    setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length);
  }, [lightboxIndex, gallery.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };

    window.addEventListener('keydown', handleKey);
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen, goNext, goPrev]);

  // Card dimensions: compact floating celestial polaroids (delicate and starry, not oversized)
  const cardW = isMobile ? 80 : 125;
  const cardH = isMobile ? 106 : 166;

  return (
    <div
      className={`cosmos-viewport ${viewMode === 'grid' ? 'grid-mode' : ''}`}
      onMouseDown={viewMode === '3d' ? handlePointerDown : undefined}
      onMouseMove={viewMode === '3d' ? handlePointerMove : undefined}
      onMouseUp={viewMode === '3d' ? handlePointerUp : undefined}
      onTouchStart={viewMode === '3d' ? handlePointerDown : undefined}
      onTouchMove={viewMode === '3d' ? handlePointerMove : undefined}
      onTouchEnd={viewMode === '3d' ? handlePointerUp : undefined}
    >
      {/* Dynamic Cosmic Starfield Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── TOP HUD NAVIGATION BAR ── */}
      <div
        className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between"
        style={{
          padding: isMobile ? '12px 14px' : '20px 32px',
          background: 'linear-gradient(to bottom, rgba(5, 3, 9, 0.85) 0%, rgba(5, 3, 9, 0.4) 70%, transparent 100%)',
          pointerEvents: 'none',
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="cosmos-hud-btn pointer-events-auto"
          style={{
            padding: isMobile ? '7px 12px' : '10px 18px',
            fontSize: isMobile ? 12 : 13,
            flexShrink: 0,
          }}
          aria-label="Quay về trang chính"
        >
          <ArrowLeft size={isMobile ? 14 : 16} />
          <span>Quay lại</span>
        </button>

        {/* Center Title Indicator */}
        <div className="text-center pointer-events-none px-2 min-w-0">
          <h1
            className="heading-serif tracking-wide truncate"
            style={{
              fontSize: isMobile ? 16 : 22,
              color: '#F7F3ED',
              textShadow: '0 0 16px rgba(216, 167, 167, 0.6)',
              lineHeight: 1.2,
            }}
          >
            Vũ Trụ Kỷ Niệm
          </h1>
        </div>

        {/* View Mode Toggle: 3D Universe ⇄ Grid View */}
        <div className="flex items-center pointer-events-auto">
          <button
            onClick={() => setViewMode(viewMode === '3d' ? 'grid' : '3d')}
            className={`cosmos-hud-btn ${viewMode === 'grid' ? 'active' : ''}`}
            style={{
              padding: isMobile ? '7px 12px' : '10px 18px',
              fontSize: isMobile ? 12 : 13,
              flexShrink: 0,
            }}
            title="Đổi góc nhìn"
          >
            {viewMode === '3d' ? (
              <>
                <span>{isMobile ? 'Lưới' : 'Dạng lưới'}</span>
              </>
            ) : (
              <>
                <span>{isMobile ? '3D' : 'Vũ trụ 3D'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── 3D SCATTERED CELESTIAL UNIVERSE ── */}
      {viewMode === '3d' ? (
        <div className="cosmos-scene">
          {/* Ambient Starlight Core in Center */}
          <div
            style={{
              position: 'absolute',
              width: 160,
              height: 160,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(216, 167, 167, 0.18) 0%, rgba(180, 140, 200, 0.06) 50%, transparent 70%)',
              filter: 'blur(20px)',
              pointerEvents: 'none',
            }}
          />

          {/* 3D Cosmos Space Track: updated via direct DOM ref (ZERO lag) */}
          <div ref={carouselRef} className="cosmos-carousel">
            {scatteredPhotos.map((photo) => {
              const { originalIndex, azimuth, elevation, distance, roll } = photo;

              // Spherical scattering transform
              const transformString = `
                rotateY(${azimuth}deg) 
                rotateX(${elevation}deg) 
                translateZ(${distance}px) 
                rotateX(${-elevation}deg) 
                rotateY(${-azimuth}deg) 
                rotateZ(${roll}deg)
              `;

              return (
                <div
                  key={originalIndex}
                  className="cosmos-card"
                  onClick={() => openLightbox(originalIndex)}
                  style={{
                    width: cardW,
                    height: cardH,
                    marginLeft: -cardW / 2,
                    marginTop: -cardH / 2,
                    transform: transformString,
                  }}
                >
                  <div className="cosmos-card-inner">
                    {!errorImages[originalIndex] ? (
                      <>
                        {!loadedImages[originalIndex] && (
                          <div
                            className="absolute inset-0 flex items-center justify-center animate-pulse"
                            style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                          >
                            <Heart size={20} color="#D8A7A7" style={{ opacity: 0.4 }} />
                          </div>
                        )}
                        <img
                          src={photo.src}
                          alt={photo.caption || 'Kỷ niệm'}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          style={{
                            opacity: loadedImages[originalIndex] ? 1 : 0,
                            transition: 'opacity 0.25s ease',
                          }}
                          onLoad={() => setLoadedImages(p => ({ ...p, [originalIndex]: true }))}
                          onError={() => setErrorImages(p => ({ ...p, [originalIndex]: true }))}
                        />
                      </>
                    ) : (
                      /* Fallback when image file is missing */
                      <div
                        className="w-full h-full flex flex-col items-center justify-center p-4 text-center"
                        style={{
                          background: 'radial-gradient(circle, rgba(216, 167, 167, 0.12) 0%, rgba(15, 10, 22, 0.95) 100%)',
                        }}
                      >
                        <Heart size={26} color="#D8A7A7" style={{ opacity: 0.6, marginBottom: 8 }} />
                        <span style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.5)' }}>
                          Bấm để xem
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ── BENTO GRID VIEW MODE (Full Native Scroll Support for Desktop & Mobile) ── */
        <div
          className="cosmos-grid-scroll"
          onTouchStart={handleGridTouchStart}
          onTouchMove={handleGridTouchMove}
          style={{
            paddingTop: isMobile ? '84px' : '96px',
            paddingBottom: 'max(90px, env(safe-area-inset-bottom, 90px))',
            paddingLeft: isMobile ? '16px' : '32px',
            paddingRight: isMobile ? '16px' : '32px',
          }}
        >
          <div className="mx-auto" style={{ maxWidth: 1100, minHeight: '100%' }}>
            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
              style={{ gap: isMobile ? 12 : 18 }}
            >
              {gallery.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleGridCardClick(index)}
                  className="relative rounded-2xl overflow-hidden cursor-pointer group active:scale-95 transition-transform duration-150"
                  style={{
                    aspectRatio: '3/4',
                    background: '#150F20',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                    transform: 'translateZ(0)',
                  }}
                >
                  {!errorImages[index] ? (
                    <img
                      src={item.src}
                      alt={item.caption || 'Kỷ niệm'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                      onError={() => setErrorImages(p => ({ ...p, [index]: true }))}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
                      <ImageOff size={22} className="opacity-40 text-white mb-2" />
                      <p className="text-white text-xs opacity-60">Chưa có ảnh</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── IMMERSIVE CELESTIAL LIGHTBOX MODAL (Shows Caption & #) ── */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0"
              style={{
                background: 'rgba(3, 2, 7, 0.9)',
                backdropFilter: 'blur(16px)',
              }}
              onClick={closeLightbox}
            />

            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute z-20 cosmos-hud-btn"
              style={{
                top: 24,
                right: 24,
                width: 44,
                height: 44,
                padding: 0,
                borderRadius: '50%',
              }}
              aria-label="Đóng ảnh"
            >
              <X size={20} color="#F7F3ED" />
            </button>

            {/* Navigation Arrows */}
            {gallery.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  className="absolute z-20 cosmos-hud-btn"
                  style={{
                    left: isMobile ? 12 : 28,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 48,
                    height: 48,
                    padding: 0,
                    borderRadius: '50%',
                  }}
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft size={24} color="#F7F3ED" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  className="absolute z-20 cosmos-hud-btn"
                  style={{
                    right: isMobile ? 12 : 28,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 48,
                    height: 48,
                    padding: 0,
                    borderRadius: '50%',
                  }}
                  aria-label="Ảnh sau"
                >
                  <ChevronRight size={24} color="#F7F3ED" />
                </button>
              </>
            )}

            {/* Photo Card with Caption */}
            <motion.div
              key={lightboxIndex}
              className="relative z-10 flex flex-col items-center"
              style={{
                maxWidth: isMobile ? '92vw' : '82vw',
                maxHeight: '90vh',
              }}
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ duration: 0.2, ease: fast }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Frame */}
              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(20, 15, 30, 0.6)',
                  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(216, 167, 167, 0.25)',
                }}
              >
                {!errorImages[lightboxIndex] ? (
                  <img
                    src={gallery[lightboxIndex]?.src}
                    alt={gallery[lightboxIndex]?.caption || 'Photo'}
                    style={{
                      maxHeight: isMobile ? '65vh' : '72vh',
                      maxWidth: isMobile ? '90vw' : '75vw',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                ) : (
                  <div
                    className="flex flex-col items-center justify-center p-12 text-center"
                    style={{ minWidth: 280, minHeight: 280 }}
                  >
                    <ImageOff size={42} color="#D8A7A7" style={{ opacity: 0.5, marginBottom: 16 }} />
                    <p style={{ color: '#F7F3ED', fontSize: 16 }}>Ảnh đang cập nhật</p>
                  </div>
                )}
              </div>

              {/* Romantic Caption Card */}
              <div
                className="mt-4 px-6 py-3 rounded-2xl text-center"
                style={{
                  background: 'rgba(15, 10, 24, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  maxWidth: isMobile ? '90vw' : 580,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
              >
                {gallery[lightboxIndex]?.caption ? (
                  <h2
                    className="heading-serif"
                    style={{
                      fontSize: isMobile ? 16 : 20,
                      color: '#F7F3ED',
                      letterSpacing: '0.02em',
                      lineHeight: 1.4,
                    }}
                  >
                    {gallery[lightboxIndex].caption}
                  </h2>
                ) : (
                  <p
                    className="heading-serif"
                    style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    Khoảnh khắc kỷ niệm ngọt ngào
                  </p>
                )}

                <div className="flex items-center justify-center gap-2 mt-2">
                  <span style={{ fontSize: 11, color: '#D8A7A7', fontWeight: 600 }}>
                    {lightboxIndex + 1}
                  </span>
                  <span style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.3)' }}>/</span>
                  <span style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.5)' }}>
                    {gallery.length}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
