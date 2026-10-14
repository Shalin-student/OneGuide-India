import React from "react";
import { Lock, Share2, Link as LinkIcon, ShieldCheck } from "lucide-react";

const trustPillars = [
  {
    title: 'Bank-Grade Security',
    description: 'Our platform uses standard encryption to ensure your browsing and interactions are secure.',
    icon: Lock,
  },
  {
    title: 'Zero Data Sharing',
    description: 'We do not sell, share, or monetize your personal data. Your searches and profile remain strictly private.',
    icon: Share2,
  },
  {
    title: 'Official Links Only',
    description: 'We never host application forms. Every service strictly redirects to verified .gov.in or .nic.in official portals.',
    icon: LinkIcon,
  }
];

export const TrustSection = () => {
  return (
    <section className="py-20 md:py-28 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-6 shadow-sm">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a365d] tracking-tight mb-6">
            Your Trust, Our Priority
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            We are an <span className="font-bold text-[#1a365d]">independent guidance platform</span>. We are <span className="text-rose-600 font-bold underline decoration-rose-200 underline-offset-4">not</span> affiliated with the Government of India, but we prioritize your safety above all.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustPillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center hover:border-blue-300 hover:shadow-md transition-all shadow-sm"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                  <Icon size={28} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-[#1a365d] mb-3 leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
