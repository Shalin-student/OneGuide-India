import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { ServiceCard } from '../../components/ui/ServiceCard';
import { SkeletonCard } from '../../components/ui/SkeletonCard';

export const RecommendedForYou = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        let allServices = [];
        try {
          const res = await axios.get('http://localhost:5000/api/v1/services');
          allServices = res.data?.data && res.data.data.length > 0 ? res.data.data : [];
        } catch (err) {
          allServices = [];
        }

        const userState = (user as any)?.state || '';
        const userEdu = (user as any)?.education || '';
        const userInterests = (user as any)?.userInterests || [];

        // Basic mock recommendation engine
        let scoredServices = allServices.map((service: any) => {
          let score = 0;
          let reasons = [];

          // Match by category/interest
          const categoryName = service.categoryId?.name || service.category?.name || '';
          if (userInterests.includes(categoryName)) {
            score += 5;
            reasons.push(`interested in ${categoryName}`);
          }

          // State matching
          const isStateSpecific = service.stateOrCentral === 'State Government';
          if (isStateSpecific && service.name.includes(userState)) {
            score += 10;
            reasons.push(`from ${userState}`);
          } else if (service.stateOrCentral === 'Central Government') {
            score += 2; // Central schemes are for everyone
          }

          // Education matching (rough keyword match)
          if (userEdu && (service.name.includes('Scholarship') || service.description.includes('education'))) {
            if (categoryName === 'Scholarships') {
              score += 5;
              reasons.push(`an ${userEdu} student`);
            }
          }

          // Create a natural language reason
          let matchReason = "Recommended based on your profile";
          if (reasons.length > 0) {
             matchReason = `Recommended because you are ${reasons.join(' and ')}.`;
          }

          return { ...service, score, matchReason };
        });

        // Sort by score and take top 3
        scoredServices.sort((a: any, b: any) => b.score - a.score);
        setRecommendations(scoredServices.slice(0, 3));
      } catch (error) {
        console.error("Failed to load recommendations", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  if (!user) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Recommended For You</h2>
            <p className="text-slate-500 font-medium mt-1 text-sm">Personalized AI matches based on your profile and goals</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => <SkeletonCard key={n} />)}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((service, index) => (
              <motion.div
                key={service._id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col"
              >
                <ServiceCard service={service} />
                <div className="mt-2 bg-orange-50 text-orange-800 text-xs font-medium px-4 py-2 rounded-lg flex items-start gap-2 border border-orange-100 shadow-sm">
                  <Sparkles size={14} className="text-orange-500 shrink-0 mt-0.5" />
                  <span>{service.matchReason}</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 mb-6 border border-slate-100">
               <BookOpen className="text-slate-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">More recommendations coming soon</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              We are constantly analyzing opportunities. Keep your profile updated for the best matches.
            </p>
            <Link 
              to="/services"
              className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md hover:bg-primary-700 transition-all inline-block"
            >
              Browse All Services
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
