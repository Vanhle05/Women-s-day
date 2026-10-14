import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, SkipForward, MessageCircle, Send, X, Volume2, VolumeX } from 'lucide-react';
import siteConfig from '../config/siteConfig';
import storageService from '../services/storageService';

const fast = [0.16, 1, 0.3, 1];
const TROLL_TEXT = 'Góp ý cái gièeeeeeee';

const getTrollText = (len) => {
  if (len <= 0) return '';
  if (len <= TROLL_TEXT.length) {
    return TROLL_TEXT.slice(0, len);
  }
  const extraE = Math.min(len - TROLL_TEXT.length, 60);
  return TROLL_TEXT + 'e'.repeat(extraE);
};

export default function LetterPage({ addToast }) {
  const navigate = useNavigate();
  const { letter } = siteConfig;
  const [isTyping, setIsTyping] = useState(true);
  const [displayedText, setDisplayedText] = useState([]);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState('');
  const [showEnvelope, setShowEnvelope] = useState(true);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const voiceAudioRef = useRef(null);
  const typingInterval = useRef(null);
  const fullText = letter.paragraphs;

  useEffect(() => {
    const saved = storageService.getFeedback();
    if (saved) {
      setFeedbackSubmitted(true);
      setSavedFeedback(saved);
    }
  }, []);

  // Cleanup voice audio when unmounting
  useEffect(() => {
    return () => {
      if (voiceAudioRef.current) {
        voiceAudioRef.current.pause();
        voiceAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isTyping || showEnvelope) return;
    if (currentParagraph >= fullText.length) { setIsTyping(false); return; }
    const paragraph = fullText[currentParagraph];
    if (currentChar >= paragraph.length) {
      setTimeout(() => { setCurrentParagraph(p => p + 1); setCurrentChar(0); }, 200);
      return;
    }
    typingInterval.current = setTimeout(() => {
      setDisplayedText(prev => {
        const t = [...prev];
        if (!t[currentParagraph]) t[currentParagraph] = '';
        t[currentParagraph] = paragraph.substring(0, currentChar + 1);
        return t;
      });
      setCurrentChar(p => p + 1);
    }, 20 + Math.random() * 15);
    return () => clearTimeout(typingInterval.current);
  }, [isTyping, currentParagraph, currentChar, fullText, showEnvelope]);

  const handleOpenLetter = () => {
    setShowEnvelope(false);
    if (letter.voiceSrc) {
      try {
        if (!voiceAudioRef.current) {
          const audio = new Audio(letter.voiceSrc);
          audio.volume = 1.0;
          audio.onended = () => setIsPlayingVoice(false);
          audio.onerror = () => setIsPlayingVoice(false);
          voiceAudioRef.current = audio;
        }
        voiceAudioRef.current.currentTime = 0;
        voiceAudioRef.current.play()
          .then(() => setIsPlayingVoice(true))
          .catch(() => setIsPlayingVoice(false));
      } catch (err) {
        console.warn('Voice play error:', err);
      }
    }
  };

  const toggleVoice = () => {
    if (!voiceAudioRef.current && letter.voiceSrc) {
      const audio = new Audio(letter.voiceSrc);
      audio.volume = 1.0;
      audio.onended = () => setIsPlayingVoice(false);
      audio.onerror = () => setIsPlayingVoice(false);
      voiceAudioRef.current = audio;
    }
    if (!voiceAudioRef.current) return;

    if (isPlayingVoice) {
      voiceAudioRef.current.pause();
      setIsPlayingVoice(false);
    } else {
      voiceAudioRef.current.play()
        .then(() => setIsPlayingVoice(true))
        .catch(() => setIsPlayingVoice(false));
    }
  };

  const skipTyping = () => { clearTimeout(typingInterval.current); setDisplayedText([...fullText]); setCurrentParagraph(fullText.length); setIsTyping(false); };
  const replayTyping = () => {
    setDisplayedText([]);
    setCurrentParagraph(0);
    setCurrentChar(0);
    setIsTyping(true);
    if (voiceAudioRef.current) {
      voiceAudioRef.current.currentTime = 0;
      voiceAudioRef.current.play()
        .then(() => setIsPlayingVoice(true))
        .catch(() => setIsPlayingVoice(false));
    }
  };
  const typingDone = !isTyping && currentParagraph >= fullText.length;

  const handleFeedbackChange = (e) => {
    const len = e.target.value.length;
    setFeedbackText(getTrollText(len));
  };

  const handleFeedbackSubmit = () => {
    const finalFeedback = feedbackText.trim() || TROLL_TEXT;
    storageService.saveFeedback(finalFeedback);
    setSavedFeedback(finalFeedback);
    setFeedbackSubmitted(true);
    setShowFeedback(false);
    setFeedbackText('');
    if (addToast) addToast('Góp ý đã được tiếp nhận! Cảm ơn em~ 💌');
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ padding: '32px 24px' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.button
        className="fixed btn-secondary z-20"
        style={{ top: 24, left: 24 }}
        onClick={() => navigate('/')}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, ease: fast }}
        whileTap={{ scale: 0.95 }}
        aria-label="Quay về trang chính"
      >
        <ArrowLeft size={16} />
        <span style={{ fontSize: 12 }}>Quay lại</span>
      </motion.button>

      <AnimatePresence mode="wait">
        {showEnvelope ? (
          <motion.div
            key="envelope"
            className="flex flex-col items-center cursor-pointer"
            style={{ gap: 28 }}
            onClick={handleOpenLetter}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.25, ease: fast }}
          >
            <motion.div
              className="relative rounded-2xl overflow-hidden"
              style={{
                width: 300, height: 200,
                background: 'linear-gradient(135deg, #F7F3ED 0%, #EDE6DB 100%)',
                border: '1px solid rgba(216,195,165,0.4)',
                boxShadow: '0 8px 32px rgba(41,37,34,0.08)',
              }}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="absolute top-0 left-0 right-0" style={{
                height: '50%',
                background: 'linear-gradient(180deg, rgba(216,195,165,0.3) 0%, transparent 100%)',
                clipPath: 'polygon(0 0, 50% 60%, 100% 0)',
              }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex items-center justify-center" style={{
                  width: 44, height: 44, borderRadius: 22,
                  background: 'linear-gradient(135deg, #C9918F, #D8A7A7)',
                  boxShadow: '0 2px 8px rgba(201,145,143,0.3)',
                }}>
                  <span className="text-white" style={{ fontSize: 14 }}>♡</span>
                </div>
              </div>
            </motion.div>
            <p style={{ fontSize: 13, opacity: 0.35 }}>Nhấn để mở thư</p>
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            className="w-full"
            style={{ maxWidth: 640 }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: fast }}
          >
            <div
              className="letter-content rounded-2xl relative overflow-hidden"
              style={{
                padding: '48px 48px 40px',
                background: 'linear-gradient(135deg, #FAF8F4 0%, #F5F1EA 50%, #F7F3ED 100%)',
                border: '1px solid rgba(216,195,165,0.25)',
                boxShadow: '0 16px 48px rgba(41,37,34,0.06)',
              }}
            >
              <div className="absolute" style={{
                top: 20, right: 20, width: 32, height: 32, borderRadius: 16,
                background: 'linear-gradient(135deg, #D8A7A7, #C9918F)', opacity: 0.12,
              }} />

              <p className="heading-serif" style={{ fontSize: 'clamp(24px, 4vw, 32px)', color: '#292522', marginBottom: 36 }}>
                {letter.greeting}
              </p>

              <div style={{ minHeight: 200, marginBottom: 36 }}>
                {displayedText.map((para, i) => (
                  <p key={i} style={{ fontSize: 15, lineHeight: 1.85, color: 'rgba(41,37,34,0.7)', marginBottom: 16 }}>
                    {para}
                    {isTyping && i === currentParagraph && (
                      <motion.span
                        className="inline-block align-middle"
                        style={{ width: 2, height: 16, marginLeft: 2, background: '#C9918F' }}
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      />
                    )}
                  </p>
                ))}
                {isTyping && displayedText.length === 0 && (
                  <motion.span className="inline-block" style={{ width: 2, height: 16, background: '#C9918F' }}
                    animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} />
                )}
              </div>

              <AnimatePresence>
                {typingDone && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
                    <p style={{ fontSize: 14, color: 'rgba(41,37,34,0.55)', marginBottom: 8 }}>{letter.closing}</p>
                    <p className="text-hand" style={{ fontSize: 24, color: '#292522' }}>{letter.signature}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-wrap items-center" style={{ gap: 10, marginTop: 36, paddingTop: 28, borderTop: '1px solid rgba(216,195,165,0.2)' }}>
                {isTyping ? (
                  <button onClick={skipTyping} className="btn-secondary" style={{ fontSize: 12 }}>
                    <SkipForward size={14} /> Đọc ngay
                  </button>
                ) : (
                  <button onClick={replayTyping} className="btn-secondary" style={{ fontSize: 12 }}>
                    <RotateCcw size={14} /> Phát lại
                  </button>
                )}
                {letter.voiceSrc && (
                  <button
                    onClick={toggleVoice}
                    className={`btn-secondary ${isPlayingVoice ? 'text-[#C9918F] border-[#C9918F]/40' : ''}`}
                    style={{ fontSize: 12 }}
                    title={isPlayingVoice ? 'Tạm dừng giọng nói' : 'Bật giọng nói'}
                  >
                    {isPlayingVoice ? <Volume2 size={14} className="animate-pulse" /> : <VolumeX size={14} />}
                    <span>{isPlayingVoice ? 'Đang phát giọng anh' : 'Nghe giọng anh'}</span>
                  </button>
                )}
                {typingDone && (
                  <button onClick={() => { setFeedbackText(''); setShowFeedback(true); }} className="btn-secondary ml-auto" style={{ fontSize: 12 }}>
                    <MessageCircle size={14} /> Góp ý
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ padding: 24 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)' }}
              onClick={() => setShowFeedback(false)} />
            <motion.div
              className="liquid-glass-strong rounded-2xl relative z-10 w-full feedback-modal-content"
              style={{ padding: '36px 36px 32px', maxWidth: 420 }}
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.2, ease: fast }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
                <h3 className="heading-serif" style={{ fontSize: 20, color: '#292522' }}>Góp ý</h3>
                <button onClick={() => setShowFeedback(false)}
                  style={{ padding: 10, borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', transition: 'background 0.1s' }}
                  className="hover:bg-white/10" aria-label="Đóng">
                  <X size={16} />
                </button>
              </div>
              <p style={{ fontSize: 12, opacity: 0.35, marginBottom: 20 }}>Muốn gì nói luôn ?</p>
              <textarea
                value={feedbackText}
                onChange={handleFeedbackChange}
                placeholder="Nhập góp ý của em..."
                maxLength={80}
                rows={4}
                className="input-glass resize-none"
                style={{ fontSize: 14, marginBottom: 8 }}
                autoFocus
              />
              <div className="flex justify-between items-center" style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 11, opacity: 0.2 }}>{feedbackText.length}/80</p>
              </div>
              <div className="flex" style={{ gap: 12 }}>
                <button onClick={() => setShowFeedback(false)} className="btn-secondary flex-1">Hủy</button>
                <button onClick={handleFeedbackSubmit} className="btn-primary flex-1" disabled={!feedbackText.trim()}>
                  <Send size={14} /> Gửi
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
