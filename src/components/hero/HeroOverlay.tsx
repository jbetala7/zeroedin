'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface HeroOverlayProps {
  scrollProgress: number;
}

export default function HeroOverlay({ scrollProgress }: HeroOverlayProps) {
  const showTitle = scrollProgress < 0.15;
  const showCTA = scrollProgress > 0.92;

  return (
    <div className="fixed inset-0 z-10 pointer-events-none flex flex-col items-center justify-between py-8 px-6 md:py-16 md:px-12">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="w-full flex justify-between items-center pointer-events-auto"
      >
        <div className="text-2xl font-bold tracking-wider">
          <span className="text-orange-500 drop-shadow-[0_0_10px_rgba(255,77,0,0.5)]">ZEROED</span>
          <span className="text-white">IN</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm tracking-wide">
          <a href="#about" className="text-white/70 hover:text-orange-500 transition-colors">ABOUT</a>
          <a href="#services" className="text-white/70 hover:text-orange-500 transition-colors">SERVICES</a>
          <a href="#book" className="text-white/70 hover:text-orange-500 transition-colors">BOOK NOW</a>
          <a href="#contact" className="text-white/70 hover:text-orange-500 transition-colors">CONTACT</a>
        </div>
        <button className="md:hidden text-white pointer-events-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </motion.nav>

      {/* Center content */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {showTitle && (
            <motion.div
              key="title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-orange-400/80 text-sm md:text-base tracking-[0.3em] mb-4"
              >
                PRECISION SHOOTING RANGE
              </motion.p>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
                <span className="text-white">AIM.</span>
                <br />
                <span className="text-orange-500 drop-shadow-[0_0_30px_rgba(255,77,0,0.6)]">FOCUS.</span>
                <br />
                <span className="text-white">EXCEL.</span>
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-white/50 text-lg md:text-xl max-w-md mx-auto"
              >
                Experience world-class air rifle training in a state-of-the-art facility
              </motion.p>
            </motion.div>
          )}

          {/* Mid-journey - distance indicator */}
          {scrollProgress > 0.15 && scrollProgress < 0.85 && (
            <motion.div
              key="journey"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-7xl md:text-9xl font-bold text-white/10">
                {Math.round((scrollProgress - 0.15) / 0.7 * 10)}m
              </div>
            </motion.div>
          )}

          {/* Final CTA */}
          {showCTA && (
            <motion.div
              key="cta"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center pointer-events-auto"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-5xl font-bold mb-6 text-white"
              >
                Ready to hit your mark?
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col md:flex-row gap-4 justify-center"
              >
                <button className="px-8 py-4 bg-orange-500 text-black font-bold text-lg rounded-full hover:bg-orange-400 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,77,0,0.5)]">
                  BOOK A SESSION
                </button>
                <button className="px-8 py-4 border-2 border-white/30 text-white font-bold text-lg rounded-full hover:border-orange-500 hover:text-orange-500 transition-all">
                  LEARN MORE
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll indicator */}
      <AnimatePresence>
        {scrollProgress < 0.05 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-white/40 text-sm tracking-widest">SCROLL TO FIRE</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
            >
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1.5 h-3 bg-orange-500 rounded-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
