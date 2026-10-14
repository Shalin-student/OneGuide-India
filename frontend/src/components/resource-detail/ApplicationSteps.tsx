import React from 'react';
import { ShieldCheck, Info, ExternalLink } from 'lucide-react';
import type { GovernmentResource } from './types';
import { useTranslation } from '../../../node_modules/react-i18next';

export const ApplicationSteps = ({ resource }: { resource: GovernmentResource }) => {
  const { t } = useTranslation();
  if (!resource.application) return null;
  const { processSteps, url } = resource.application;

  if (!processSteps && !url) return null;

  return (
    <section id="application" className="scroll-mt-28">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-50 rounded-xl">
          <ShieldCheck size={24} className="text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{t('resource.sectionHowtoApply')}</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">

        {Array.isArray(processSteps) && processSteps.length > 0 ? (
          <div className="relative border-l-2 border-indigo-100 ml-4 space-y-10 py-2">
            {processSteps.map((step: any, idx: number) => {
              const stepTitle = typeof step === 'string' ? `Step ${idx + 1}` : step.title || `Step ${idx + 1}`;
              const stepDesc = typeof step === 'string' ? step : step.description;

              return (
                <div key={idx} className="relative pl-8">
                  <div className="absolute -left-[21px] top-0 w-10 h-10 rounded-full bg-white border-4 border-indigo-100 flex items-center justify-center font-black text-sm text-indigo-600 shadow-sm">
                    {idx + 1}
                  </div>
                  <h3 className="text-[17px] font-bold text-slate-900 mb-2 mt-1">{stepTitle}</h3>
                  {stepDesc && <p className="text-[15px] text-slate-600 leading-relaxed font-medium">{stepDesc}</p>}
                </div>
              );
            })}
          </div>
        ) : typeof processSteps === 'string' && processSteps.length > 0 ? (
          <p className="text-slate-700 text-[15px] leading-relaxed mb-6 whitespace-pre-line">{processSteps}</p>
        ) : url ? (
          <div className="flex items-start gap-4 bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6">
            <Info className="text-slate-500 shrink-0 mt-0.5" size={20} />
            <p className="text-[15px] text-slate-700 leading-relaxed font-medium">
              Detailed application instructions are not available in OneGuide. <br />
              Follow the application instructions on the official source.
            </p>
          </div>
        ) : null}

        {url && (
          <div className={`mt-8 pt-8 ${processSteps && processSteps.length > 0 ? 'border-t border-slate-100' : ''}`}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition shadow-sm w-full sm:w-auto"
            >
              Visit Official Application Page <ExternalLink size={18} className="text-slate-400" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
};
