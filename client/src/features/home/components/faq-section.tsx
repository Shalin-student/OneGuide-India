import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";
import { ScrollRevealText } from '../../../components/ui/scroll-reveal-text';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200/50 last:border-0">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-6 text-left focus:outline-none group"
      >
        <span className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
          {question}
        </span>
        <div className="flex-shrink-0 ml-4 relative w-6 h-6 flex items-center justify-center">
          <motion.div
            initial={false}
            animate={{ rotate: isOpen ? 180 : 0, opacity: isOpen ? 0 : 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute"
          >
            <Plus className="text-gray-400 group-hover:text-primary-500 transition-colors" size={20} />
          </motion.div>
          <motion.div
            initial={false}
            animate={{ rotate: isOpen ? 0 : -180, opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute"
          >
            <Minus className="text-primary-600" size={20} />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-600 text-[15px] leading-relaxed pr-8">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Is OneGuide India an official government website?',
      answer: 'No, OneGuide India is an independent platform built to simplify the discovery and understanding of Indian government schemes, scholarships, and services. We provide clear, verified information and direct links to official government portals.',
    },
    {
      question: 'How do I know if I am eligible for a scheme?',
      answer: 'Each scheme on our platform lists explicit eligibility criteria in a simplified format. You can also use our "Find Schemes for Me" tool to answer a few questions and automatically discover programs tailored to your profile.',
    },
    {
      question: 'Are the services and documents provided free of cost?',
      answer: 'Yes, OneGuide India is completely free to use. However, some official government portals may charge processing fees for certain applications or document issuances. We will always inform you about potential official fees upfront.',
    },
    {
      question: 'How frequently is the information updated?',
      answer: 'Our dedicated team continuously monitors official government announcements, press releases, and gazettes. We update our database regularly to ensure you have access to the latest deadlines, procedures, and scheme changes.',
    },
    {
      question: 'Can I apply for schemes directly on OneGuide India?',
      answer: 'No, we do not collect your personal application data. Instead, we guide you through the preparation process (documents needed, forms to fill) and then provide a secure, direct link to the exact page on the official government portal where you can apply.',
    },
  ];

  return (
    <section className="py-24 bg-transparent relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center mb-16">
          <ScrollRevealText
            htmlTag="h2"
            text="Frequently Asked Questions"
            preset="Blur Reveal"
            trigger="On Load"
            onLoadDuration={0.8}
            className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight"
          />
          <ScrollRevealText
            htmlTag="p"
            text="Everything you need to know about using OneGuide India."
            preset="Soft Words"
            trigger="On Load"
            onLoadDuration={0.8}
            className="mt-4 text-lg text-gray-600"
          />
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-6 md:p-10">
          <div className="flex flex-col">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
