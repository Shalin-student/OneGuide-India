import React from 'react';
import { useTranslation } from '../../../node_modules/react-i18next';
import { FileText, CheckCircle2, HandHeart, FileCheck, ShieldCheck, ExternalLink } from 'lucide-react';

const SECTIONS = [
  { id: 'details', labelKey: 'sectionOverview', icon: FileText },
  { id: 'eligibility', labelKey: 'sectionEligibility', icon: CheckCircle2 },
  { id: 'benefits', labelKey: 'sectionBenefits', icon: HandHeart },
  { id: 'documents', labelKey: 'sectionDocuments', icon: FileCheck },
  { id: 'application', labelKey: 'sectionHowtoApply', icon: ShieldCheck },
  { id: 'sources', labelKey: 'sectionSources', icon: ExternalLink },
];

export const ResourceSectionNav = ({ activeSection, onNavigate }: { activeSection: string, onNavigate: (id: string) => void }) => {
  const { t } = useTranslation();

  return (
    <div className="theme-section-nav w-full border-y border-slate-200 bg-white/80 backdrop-blur-md sticky top-16 z-40 shadow-sm transition-all">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex overflow-x-auto hide-scrollbar py-2.5 gap-2" aria-label="Sections">
          {SECTIONS.map(section => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => onNavigate(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${isActive
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
              >
                <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                {t(`resource.${section.labelKey}`)}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
