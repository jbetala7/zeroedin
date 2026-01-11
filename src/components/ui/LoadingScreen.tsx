'use client';

import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="text-center">
        {/* Animated logo/crosshair */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative w-24 h-24 mx-auto mb-8"
        >
          {/* Outer ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            className="absolute inset-0 border-4 border-primary/30 rounded-full"
          />
          {/* Inner ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            className="absolute inset-3 border-2 border-primary rounded-full"
          />
          {/* Crosshair lines */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-0.5 bg-primary/50" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-0.5 h-full bg-primary/50" />
          </div>
          {/* Center dot */}
          <motion.div
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-3 h-3 bg-primary rounded-full" />
          </motion.div>
        </motion.div>

        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold tracking-wider mb-2">
            <span className="text-primary">ZEROED</span>
            <span className="text-foreground">IN</span>
          </h2>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-foreground/60 text-sm tracking-widest"
          >
            LOADING...
          </motion.p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          className="mt-8 mx-auto max-w-xs"
        >
          <div className="h-0.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="h-full w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
