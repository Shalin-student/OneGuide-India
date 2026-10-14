import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, ChevronRight, Home, Share2, Bookmark, ExternalLink, ArrowLeft } from 'lucide-react';
import type { GovernmentResource } from './types';
import { useTranslation } from '../../../node_modules/react-i18next';

import bgSchemes from '../../assets/banners/bg_schemes_1789627553903.jpg';
import bgJobs from '../../assets/banners/bg_jobs_1789627566139.jpg';
import bgScholarships from '../../assets/banners/bg_scholarships_1789627578444.jpg';
import bgAgriculture from '../../assets/banners/bg_agriculture_1789627592280.jpg';
import bgDocuments from '../../assets/banners/bg_documents_1789627607524.jpg';
import bgDefault from '../../assets/banners/bg_default_1789627619605.jpg';

interface ResourceHeroProps {
  resource: GovernmentResource;
  saved: boolean;
  saveLoading: boolean;
  onSaveToggle: () => void;
  onShare: () => void;
  onCheckEligibility: () => void;
}

export const ResourceHero: React.FC<ResourceHeroProps> = ({
  resource,
  saved,
  saveLoading,
  onSaveToggle,
  onShare,
  onCheckEligibility
}) => {
  const { t } = useTranslation();

  const getBannerImage = () => {
    const type = (resource.module || '').toLowerCase();
    if (type.includes('scheme')) return bgSchemes;
    if (type.includes('job') || type.includes('exam')) return bgJobs;
    if (type.includes('scholarship') || type.includes('internship')) return bgScholarships;
    if (type.includes('agriculture')) return bgAgriculture;
    if (type.includes('document') || type.includes('certificate')) return bgDocuments;
    return bgDefault;
  };

  return (
    <div className="bg-slate-50 border-b border-slate-200">

      {/* Header Banner (Matching Image 1 perfectly) */}
      <div
        className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200 flex flex-col justify-center min-h-[200px]"
        style={{
          backgroundImage: `url('${getBannerImage()}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#f8fafc' // Fallback
        }}
      >
        <div className="max-w-[1200px] mx-auto w-full text-center flex justify-center">
          <div className="max-w-4xl text-center">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1a365d] tracking-tight leading-[1.15] mb-2 drop-shadow-sm text-center">
              {resource.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Under Banner area - Back button and Actions */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row lg:items-start justify-between gap-6">

        {/* Left Side: Back Button, Breadcrumb, Provider */}
        <div className="flex flex-col items-start gap-4">
          <Link to="/services" className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors whitespace-nowrap bg-indigo-50 px-4 py-2 rounded-lg">
            <ArrowLeft size={16} className="mr-1.5" />
            Back
          </Link>

          {/* Breadcrumb moved here for cleaner banner */}
          <nav className="flex items-center text-sm font-semibold text-slate-500 mt-2" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-slate-800 transition-colors flex items-center gap-1">
              <Home size={14} />
              <span className="hidden sm:inline">{t('navigation.home')}</span>
            </Link>
            <ChevronRight size={14} className="mx-2 opacity-50" />
            <Link to={`/services/category/${encodeURIComponent(resource.module || '')}`} className="hover:text-slate-800 transition-colors">
              {resource.module || 'Resources'}
            </Link>
            <ChevronRight size={14} className="mx-2 opacity-50" />
            <span className="text-slate-800 truncate" aria-current="page">
              {resource.name}
            </span>
          </nav>

          <div className="flex flex-wrap gap-2 mt-1">
            <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-extrabold px-3 py-1 rounded-md uppercase tracking-widest shadow-sm">
              {resource.resourceType || 'Resource'}
            </span>
            {resource.location?.state && (
              <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-extrabold px-3 py-1 rounded-md uppercase tracking-widest flex items-center gap-1 shadow-sm">
                <Landmark size={12} /> {resource.location.state}
              </span>
            )}
          </div>

          {resource.authority && (
            <p className="text-sm text-slate-500 font-medium flex items-center gap-2 uppercase tracking-wider mt-2">
              Provided by: <span className="font-bold text-slate-700">{resource.authority}</span>
            </p>
          )}
        </div>

        {/* Desktop Primary Actions (Eligibility & External Link) */}
        <div className="hidden lg:flex flex-col gap-3 w-full lg:w-[280px] shrink-0 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-[-80px] z-10 relative">
          <h3 className="font-bold text-slate-800 mb-2">Next Steps</h3>
          <button
            onClick={onCheckEligibility}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-4 rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            {t('resource.checkEligibility')}
          </button>

          {resource.officialSources && resource.officialSources.length > 0 && (
            <a
              href={resource.officialSources[0].sourceURL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-sm text-sm mt-2"
            >
              {t('resource.visitOfficialSource')} <ExternalLink size={16} className="text-slate-400" />
            </a>
          )}

          <div className="flex gap-3 mt-2">
            <button
              onClick={onSaveToggle}
              disabled={saveLoading}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition text-sm ${saved
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm'
                }`}
            >
              <Bookmark size={16} className={saved ? 'fill-emerald-700' : ''} />
              {saved ? t('resource.saved') : t('resource.save')}
            </button>

            <button
              onClick={onShare}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold transition text-sm bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm"
              aria-label={t('resource.share')}
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
