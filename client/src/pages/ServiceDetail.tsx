import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, FileText, ExternalLink, Bookmark, ShieldCheck, Share2, HelpCircle, FileCheck, Landmark, HandHeart, XCircle } from 'lucide-react';
import axios from 'axios';

const SECTIONS = [
  { id: 'details', label: 'Details', icon: FileText },
  { id: 'benefits', label: 'Benefits', icon: HandHeart },
  { id: 'eligibility', label: 'Eligibility', icon: CheckCircle2 },
  { id: 'exclusions', label: 'Exclusions', icon: XCircle },
  { id: 'application', label: 'Application Process', icon: ShieldCheck },
  { id: 'documents', label: 'Documents Required', icon: FileCheck },
  { id: 'faqs', label: 'Frequently Asked Questions', icon: HelpCircle },
  { id: 'sources', label: 'Sources', icon: ExternalLink },
];

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('details');
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/services/slug/${slug}`);
        if (response.data && response.data.data) {
           setService(response.data.data);
        }
        
        try {
          const profileRes = await axios.get('http://localhost:5000/api/v1/users/profile', { withCredentials: true, timeout: 1500 });
          const userSavedServices = profileRes.data.data.savedServices;
          if (userSavedServices.some((s: any) => s._id === response?.data?.data?._id || s === response?.data?.data?._id)) {
            setSaved(true);
          }
        } catch (e) {
          // ignore
        }
        
      } catch (error) {
        console.error('Error fetching service', error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  // Scrollspy logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // offset for sticky header
      
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
    const element = sectionRefs.current[id];
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100, // Offset for sticky header
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  const handleSaveToggle = async () => {
    if (!service) return;
    try {
      if (saved) {
        await axios.delete(`http://localhost:5000/api/v1/users/saved-services/${service._id}`, { withCredentials: true });
        setSaved(false);
      } else {
        await axios.post(`http://localhost:5000/api/v1/users/saved-services/${service._id}`, {}, { withCredentials: true });
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
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <AlertTriangle className="text-gray-400 mb-4" size={48} />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h2>
        <p className="text-gray-500">The service you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen pt-20">
      
      {/* Title Header Section */}
      <div className="bg-white border-b relative z-10 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {service.categoryId?.name || service.category?.name || 'Service'}
                </span>
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Landmark size={12} /> {service.stateOrCentral || service.level || 'Central Government'}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
                {service.name}
              </h1>
              <p className="text-sm md:text-base text-gray-500 font-medium">
                Provided by: <span className="text-gray-700">{service.governmentDepartment || service.department || 'Government of India'}</span>
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handleSaveToggle}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                  saved 
                    ? 'bg-primary-50 text-primary-700 border border-primary-200' 
                    : 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg'
                }`}
              >
                <Bookmark size={18} className={saved ? 'fill-primary-700' : ''} />
                {saved ? 'Saved to Profile' : 'Save this Scheme'}
              </button>
              <button className="p-3 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors tooltip" aria-label="Share">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-10 items-start">
        
        {/* LEFT SIDEBAR (Sticky Navigation) */}
        <div className="hidden lg:block w-72 flex-shrink-0 sticky top-28">
          <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-primary-600' : 'text-gray-400'} />
                      {section.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* RIGHT MAIN CONTENT */}
        <div className="flex-1 space-y-12">
          
          {/* Details */}
          <section id="details" ref={el => { sectionRefs.current['details'] = el; }} className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
              <FileText className="text-primary-600" /> Details
            </h2>
            <div className="prose prose-primary max-w-none text-gray-700">
              {service.detailedDescription ? (
                <div className="space-y-4 text-base leading-relaxed">
                  {service.detailedDescription.map((p: string, i: number) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              ) : (
                <p className="text-base leading-relaxed">{service.description}</p>
              )}
            </div>
          </section>

          {/* Benefits */}
          <section id="benefits" ref={el => { sectionRefs.current['benefits'] = el; }} className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
              <HandHeart className="text-primary-600" /> Benefits
            </h2>
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              {service.benefits && Array.isArray(service.benefits) ? (
                <ul className="space-y-4">
                  {service.benefits.map((benefit: string, i: number) => (
                    <li key={i} className="flex gap-3 text-gray-700 leading-relaxed">
                      <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center">
                        <CheckCircle2 size={12} className="text-primary-700" />
                      </div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700 leading-relaxed">{service.benefits || "Details about benefits will be updated soon."}</p>
              )}
            </div>
          </section>

          {/* Eligibility */}
          <section id="eligibility" ref={el => { sectionRefs.current['eligibility'] = el; }} className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
              <CheckCircle2 className="text-primary-600" /> Eligibility
            </h2>
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              {service.eligibility && Array.isArray(service.eligibility) ? (
                <ul className="space-y-4">
                  {service.eligibility.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700 leading-relaxed">{service.eligibility || "Eligibility criteria is not specified."}</p>
              )}
            </div>
          </section>

          {/* Exclusions */}
          <section id="exclusions" ref={el => { sectionRefs.current['exclusions'] = el; }} className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
              <XCircle className="text-red-500" /> Exclusions
            </h2>
            <div className="bg-red-50/50 rounded-xl p-6 sm:p-8 border border-red-100">
              {service.exclusions && Array.isArray(service.exclusions) ? (
                <ul className="space-y-4">
                  {service.exclusions.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-gray-800 leading-relaxed">
                      <XCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700">No specific exclusions listed for this scheme.</p>
              )}
            </div>
          </section>

          {/* Application Process */}
          <section id="application" ref={el => { sectionRefs.current['application'] = el; }} className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
              <ShieldCheck className="text-primary-600" /> Application Process
            </h2>
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Step-by-step Guide</h3>
              {service.applicationProcess && Array.isArray(service.applicationProcess) ? (
                <div className="space-y-6">
                  {service.applicationProcess.map((step: string, i: number) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm">
                        {i + 1}
                      </div>
                      <div className="pt-1 text-gray-700 leading-relaxed">
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-700 leading-relaxed">{service.applicationProcess || "Application process details will be updated."}</p>
              )}
            </div>
          </section>

          {/* Documents Required */}
          <section id="documents" ref={el => { sectionRefs.current['documents'] = el; }} className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
              <FileCheck className="text-primary-600" /> Documents Required
            </h2>
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              {service.documentsRequired && Array.isArray(service.documentsRequired) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.documentsRequired.map((doc: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                      <FileText size={18} className="text-primary-600 flex-shrink-0" />
                      <span className="text-gray-700 text-sm font-medium">{doc}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-700">{service.documentsRequired || "No specific documents listed."}</p>
              )}
            </div>
          </section>

          {/* FAQs */}
          <section id="faqs" ref={el => { sectionRefs.current['faqs'] = el; }} className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
              <HelpCircle className="text-primary-600" /> Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {service.faqs && Array.isArray(service.faqs) && service.faqs.length > 0 ? (
                service.faqs.map((faq: any, i: number) => (
                  <details key={i} className="group bg-white border border-gray-100 rounded-xl shadow-sm">
                    <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-gray-900 marker:content-none">
                      {faq.question}
                      <span className="transition group-open:rotate-180">
                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24" className="text-gray-500"><path d="M6 9l6 6 6-6"></path></svg>
                      </span>
                    </summary>
                    <div className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                      {faq.answer}
                    </div>
                  </details>
                ))
              ) : (
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-gray-600">
                  No frequently asked questions available for this scheme yet.
                </div>
              )}
            </div>
          </section>

          {/* Sources */}
          <section id="sources" ref={el => { sectionRefs.current['sources'] = el; }} className="scroll-mt-32 mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
              <ExternalLink className="text-primary-600" /> Sources
            </h2>
            <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
              
              <p className="text-gray-400 mb-6 max-w-2xl text-sm leading-relaxed relative z-10">
                This information is compiled from official government sources for easy reference. 
                Always verify details on the official portals before applying.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                {service.sources && Array.isArray(service.sources) ? (
                  service.sources.map((source: any, i: number) => (
                    <a 
                      key={i}
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex flex-col p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary-500/30 rounded-xl transition-all group"
                    >
                      <span className="font-semibold text-white mb-1 group-hover:text-primary-400 transition-colors">{source.title}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        Visit Source <ExternalLink size={10} />
                      </span>
                    </a>
                  ))
                ) : (
                  service.sourceUrl && (
                     <a 
                      href={service.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex flex-col p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary-500/30 rounded-xl transition-all group"
                    >
                      <span className="font-semibold text-white mb-1 group-hover:text-primary-400 transition-colors">Official Portal</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        Visit Source <ExternalLink size={10} />
                      </span>
                    </a>
                  )
                )}
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
