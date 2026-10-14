import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Building2, ChevronRight, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from '../../../node_modules/react-i18next';
import { KeywordHighlight } from '../search/KeywordHighlight';
import { extractKeywords } from '../search/searchUtils';

interface ServiceCardProps {
  service: {
    _id: string;
    name: string;
    description: string;
    categoryId?: { name: string };
    governmentDepartment?: string;
    stateOrCentral?: string;
    slug: string;
    resourceType?: string; // from canonical resource
    tags?: string[];
    keywords?: string[];
  };
  highlightKeywords?: string[];
}

import { SaveButton } from './SaveButton';

export const ServiceCard = ({ service, highlightKeywords = [] }: ServiceCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.preventDefault();
    e.stopPropagation(); // Just in case we wrap the whole card in a Link later
    navigate(`/services?search=${encodeURIComponent(tag)}`);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="card-base p-5 md:p-6 flex flex-col h-full"
    >
      {/* Title & Save Button */}
      <div className="flex justify-between items-start mb-1 gap-4">
        <Link to={`/services/view/${service.slug}`} className="hover:underline decoration-primary-600 decoration-2 underline-offset-2">
          <h3 className="text-xl md:text-2xl font-semibold text-slate-900 leading-snug group-hover:text-primary-700 transition-colors">
            <KeywordHighlight text={service.name} keywords={highlightKeywords} />
          </h3>
        </Link>
        {service.resourceType && (
          <div className="shrink-0 mt-1">
            <SaveButton
              resourceId={service._id}
              resourceType={service.resourceType}
            />
          </div>
        )}
      </div>

      {/* Location / Department */}
      <div className="text-slate-500 text-sm mb-4">
        {service.stateOrCentral || 'Central Government'}
        {service.governmentDepartment && ` • ${service.governmentDepartment}`}
      </div>

      {/* Description */}
      <p className="text-slate-700 text-sm leading-relaxed mb-6">
        <KeywordHighlight text={service.description} keywords={highlightKeywords} />
      </p>

      {/* Tags (Pills) */}
      <div className="flex flex-wrap gap-2 mt-auto pt-2">
        {Array.from(new Set([
          service.categoryId?.name, 
          ...(service.tags || []),
          ...(service.keywords || []),
          ...extractKeywords(service.name, service.description)
        ]))
          .filter(Boolean)
          .slice(0, 5) // Display up to 5 tags to prevent overflow
          .map((tag, idx) => (
          <button 
            key={idx} 
            title={tag as string}
            onClick={(e) => handleTagClick(e, tag as string)}
            className="px-3 py-1 rounded-full border border-[#2e7d32] text-[#2e7d32] bg-white text-[12px] font-semibold tracking-wide shadow-sm hover:bg-[#2e7d32] hover:text-white transition-all cursor-pointer"
          >
            <KeywordHighlight text={tag as string} keywords={highlightKeywords} />
          </button>
        ))}
      </div>
    </motion.div>
  );
};
