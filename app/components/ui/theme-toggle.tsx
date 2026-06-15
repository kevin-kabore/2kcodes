'use client';

import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  if (!mounted) {
    return (
      <div className="relative w-8 h-8 rounded-md flex items-center justify-center">
        <div className="relative w-4 h-4">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative w-8 h-8 rounded-md hover:bg-muted/50 flex items-center justify-center transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} theme`}
    >
      <div className="relative w-4 h-4">
        {/* Sun icon */}
        <motion.svg
          className="absolute inset-0 w-4 h-4 text-yellow-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          animate={{
            scale: resolvedTheme === 'light' ? 1 : 0,
            opacity: resolvedTheme === 'light' ? 1 : 0,
            rotate: resolvedTheme === 'light' ? 0 : 180,
          }}
          transition={{ duration: 0.2 }}
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </motion.svg>

        {/* Moon icon */}
        <motion.svg
          className="absolute inset-0 w-4 h-4 text-purple-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          animate={{
            scale: resolvedTheme === 'dark' ? 1 : 0,
            opacity: resolvedTheme === 'dark' ? 1 : 0,
            rotate: resolvedTheme === 'dark' ? 0 : -180,
          }}
          transition={{ duration: 0.2 }}
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </motion.svg>
      </div>
    </button>
  );
}