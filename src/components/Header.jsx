/**
 * Header Component
 *
 * Hero section with animated branding and tagline.
 * Features aurora background effects using Framer Motion.
 *
 * @author Yassin Hamdi
 */

import React from "react";
import { motion } from "framer-motion";

export function Header() {
  return (
    <header className="relative py-24 px-4 text-center overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse-glow" />
        <div
          className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px] animate-pulse-glow"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-violet-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-3 mb-8"
        >
          {/* <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
            <Workflow className="w-6 h-6 text-white" />
          </div> */}
          <span className="text-2xl font-bold text-white tracking-tight">
            BluePrint<span className="text-indigo-400">Diagram</span>
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight"
        >
          Architecture Diagrams <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300">
            by Yassin Hamdi
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-dark-300 text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Transform your technical ideas into professional system architecture
          diagrams instantly. No drag-and-drop required.
        </motion.p>
      </div>
    </header>
  );
}
