import React from "react";
import { Layers, MessageSquare, Compass, ShieldCheck, Users, Sparkles } from "lucide-react";

const benefits = [
  {
    title: 'One Place',
    description: 'Find multiple citizen services from one platform instead of searching across dozens of different websites.',
    icon: Layers,
  },
  {
    title: 'Simple Language',
    description: 'Complex government information translated and explained in an easy-to-understand way.',
    icon: MessageSquare,
  },
  {
    title: 'Clear Guidance',
    description: 'Understand eligibility, required documents, application process, and exactly what to do next.',
    icon: Compass,
  },
  {
    title: 'Official Sources',
    description: 'We always provide direct links to authoritative government sources for verification and safe application.',
    icon: ShieldCheck,
  },
  {
    title: 'Citizen Focused',
    description: 'Designed specifically for students, job seekers, farmers, families, and everyday citizens.',
    icon: Users,
  },
  {
    title: 'No Unnecessary Complexity',
    description: 'Simple navigation, clear actions, and no overwhelming forms or confusing terminology.',
    icon: Sparkles,
  }
];

export const WhyOneGuide = () => {
  return (
    <section className="theme-section py-20 md:py-28 bg-[#fafaf9] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why OneGuide?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="flex flex-col gap-5 items-start p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
