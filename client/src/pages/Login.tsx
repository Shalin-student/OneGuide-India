import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { motion } from 'motion/react';
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2, Check } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [recaptchaChecked, setRecaptchaChecked] = useState(false);
  const [recaptchaError, setRecaptchaError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Simulate reCAPTCHA validation
    if (!recaptchaChecked) {
      setRecaptchaError(true);
      return;
    }
    setRecaptchaError(false);

    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.status === 'success') {
        setUser(res.data.data);
        if (res.data.data.onboardingCompleted === false) {
          navigate('/onboarding');
        } else {
          navigate('/');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/google', { token: credentialResponse.credential });
      if (res.data.status === 'success') {
        setUser(res.data.data);
        if (res.data.data.onboardingCompleted === false) {
          navigate('/onboarding');
        } else {
          navigate('/');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleFailure = () => {
    setError('Google Login failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0F172A] overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop')] mix-blend-overlay opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-transparent" />
        
        <div className="relative z-10 p-12 lg:p-16 flex flex-col items-start justify-center h-full max-w-xl">
          <div className="w-16 h-16 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-8 border border-white/10 shadow-xl">
            <ShieldCheck size={32} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Welcome back to <span className="text-orange-500">OneGuide</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed mb-12">
            Your single digital gateway to discover government schemes, jobs, scholarships, and citizen services across India.
          </p>
          
          <div className="flex items-center gap-4 text-white text-sm font-medium">
            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md shadow-sm">
              <ShieldCheck size={16} className="text-emerald-400" /> Secure Access
            </span>
            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md shadow-sm">
              <Lock size={16} className="text-blue-400" /> Privacy Protected
            </span>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-white relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-10"
        >
          <div className="text-left space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Sign In
            </h2>
            <p className="text-base text-slate-500 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-orange-600 hover:text-orange-700 transition-colors">
                Create one now
              </Link>
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email-address" className="block text-sm font-bold text-slate-700">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm sm:text-sm font-medium"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-bold text-slate-700">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm sm:text-sm font-medium"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {recaptchaError && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100 flex items-center"
              >
                Verification expired. Check the checkbox again.
              </motion.div>
            )}

            {/* Mock reCAPTCHA */}
            <div 
              className="flex items-center justify-between border border-gray-300 rounded bg-[#f9f9f9] p-3 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => {
                setRecaptchaChecked(!recaptchaChecked);
                setRecaptchaError(false);
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded border flex items-center justify-center transition-colors ${recaptchaChecked ? 'border-green-500 bg-green-50' : 'border-gray-400 bg-white'}`}>
                  {recaptchaChecked && <Check size={18} className="text-green-600" />}
                </div>
                <span className="text-sm font-medium text-slate-700">I'm not a robot</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" className="w-8 opacity-80" />
                <span className="text-[10px] text-gray-500 mt-1">reCAPTCHA</span>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-rose-600 text-sm font-medium bg-rose-50 p-3.5 rounded-lg border border-rose-100 flex items-center"
              >
                {error}
              </motion.div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center py-3.5 px-4 border border-transparent text-base font-bold rounded-lg text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-70 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/30"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            <div className="relative mt-8 mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500 font-bold text-xs uppercase tracking-wider">Or</span>
              </div>
            </div>
            
            <div className="flex justify-center transition-all hover:scale-[1.01]">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                useOneTap
                use_fedcm_for_prompt={false}
                theme="outline"
                size="large"
                shape="rectangular"
                text="continue_with"
                width="320"
              />
            </div>

            <div className="pt-6 text-center">
              <Link to="/forgot-password" className="text-sm font-medium text-slate-500 hover:text-orange-600 transition-colors underline-offset-4 hover:underline">
                Forgot Password / Account Recovery
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
