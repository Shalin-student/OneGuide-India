import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import flagImage from "../../../assets/indianflag_image.png";
import { useAuth } from "../../../context/AuthContext";

const HERO_TITLES = [
  "One Stop Solution for Every Citizens",
  "AI based Citizens Service Guidance Platform",
  "OneGuide Is for Indian citizens",
];

export const HeroSlider = () => {
  const { user } = useAuth();
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [phase, setPhase] = useState<"typing" | "pause" | "deleting">("typing");
  const title = HERO_TITLES[titleIndex];

  useEffect(() => {
    let timer: number;

    if (phase === "typing") {
      timer = window.setTimeout(() => {
        setDisplayedTitle((current) => {
          const next = title.slice(0, current.length + 1);
          if (next === title) setPhase("pause");
          return next;
        });
      }, 72);
    } else if (phase === "pause") {
      timer = window.setTimeout(() => setPhase("deleting"), 1500);
    } else {
      timer = window.setTimeout(() => {
        setDisplayedTitle((current) => {
          const next = current.slice(0, -1);
          if (next.length === 0) {
            setTitleIndex((index) => (index + 1) % HERO_TITLES.length);
            setPhase("typing");
          }
          return next;
        });
      }, 38);
    }

    return () => window.clearTimeout(timer);
  }, [displayedTitle, phase, title]);

  return (
    <section className="theme-section relative w-full pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden bg-[#fafaf9]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 md:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-12">
          {/* LEFT COLUMN: Typography & CTAs */}
          <div className="w-full lg:w-[55%] flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-emerald-50 border border-emerald-100 mb-8 w-fit">
              <ShieldCheck size={11} className="text-emerald-700" />
              <span className="text-xs font-bold text-emerald-800 tracking-widest uppercase">
                AI And NLP BASED PLATFORM
              </span>
            </div>

            <h1
              aria-label={title}
              className="min-h-[8.8rem] text-[2.75rem] sm:min-h-[7.2rem] sm:text-5xl md:min-h-[8rem] md:text-6xl font-bold tracking-tight leading-[1.15] mb-9 text-slate-900"
            >
              <span key={titleIndex} className="inline-block pr-2">
                {displayedTitle}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-[540px] mb-10 leading-relaxed font-medium">
              Make citizens more independent when searching for
              government-related information and reduce their reliance on
              YouTube videos, social media platforms like Instagram, and
              multiple websites.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                to={
                  user?.onboardingCompleted
                    ? "/services/personalized"
                    : "/onboarding"
                }
                className="inline-flex items-center justify-center gap-2 bg-orange-600 px-7 py-4 text-[15px] font-bold text-white transition-all hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                Find schemes for you
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 border border-slate-300 bg-white px-7 py-4 text-[15px] font-bold text-slate-900 transition-all hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              >
                Explore all services
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[13px] font-bold text-slate-500 uppercase tracking-wider">
              <span className="inline-flex items-center gap-2">
                <Check size={16} className="text-emerald-600" />
                Verified Information
              </span>
              <span className="inline-flex items-center gap-2">
                <Check size={16} className="text-emerald-600" />
                Free for Citizens
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Visuals */}
          <div className="w-full lg:w-[45%] relative flex justify-end lg:translate-x-5 xl:translate-x-10">
            <div className="relative w-full max-w-[600px] aspect-[4/3] bg-slate-200 overflow-hidden shadow-2xl">
              <img
                src={flagImage}
                alt="Indian Flag"
                className="w-full h-full object-cover object-center scale-105"
              />
              <div className="absolute inset-0 bg-slate-900/10 mix-blend-multiply pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
