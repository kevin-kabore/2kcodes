'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface TextSlideshowProps {
  prefix: string;
  items: string[];
}

const TextSlideshow: React.FC<TextSlideshowProps> = ({ prefix, items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const getNextIndex = useCallback(() => {
    return (currentIndex + 1) % items.length;
  }, [currentIndex, items.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex(getNextIndex());
        setIsVisible(true);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, [getNextIndex]);

  return (
    <div className="inline-block">
      <span>{prefix} </span>
      <motion.span
        key={currentIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isVisible ? 1 : 0, 
          y: isVisible ? 0 : -20 
        }}
        transition={{ duration: 0.5 }}
        className="text-purple-400"
      >
        {items[currentIndex]}
      </motion.span>
    </div>
  );
};

export default TextSlideshow;