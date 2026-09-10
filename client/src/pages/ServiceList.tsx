import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, SlidersHorizontal, ArrowUpDown, X, BookOpen, AlertCircle } from 'lucide-react';
import { ServiceCard } from '../components/ui/ServiceCard';
import { SkeletonCard } from '../components/ui/SkeletonCard';

const CATEGORIES = [
  "Government Schemes",
  "Jobs & Exams",
  "Scholarships",
  "Agriculture Services",
  "Documents & Certificates"
];

const DEPARTMENTS = [
  "Ministry of Agriculture",
  "Ministry of Education",
  "Ministry of Finance",
  "Ministry of Health",
  "Ministry of Labor",
  "General Department"
];

const ServiceList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter States
  const urlCategory = searchParams.get('category') || '';
  const urlSearch = searchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState(
    CATEGORIES.find(c => c.toLowerCase() === urlCategory.toLowerCase()) || ''
  );
  const [selectedStateCentral, setSelectedStateCentral] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [sortBy, setSortBy] = useState('relevance');

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = 'http://localhost:5000/api/v1/services';
        const params = new URLSearchParams();
        if (urlCategory) params.append('category', urlCategory);
        if (urlSearch) params.append('search', urlSearch);
        
        if (params.toString()) {
            url += `?${params.toString()}`;
        }
        
        const response = await axios.get(url);
        if (response.data && response.data.data && response.data.data.length > 0) {
          setServices(response.data.data);
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
  }, [urlCategory, urlSearch]); // Keep discovery results in sync with the backend query in the URL

  // Client-side filtering logic for immediate feedback
  const filteredServices = useMemo(() => {
    let result = services;

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name?.toLowerCase().includes(q) || 
        s.description?.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory) {
      result = result.filter(s => s.categoryId?.name === selectedCategory);
    }

    // State/Central
    if (selectedStateCentral) {
      result = result.filter(s => s.stateOrCentral === selectedStateCentral);
    }

    // Department
    if (selectedDepartment) {
      result = result.filter(s => s.governmentDepartment === selectedDepartment);
    }

    // Sorting
    if (sortBy === 'a-z') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'z-a') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [services, searchQuery, selectedCategory, selectedStateCentral, selectedDepartment, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    if (searchQuery) newParams.set('search', searchQuery);
    if (selectedCategory) newParams.set('category', selectedCategory);
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedStateCentral('');
    setSelectedDepartment('');
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Banner */}
      <div className="bg-primary-900 pt-10 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto mt-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
            {selectedCategory === "Government Schemes" ? "Government Schemes" :
             selectedCategory === "Jobs & Exams" ? "Government Jobs & Exams" :
             selectedCategory === "Scholarships" ? "Scholarships & Education" :
             selectedCategory === "Documents & Certificates" ? "Documents & Certificates" :
             selectedCategory === "Agriculture Services" ? "Agriculture Services" :
             "Service Discovery Portal"}
          </h1>
          <p className="text-primary-100 max-w-2xl text-lg">
            {selectedCategory === "Government Schemes" ? "Find government schemes and welfare opportunities available through OneGuide India." :
             selectedCategory === "Jobs & Exams" ? "Find government job openings and exam opportunities available through OneGuide India." :
             selectedCategory === "Scholarships" ? "Find scholarships and educational opportunities available through OneGuide India." :
             selectedCategory === "Documents & Certificates" ? "Find document services and certificate applications available through OneGuide India." :
             selectedCategory === "Agriculture Services" ? "Find agriculture support and services available through OneGuide India." :
             "Find and apply for government schemes, jobs, scholarships, and essential certificates all in one place."}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <span className="font-semibold text-slate-700">Filter Results</span>
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
                  Filters
                </h2>
                <button onClick={clearFilters} className="text-sm text-slate-500 hover:text-primary-600 font-medium">
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Category</h3>
                <div className="space-y-2.5">
                  {CATEGORIES.map(cat => (
                    <label key={cat} className="flex items-center cursor-pointer group">
                      <input 
                        type="radio" 
                        name="category" 
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 text-primary-600 border-slate-300 focus:ring-primary-500 cursor-pointer"
                      />
                      <span className="ml-3 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <hr className="border-slate-100 my-6" />

              {/* State vs Central */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Jurisdiction</h3>
                <div className="space-y-2.5">
                  {['Central Government', 'State Government'].map(type => (
                    <label key={type} className="flex items-center cursor-pointer group">
                      <input 
                        type="radio" 
                        name="jurisdiction" 
                        value={type}
                        checked={selectedStateCentral === type}
                        onChange={(e) => setSelectedStateCentral(e.target.value)}
                        className="w-4 h-4 text-primary-600 border-slate-300 focus:ring-primary-500 cursor-pointer"
                      />
                      <span className="ml-3 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <hr className="border-slate-100 my-6" />

              {/* Department Filter */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Department</h3>
                <select 
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
                >
                  <option value="">All Departments</option>
                  {DEPARTMENTS.map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4 flex-grow">
            
            {/* Search and Sort Top Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
              <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by keyword, name, or ID..." 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-11 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm transition-all"
                />
              </form>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="text-sm text-slate-500 font-medium whitespace-nowrap hidden sm:block">Sort by:</span>
                <div className="relative w-full md:w-auto">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 rounded-xl pl-4 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm cursor-pointer"
                  >
                    <option value="relevance">Relevance</option>
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
                  {selectedCategory ? `Search within ${selectedCategory}` : 'All Services'}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Showing <span className="font-bold text-slate-700">{filteredServices.length}</span> results
                </p>
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
            ) : filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {filteredServices.map((service) => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 mb-6 border border-slate-100">
                   <BookOpen className="text-slate-300" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No matching services found</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-6">
                  We couldn't find any services matching your current filters. Try adjusting your search or clearing the filters.
                </p>
                <button 
                  onClick={clearFilters}
                  className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md hover:bg-primary-700 transition-all"
                >
                  Clear All Filters
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
