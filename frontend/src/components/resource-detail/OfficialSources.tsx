import React from 'react';
import { ExternalLink, Globe } from 'lucide-react';
import type { GovernmentResource } from './types';
import { useTranslation } from '../../../node_modules/react-i18next';

export const OfficialSources = ({ resource }: { resource: GovernmentResource }) => {
  const { t } = useTranslation();
  if (!resource.officialSources || resource.officialSources.length === 0) return null;

  return (
    <section id="sources" className="scroll-mt-28">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-xl">
          <Globe size={24} className="text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{t('resource.sectionSources')}</h2>
      </div>

      <p className="text-[15px] text-slate-600 mb-6 font-medium">
        Use the official source for the latest application instructions and requirements.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resource.officialSources.map((source, index) => (
          <a
            key={index}
            href={source.sourceURL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                  Official
                </span>
                <ExternalLink size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <h3 className="font-bold text-slate-900 text-[15px] mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                {source.sourceName}
              </h3>
              {source.sourceType && (
                <p className="text-[13px] text-slate-500 font-medium">
                  {source.sourceType}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
