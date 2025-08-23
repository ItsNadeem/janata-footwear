import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import splashBackground from 'figma:asset/a2ef68f85ff623b1a5828a27540301c0fac20c5b.png';
import shoeaLogo from 'figma:asset/22a145728baa3db5f87cbff33464e96e1f1f2ffa.png';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // Show splash for 3 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-900">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${splashBackground})` }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Overlay to crop out "Shoea" text from bottom right */}
        <div className="absolute bottom-0 right-0 w-32 h-24 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        {/* Logo Animation */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            delay: 0.2 
          }}
        >
          <div className="w-24 h-24 bg-white rounded-3xl p-4 shadow-2xl">
            <img 
              src={shoeaLogo} 
              alt="Janata Footwear Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>

        {/* Welcome Text Animation */}
        <motion.div
          className="text-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            delay: 0.6 
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-white text-2xl font-normal">Welcome to</span>
            <motion.span
              className="text-4xl"
              animate={{ 
                rotate: [0, 14, -8, 14, -4, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1, 1.1, 1]
              }}
              transition={{ 
                duration: 1.5,
                delay: 1,
                ease: "easeInOut"
              }}
            >
              👋
            </motion.span>
          </div>
          
          <motion.h1
            className="text-4xl font-bold text-white mb-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 0.6, 
              ease: "easeOut",
              delay: 1.2 
            }}
          >
            Janata Footwear
          </motion.h1>
          
          <motion.p
            className="text-white/80 text-lg font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          >
            Step into comfort and style
          </motion.p>
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          className="absolute bottom-16 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-white rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}