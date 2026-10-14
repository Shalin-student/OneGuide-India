import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, Loader2, Save, AlertCircle, CheckCircle2, Pencil, Camera } from 'lucide-react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../../node_modules/react-i18next';
import { INDIA_STATES, INDIA_STATES_AND_DISTRICTS } from '../data/indiaData';
import { motion, AnimatePresence, type Variants } from 'motion/react';

const INTEREST_OPTIONS = [
  { id: 'Government Schemes & Yojanas', label: 'Government Schemes' },
  { id: 'Government Jobs & Exams', label: 'Government Jobs' },
  { id: 'Scholarships', label: 'Scholarships' },
  { id: 'Internships', label: 'Internships' },
  { id: 'Agriculture Services', label: 'Agriculture' },
  { id: 'Government Documents & Certificates', label: 'Documents' },
  { id: 'Emergency Helplines', label: 'Helplines' }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 30 } }
};

const InputWrapper = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="group relative">
    <label className="block text-sm font-semibold text-slate-600 mb-1.5 transition-colors group-focus-within:text-primary-600">
      {label}
    </label>
    <div className="relative">
      {children}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <Pencil size={14} />
      </div>
    </div>
  </div>
);

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, checkAuth } = useAuth();
  const { t } = useTranslation();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    age: '',
    state: '',
    district: '',
    educationLevel: '',
    employmentStatus: '',
    annualIncomeRange: '',
    socialCategory: '',
    gender: '',
    preferredLanguage: 'en',
    disabilityStatus: 'none',
    minorityStatus: '',
    maritalStatus: '',
    residence: '',
    bplStatus: '',
    governmentEmployee: '',
    economicDistress: '',
    userInterests: [] as string[],
    profileImage: ''
  });

  const availableDistricts = formData.state ? INDIA_STATES_AND_DISTRICTS[formData.state] || [] : [];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        const data = response.data.data;
        setProfile(data);
        setFormData({
          age: data.age || '',
          state: data.state || '',
          district: data.district || '',
          educationLevel: data.educationLevel || '',
          employmentStatus: data.employmentStatus || '',
          annualIncomeRange: data.annualIncomeRange || '',
          socialCategory: data.socialCategory || '',
          gender: data.gender || '',
          preferredLanguage: data.preferredLanguage || 'en',
          disabilityStatus: data.disabilityStatus || 'none',
          minorityStatus: data.minorityStatus || '',
          maritalStatus: data.maritalStatus || '',
          residence: data.residence || '',
          bplStatus: data.bplStatus || '',
          governmentEmployee: data.governmentEmployee || '',
          economicDistress: data.economicDistress || '',
          userInterests: data.userInterests || [],
          profileImage: data.profileImage || ''
        });
      } catch (error) {
        console.error('Error fetching profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setIsDirty(true);
    if (name === 'state') {
      setFormData({ ...formData, state: value, district: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const toggleInterest = (interest: string) => {
    setIsDirty(true);
    setFormData(prev => ({
      ...prev,
      userInterests: prev.userInterests.includes(interest)
        ? prev.userInterests.filter(i => i !== interest)
        : [...prev.userInterests, interest]
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDirty) return;

    setSaving(true);
    setMessage(null);
    try {
      const payload: any = { ...formData };
      if (payload.age === '') {
        payload.age = null;
      } else if (payload.age) {
        payload.age = parseInt(payload.age as string);
      }

      const response = await api.patch('/users/profile', payload);
      setProfile(response.data.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsDirty(false);
      await checkAuth();
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#F8F9FB] pt-20">
        <Loader2 className="animate-spin text-primary-600" size={40} />
      </div>
    );
  }

  const completeness = profile?.completeness?.percentage || 0;
  const inputClass = "w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-4 py-2.5 shadow-sm focus:bg-white focus:border-primary-500 focus:ring-[3px] focus:ring-primary-500/15 outline-none transition-all duration-200 font-medium appearance-none cursor-pointer";

  return (
    <div className="bg-[#F8F9FB] min-h-screen pt-24 pb-32 px-4 sm:px-6 lg:px-8 font-sans">
      <motion.div
        className="max-w-3xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >

        {/* Profile Header */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="px-6 md:px-8 py-6 md:py-8 relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="w-24 h-24 bg-white rounded-full p-1.5 shadow-md ring-1 ring-slate-200 shrink-0 relative group">
              <div className="w-full h-full bg-gradient-to-br from-primary-100 via-white to-blue-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-4xl overflow-hidden">
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover object-center" />
                ) : (
                  <span className="leading-none select-none">{profile?.name?.charAt(0).toUpperCase()}</span>
                )}
              </div>

              <label className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow border border-slate-200 flex items-center justify-center cursor-pointer text-slate-500 hover:text-primary-600 hover:border-primary-300 transition-colors">
                <Camera size={14} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 2 * 1024 * 1024) {
                        alert('Image size must be less than 2MB');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({ ...formData, profileImage: reader.result as string });
                        setIsDirty(true);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>

            <div className="flex-1 text-center md:text-left pt-2 md:pt-0">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{profile?.name}</h1>
              <p className="text-sm text-slate-500 font-medium">{profile?.email}</p>

              <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide">
                  <User size={12} /> {profile?.role === 'admin' ? 'Administrator' : 'Citizen'}
                </span>
                {profile?.onboardingCompleted && (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide">
                    <CheckCircle2 size={12} /> Onboarded
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto shrink-0 mt-4 md:mt-0">
              {profile?.role === 'admin' && (
                <Link to="/admin" className="flex-1 md:flex-none px-6 py-2.5 bg-slate-900 text-white rounded-lg font-semibold text-sm text-center hover:bg-slate-800 transition shadow-sm">
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSave} className="space-y-6">

          {/* Completeness Card */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary-500" />
            <div className="flex-1 w-full text-center md:text-left">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Profile Completeness</h2>
              <p className="text-slate-500 text-sm">
                {completeness === 100
                  ? "Your profile is fully complete. You'll receive optimal recommendations."
                  : "Complete more profile details to personalize your discovery and improve recommendations."}
              </p>
              {profile?.completeness?.missingFields?.length > 0 && (
                <div className="mt-4 bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2 text-left">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-0.5">Missing details:</span>
                    <span className="text-amber-700/90">{profile.completeness.missingFields.join(', ')}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="shrink-0 flex flex-col items-center justify-center relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <motion.path
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${completeness}, 100` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
                  className="text-primary-500"
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-slate-900">
                {completeness}%
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Personal Details */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-slate-100 p-6 md:p-8 space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Personal Details</h3>
                <p className="text-xs text-slate-500">Basic demographic information</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper label="Age">
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </InputWrapper>
                  <InputWrapper label="Gender">
                    <div className="relative">
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Not Specified</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Transgender / Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </InputWrapper>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper label="State">
                    <div className="relative">
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select State</option>
                        {INDIA_STATES.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </InputWrapper>
                  <InputWrapper label="District">
                    <div className="relative">
                      <select
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        disabled={!formData.state || formData.state === 'All India'}
                        className={inputClass + " disabled:opacity-60 disabled:bg-slate-50 disabled:cursor-not-allowed"}
                      >
                        <option value="">Select District</option>
                        {availableDistricts.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </InputWrapper>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper label="Marital Status">
                    <div className="relative">
                      <select
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Not Specified</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </InputWrapper>
                  <InputWrapper label="Residence Area">
                    <div className="relative">
                      <select
                        name="residence"
                        value={formData.residence}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Not Specified</option>
                        <option value="Urban">Urban</option>
                        <option value="Rural">Rural</option>
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </InputWrapper>
                </div>
              </div>
            </motion.div>

            {/* Professional Details */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-slate-100 p-6 md:p-8 space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Professional Details</h3>
                <p className="text-xs text-slate-500">Education, employment & eligibility</p>
              </div>

              <div className="space-y-4">
                <InputWrapper label="Employment Status">
                  <div className="relative">
                    <select
                      name="employmentStatus"
                      value={formData.employmentStatus}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select Status</option>
                      <option value="Student">Student</option>
                      <option value="Employed">Employed</option>
                      <option value="Unemployed">Unemployed</option>
                      <option value="Self-employed">Self-employed</option>
                      <option value="Farmer">Farmer</option>
                      <option value="Business owner">Business owner</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </InputWrapper>

                <InputWrapper label="Education Level">
                  <div className="relative">
                    <select
                      name="educationLevel"
                      value={formData.educationLevel}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select Education</option>
                      <option value="Below 10th">Below 10th</option>
                      <option value="10th Pass">10th Pass</option>
                      <option value="12th Pass">12th Pass</option>
                      <option value="Diploma">Diploma / ITI</option>
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Postgraduate">Postgraduate</option>
                      <option value="PhD">PhD</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </InputWrapper>

                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper label="Annual Income">
                    <div className="relative">
                      <select
                        name="annualIncomeRange"
                        value={formData.annualIncomeRange}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select Range</option>
                        <option value="Below 1 Lakh">Below ₹1 Lakh</option>
                        <option value="1L - 2.5L">₹1L - ₹2.5L</option>
                        <option value="2.5L - 5L">₹2.5L - ₹5L</option>
                        <option value="5L - 8L">₹5L - ₹8L</option>
                        <option value="Above 8 Lakh">Above ₹8 Lakh</option>
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5 leading-tight">Kept private for eligibility matching.</p>
                  </InputWrapper>
                  <InputWrapper label="Social Category">
                    <div className="relative">
                      <select
                        name="socialCategory"
                        value={formData.socialCategory}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Not Specified</option>
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5 leading-tight">Kept private for eligibility matching.</p>
                  </InputWrapper>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper label="Minority Community">
                    <div className="relative">
                      <select
                        name="minorityStatus"
                        value={formData.minorityStatus}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Not Specified</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </InputWrapper>
                  <InputWrapper label="BPL Household">
                    <div className="relative">
                      <select
                        name="bplStatus"
                        value={formData.bplStatus}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Not Specified</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </InputWrapper>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper label="Government Employee">
                    <div className="relative">
                      <select
                        name="governmentEmployee"
                        value={formData.governmentEmployee}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Not Specified</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </InputWrapper>
                  <InputWrapper label="Economic Distress">
                    <div className="relative">
                      <select
                        name="economicDistress"
                        value={formData.economicDistress}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Not Specified</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </InputWrapper>
                </div>
              </div>
            </motion.div>

            {/* Interests */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-slate-100 p-6 md:p-8 space-y-5 md:col-span-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">Your Interests</h3>
                <p className="text-sm text-slate-500 mt-1">Select the areas you're interested in — this personalizes your homepage recommendations and AI assistant suggestions.</p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {INTEREST_OPTIONS.map(interest => {
                  const isSelected = formData.userInterests.includes(interest.id);
                  return (
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      key={interest.id}
                      onClick={() => toggleInterest(interest.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 border ${isSelected
                          ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                    >
                      {interest.label}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>

            {/* Language & Settings */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-slate-100 p-6 md:p-8 space-y-5 md:col-span-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">Language & Settings</h3>
                <p className="text-xs text-slate-500">App preferences</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputWrapper label="Language">
                  <div className="relative">
                    <select
                      name="preferredLanguage"
                      value={formData.preferredLanguage}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="gu">Gujarati</option>
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </InputWrapper>
                <InputWrapper label="Disability Status">
                  <div className="relative">
                    <select
                      name="disabilityStatus"
                      value={formData.disabilityStatus}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="none">None</option>
                      <option value="physical">Physical Disability</option>
                      <option value="visual">Visual Impairment</option>
                      <option value="hearing">Hearing Impairment</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-tight">Kept private for eligibility matching.</p>
                </InputWrapper>
              </div>
            </motion.div>

          </div>

          {/* Sticky Save Bar */}
          <AnimatePresence>
            {isDirty && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50, transition: { duration: 0.2 } }}
                className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4"
              >
                <div className="bg-white/90 backdrop-blur-lg border border-slate-200 p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-w-2xl w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex-1 w-full flex items-center justify-center sm:justify-start">
                    <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
                      <AlertCircle size={16} className="text-amber-500" />
                      You have unsaved changes
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={saving}
                    className="w-full sm:w-auto bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold shadow-sm hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Toast */}
          <AnimatePresence>
            {message && message.type === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-emerald-50 text-emerald-700 border border-emerald-200 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 font-semibold text-sm"
              >
                <CheckCircle2 size={18} />
                {message.text}
              </motion.div>
            )}
            {message && message.type === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-rose-50 text-rose-700 border border-rose-200 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 font-semibold text-sm"
              >
                <AlertCircle size={18} />
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

        </form>
      </motion.div>
    </div>
  );
}
