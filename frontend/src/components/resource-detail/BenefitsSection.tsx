import React from 'react';
import { HandHeart, CheckCircle2 } from 'lucide-react';
import type { GovernmentResource } from './types';
import { useTranslation } from '../../../node_modules/react-i18next';

export const BenefitsSection = ({ resource }: { resource: GovernmentResource }) => {
  const { t } = useTranslation();
  if (!resource.benefits || resource.benefits.length === 0) return null;

  return (
    <section id="benefits" className="scroll-mt-28">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-50 rounded-xl">
          <HandHeart size={24} className="text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{t('resource.sectionBenefits')}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resource.benefits.map((benefit, index) => (
          <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex gap-4 transition-shadow hover:shadow-md">
            <CheckCircle2 className="text-purple-500 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-slate-800 font-semibold leading-relaxed text-[15px]">{benefit}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
