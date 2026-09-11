import React, { useEffect, useState } from 'react';
import { Bookmark, SearchX, AlertCircle } from 'lucide-react';
import api from '../lib/axios';
import { ServiceCard } from '../components/ui/ServiceCard';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function SavedResources() {
  const { user } = useAuth();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-200 text-[#f05c19]">
            <Bookmark size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
              My Saved Resources
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-1">
              Quickly access the schemes, jobs, and services you've bookmarked.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl flex items-start gap-3 mb-6">
            <AlertCircle className="mt-0.5 shrink-0" size={18} />
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white p-6 border border-slate-200/60 rounded-2xl h-48 animate-pulse flex flex-col gap-4">
                <div className="flex justify-between">
                  <div className="h-6 bg-slate-100 rounded-md w-2/3"></div>
                  <div className="h-5 bg-slate-100 rounded-full w-16"></div>
                </div>
                <div className="h-4 bg-slate-100 rounded-md w-full"></div>
                <div className="h-4 bg-slate-100 rounded-md w-5/6"></div>
                <div className="mt-auto h-10 bg-slate-100 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="bg-white border border-slate-200/60 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
              <SearchX size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No saved resources yet</h3>
            <p className="text-slate-500 max-w-md mb-6">
              When you find a scheme, job, or service you want to keep track of, click the Save button to bookmark it here.
            </p>
            <a href="/services" className="bg-[#f05c19] text-white px-6 py-2.5 rounded-full font-semibold shadow-md hover:bg-orange-600 transition-all">
              Explore Resources
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <ServiceCard key={resource._id} service={resource} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
