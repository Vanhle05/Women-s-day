import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ThumbsDown } from "lucide-react";
/**
 * ScratchCard component — Canvas-based scratch-to-reveal.
 * Supports mouse and touch. Reveals password after ~75% scratched.
 */
export default function ScratchCard({ password, onComplete }) {
  const canvasRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  const scratchPercent = useRef(0);

  const CARD_WIDTH = 280;
  const CARD_HEIGHT = 120;

  const drawCover = useCallback((ctx) => {
    // Champagne/holographic gradient cover
    const gradient = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT);
    gradient.addColorStop(0, '#D8C3A5');
    gradient.addColorStop(0.3, '#E8D5BC');
    gradient.addColorStop(0.5, '#D8C3A5');
    gradient.addColorStop(0.7, '#C9B496');
    gradient.addColorStop(1, '#D8C3A5');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

    // Shimmer lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 40 - 20, 0);
      ctx.lineTo(i * 40 + 20, CARD_HEIGHT);
      ctx.stroke();
    }

    // Text
    ctx.fillStyle = 'rgba(41, 37, 34, 0.6)';
    ctx.font = '500 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Cào đe', CARD_WIDTH / 2, CARD_HEIGHT / 2);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = CARD_WIDTH;
    canvas.height = CARD_HEIGHT;
    drawCover(ctx);
  }, [drawCover]);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const scratch = (e) => {
    if (!isScratching || isRevealed) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 18, 0, Math.PI * 2);
    ctx.fill();

    // Calculate scratch percentage
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparentPixels = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparentPixels++;
    }
    const totalPixels = imageData.data.length / 4;
    scratchPercent.current = (transparentPixels / totalPixels) * 100;

    if (scratchPercent.current > 75) {
      setIsRevealed(true);
      // Clear remaining cover
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (onComplete) onComplete();
    }
  };

  const handleStart = (e) => {
    e.preventDefault();
    setIsScratching(true);
    scratch(e);
  };

  const handleMove = (e) => {
    e.preventDefault();
    scratch(e);
  };

  const handleEnd = () => {
    setIsScratching(false);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs opacity-50 text-center">
        Bé iu kém quá 👎
      </p>
      <div
        className="relative rounded-2xl overflow-hidden w-full max-w-[280px]"
        style={{
          aspectRatio: `${CARD_WIDTH} / ${CARD_HEIGHT}`,
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 4px 16px rgba(41,37,34,0.08)',
        }}
      >
        {/* Password underneath */}
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          <motion.span
            className="text-lg font-medium tracking-wide"
            style={{ color: '#292522', fontFamily: 'var(--font-sans)' }}
            initial={false}
            animate={isRevealed ? { scale: [1, 1.05, 1], opacity: 1 } : { opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {password}
          </motion.span>
        </div>

        {/* Scratch canvas on top */}
        <canvas
          ref={canvasRef}
          className="scratch-canvas absolute inset-0 w-full h-full"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </div>
      {isRevealed && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-center opacity-60"
        >
          Thực ra chỉ là tổng sn anh + sn em + ngày tháng năm mình bắt đầu thui
        </motion.p>
      )}
    </div>
  );
}
