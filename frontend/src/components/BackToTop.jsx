import React, { useState, useEffect } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40 bg-primary text-white w-11 h-11 rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 hover:scale-110 transition-all"
      title="Back to top"
    >
      <span className="material-symbols-outlined text-sm">arrow_upward</span>
    </button>
  );
}
