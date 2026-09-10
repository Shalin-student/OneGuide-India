import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Compass } from 'lucide-react';

const TypewriterHeading = () => {
  const text1 = "Everything You Need.";
  const text2 = "OneGuide.";

  const [displayedText1, setDisplayedText1] = useState("");
  const [displayedText2, setDisplayedText2] = useState("");
  const [phase, setPhase] = useState<"typing1" | "typing2" | "paused">("typing1");

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing1") {
      if (displayedText1.length < text1.length) {
        timeout = setTimeout(() => {
          setDisplayedText1(text1.slice(0, displayedText1.length + 1));
        }, 75);
      } else {
        setPhase("typing2");
      }
    } else if (phase === "typing2") {
      if (displayedText2.length < text2.length) {
        timeout = setTimeout(() => {
          setDisplayedText2(text2.slice(0, displayedText2.length + 1));
        }, 75);
      } else {
        setPhase("paused");
        timeout = setTimeout(() => {
          setDisplayedText1("");
          setDisplayedText2("");
          setPhase("typing1");
        }, 4000);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText1, displayedText2, phase]);

  return (
    <h1 className="text-[2.5rem] sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-5 text-slate-900">
      {displayedText1 || "\u200B"}
      {phase === "typing1" && <span className="animate-pulse font-normal opacity-70">|</span>}
      <br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
        {displayedText2 || "\u200B"}
      </span>
      {phase === "typing2" && <span className="animate-pulse font-normal opacity-70 text-slate-900">|</span>}
    </h1>
  );
};

export const HeroSlider = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative w-full pt-16 pb-12 md:pt-20 md:pb-16 overflow-hidden bg-slate-50/50">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/70 via-white/40 to-transparent pointer-events-none z-0" />

      {/* Subtle Dot Grid */}
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)',
          backgroundSize: '32px 32px',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 md:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-6">

          {/* LEFT COLUMN: Typography & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full lg:w-[50%] flex flex-col justify-center pt-6 pb-4 lg:py-0"
          >
            <TypewriterHeading />

            <p className="text-base sm:text-lg text-slate-600 max-w-lg mb-6 leading-relaxed font-medium">
              Discover government schemes, jobs, scholarships, internships, documents, and citizen services — all in one place.
            </p>

          </motion.div>

          {/* RIGHT COLUMN: Visuals */}
          <motion.div
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 20, scale: prefersReducedMotion ? 1 : 1.03 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="w-full lg:w-[50%] relative flex items-center justify-center p-6 lg:p-12"
          >
            {/* Tricolor Gradient Blob (Indian colors: Saffron, White, Green) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center z-0">
              <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-[#FF9933]/20 rounded-full blur-[80px] absolute top-0 -right-10" />
              <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-[#138808]/20 rounded-full blur-[80px] absolute -bottom-10 left-10" />
            </div>

            <div className="relative w-full max-w-[540px] aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl border-[6px] border-white/80 z-10 bg-white">
              <motion.div
                animate={!prefersReducedMotion ? { scale: [1, 1.05] } : {}}
                transition={{ duration: 15, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
                className="w-full h-full"
              >
                <img
                  src="https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=1200&auto=format&fit=crop"
                  alt="Government Services Gateway"
                  className="w-full h-full object-cover object-center"
                />
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
