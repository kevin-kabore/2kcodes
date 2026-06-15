'use client';

import React, { useState, useEffect } from 'react';

interface TextSlideshowProps {
  prefix: string;
  items: string[];
}

const TextSlideshow: React.FC<TextSlideshowProps> = ({ prefix, items }) => {
  const [display, setDisplay] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = items[wordIndex % items.length] ?? '';
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting) {
      if (display.length < current.length) {
        // Forward typing: fast but with slight jitter so it feels human.
        timeout = setTimeout(
          () => setDisplay(current.slice(0, display.length + 1)),
          55 + Math.random() * 75,
        );
      } else {
        // Hold the full phrase, then start deleting.
        timeout = setTimeout(() => setDeleting(true), 1600);
      }
    } else {
      if (display.length > 0) {
        // Fast, steady backspace.
        timeout = setTimeout(() => setDisplay(current.slice(0, display.length - 1)), 28);
      } else {
        // Cleared: brief beat, then advance to the next phrase.
        timeout = setTimeout(() => {
          setDeleting(false);
          setWordIndex(i => (i + 1) % items.length);
        }, 350);
      }
    }

    return () => clearTimeout(timeout);
  }, [display, deleting, wordIndex, items]);

  return (
    <span className="inline-block">
      <span>{prefix} </span>
      <span className="text-purple-400">{display}</span>
      <span className="text-purple-400 animate-pulse" aria-hidden="true">
        |
      </span>
    </span>
  );
};

export default TextSlideshow;
