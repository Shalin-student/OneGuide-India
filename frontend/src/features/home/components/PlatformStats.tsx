import React, { useState, useEffect, useRef } from "react";
import { useInView } from "motion/react";

const AnimatedCounter = ({ end, duration = 2 }: { end: number, duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setCount(Math.floor(easeProgress * end));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [end, duration, isInView]);

  return <span ref={ref}>{count}</span>;
};

export const PlatformStats = () => {
  const stats = [
    { label: 'Government Schemes', value: 1453 },
    { label: 'Government Jobs & Exams', value: 401 },
    { label: 'Scholarships & Education', value: 1110 },
    { label: 'Documents & Certificates', value: 58 },
    { label: 'Agriculture Services', value: 862 },
  ];

  return (
    <section className="py-12 bg-slate-900 border-y border-slate-800 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6 divide-x divide-transparent lg:divide-slate-700/50">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center text-center px-2 lg:px-4"
            >
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2 tabular-nums tracking-tighter">
                <AnimatedCounter end={stat.value} />
              </div>
              <div className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
