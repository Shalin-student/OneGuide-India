import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Search, SlidersHorizontal, ArrowUpDown, X, BookOpen, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../../node_modules/react-i18next';
import { ServiceCard } from '../components/ui/ServiceCard';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { getHighlightKeywords } from '../components/search/searchUtils';
import { useAuth } from '../context/AuthContext';
import { DiscoveryFilters } from '../components/search/DiscoveryFilters';
import { ActiveFilterChips } from '../components/search/ActiveFilterChips';


import bgSchemes from '../assets/banners/bg_schemes_1789627553903.jpg';
import bgJobs from '../assets/banners/bg_jobs_1789627566139.jpg';
import bgScholarships from '../assets/banners/bg_scholarships_1789627578444.jpg';
import bgAgriculture from '../assets/banners/bg_agriculture_1789627592280.jpg';
import bgDocuments from '../assets/banners/bg_documents_1789627607524.jpg';
import bgDefault from '../assets/banners/bg_default_1789627619605.jpg';

const CATEGORIES = [
  "Government Schemes",
  "Jobs & Exams",
  "Scholarships",
  "Internships",
  "Agriculture Services",
  "Documents & Certificates",
  "Government Portals",
  "Helplines"
];

const ServiceList = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });

  // URL State
  const categoryParam = searchParams.get('category');
  const category = categoryName
    ? decodeURIComponent(categoryName.replace(/\+/g, ' '))
    : (categoryParam || '');
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || (search ? 'relevance' : 'recent');
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  // Extract all potential filters dynamically from URL params
  const activeFilters: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (!['search', 'page', 'limit', 'sort', 'category'].includes(key)) {
      activeFilters[key] = value;
    }
  });

  // Local Form State
  const [searchInput, setSearchInput] = useState(search);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync search input with URL when URL changes externally
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (search) params.append('search', search);
        if (sort) params.append('sort', sort);
        params.append('page', page.toString());
        params.append('limit', '20');

        // Append all active dynamic filters
        Object.entries(activeFilters).forEach(([key, value]) => {
          if (value && value !== 'All') {
            params.append(key, value);
          }
        });

        const url = `http://localhost:5000/api/v1/discovery?${params.toString()}`;

        const response = await axios.get(url);
        if (response.data && response.data.data) {
          setServices(response.data.data);
          setPagination(response.data.pagination || { page: 1, limit: 20, total: response.data.data.length, totalPages: 1 });
        } else {
          setServices([]);
        }
      } catch (err: any) {
        console.error('Failed to fetch services:', err);
        setError(err.message || 'An error occurred while fetching services.');
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [category, search, sort, page, ...Object.values(activeFilters)]);

  const updateParams = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    // Clean up legacy category query param if it exists
    if (newParams.has('category')) newParams.delete('category');

    let targetCategory = category;
    
    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'category') {
        targetCategory = value || '';
      } else if (value === null || value === '' || value === 'All') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    // Reset to page 1 on any filter change, except if we are explicitly updating page
    if (!updates.page) {
      newParams.set('page', '1');
    }

    if (updates.hasOwnProperty('category')) {
      if (targetCategory) {
        navigate(`/services/category/${encodeURIComponent(targetCategory)}?${newParams.toString()}`);
      } else {
        navigate(`/services?${newParams.toString()}`);
      }
    } else {
      setSearchParams(newParams);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchInput });
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchInput('');
    navigate('/services');
  };

  const removeFilter = (key: string) => {
    updateParams({ [key]: null });
  };

  const getBannerImage = (cat: string | null) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('scheme')) return bgSchemes;
    if (c.includes('job') || c.includes('exam')) return bgJobs;
    if (c.includes('scholarship') || c.includes('internship')) return bgScholarships;
    if (c.includes('agriculture')) return bgAgriculture;
    if (c.includes('document') || c.includes('certificate')) return bgDocuments;
    return bgDefault;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Banner */}
      <div
        className="py-5 md:py-7 px-4 sm:px-6 lg:px-8 border-b border-slate-200 flex flex-col justify-center min-h-[128px] relative"
      >
        <div className="absolute inset-0 z-0" style={{ backgroundImage: `url('${getBannerImage(category)}')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#f8fafc' }} />
        <div className="absolute inset-0 bg-white/35 backdrop-blur-[1px] z-0" />
        <div className="max-w-7xl mx-auto w-full text-center flex justify-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-2 max-w-4xl text-center">
            {category || "Unified Service Discovery"}
          </h1>
        </div>
      </div>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <span className="font-semibold text-slate-700">{t('discovery.filters')}</span>
            <button
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="bg-slate-100 p-2 rounded-lg text-slate-600 hover:bg-primary-50 hover:text-primary-600"
            >
              {isMobileFiltersOpen ? <X size={20} /> : <SlidersHorizontal size={20} />}
            </button>
          </div>

          {/* Sidebar Filters */}
          <div className={`lg:w-[320px] flex-shrink-0 space-y-6 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar">
              {/* Dynamic Modular Filters */}
              <DiscoveryFilters 
                category={category} 
                filters={activeFilters} 
                onChange={(k, v) => updateParams({ [k]: v })} 
                onClear={clearFilters}
                resultCount={pagination.total}
                categorySlot={
                  <div className="mb-6 mt-5 pb-6 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Resource Category</h3>
                    <div className="relative">
                      <select
                        value={category || ''}
                        onChange={(e) => updateParams({ category: e.target.value || null })}
                        className="w-full appearance-none bg-slate-50 border border-slate-200 font-medium text-slate-900 rounded-xl pl-4 pr-10 py-3 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm cursor-pointer transition-all"
                      >
                        <option value="">All Resources</option>
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <ArrowUpDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                }
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">

            {/* Search and Sort Top Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
              <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md flex gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder={t('common.searchPlaceholder')}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-medium rounded-xl pl-11 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm transition-all"
                  />
                </div>
                <button
                  type="submit"
                  aria-label="Search services"
                  title="Search services"
                  className="inline-flex items-center justify-center bg-primary-600 text-white w-11 rounded-xl hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-colors"
                >
                  <Search size={18} aria-hidden="true" />
                </button>
              </form>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="text-sm text-slate-500 font-medium whitespace-nowrap hidden sm:block">Sort by:</span>
                <div className="relative w-full md:w-auto">
                  <select
                    value={sort}
                    onChange={(e) => updateParams({ sort: e.target.value })}
                    className="w-full appearance-none bg-slate-50 border border-slate-200 font-medium text-slate-900 rounded-xl pl-4 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm cursor-pointer"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="recent">Recently Verified</option>
                    <option value="a-z">Alphabetical (A-Z)</option>
                    <option value="z-a">Alphabetical (Z-A)</option>
                  </select>
                  <ArrowUpDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="mb-6 px-1">
              <ActiveFilterChips filters={activeFilters} onRemove={removeFilter} onClearAll={clearFilters} />
            </div>

            {/* Results Header */}
            <div className="flex justify-between items-end mb-6 px-1">
              <div>
                {category && (
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    Results in {category}
                  </h2>
                )}
                {!loading && (
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    Showing {Math.min((page - 1) * pagination.limit + 1, pagination.total)} - {Math.min(page * pagination.limit, pagination.total)} of <span className="font-bold text-slate-800">{pagination.total}</span> verified results
                  </p>
                )}
              </div>
            </div>

            {/* Grid / Content */}
            {loading ? (
              <div className="flex flex-col gap-6">
                {[1, 2, 3, 4, 5, 6].map(n => <SkeletonCard key={n} />)}
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-100 flex flex-col items-center text-center">
                <AlertCircle size={40} className="mb-4 text-red-400" />
                <h3 className="text-lg font-bold mb-2">Failed to load services</h3>
                <p>{error}</p>
              </div>
            ) : services.length > 0 ? (
              <>
                <div className="flex flex-col gap-6 mb-10">
                  {services.map((service, idx) => (
                    <ServiceCard
                      key={service.id || service._id || idx}
                      service={service}
                      highlightKeywords={getHighlightKeywords(search)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => updateParams({ page: String(page - 1) })}
                      disabled={page === 1}
                      className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <div className="hidden sm:flex gap-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum = page - 2 + i;
                        if (page <= 3) pageNum = i + 1;
                        if (page >= pagination.totalPages - 2) pageNum = pagination.totalPages - 4 + i;
                        pageNum = Math.max(1, Math.min(pageNum, pagination.totalPages));

                        if (i > 0 && pageNum <= (page <= 3 ? i : (page >= pagination.totalPages - 2 ? pagination.totalPages - 5 + i : page - 3 + i))) return null;

                        return (
                          <button
                            key={pageNum}
                            onClick={() => updateParams({ page: String(pageNum) })}
                            className={`w-10 h-10 rounded-lg text-sm font-bold transition-colors ${page === pageNum
                                ? 'bg-primary-600 text-white shadow-sm'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <span className="sm:hidden text-sm font-bold text-slate-700">
                      Page {page} of {pagination.totalPages}
                    </span>

                    <button
                      onClick={() => updateParams({ page: String(page + 1) })}
                      disabled={page >= pagination.totalPages}
                      className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                      aria-label="Next page"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 mb-6 border border-slate-100">
                  <BookOpen className="text-slate-300" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{t('discovery.noResults')}</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-6">
                  We couldn't find any resources matching your current filters. Try adjusting your search or clearing the filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md hover:bg-primary-700 transition-all"
                >
                  {t('discovery.clearFilters')}
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceList;
