import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, Target, MapPin, Landmark, HeartHandshake, GraduationCap as GradIcon, Briefcase, Award, BookOpen, Sprout, FileText, Phone, Compass, Check, AlertCircle } from 'lucide-react';
import { INDIA_STATES, INDIA_STATES_AND_DISTRICTS } from '../data/indiaData';
import { useTranslation } from '../../node_modules/react-i18next';
import { useAuth } from '../context/AuthContext';

const INTEREST_OPTIONS = [
  { id: 'Government Schemes & Yojanas', label: 'Government Schemes', icon: <Landmark size={20} /> },
  { id: 'Government Jobs & Exams', label: 'Government Jobs', icon: <Briefcase size={20} /> },
  { id: 'Scholarships', label: 'Scholarships', icon: <Award size={20} /> },
  { id: 'Internships', label: 'Internships', icon: <BookOpen size={20} /> },
  { id: 'Agriculture Services', label: 'Agriculture', icon: <Sprout size={20} /> },
  { id: 'Government Documents & Certificates', label: 'Documents', icon: <FileText size={20} /> },
  { id: 'Emergency Helplines', label: 'Helplines', icon: <Phone size={20} /> }
];

const LANGUAGE_OPTIONS = [
  { id: 'en', label: 'English', native: 'English' },
  { id: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { id: 'gu', label: 'Gujarati', native: 'ગુજરાતી' }
];

const STATUS_OPTIONS = ['Student', 'Employed', 'Unemployed', 'Self-employed', 'Farmer', 'Business owner', 'Other'];

export default function Onboarding() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { checkAuth } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    age: '',
    state: '',
    district: '',
    currentStatus: '',
    educationLevel: '',
    annualIncomeRange: '',
    socialCategory: '',
    gender: '',
    disabilityStatus: '',
    minorityStatus: '',
    maritalStatus: '',
    residence: '',
    bplStatus: '',
    governmentEmployee: '',
    economicDistress: '',
    userInterests: [] as string[],
    preferredLanguage: 'en'
  });

  // Ensure scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setError('');
  }, [step]);

  const availableDistricts = formData.state ? INDIA_STATES_AND_DISTRICTS[formData.state] || [] : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'state') {
      setFormData(prev => ({ ...prev, state: value, district: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      userInterests: prev.userInterests.includes(interest)
        ? prev.userInterests.filter(i => i !== interest)
        : [...prev.userInterests, interest]
    }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.age || !formData.state || !formData.district) {
        setError('Please fill in all required fields to continue.');
        return false;
      }
    }
    if (step === 2) {
      if (!formData.currentStatus) {
        setError('Please select your current status.');
        return false;
      }
      if (formData.currentStatus === 'Student' && !formData.educationLevel) {
        setError('Please select your current education level.');
        return false;
      }
    }
    if (step === 3) {
      if (!formData.annualIncomeRange) {
        setError('Please select your annual family income.');
        return false;
      }
    }
    if (step === 4) {
      if (formData.userInterests.length === 0) {
        setError('Please select at least one interest to personalize your discovery.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(s => Math.min(s + 1, 6));
    }
  };

  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      const res = await api.post('/auth/onboarding', {
        ...formData,
        employmentStatus: formData.currentStatus,
        age: formData.age ? parseInt(formData.age) : undefined
      });

      if (res.data.status === 'success') {
        await checkAuth(); // Update global context so header reflects onboarding complete
        setStep(7); // Success step
      }
    } catch (err: any) {
      console.error('Onboarding failed', err);
      setError(err.response?.data?.message || 'Failed to save preferences. Please try again.');
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // SUCCESS STEP (Step 7)
  // ---------------------------------------------------------
  if (step === 7) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white max-w-md w-full p-8 rounded-3xl shadow-xl text-center border border-slate-200"
        >
          <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-primary-200">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Your profile is ready</h2>
          <p className="text-slate-600 text-lg mb-8 leading-relaxed font-medium">
            Explore resources personalized to your preferences and discover what you're eligible for.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary-600/20"
          >
            Explore Resources <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // RENDER STEP CONTENT
  // ---------------------------------------------------------
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8">
            <div>
              <div className="text-primary-600 font-bold text-sm tracking-wider uppercase mb-2">Step 01</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Tell us about you</h2>
              <p className="text-slate-600 font-medium text-lg">
                This helps OneGuide understand which government resources and schemes may be relevant to you.
              </p>
            </div>

            <div className="bg-primary-50 text-primary-800 p-4 rounded-xl border border-primary-100 flex items-start gap-3">
              <MapPin className="shrink-0 mt-0.5" size={20} />
              <p className="text-sm font-medium"><strong>Why we ask for location:</strong> Some government resources are state or district specific.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Age <span className="text-rose-500">*</span></label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm font-medium text-slate-900"
                  placeholder="e.g., 24"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">State <span className="text-rose-500">*</span></label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm font-medium text-slate-900 appearance-none"
                  >
                    <option value="">Select State</option>
                    {INDIA_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">District <span className="text-rose-500">*</span></label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    disabled={!formData.state || formData.state === 'All India'}
                    className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm font-medium text-slate-900 disabled:bg-slate-100 disabled:opacity-60 appearance-none"
                  >
                    <option value="">Select District</option>
                    {availableDistricts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <div>
              <div className="text-primary-600 font-bold text-sm tracking-wider uppercase mb-2">Step 02</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Education & Status</h2>
              <p className="text-slate-600 font-medium text-lg">
                Your current occupation and education level greatly determine your eligibility.
              </p>
            </div>

            <div className="bg-primary-50 text-primary-800 p-4 rounded-xl border border-primary-100 flex items-start gap-3">
              <GradIcon className="shrink-0 mt-0.5" size={20} />
              <p className="text-sm font-medium"><strong>Why we ask for education:</strong> Education can affect eligibility for jobs, scholarships and internships.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">What best describes your current status? <span className="text-rose-500">*</span></label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {STATUS_OPTIONS.map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({ ...formData, currentStatus: status, educationLevel: status !== 'Student' ? formData.educationLevel : '' })}
                      className={`px-4 py-3.5 rounded-xl border-2 text-center font-bold transition-all flex items-center justify-center gap-2 ${formData.currentStatus === status
                          ? 'bg-primary-50 border-primary-600 text-primary-700 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                      {formData.currentStatus === status && <Check size={16} className="text-primary-600" />}
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {formData.currentStatus === 'Student' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">What is your current education level? <span className="text-rose-500">*</span></label>
                  <select
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm font-medium text-slate-900 appearance-none"
                  >
                    <option value="">Select Level</option>
                    <option value="Below 10th">Below 10th</option>
                    <option value="10th Pass">10th Pass</option>
                    <option value="12th Pass">12th Pass</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="PhD">PhD</option>
                    <option value="Other">Other</option>
                  </select>
                </motion.div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <div>
              <div className="text-primary-600 font-bold text-sm tracking-wider uppercase mb-2">Step 03</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Eligibility Criteria</h2>
              <p className="text-slate-600 font-medium text-lg">
                Financial and social categories are key requirements for many targeted government schemes.
              </p>
            </div>

            <div className="bg-primary-50 text-primary-800 p-4 rounded-xl border border-primary-100 flex items-start gap-3">
              <Landmark className="shrink-0 mt-0.5" size={20} />
              <p className="text-sm font-medium"><strong>Why we ask this:</strong> Many schemes have strict income limits or are reserved for specific social categories.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Annual Family Income <span className="text-rose-500">*</span></label>
                <select
                  name="annualIncomeRange"
                  value={formData.annualIncomeRange}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm font-medium text-slate-900 appearance-none"
                >
                  <option value="">Select Range</option>
                  <option value="Below 1 Lakh">Below ₹1 Lakh</option>
                  <option value="1L - 2.5L">₹1L - ₹2.5L</option>
                  <option value="2.5L - 5L">₹2.5L - ₹5L</option>
                  <option value="5L - 8L">₹5L - ₹8L</option>
                  <option value="Above 8 Lakh">Above ₹8 Lakh</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Social Category</label>
                  <select
                    name="socialCategory"
                    value={formData.socialCategory}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm font-medium text-slate-900 appearance-none"
                  >
                    <option value="">Optional</option>
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm font-medium text-slate-900 appearance-none"
                  >
                    <option value="">Optional</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Transgender / Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Differently Abled?</label>
                  <select
                    name="disabilityStatus"
                    value={formData.disabilityStatus}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm font-medium text-slate-900 appearance-none"
                  >
                    <option value="">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Minority Community?</label>
                  <select
                    name="minorityStatus"
                    value={formData.minorityStatus}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm font-medium text-slate-900 appearance-none"
                  >
                    <option value="">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Marital Status</label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm font-medium text-slate-900 appearance-none"
                >
                  <option value="">Optional</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8">
            <div>
              <div className="text-primary-600 font-bold text-sm tracking-wider uppercase mb-2">Step 04</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Your Interests</h2>
              <p className="text-slate-600 font-medium text-lg">
                Select the areas of government services you want to track and discover.
              </p>
            </div>

            <div className="bg-primary-50 text-primary-800 p-4 rounded-xl border border-primary-100 flex items-start gap-3">
              <HeartHandshake className="shrink-0 mt-0.5" size={20} />
              <p className="text-sm font-medium"><strong>Why we ask for interests:</strong> Your interests help personalize discovery and prioritize relevance on your dashboard.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-4">Select all that apply <span className="text-rose-500">*</span></label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {INTEREST_OPTIONS.map(interest => {
                  const isSelected = formData.userInterests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => toggleInterest(interest.id)}
                      className={`text-left w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${isSelected
                          ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                      <div className={`p-2.5 rounded-full shrink-0 ${isSelected ? 'bg-slate-800 text-primary-400' : 'bg-slate-100 text-slate-500'}`}>
                        {interest.icon}
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-base block leading-tight">{interest.label}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-primary-400 bg-primary-400 text-slate-900' : 'border-slate-300 bg-transparent'}`}>
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-8">
            <div>
              <div className="text-primary-600 font-bold text-sm tracking-wider uppercase mb-2">Step 05</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Additional Details</h2>
              <p className="text-slate-600 font-medium text-lg">
                Optional — some government opportunities use this information as an eligibility criterion.
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Residence Area</label>
                  <select
                    name="residence"
                    value={formData.residence}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm font-medium text-slate-900 appearance-none"
                  >
                    <option value="">Optional</option>
                    <option value="Urban">Urban</option>
                    <option value="Rural">Rural</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">BPL Household?</label>
                  <select
                    name="bplStatus"
                    value={formData.bplStatus}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm font-medium text-slate-900 appearance-none"
                  >
                    <option value="">Optional</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Government Employee?</label>
                  <select
                    name="governmentEmployee"
                    value={formData.governmentEmployee}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm font-medium text-slate-900 appearance-none"
                  >
                    <option value="">Optional</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Economic Distress?</label>
                  <select
                    name="economicDistress"
                    value={formData.economicDistress}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm font-medium text-slate-900 appearance-none"
                  >
                    <option value="">Optional</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-8">
            <div>
              <div className="text-primary-600 font-bold text-sm tracking-wider uppercase mb-2">Step 06</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Language</h2>
              <p className="text-slate-600 font-medium text-lg">
                Choose the language you want to interact with OneGuide in.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {LANGUAGE_OPTIONS.map(lang => {
                const isSelected = formData.preferredLanguage === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, preferredLanguage: lang.id }))}
                    className={`w-full text-left p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${isSelected
                        ? 'bg-primary-50 border-primary-600 shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-3xl font-extrabold ${isSelected ? 'text-primary-900' : 'text-slate-800'}`}>{lang.native}</span>
                      <span className={`font-medium ${isSelected ? 'text-primary-700' : 'text-slate-500'}`}>{lang.label}</span>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-primary-600 bg-primary-600 text-white' : 'border-slate-300 bg-transparent'}`}>
                      {isSelected && <Check size={16} strokeWidth={3} />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">

      {/* LEFT PANEL - Branding (Hidden on mobile) */}
      <div className="hidden md:flex md:w-5/12 lg:w-4/12 bg-slate-900 flex-col p-8 lg:p-12 relative overflow-hidden border-r border-slate-800">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop')] mix-blend-overlay opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-slate-900/40" />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-3 text-white mb-16">
            <Compass className="text-primary-400" size={32} />
            <span className="font-extrabold text-2xl tracking-tight">OneGuide India</span>
          </div>

          <div className="mt-auto">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">
              Let's personalize your OneGuide experience.
            </h2>
            <p className="text-slate-300 font-medium text-lg leading-relaxed mb-12">
              Complete your profile to discover government schemes, jobs, and services tailored to you.
            </p>

            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${step === i ? 'bg-primary-600 border-primary-600 text-white' :
                      step > i ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-transparent border-slate-700 text-slate-500'
                    }`}>
                    {step > i ? <Check size={16} strokeWidth={3} /> : i}
                  </div>
                  <span className={`font-bold text-sm uppercase tracking-wider ${step === i ? 'text-white' :
                      step > i ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                    {i === 1 && 'About You'}
                    {i === 2 && 'Education & Status'}
                    {i === 3 && 'Eligibility'}
                    {i === 4 && 'Interests'}
                    {i === 5 && 'Additional Details'}
                    {i === 6 && 'Language'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Content */}
      <div className="w-full md:w-7/12 lg:w-8/12 flex flex-col min-h-screen bg-slate-50">

        {/* Mobile Header */}
        <div className="md:hidden bg-white px-4 py-4 border-b border-slate-200 sticky top-0 z-20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Compass className="text-primary-600" size={24} />
              <span className="font-extrabold text-slate-900 tracking-tight">OneGuide</span>
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Step {step} of 6</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary-600"
              initial={{ width: '20%' }}
              animate={{ width: `${(step / 6) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Scrollable Form Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 xl:px-24 xl:py-16">
          <div className="max-w-2xl mx-auto">

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-medium text-sm flex items-start gap-2"
                >
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* Bottom Actions Area */}
        <div className="bg-white border-t border-slate-200 p-4 sm:px-8 sm:py-6 shrink-0 z-10 sticky bottom-0">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <button
              onClick={handleBack}
              disabled={step === 1 || loading}
              className="px-5 py-3.5 font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl disabled:opacity-0 transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={18} /> Back
            </button>

            {step < 6 ? (
              <button
                onClick={handleNext}
                className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                Continue <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-600/20 flex items-center gap-2 disabled:opacity-70"
              >
                {loading ? <><Loader2 className="animate-spin" size={18} /> Saving...</> : <>Complete My Profile</>}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
