import React from "react";
import { Search, BookOpen, CheckCircle } from "lucide-react";

const steps = [
  {
    number: '01',
    title: 'Tell Us What You Need',
    description: 'Choose a service, opportunity, or category. You can search directly or use our personalized discovery tool.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Understand Your Options',
    description: 'OneGuide helps you discover relevant information in simple language, breaking down complex eligibility criteria.',
    icon: BookOpen,
  },
  {
    number: '03',
    title: 'Verify & Apply',
    description: 'Review required documents and follow our direct links to the official government source for safe application.',
    icon: CheckCircle,
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-20 md:py-28 bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            How OneGuide Works
          </h2>
        </div>

        <div className="relative">
          {/* Solid track line for desktop */}
          <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-[3px] bg-slate-100 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 relative z-10">
            {steps.map((step) => {
              return (
                <div
                  key={step.number}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center mb-8 relative outline outline-8 outline-white z-10 transition-transform group-hover:scale-110">
                    <span className="text-white font-black text-[15px]">{step.number}</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug">
                    {step.title}
                  </h3>

                  <p className="text-slate-600 font-medium leading-relaxed max-w-[280px]">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
