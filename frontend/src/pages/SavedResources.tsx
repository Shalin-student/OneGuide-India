import React, { useEffect, useState } from 'react';
import { Bookmark, SearchX, AlertCircle, Compass, ArrowLeft } from 'lucide-react';
import api from '../lib/axios';
import { ServiceCard } from '../components/ui/ServiceCard';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORY_FILTERS = [
  "All",
  "Government Schemes",
  "Jobs & Exams",
  "Scholarships",
  "Internships",
  "Agriculture Services",
  "Documents & Certificates",
  "Government Portals",
  "Helplines"
];

export default function SavedResources() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    if (!user) return;
    
    const fetchSaved = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/saved-resources');
        if (res.data.status === 'success') {
          setResources(res.data.data);
        } else {
          setError(res.data.message || 'Failed to fetch saved resources');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSaved();
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const filteredResources = activeFilter === "All" 
    ? resources 
    : resources.filter(r => r.categoryId?.name === activeFilter);

  // Derive available categories dynamically to avoid showing dead filters
  const availableCategories = ["All", ...Array.from(new Set(resources.map(r => r.categoryId?.name).filter(Boolean)))];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 font-sans">
      <div className="bg-white border-b border-slate-200 pt-8 pb-8 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 font-bold mb-6 transition-colors"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center shadow-sm border border-primary-100 text-primary-600 shrink-0">
              <Bookmark size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                My Saved Resources
              </h1>
              <p className="text-slate-500 font-medium text-base mt-1">
                Keep useful government resources in one place for later.
              </p>
            </div>
          </div>
          <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 text-center shrink-0">
            <span className="block text-2xl font-extrabold text-slate-800 leading-none">{resources.length}</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saved Items</span>
          </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl flex items-start gap-3 mb-8 shadow-sm">
            <AlertCircle className="mt-0.5 shrink-0" size={20} />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {!loading && resources.length > 0 && availableCategories.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {availableCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat as string)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  activeFilter === cat 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card-base p-6 h-64 animate-pulse flex flex-col gap-4">
                <div className="flex justify-between">
                  <div className="h-6 bg-slate-100 rounded-md w-2/3"></div>
                  <div className="h-6 bg-slate-100 rounded-full w-20"></div>
                </div>
                <div className="h-4 bg-slate-100 rounded-md w-full mt-2"></div>
                <div className="h-4 bg-slate-100 rounded-md w-5/6"></div>
                <div className="mt-auto h-12 bg-slate-100 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="card-base p-12 md:p-20 flex flex-col items-center justify-center text-center max-w-3xl mx-auto mt-10">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
              <Bookmark size={40} className="text-slate-300" />
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Build your personal shortlist</h3>
            <p className="text-slate-500 font-medium text-lg max-w-lg mb-8 leading-relaxed">
              Save schemes, jobs, and services you want to revisit later. They will appear here for easy access.
            </p>
            <Link to="/services" className="bg-primary-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all hover:-translate-y-0.5 flex items-center gap-2">
              Explore Resources <Compass size={18} />
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            <AnimatePresence mode="popLayout">
              {filteredResources.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-center py-12 text-slate-500 font-medium"
                >
                  No resources match the selected filter.
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources.map((resource) => (
                    <ServiceCard key={resource._id} service={resource} />
                  ))}
                </div>
              )}
            </AnimatePresence>

            <div className="mt-12 pt-8 border-t border-slate-200 text-center">
              <p className="text-slate-500 font-medium mb-4">Looking for something else?</p>
              <Link to="/services" className="inline-flex items-center gap-2 bg-white text-slate-700 border border-slate-300 px-6 py-2.5 rounded-full font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
                Discover more resources <Compass size={16} />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
