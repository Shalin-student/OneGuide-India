import React from "react";
import { motion } from "motion/react";
import { Search, BookOpen, CheckCircle } from "lucide-react";

const steps = [
  {
    number: '01',
    title: 'Tell Us What You Need',
    description: 'Choose a service, opportunity, or category. You can search directly or use our personalized discovery tool.',
    icon: Search,
    color: 'text-orange-500',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-200'
  },
  {
    number: '02',
    title: 'Understand Your Options',
    description: 'OneGuide helps you discover relevant information in simple language, breaking down complex eligibility criteria.',
    icon: BookOpen,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200'
  },
  {
    number: '03',
    title: 'Verify & Apply',
    description: 'Review required documents and follow our direct links to the official government source for safe application.',
    icon: CheckCircle,
    color: 'text-primary-500',
    bgColor: 'bg-primary-100',
    borderColor: 'border-primary-200'
  }
];

export const HowItWorks = () => {
  return (
    <section className="pt-12 pb-24 md:pt-16 md:pb-24 bg-transparent relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full opacity-50 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight"
          >
            How OneGuide Works
          </motion.h2>
        </div>

        <div className="relative">
          {/* Connecting Line for Desktop */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-orange-200 via-blue-200 to-primary-200 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className={`w-20 h-20 rounded-2xl ${step.bgColor} ${step.borderColor} border-2 flex items-center justify-center mb-6 relative group-hover:scale-110 transition-transform duration-300 shadow-sm bg-white`}>
                    <Icon size={32} className={step.color} strokeWidth={1.5} />
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold border-4 border-slate-50">
                      {step.number}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {step.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
