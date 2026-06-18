"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  CreditCard,
  PenTool,
  MessageSquare,
  BarChart,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    id: "quotes",
    label: "Smart Quotes",
    icon: FileText,
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200",
    description: "Generate professional branded quotes in seconds.",
  },
  {
    id: "esignatures",
    label: "E-Signatures",
    icon: PenTool,
    image:
      "https://images.unsplash.com/photo-1569144157591-c60f3f82f137?q=80&w=1200",
    description: "Clients can securely sign their quotes digitally.",
  },
  {
    id: "payments",
    label: "M-Pesa Integration",
    icon: CreditCard,
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200",
    description: "Accept instant payments via STK Push callbacks.",
  },
  {
    id: "communications",
    label: "Instant Delivery",
    icon: MessageSquare,
    image:
      "https://images.unsplash.com/photo-1577563908411-50cb989766a3?q=80&w=1200",
    description: "Send quotes directly to WhatsApp and Email.",
  },
  {
    id: "analytics",
    label: "Financial Tracking",
    icon: BarChart,
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200",
    description: "Real-time insights into your revenue pipeline.",
  },
  {
    id: "security",
    label: "Secure Audit Logs",
    icon: ShieldCheck,
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200",
    description: "Bank-grade encryption for all customer data.",
  },
];

const AUTO_PLAY_INTERVAL = 3000;
const ITEM_HEIGHT = 65;

const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export function FeatureCarousel() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentIndex =
    ((step % FEATURES.length) + FEATURES.length) % FEATURES.length;

  const nextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const handleChipClick = (index) => {
    const diff = (index - currentIndex + FEATURES.length) % FEATURES.length;
    if (diff > 0) setStep((s) => s + diff);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [nextStep, isPaused]);

  const getCardStatus = (index) => {
    const diff = index - currentIndex;
    const len = FEATURES.length;

    let normalizedDiff = diff;
    if (diff > len / 2) normalizedDiff -= len;
    if (diff < -len / 2) normalizedDiff += len;

    if (normalizedDiff === 0) return "active";
    if (normalizedDiff === -1) return "prev";
    if (normalizedDiff === 1) return "next";
    return "hidden";
  };

  return (
    <div className="w-full max-w-7xl mx-auto md:p-8 relative z-20">
      <div className="relative overflow-hidden rounded-[2.5rem] lg:rounded-[4rem] flex flex-col lg:flex-row min-h-[600px] lg:aspect-video border border-white/20 shadow-2xl backdrop-blur-md bg-white/5">
        <div className="w-full lg:w-[40%] min-h-[350px] md:min-h-[450px] lg:h-full relative z-30 flex flex-col items-start justify-center overflow-hidden px-8 md:px-16 lg:pl-16">
          <div className="absolute inset-x-0 top-0 h-12 md:h-20 lg:h-16 bg-gradient-to-b from-blue-900/40 to-transparent z-40" />
          <div className="absolute inset-x-0 bottom-0 h-12 md:h-20 lg:h-16 bg-gradient-to-t from-blue-900/40 to-transparent z-40" />
          <div className="relative w-full h-full flex items-center justify-center lg:justify-start z-20">
            {FEATURES.map((feature, index) => {
              const isActive = index === currentIndex;
              const distance = index - currentIndex;
              const wrappedDistance = wrap(
                -(FEATURES.length / 2),
                FEATURES.length / 2,
                distance
              );

              return (
                <motion.div
                  key={feature.id}
                  style={{
                    height: ITEM_HEIGHT,
                    width: "fit-content",
                  }}
                  animate={{
                    y: wrappedDistance * ITEM_HEIGHT,
                    opacity: 1 - Math.abs(wrappedDistance) * 0.25,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 90,
                    damping: 22,
                    mass: 1,
                  }}
                  className="absolute flex items-center justify-start"
                >
                  <button
                    onClick={() => handleChipClick(index)}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className={cn(
                      "relative flex items-center gap-4 px-6 md:px-10 lg:px-8 py-3.5 md:py-5 lg:py-4 rounded-full transition-all duration-700 text-left group border",
                      isActive
                        ? "bg-white text-blue-900 border-white z-10 shadow-lg"
                        : "bg-transparent text-white/60 border-white/20 hover:border-white/40 hover:text-white"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center transition-colors duration-500",
                        isActive ? "text-blue-900" : "text-white/40"
                      )}
                    >
                      {React.createElement(feature.icon, { size: 18, strokeWidth: 2 })}
                    </div>

                    <span className="font-bold text-sm md:text-[15px] tracking-tight whitespace-nowrap uppercase">
                      {feature.label}
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 min-h-[500px] md:min-h-[600px] lg:h-full relative flex items-center justify-center py-16 md:py-24 lg:py-16 px-6 md:px-12 lg:px-10 overflow-hidden border-t lg:border-t-0 lg:border-l border-white/20 bg-black/10">
          <div className="relative w-full max-w-[420px] aspect-[4/5] flex items-center justify-center">
            {FEATURES.map((feature, index) => {
              const status = getCardStatus(index);
              const isActive = status === "active";
              const isPrev = status === "prev";
              const isNext = status === "next";

              return (
                <motion.div
                  key={feature.id}
                  initial={false}
                  animate={{
                    x: isActive ? 0 : isPrev ? -100 : isNext ? 100 : 0,
                    scale: isActive ? 1 : isPrev || isNext ? 0.85 : 0.7,
                    opacity: isActive ? 1 : isPrev || isNext ? 0.4 : 0,
                    rotate: isPrev ? -3 : isNext ? 3 : 0,
                    zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 25,
                    mass: 0.8,
                  }}
                  className="absolute inset-0 rounded-[2rem] md:rounded-[2.8rem] overflow-hidden border-4 md:border-8 border-white/20 bg-black/50 origin-center"
                >
                  <img
                    src={feature.image}
                    alt={feature.label}
                    className={cn(
                      "w-full h-full object-cover transition-all duration-700",
                      isActive
                        ? "grayscale-0 blur-0"
                        : "grayscale blur-[2px] brightness-75"
                    )}
                  />

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute inset-x-0 bottom-0 p-10 pt-32 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end pointer-events-none"
                      >
                        <div className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] w-fit shadow-lg mb-3 border border-white/50">
                          {index + 1} • {feature.label}
                        </div>
                        <p className="text-white font-medium text-xl md:text-2xl leading-tight drop-shadow-md tracking-tight">
                          {feature.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div
                    className={cn(
                      "absolute top-8 left-8 flex items-center gap-3 transition-opacity duration-300",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_#4ade80]" />
                    <span className="text-white/80 text-[10px] font-bold uppercase tracking-[0.3em] font-mono">
                      Feature Focus
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeatureCarousel;
