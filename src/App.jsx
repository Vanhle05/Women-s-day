import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import storageService from './services/storageService';
import AccessPage from './pages/AccessPage';
import HomePage from './pages/HomePage';
import MusicPage from './pages/MusicPage';
import LetterPage from './pages/LetterPage';
import GalleryPage from './pages/GalleryPage';
import WishesPage from './pages/WishesPage';
import Toast from './components/Toast';
import BackgroundScene from './components/BackgroundScene';

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [toasts, setToasts] = useState([]);
  const location = useLocation();

  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <>
      <BackgroundScene />
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <AccessPage key="access" onUnlock={handleUnlock} />
        ) : (
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/music" element={<MusicPage addToast={addToast} />} />
            <Route path="/letter" element={<LetterPage addToast={addToast} />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/wishes" element={<WishesPage addToast={addToast} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </AnimatePresence>
      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  );
}

export default App;
