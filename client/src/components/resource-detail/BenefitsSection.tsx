import React from 'react';
import { HandHeart, CheckCircle2 } from 'lucide-react';
import type { GovernmentResource } from './types';

interface BenefitsSectionProps {
  resource: GovernmentResource;
}

export const BenefitsSection: React.FC<BenefitsSectionProps> = ({ resource }) => {
  if (!resource.benefits || resource.benefits.length === 0) return null;

  return (
    <section id="benefits" className="scroll-mt-32">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
        <HandHeart className="text-primary-600" /> Benefits / Purpose
      </h2>
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-100 shadow-sm">
        <ul className="space-y-4">
          {resource.benefits.map((benefit: string, i: number) => (
            <li key={i} className="flex gap-3 text-gray-700 leading-relaxed">
              <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center">
                <CheckCircle2 size={12} className="text-primary-700" />
              </div>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
