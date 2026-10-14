import React from 'react';
import type { GovernmentResource } from './types';
import { useTranslation } from '../../../node_modules/react-i18next';
import { CheckCircle2, FileText, ArrowRight } from 'lucide-react';

export const ResourceSummary = ({ resource, onCheckEligibility }: { resource: GovernmentResource, onCheckEligibility: () => void }) => {
  const { t } = useTranslation();
  if (!resource.description) return null;

  return (
    <section id="details" className="scroll-mt-28 space-y-8">
      {/* What is this? */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('resource.whatIsThis')}</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-[15px]">
            {resource.description.split('\n').map((paragraph, idx) => (
              <p key={idx} className={idx > 0 ? 'mt-4' : ''}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Your Next Step */}
      <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-5">{t('resource.yourNextStep')}</h3>

          <div className="flex flex-col md:flex-row gap-8 md:items-center justify-between">
            <div className="flex-1 space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary-500/20 p-1.5 rounded-full mt-0.5 shrink-0">
                  <CheckCircle2 size={14} className="text-primary-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-100 text-[15px]">1. Understand if this applies to you</p>
                </div>
              </div>
              <div className="flex items-start gap-3 opacity-75">
                <div className="bg-slate-700 p-1.5 rounded-full mt-0.5 shrink-0">
                  <FileText size={14} className="text-slate-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-300 text-[15px]">2. Prepare the required documents</p>
                </div>
              </div>
              <div className="flex items-start gap-3 opacity-75">
                <div className="bg-slate-700 p-1.5 rounded-full mt-0.5 shrink-0">
                  <ArrowRight size={14} className="text-slate-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-300 text-[15px]">3. Follow official application instructions</p>
                </div>
              </div>
            </div>

            <div className="md:w-64 shrink-0">
              <button
                onClick={onCheckEligibility}
                className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3.5 px-6 rounded-xl transition shadow-sm text-sm"
              >
                {t('resource.checkEligibility')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
