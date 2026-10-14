import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { GovernmentResource } from './types';
import { useTranslation } from '../../../node_modules/react-i18next';

export const EligibilitySection = ({ resource }: { resource: GovernmentResource }) => {
  const { t } = useTranslation();
  const { eligibility } = resource;

  if (!eligibility) return null;

  const criteriaList = [];

  if (eligibility.age) {
    if (typeof eligibility.age === 'string') {
      criteriaList.push({ label: 'Age Requirement', value: eligibility.age });
    } else {
      let ageStr = '';
      if (eligibility.age.min) ageStr += `Minimum ${eligibility.age.min} years`;
      if (eligibility.age.max) {
        if (ageStr) ageStr += ' and ';
        ageStr += `Maximum ${eligibility.age.max} years`;
      }
      if (ageStr) criteriaList.push({ label: 'Age Requirement', value: ageStr });
    }
  }

  if (eligibility.incomeLimit) {
    criteriaList.push({ label: 'Income Limit', value: eligibility.incomeLimit });
  }

  if (eligibility.stateApplicability) {
    criteriaList.push({ label: 'State / Residence', value: eligibility.stateApplicability });
  }

  if (eligibility.qualification) {
    criteriaList.push({ label: 'Education', value: eligibility.qualification });
  }

  if (eligibility.socialCategory && eligibility.socialCategory.length > 0) {
    criteriaList.push({ label: 'Social Category', value: eligibility.socialCategory.join(', ') });
  }

  if (eligibility.occupation && eligibility.occupation.length > 0) {
    criteriaList.push({ label: 'Occupation', value: eligibility.occupation.join(', ') });
  }

  if (eligibility.gender && eligibility.gender.length > 0 && !eligibility.gender.includes('All')) {
    criteriaList.push({ label: 'Gender', value: eligibility.gender.join(', ') });
  }

  if (eligibility.student) {
    criteriaList.push({ label: 'Student Status', value: 'Must be a student' });
  }

  if (eligibility.disability) {
    criteriaList.push({ label: 'Disability', value: 'Applicable for Persons with Disabilities' });
  }

  if (criteriaList.length === 0 && !eligibility.overview) {
    return null;
  }

  return (
    <section id="eligibility" className="scroll-mt-28">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-50 rounded-xl">
          <CheckCircle2 size={24} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{t('resource.sectionEligibility')}</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {eligibility.overview && (
          <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50">
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Overview</h3>
            <p className="text-slate-700 leading-relaxed font-medium text-[15px]">{eligibility.overview}</p>
          </div>
        )}

        {criteriaList.length > 0 && (
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {criteriaList.map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    {item.label}
                  </span>
                  <span className="text-slate-900 font-semibold text-[15px]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
