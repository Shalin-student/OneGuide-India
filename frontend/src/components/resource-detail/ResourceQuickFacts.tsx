import React from 'react';
import type { GovernmentResource } from './types';
import { Building, MapPin, Clock, CreditCard, Calendar, GraduationCap, Briefcase } from 'lucide-react';
import { useTranslation } from '../../../node_modules/react-i18next';

export const ResourceQuickFacts = ({ resource }: { resource: GovernmentResource }) => {
  const { t } = useTranslation();

  const facts = [];

  if (resource.authority) {
    facts.push({ icon: Building, label: 'Authority', value: resource.authority });
  }
  if (resource.location && resource.location.state) {
    facts.push({ icon: MapPin, label: 'State', value: resource.location.state });
  }
  if (resource.application?.processingTime) {
    facts.push({ icon: Clock, label: 'Processing Time', value: resource.application.processingTime });
  }
  if (resource.application?.fees) {
    facts.push({ icon: CreditCard, label: 'Fees', value: resource.application.fees });
  }
  if (resource.application?.applicationMode) {
    facts.push({ icon: Briefcase, label: 'Mode', value: resource.application.applicationMode });
  }
  if (resource.application?.deadline) {
    facts.push({ icon: Calendar, label: 'Deadline', value: new Date(resource.application.deadline).toLocaleDateString() });
  }
  if (resource.eligibility?.qualification) {
    facts.push({ icon: GraduationCap, label: 'Qualification', value: resource.eligibility.qualification });
  }

  if (facts.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-4">{t('resource.atAGlance')}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {facts.map((fact, index) => (
          <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-1.5 shadow-sm transition-shadow hover:shadow-md">
            <span className="flex items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              <fact.icon size={12} className="mr-1.5 text-slate-400" /> {fact.label}
            </span>
            <span className="text-sm font-semibold text-slate-900 leading-snug">{fact.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
