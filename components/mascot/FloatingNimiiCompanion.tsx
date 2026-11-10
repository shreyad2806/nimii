"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Sparkles, X, Heart } from "lucide-react";

const COMPANION_QUOTES = [
  "I'm keeping your memories safe! ♡",
  "Small steps lead to great achievements! ✨",
  "Need to track a task? Add an Open Loop!",
  "Always here by your side! 🐾",
  "Don't forget to take a break when you need to! ☕",
];

export function FloatingNimiiCompanion() {
  const shouldReduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showHeart, setShowHeart] = useState(false);

  const handleMascotClick = () => {
    setQuoteIndex((prev) => (prev + 1) % COMPANION_QUOTES.length);
    setIsOpen(true);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-auto flex flex-col items-end gap-2 select-none">
      {/* Speech Bubble */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-xs p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#DDD6FE] shadow-xl text-left"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 p-1 text-[#94A3B8] hover:text-[#1E1B4B] rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close message"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#6C5CE7] uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Nimii says:</span>
            </div>
            <p className="text-xs font-semibold text-[#1E1B4B] pr-4 leading-relaxed">
              &ldquo;{COMPANION_QUOTES[quoteIndex]}&rdquo;
            </p>

            {/* Triangle pointer */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white/95 border-b border-r border-[#DDD6FE] transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating 3D Kitten Mascot Button */}
      <motion.button
        onClick={handleMascotClick}
        whileHover={shouldReduceMotion ? {} : { scale: 1.08, y: -3 }}
        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
        className="relative group p-1.5 rounded-full bg-white/90 backdrop-blur-xl border-2 border-white/90 shadow-2xl shadow-[#6C5CE7]/20 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
        aria-label="Interact with Nimii 3D companion"
        title="Click to interact with Nimii!"
      >
        {/* Floating Heart Particle */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 1, y: -25, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute -top-3 text-rose-500 pointer-events-none"
            >
              <Heart className="w-5 h-5 fill-rose-500" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative w-12 h-12 animate-soft-bounce">
          <Image
            src="/images/mascot/nimii-3d-peek.png?v=3d"
            alt="Interactive Nimii 3D companion"
            fill
            className="object-contain drop-shadow-md"
            priority
          />
        </div>

        {/* Pulse indicator */}
        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
        </span>
      </motion.button>
    </div>
  );
}
