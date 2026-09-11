import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bookmark, Share2, HelpCircle, FileText, HandHeart, CheckCircle2, ShieldCheck, FileCheck, ExternalLink, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../lib/axios';

import type { GovernmentResource } from '../components/resource-detail/types';
import { ResourceHeader } from '../components/resource-detail/ResourceHeader';
import { ResourceSummary } from '../components/resource-detail/ResourceSummary';
import { EligibilitySection } from '../components/resource-detail/EligibilitySection';
import { EligibilityChecker } from '../components/resource-detail/EligibilityChecker';
import { BenefitsSection } from '../components/resource-detail/BenefitsSection';
import { DocumentsSection } from '../components/resource-detail/DocumentsSection';
import { ApplicationSteps } from '../components/resource-detail/ApplicationSteps';
import { OfficialSources } from '../components/resource-detail/OfficialSources';
import { RelatedResources } from '../components/resource-detail/RelatedResources';

const SECTIONS = [
  { id: 'details', label: 'Details', icon: FileText },
  { id: 'eligibility', label: 'Eligibility', icon: CheckCircle2 },
  { id: 'benefits', label: 'Benefits', icon: HandHeart },
  { id: 'documents', label: 'Documents', icon: FileCheck },
  { id: 'application', label: 'How to Apply', icon: ShieldCheck },
  { id: 'sources', label: 'Sources', icon: ExternalLink },
];

const ServiceDetail = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [resource, setResource] = useState<GovernmentResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('details');
  const [isCheckerOpen, setIsCheckerOpen] = useState(false);
  
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

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

  // Scrollspy logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      for (const section of SECTIONS) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id); // Use standard element ID mapping
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100, 
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  const handleSaveToggle = async () => {
    if (!resource) return;
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
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50">
        <XCircle className="text-slate-400 mb-4" size={48} />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('resource.notFoundTitle')}</h2>
        <p className="text-slate-500">{t('resource.notFoundSubtitle')}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen pt-20 pb-20">
      <ResourceHeader resource={resource} />
      
      {/* Sticky Action Bar on Mobile, Action Bar inside Header on Desktop */}
      <div className="bg-white border-b sticky top-20 z-40 lg:static lg:top-auto lg:border-none lg:bg-transparent px-4 sm:px-6 lg:px-8 py-3 max-w-[1200px] mx-auto flex justify-between lg:justify-end gap-3 mt-0 lg:-mt-16 relative lg:z-20 pointer-events-none">
        <div className="flex gap-2 pointer-events-auto w-full lg:w-auto">
          <button 
            onClick={() => setIsCheckerOpen(true)}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all duration-300 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg"
          >
            {t('resource.checkEligibility')}
          </button>
          <button 
            onClick={handleSaveToggle}
            className={`hidden lg:flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all duration-300 ${
              saved 
                ? 'bg-primary-50 text-primary-700 border border-primary-200' 
                : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm'
            }`}
          >
            <Bookmark size={18} className={saved ? 'fill-primary-700 text-primary-700' : ''} />
            {saved ? t('resource.saved') : t('resource.save')}
          </button>
          <button className="hidden lg:flex p-2.5 rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors shadow-sm" aria-label="Share">
            <Share2 size={18} />
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-10 items-start">
        
        {/* LEFT SIDEBAR (Sticky Navigation) */}
        <div className="hidden lg:block w-72 flex-shrink-0 sticky top-28">
          <nav className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <ul className="flex flex-col">
              {SECTIONS.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-3 px-6 py-4 text-left text-sm font-semibold transition-colors duration-200 border-l-4 ${
                        isActive 
                          ? 'border-primary-600 bg-primary-50/50 text-primary-700' 
                          : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-primary-600' : 'text-slate-400'} />
                      {t(`resource.section${section.label.replace(/\s+/g, '')}`)}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* RIGHT MAIN CONTENT */}
        <div className="flex-1 space-y-12">
          
          <ResourceSummary resource={resource} />

          {/* Details / About */}
          <section id="details" className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
              <FileText className="text-primary-600" /> {t('resource.sectionDetails')}
            </h2>
            <div className="prose prose-primary max-w-none text-slate-700 text-base leading-relaxed bg-white rounded-xl p-6 sm:p-8 border border-slate-100 shadow-sm">
              <p>{resource.description}</p>
            </div>
          </section>

          <EligibilitySection resource={resource} />
          
          <BenefitsSection resource={resource} />
          
          <DocumentsSection resource={resource} />
          
          <ApplicationSteps resource={resource} />
          
          <OfficialSources resource={resource} />

          {resource.relatedResources && resource.relatedResources.length > 0 && (
            <RelatedResources resources={resource.relatedResources} />
          )}

        </div>
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
