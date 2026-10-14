import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Music, Mail, Image, Heart } from 'lucide-react';
import siteConfig from '../config/siteConfig';

const navItems = [
  {
    key: 'music',
    path: '/music',
    icon: Music,
    title: 'Music',
    subtitle: 'Vô xem ca sĩ hát em',
    gradient: 'linear-gradient(135deg, rgba(216,167,167,0.2) 0%, rgba(216,195,165,0.1) 100%)',
  },
  {
    key: 'letter',
    path: '/letter',
    icon: Mail,
    title: 'Letter',
    subtitle: 'Vô xem thi sĩ tâm sự em',
    gradient: 'linear-gradient(135deg, rgba(216,195,165,0.2) 0%, rgba(247,243,237,0.1) 100%)',
  },
  {
    key: 'gallery',
    path: '/gallery',
    icon: Image,
    title: 'Memories',
    subtitle: 'Vô xem ảnh em và anh cùng sĩ',
    gradient: 'linear-gradient(135deg, rgba(201,145,143,0.15) 0%, rgba(216,195,165,0.1) 100%)',
  },
  {
    key: 'wishes',
    path: '/wishes',
    icon: Heart,
    title: 'Wishes',
    subtitle: 'Nhắn nhủ gì anh hong',
    gradient: 'linear-gradient(135deg, rgba(216,195,165,0.15) 0%, rgba(216,167,167,0.1) 100%)',
  },
];

// Fast, crisp easing - no spring bounce
const fastEase = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: fastEase } },
};

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ padding: '48px 32px' }}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {/* Header */}
      <motion.div className="text-center" style={{ marginBottom: 64 }} variants={itemVariants}>
        <p
          className="tracking-[0.3em] uppercase opacity-40"
          style={{ fontSize: 11, fontFamily: 'var(--font-sans)', marginBottom: 20 }}
        >
          {siteConfig.occasion}
        </p>
        <h1
          className="heading-serif"
          style={{ fontSize: 'clamp(40px, 7vw, 72px)', color: '#292522', marginBottom: 20 }}
        >
          {siteConfig.greeting}
        </h1>
        <p
          className="max-w-md mx-auto leading-relaxed"
          style={{ fontSize: 14, color: 'rgba(41,37,34,0.45)' }}
        >
          {siteConfig.introText}
        </p>
      </motion.div>

      {/* Navigation Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 w-full max-w-[740px]"
        style={{ gap: 20 }}
        variants={containerVariants}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.key}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.15, ease: fastEase } }}
              whileTap={{ scale: 0.97, transition: { duration: 0.08 } }}
              onClick={() => navigate(item.path)}
              className="liquid-glass-card text-left cursor-pointer group"
              style={{ padding: '36px 36px 32px', background: item.gradient }}
              aria-label={`Mở ${item.title}`}
            >
              <div className="flex items-start justify-between" style={{ marginBottom: 20 }}>
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}
                >
                  <Icon size={18} strokeWidth={1.5} color="#292522" />
                </div>
                <div
                  className="flex items-center justify-center opacity-0 group-hover:opacity-100"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    background: 'rgba(41,37,34,0.06)',
                    transition: 'opacity 0.12s ease',
                  }}
                >
                  <span style={{ fontSize: 13, color: '#292522' }}>→</span>
                </div>
              </div>
              <h2
                className="heading-serif"
                style={{ fontSize: 'clamp(22px, 3vw, 28px)', color: '#292522', marginBottom: 6 }}
              >
                {item.title}
              </h2>
              <p style={{ fontSize: 12, opacity: 0.4, lineHeight: 1.5 }}>{item.subtitle}</p>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Footer whisper */}
      <motion.p
        variants={itemVariants}
        className="opacity-20"
        style={{ fontFamily: 'var(--font-hand)', fontSize: 17, marginTop: 56 }}
      >
        Made with love, just for you ♡
      </motion.p>
    </motion.div>
  );
}
