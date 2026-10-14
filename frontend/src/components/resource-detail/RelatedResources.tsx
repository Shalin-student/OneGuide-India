import React from 'react';
import type { GovernmentResource } from './types';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../../node_modules/react-i18next';
import { ArrowRight, Landmark } from 'lucide-react';

export const RelatedResources = ({ resources }: { resources: Partial<GovernmentResource>[] }) => {
  const { t } = useTranslation();
  if (!resources || resources.length === 0) return null;

  return (
    <section className="py-12 mt-8 border-t border-slate-200">
      <div className="flex flex-col items-center text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">{t('resource.relatedResources')}</h2>
        <p className="text-slate-500 font-medium">Explore related government resources.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {resources.slice(0, 3).map((res, idx) => (
          <Link
            to={`/services/${res.id}`}
            key={idx}
            className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 hover:border-primary-200 transition-all duration-300 flex flex-col h-full"
          >
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                {res.resourceType || 'Resource'}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
              {res.name}
            </h3>

            <p className="text-[14px] text-slate-600 font-medium leading-relaxed mb-6 line-clamp-3 flex-grow">
              {res.description}
            </p>

            <div className="pt-4 border-t border-slate-100 mt-auto flex items-center justify-between">
              {res.authority ? (
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 truncate max-w-[65%]">
                  <Landmark size={12} className="shrink-0" />
                  <span className="truncate">{res.authority}</span>
                </span>
              ) : <div />}
              <span className="text-primary-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                {t('common.viewDetails')} <ArrowRight size={16} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
