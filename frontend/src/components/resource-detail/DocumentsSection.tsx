import React from 'react';
import { FileCheck, FileText } from 'lucide-react';
import type { GovernmentResource } from './types';
import { useTranslation } from '../../../node_modules/react-i18next';

export const DocumentsSection = ({ resource }: { resource: GovernmentResource }) => {
  const { t } = useTranslation();
  if (!resource.documentsRequired || resource.documentsRequired.length === 0) return null;

  return (
    <section id="documents" className="scroll-mt-28">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-50 rounded-xl">
          <FileCheck size={24} className="text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{t('resource.sectionDocuments')}</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 md:p-6 bg-amber-50/50 border-b border-amber-100">
          <p className="text-amber-800 font-medium text-[14px]">
            Document requirements can vary. Verify the official application instructions before applying.
          </p>
        </div>

        <div className="p-6 md:p-8">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            {resource.documentsRequired.map((doc, index) => (
              <li key={index} className="flex items-start gap-3">
                <FileText className="text-slate-400 shrink-0 mt-0.5" size={18} />
                <span className="text-slate-800 font-medium text-[15px]">{doc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
