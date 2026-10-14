import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-6 text-left focus:outline-none group"
      >
        <span className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
          {question}
        </span>
        <div className="flex-shrink-0 ml-4">
          {isOpen ? (
            <Minus className="text-slate-400" size={24} />
          ) : (
            <Plus className="text-slate-400 group-hover:text-orange-600 transition-colors" size={24} />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="pb-6">
          <p className="text-slate-600 text-[15px] font-medium leading-relaxed pr-8">
            {answer}
          </p>
        </div>
      )}
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
    <section className="py-20 md:py-28 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-slate-600 font-medium">
            Everything you need to know about using OneGuide India.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-10">
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
