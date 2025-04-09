import React, { useEffect, useState } from 'react';
import './style.css';

const ScrollBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = (scrollTop / scrollHeight) * 100;
      setProgress(percent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="scrollbar-container">
      <div className="scrollbar-progress" style={{ height: `${progress}%` }} />
    </div>
  );
};

export default ScrollBar;
