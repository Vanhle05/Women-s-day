import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import siteConfig from '../config/siteConfig';

const fast = [0.16, 1, 0.3, 1];

export default function MusicPage({ addToast }) {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const { music } = siteConfig;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 1.0;
    const tryAutoplay = async () => { try { await audio.play(); setIsPlaying(true); } catch { setNeedsInteraction(true); } };
    if (audioLoaded) tryAutoplay();
    return () => { if (audio) { audio.pause(); audio.currentTime = 0; } };
  }, [audioLoaded]);

  const handleLoadedMetadata = () => { if (audioRef.current) { setDuration(audioRef.current.duration); setAudioLoaded(true); } };
  const handleTimeUpdate = () => { if (audioRef.current) setCurrentTime(audioRef.current.currentTime); };

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => {
        setIsPlaying(true);
        setNeedsInteraction(false);
      }).catch(err => {
        console.warn('Audio play error:', err);
      });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const clickPos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = clickPos * duration;
  };

  const formatTime = (t) => {
    if (!t || isNaN(t)) return '0:00';
    return `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, '0')}`;
  };
  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ padding: '32px 24px' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.button className="fixed btn-secondary z-20" style={{ top: 24, left: 24 }}
        onClick={() => navigate('/')}
        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, ease: fast }}
        whileTap={{ scale: 0.95 }} aria-label="Quay về trang chính">
        <ArrowLeft size={16} /><span style={{ fontSize: 12 }}>Quay lại</span>
      </motion.button>

      <audio
        ref={audioRef}
        src={encodeURI(music.audioSrc)}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => {
          setIsPlaying(true);
          setNeedsInteraction(false);
          setAudioError(false);
        }}
        onPause={() => setIsPlaying(false)}
        onError={() => setAudioError(true)}
        onEnded={() => setIsPlaying(false)}
        preload="auto"
      />

      <motion.div
        className="liquid-glass-strong rounded-3xl overflow-hidden specular-shine w-full"
        style={{ maxWidth: 460 }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: fast }}
      >
        {/* Cover */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1/1' }}>
          {music.coverSrc ? (
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${music.coverSrc})`, backgroundColor: 'rgba(216,195,165,0.3)' }}
              animate={isPlaying ? { scale: [1, 1.02, 1] } : { scale: 1 }}
              transition={isPlaying ? { duration: 8, repeat: Infinity, ease: 'easeInOut' } : {}}
            />
          ) : (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
              style={{
                background: 'radial-gradient(ellipse at center, #F5EFEB 0%, #E8DCD1 55%, #D6BBA5 100%)',
              }}
            >
              {/* Spinning vinyl record fallback */}
              <motion.div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: '58%',
                  height: '58%',
                  background: 'radial-gradient(circle, #2d2825 0%, #1a1715 100%)',
                  border: '8px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 20px 40px rgba(41, 37, 34, 0.28), inset 0 0 24px rgba(0, 0, 0, 0.7)',
                }}
                animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={isPlaying ? { duration: 12, repeat: Infinity, ease: 'linear' } : { duration: 0.4 }}
              >
                {/* Vinyl grooves rings */}
                <div
                  className="rounded-full flex items-center justify-center"
                  style={{
                    width: '74%',
                    height: '74%',
                    border: '1px dashed rgba(255, 255, 255, 0.16)',
                  }}
                >
                  {/* Center label */}
                  <div
                    className="rounded-full flex items-center justify-center text-center shadow-inner"
                    style={{
                      width: '46%',
                      height: '46%',
                      background: 'linear-gradient(135deg, #D8A7A7 0%, #D8C3A5 100%)',
                      border: '2px solid rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    <span style={{ fontSize: 20 }}>🎧</span>
                  </div>
                </div>
              </motion.div>

              <p
                className="heading-serif"
                style={{
                  marginTop: 20,
                  fontSize: 15,
                  color: 'rgba(41, 37, 34, 0.65)',
                  fontStyle: 'italic',
                  letterSpacing: '0.04em',
                }}
              >
                A melody for you
              </p>
            </div>
          )}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(41,37,34,0.55) 0%, transparent 45%)' }} />

          {isPlaying && (
            <div className="absolute flex items-end pointer-events-none" style={{ bottom: 20, left: '50%', transform: 'translateX(-50%)', gap: 4 }}>
              {[...Array(5)].map((_, i) => (
                <motion.div key={i} className="rounded-full" style={{ width: 3, background: 'rgba(255,255,255,0.7)' }}
                  animate={{ height: [8, 16 + Math.random() * 16, 8] }}
                  transition={{ duration: 0.4 + Math.random() * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.08 }} />
              ))}
            </div>
          )}

          {audioError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <AlertCircle size={32} color="white" style={{ marginBottom: 12, opacity: 0.7 }} />
              <p className="text-center" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, padding: '0 40px' }}>
                Chưa tìm thấy file nhạc.<br /><span style={{ fontSize: 12, opacity: 0.6 }}>Kiểm tra đường dẫn file trong siteConfig.js</span>
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="music-controls" style={{ padding: '36px 40px 32px' }}>
          <h2 className="heading-serif" style={{ fontSize: 'clamp(22px, 3vw, 28px)', color: '#292522', marginBottom: 6 }}>
            {music.title}
          </h2>
          <p style={{ fontSize: 12, opacity: 0.4, marginBottom: 28 }}>{music.description}</p>

          <div ref={progressRef} className="w-full rounded-full cursor-pointer relative overflow-hidden"
            style={{ height: 6, background: 'rgba(41,37,34,0.08)', marginBottom: 12 }}
            onClick={handleProgressClick} role="slider" aria-label="Tiến trình bài hát">
            <div className="absolute top-0 left-0 h-full rounded-full"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #D8A7A7, #C9918F)', transition: 'width 0.1s linear' }} />
          </div>

          <div className="flex justify-between" style={{ fontSize: 11, opacity: 0.3, marginBottom: 24 }}>
            <span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span>
          </div>

          <div className="flex items-center justify-center" style={{ gap: 20 }}>
            <button
              type="button"
              onClick={() => {
                const a = audioRef.current;
                if (a) {
                  a.muted = !a.muted;
                  setIsMuted(!isMuted);
                }
              }}
              style={{
                padding: 12,
                borderRadius: 12,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.1s',
              }}
              className="hover:bg-white/10"
              aria-label={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {isMuted ? (
                <VolumeX size={18} strokeWidth={1.5} style={{ opacity: 0.35 }} />
              ) : (
                <Volume2 size={18} strokeWidth={1.5} style={{ opacity: 0.35 }} />
              )}
            </button>

            <motion.button
              type="button"
              onClick={togglePlay}
              whileTap={{ scale: 0.92 }}
              className="flex items-center justify-center cursor-pointer shadow-lg active:scale-95 transition-shadow"
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                background: '#292522',
                color: '#F7F3ED',
                border: 'none',
              }}
              aria-label={isPlaying ? 'Tạm dừng' : 'Phát nhạc'}
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" style={{ marginLeft: 3 }} />}
            </motion.button>

            <div style={{ width: 42 }} />
          </div>

          {needsInteraction && !isPlaying && !audioError && (
            <p className="text-center" style={{ fontSize: 12, opacity: 0.35, marginTop: 20 }}>Nhấn nút Play để bắt đầu nghe nhé</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
