import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, SlidersHorizontal, ArrowUpDown, X, BookOpen, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ServiceCard } from '../components/ui/ServiceCard';
import { SkeletonCard } from '../components/ui/SkeletonCard';

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

const STATES = [
  "All India",
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const ServiceList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  
  // URL State
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const stateParam = searchParams.get('state') || '';
  const sort = searchParams.get('sort') || (search ? 'relevance' : 'recent');
  const page = parseInt(searchParams.get('page') || '1', 10);

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
        if (stateParam && stateParam !== 'All India') params.append('state', stateParam);
        if (sort) params.append('sort', sort);
        params.append('page', page.toString());
        params.append('limit', '20');
        
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
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [category, search, stateParam, sort, page]);

  const updateParams = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    // Reset to page 1 on any filter change, except if we are explicitly updating page
    if (!updates.page) {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchInput });
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchInput('');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Banner */}
      <div className="bg-primary-900 pt-10 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto mt-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
            {category || "Unified Service Discovery"}
          </h1>
          <p className="text-primary-100 max-w-2xl text-lg">
            Search, filter, and discover verified government resources, schemes, jobs, and services.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
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
          <div className={`lg:w-1/4 flex-shrink-0 space-y-6 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-primary-600" />
                  {t('discovery.filters')}
                </h2>
                <button onClick={clearFilters} className="text-sm text-slate-500 hover:text-primary-600 font-medium">
                  {t('discovery.clearFilters')}
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Resource Module</h3>
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {CATEGORIES.map(cat => (
                    <label key={cat} className="flex items-center cursor-pointer group">
                      <input 
                        type="radio" 
                        name="category" 
                        value={cat}
                        checked={category === cat}
                        onChange={(e) => updateParams({ category: e.target.value })}
                        className="w-4 h-4 text-primary-600 border-slate-300 focus:ring-primary-500 cursor-pointer"
                      />
                      <span className="ml-3 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                        {cat}
                      </span>
                    </label>
                  ))}
                  <button 
                    onClick={() => updateParams({ category: null })}
                    className={`mt-2 text-sm ${!category ? 'font-bold text-primary-600' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    View All Modules
                  </button>
                </div>
              </div>

              <hr className="border-slate-100 my-6" />

              {/* State Filter */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">State / Jurisdiction</h3>
                <select 
                  value={stateParam}
                  onChange={(e) => updateParams({ state: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
                >
                  <option value="">Any Location</option>
                  {STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4 flex-grow">
            
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
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-11 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm transition-all"
                  />
                </div>
                <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary-700">
                  Search
                </button>
              </form>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="text-sm text-slate-500 font-medium whitespace-nowrap hidden sm:block">Sort by:</span>
                <div className="relative w-full md:w-auto">
                  <select 
                    value={sort}
                    onChange={(e) => updateParams({ sort: e.target.value })}
                    className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 rounded-xl pl-4 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm cursor-pointer"
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

            {/* Results Header */}
            <div className="flex justify-between items-end mb-6 px-1">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {category ? `Results in ${category}` : 'All Resources'}
                </h2>
                {!loading && (
                  <p className="text-sm text-slate-500 mt-1">
                    Showing {Math.min((page - 1) * pagination.limit + 1, pagination.total)} - {Math.min(page * pagination.limit, pagination.total)} of <span className="font-bold text-slate-700">{pagination.total}</span> verified results
                  </p>
                )}
              </div>
            </div>

            {/* Grid / Content */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 mb-10">
                  {services.map((service, idx) => (
                    <ServiceCard key={service.id || service._id || idx} service={service} />
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
                        // Logic to show pages around current page
                        let pageNum = page - 2 + i;
                        if (page <= 3) pageNum = i + 1;
                        if (page >= pagination.totalPages - 2) pageNum = pagination.totalPages - 4 + i;
                        pageNum = Math.max(1, Math.min(pageNum, pagination.totalPages));
                        
                        // Avoid duplicates
                        if (i > 0 && pageNum <= (page <= 3 ? i : (page >= pagination.totalPages - 2 ? pagination.totalPages - 5 + i : page - 3 + i))) return null;

                        return (
                          <button
                            key={pageNum}
                            onClick={() => updateParams({ page: String(pageNum) })}
                            className={`w-10 h-10 rounded-lg text-sm font-bold transition-colors ${
                              page === pageNum 
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
