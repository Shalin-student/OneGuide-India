import React from 'react';
import { Clock, IndianRupee, MapPin, GraduationCap, Briefcase, Calendar } from 'lucide-react';
import type { GovernmentResource } from './types';

interface ResourceSummaryProps {
  resource: GovernmentResource;
}

export const ResourceSummary: React.FC<ResourceSummaryProps> = ({ resource }) => {
  const getHighlights = () => {
    const highlights = [];

    // State / Location
    if (resource.location?.state) {
      highlights.push({
        icon: MapPin,
        label: 'State',
        value: resource.location.state
      });
    }

    // Qualification
    if (resource.eligibility?.qualification) {
      highlights.push({
        icon: GraduationCap,
        label: 'Qualification',
        value: resource.eligibility.qualification
      });
    }

    // Age
    if (resource.eligibility?.age) {
      let ageVal = '';
      if (typeof resource.eligibility.age === 'string') {
        ageVal = resource.eligibility.age;
      } else {
        const { min, max } = resource.eligibility.age;
        if (min && max) ageVal = `${min} - ${max} Years`;
        else if (min) ageVal = `Min ${min} Years`;
        else if (max) ageVal = `Max ${max} Years`;
      }
      if (ageVal) {
        highlights.push({
          icon: Briefcase, // using briefcase or calendar for age is okay, let's use Clock or generic
          label: 'Age Limit',
          value: ageVal
        });
      }
    }

    // Income
    if (resource.eligibility?.incomeLimit) {
      highlights.push({
        icon: IndianRupee,
        label: 'Income Limit',
        value: resource.eligibility.incomeLimit
      });
    }

    // Deadline
    if (resource.application?.deadline) {
      highlights.push({
        icon: Calendar,
        label: 'Deadline',
        value: new Date(resource.application.deadline).toLocaleDateString()
      });
    }

    // Metadata specifics (Salary, Stipend, Vacancies, Fees)
    if (resource.searchMetadata?.salary) {
      highlights.push({ icon: IndianRupee, label: 'Salary', value: resource.searchMetadata.salary });
    }
    if (resource.searchMetadata?.stipend) {
      highlights.push({ icon: IndianRupee, label: 'Stipend', value: resource.searchMetadata.stipend });
    }
    if (resource.application?.fees) {
      highlights.push({ icon: IndianRupee, label: 'Application Fee', value: resource.application.fees });
    }
    if (resource.searchMetadata?.duration) {
      highlights.push({ icon: Clock, label: 'Duration', value: resource.searchMetadata.duration });
    }

    return highlights.slice(0, 4); // Max 4 highlights for the summary
  };

  const highlights = getHighlights();

  if (highlights.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {highlights.map((h, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <h.icon size={24} className="text-primary-500 mb-2" />
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">{h.label}</span>
            <span className="text-sm font-bold text-slate-800 line-clamp-2" title={h.value}>{h.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
