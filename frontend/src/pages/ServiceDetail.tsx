import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bookmark, Share2, HelpCircle, XCircle } from 'lucide-react';
import { useTranslation } from '../../node_modules/react-i18next';
import api from '../lib/axios';

import type { GovernmentResource } from '../components/resource-detail/types';
import { ResourceHero } from '../components/resource-detail/ResourceHero';
import { ResourceSectionNav } from '../components/resource-detail/ResourceSectionNav';
import { ResourceQuickFacts } from '../components/resource-detail/ResourceQuickFacts';
import { ResourceSummary } from '../components/resource-detail/ResourceSummary';
import { EligibilitySection } from '../components/resource-detail/EligibilitySection';
import { EligibilityChecker } from '../components/resource-detail/EligibilityChecker';
import { BenefitsSection } from '../components/resource-detail/BenefitsSection';
import { DocumentsSection } from '../components/resource-detail/DocumentsSection';
import { ApplicationSteps } from '../components/resource-detail/ApplicationSteps';
import { OfficialSources } from '../components/resource-detail/OfficialSources';
import { RelatedResources } from '../components/resource-detail/RelatedResources';
import { TrustPanel } from '../components/resource-detail/TrustPanel';

const ServiceDetail = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [resource, setResource] = useState<GovernmentResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [isCheckerOpen, setIsCheckerOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('details');

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await api.get(`/services/slug/${slug}`);
        if (response.data && response.data.data) {
          setResource(response.data.data);
        }

        try {
          const profileRes = await api.get('/users/profile');
          const userSavedServices = profileRes.data.data.savedServices;
          if (userSavedServices.some((s: any) => s._id === response?.data?.data?.id || s === response?.data?.data?.id)) {
            setSaved(true);
          }
        } catch (e) {
          // ignore auth error
        }

      } catch (error) {
        console.error('Error fetching resource', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [slug]);

  // Simple scrollspy
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['details', 'eligibility', 'benefits', 'documents', 'application', 'sources'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 140, // Offset for sticky nav
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  const handleSaveToggle = async () => {
    if (!resource) return;
    setSaveLoading(true);
    try {
      if (saved) {
        await api.delete(`/users/saved-services/${resource.id}`);
        setSaved(false);
      } else {
        await api.post(`/users/saved-services/${resource.id}`, {});
        setSaved(true);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        navigate('/login');
      } else {
        console.error('Failed to toggle save', error);
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: resource?.name,
        text: resource?.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-48 mb-8"></div>
          <div className="h-6 bg-slate-200 rounded w-24 mb-4"></div>
          <div className="h-12 bg-slate-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/4 mb-12"></div>

          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1 space-y-8">
              <div className="h-40 bg-slate-200 rounded-2xl"></div>
              <div className="h-64 bg-slate-200 rounded-2xl"></div>
            </div>
            <div className="w-full lg:w-[340px] space-y-6">
              <div className="h-32 bg-slate-200 rounded-2xl"></div>
              <div className="h-12 bg-slate-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#f8f9fa] px-4">
        <XCircle className="text-slate-400 mb-4" size={56} />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('resource.notFoundTitle')}</h2>
        <p className="text-slate-500 mb-6 text-center max-w-md">{t('resource.notFoundSubtitle')}</p>
        <div className="flex gap-4">
          <button onClick={() => navigate('/explore')} className="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition">
            Explore Resources
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfc] min-h-screen pt-16 pb-24">
      <ResourceHero
        resource={resource}
        saved={saved}
        saveLoading={saveLoading}
        onSaveToggle={handleSaveToggle}
        onShare={handleShare}
        onCheckEligibility={() => setIsCheckerOpen(true)}
      />

      <ResourceSectionNav activeSection={activeSection} onNavigate={handleNavigate} />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start pt-8">

        {/* Main Content Area - 70% */}
        <div className="w-full lg:flex-1 space-y-12 lg:max-w-[70%]">
          <ResourceQuickFacts resource={resource} />
          <ResourceSummary resource={resource} onCheckEligibility={() => setIsCheckerOpen(true)} />
          <EligibilitySection resource={resource} />
          <BenefitsSection resource={resource} />
          <DocumentsSection resource={resource} />
          <ApplicationSteps resource={resource} />
          <OfficialSources resource={resource} />
        </div>

        {/* Right Guidance Panel - 30% */}
        <div className="w-full lg:w-[30%] flex-shrink-0 lg:sticky lg:top-36 space-y-6">
          <TrustPanel resource={resource} />
        </div>

      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {resource.relatedResources && resource.relatedResources.length > 0 && (
          <RelatedResources resources={resource.relatedResources} />
        )}
      </div>

      {/* Mobile Sticky Actions */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-40 flex gap-3 pb-safe">
        <button
          onClick={handleSaveToggle}
          disabled={saveLoading}
          className={`flex items-center justify-center p-3.5 rounded-xl font-semibold transition ${saved
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
          aria-label={saved ? t('resource.saved') : t('resource.save')}
        >
          <Bookmark size={20} className={saved ? 'fill-emerald-700' : ''} />
        </button>
        <button
          onClick={() => setIsCheckerOpen(true)}
          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-4 rounded-xl transition shadow-sm flex items-center justify-center"
        >
          {t('resource.checkEligibility')}
        </button>
      </div>

      <EligibilityChecker
        resource={resource}
        isOpen={isCheckerOpen}
        onClose={() => setIsCheckerOpen(false)}
      />
    </div>
  );
};

export default ServiceDetail;
