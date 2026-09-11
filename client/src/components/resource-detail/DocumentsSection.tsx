import React from 'react';
import { FileCheck, FileText } from 'lucide-react';
import type { GovernmentResource } from './types';

interface DocumentsSectionProps {
  resource: GovernmentResource;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({ resource }) => {
  if (!resource.documentsRequired || resource.documentsRequired.length === 0) return null;

  return (
    <section id="documents" className="scroll-mt-32">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
        <FileCheck className="text-primary-600" /> Documents Required
      </h2>
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {resource.documentsRequired.map((doc: string, i: number) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
              <FileText size={18} className="text-primary-600 flex-shrink-0" />
              <span className="text-gray-700 text-sm font-medium">{doc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
