import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../node_modules/react-i18next';
import { Search, Menu, X, Bookmark, ChevronDown, User as UserIcon, Mic, Moon, Sun } from 'lucide-react';
import WebsiteLogo from '../../assets/website-logo.png';
import AshokaChakra from '../../assets/ashoka-chakra-png-46987.png';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useTheme } from '../../context/ThemeContext';

const NAV_LINKS = [
  { name: 'Schemes', path: '/services/category/Government%20Schemes' },
  { name: 'Jobs', path: '/services/category/Jobs%20%26%20Exams' },
  { name: 'Scholarships', path: '/services/category/Scholarships' },
  { name: 'Internships', path: '/services/category/Internships' },
  { name: 'Agriculture', path: '/services/category/Agriculture%20Services' },
  { name: 'Documents', path: '/services/category/Documents%20%26%20Certificates' },
  { name: 'Government Portals', path: '/services/category/Government%20Portals' },
  { name: 'Helplines', path: '/services/category/Helplines' }
];

export const Header = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const wasListeningRef = useRef(false);

  const themeToggle = (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
      <span className="hidden xl:inline text-xs font-bold">{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );

  const { isListening, transcript, startListening, stopListening, hasSupport } = useSpeechRecognition(
    i18n.language === 'hi' ? 'hi-IN' : i18n.language === 'gu' ? 'gu-IN' : 'en-IN'
  );

  useEffect(() => {
    if (isListening && transcript) {
      setSearchInput(transcript);
    }
  }, [transcript, isListening]);

  const submitSearch = (query: string) => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) return;

    navigate(`/services?search=${encodeURIComponent(normalizedQuery)}`);
    setIsMobileMenuOpen(false);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(`Searching for ${normalizedQuery}`));
    }
  };

  useEffect(() => {
    if (isListening) {
      wasListeningRef.current = true;
      return;
    }

    if (wasListeningRef.current && transcript.trim()) {
      wasListeningRef.current = false;
      submitSearch(transcript);
    }
  }, [isListening, transcript]);

  useEffect(() => {
    const handleChatbotVisibility = (event: Event) => {
      setIsChatbotOpen((event as CustomEvent<boolean>).detail);
    };

    window.addEventListener('oneguide-chatbot-visibility', handleChatbotVisibility);
    return () => window.removeEventListener('oneguide-chatbot-visibility', handleChatbotVisibility);
  }, []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (isChatbotOpen) {
          window.dispatchEvent(new CustomEvent('oneguide-chatbot-shortcut', { detail: 'voice' }));
          return;
        }
        if (isListening) {
          stopListening();
        } else {
          startListening();
        }
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [isChatbotOpen, isListening, startListening, stopListening]);

  useEffect(() => {
    const handleSaveShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        if (isChatbotOpen) {
          window.dispatchEvent(new CustomEvent('oneguide-chatbot-shortcut', { detail: 'focus' }));
          return;
        }
        const searchField = searchInputRef.current?.offsetParent
          ? searchInputRef.current
          : mobileSearchInputRef.current;
        searchField?.focus();
      }
    };

    window.addEventListener('keydown', handleSaveShortcut);
    return () => window.removeEventListener('keydown', handleSaveShortcut);
  }, [isChatbotOpen]);

  const changeLanguage = async (lng: string) => {
    i18n.changeLanguage(lng);
    if (user) {
      try {
        await api.patch('/users/profile', { preferredLanguage: lng });
      } catch (error) {
        console.error('Failed to save language preference', error);
      }
    }
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsExploreOpen(false);
    setIsLangOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    submitSearch(searchInput);
  };

  return (
    <header className={`navbar-shell fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 xl:px-8 2xl:px-10">
        <div className="flex items-center h-16 sm:h-20 gap-5 xl:gap-8">

          {/* Left: Logo */}
          <div className="flex items-center shrink-0">
            <Link to="/" className="flex items-center gap-2.5 group" aria-label="OneGuide India Home">
              <img src={WebsiteLogo} alt="OneGuide India logo" className="h-9 w-9 sm:h-10 sm:w-10 object-contain" />
              <div className="flex flex-col">
                <span className="font-bold text-[18px] sm:text-[22px] tracking-tight text-slate-900 leading-none">
                  OneGuide <span className="text-slate-500 font-medium">India</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1">
                  Citizen Services
                </span>
              </div>
              <div className="hidden lg:block h-8 w-[1px] bg-slate-200 mx-4"></div>
              <img src={AshokaChakra} alt="Ashoka Chakra" className="ashoka-chakra h-7 w-7 object-contain hidden lg:block transition-all duration-500" />
            </Link>
          </div>

          {/* Desktop Center: Navigation & Search */}
          <div className="hidden lg:flex items-center flex-1 min-w-0 justify-center gap-5 xl:gap-7 px-2 xl:px-4">
            <div className="relative group" onMouseLeave={() => setIsExploreOpen(false)}>
              <button
                type="button"
                onMouseEnter={() => setIsExploreOpen(true)}
                className="nav-action nav-control flex items-center gap-1.5 rounded-xl px-3 py-2 font-semibold text-slate-700 hover:text-primary-600 transition-all duration-200 hover:bg-primary-50 active:scale-95"
                aria-expanded={isExploreOpen}
              >
                Explore <ChevronDown size={16} className={`transition-transform duration-200 ${isExploreOpen ? 'rotate-180' : ''}`} />
              </button>
              {isExploreOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 pt-2 w-56">
                  <div className="theme-menu bg-white rounded-2xl shadow-xl border border-slate-100 py-2 flex flex-col z-50 overflow-hidden">
                    {NAV_LINKS.map((link) => (
                      <Link key={link.name} to={link.path} className={`px-4 py-2.5 text-sm font-semibold transition-colors ${location.pathname === link.path ? 'bg-primary-50 text-primary-700' : 'text-slate-700 hover:text-primary-600 hover:bg-primary-50'}`}>
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSearch} className="navbar-search flex-1 min-w-[260px] max-w-[580px] relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400 group-focus-within:text-primary-600 transition-colors" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search schemes, jobs, documents..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-slate-100 border border-transparent text-slate-900 rounded-xl pl-10 pr-12 py-3 focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm font-medium"
              />
              {hasSupport && (
                <button 
                  type="button" 
                  onClick={isListening ? stopListening : startListening}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center rounded-r-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  aria-label="Voice Search"
                >
                  <Mic size={18} className={`transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-primary-600'}`} />
                </button>
              )}
            </form>
            {themeToggle}
          </div>

          {/* Desktop Right: Actions */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {/* Language */}
            <div className="relative" onMouseLeave={() => setIsLangOpen(false)}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                type="button"
                className="nav-icon-button nav-control flex items-center justify-center w-10 h-10 rounded-xl bg-primary-50 text-primary-600 shrink-0 hover:bg-primary-100 transition-all duration-200 active:scale-95 border border-primary-100"
              >
                <div className="flex items-center gap-[2px] font-bold">
                  <span className="text-[12px] leading-none mb-[1px]">A</span>
                  <div className="w-[1px] h-3 bg-primary-300"></div>
                  <span className="text-[13px] leading-none">अ</span>
                </div>
              </button>
              {isLangOpen && (
                <div className="theme-menu absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 w-32 flex flex-col z-50">
                  <button onClick={() => changeLanguage('en')} className={`text-left px-4 py-2 text-sm font-semibold hover:bg-slate-50 transition-colors ${i18n.language === 'en' ? 'text-primary-600 bg-primary-50' : 'text-slate-700'}`}>English</button>
                  <button onClick={() => changeLanguage('hi')} className={`text-left px-4 py-2 text-sm font-semibold hover:bg-slate-50 transition-colors ${i18n.language === 'hi' ? 'text-primary-600 bg-primary-50' : 'text-slate-700'}`}>हिन्दी</button>
                  <button onClick={() => changeLanguage('gu')} className={`text-left px-4 py-2 text-sm font-semibold hover:bg-slate-50 transition-colors ${i18n.language === 'gu' ? 'text-primary-600 bg-primary-50' : 'text-slate-700'}`}>ગુજરાતી</button>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/saved" className="nav-control flex items-center justify-center w-10 h-10 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl border border-transparent transition-all duration-200 active:scale-95" aria-label="Saved Resources">
                  <Bookmark size={20} />
                </Link>
                <Link
                  to="/profile"
                  className="nav-profile nav-control flex items-center justify-center rounded-full p-0.5 hover:bg-primary-50 transition-all duration-200 active:scale-95"
                  aria-label="Open profile"
                  title="Profile"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-primary-100 via-white to-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm overflow-hidden">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt="" className="w-full h-full rounded-full object-cover object-center" />
                    ) : (
                      <span className="leading-none select-none">{user.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                </Link>
                <button onClick={logout} className="nav-control text-sm font-semibold text-slate-500 hover:text-red-600 px-3 py-2 rounded-xl border border-transparent transition-all duration-200 active:scale-95">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="nav-control text-sm font-semibold text-slate-600 hover:text-primary-600 transition-all duration-200 active:scale-95 px-3 py-2 rounded-xl border border-transparent hover:bg-primary-50">Login</Link>
                <Link to="/register" className="nav-control text-sm font-bold bg-primary-600 text-white px-4 py-2.5 rounded-xl border border-primary-600 hover:border-primary-700 hover:bg-primary-700 hover:shadow-md transition-all duration-200 active:scale-95">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden flex items-center gap-3">
            {user && (
              <Link
                to="/profile"
                className="flex items-center justify-center rounded-full p-0.5 text-blue-700 hover:bg-primary-50 transition-colors"
                aria-label="Open profile"
                title="Profile"
              >
                <span className="w-9 h-9 bg-gradient-to-br from-primary-100 via-white to-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm overflow-hidden">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="" className="w-full h-full rounded-full object-cover object-center" />
                  ) : (
                    <span className="leading-none select-none">{user.name.charAt(0).toUpperCase()}</span>
                  )}
                </span>
              </Link>
            )}
            <button aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={isMobileMenuOpen} className="nav-menu-button p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200 active:scale-95" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div className={`lg:hidden fixed inset-0 top-[64px] sm:top-[80px] bg-white z-40 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
        <div className="p-4 space-y-6">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              ref={mobileSearchInputRef}
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-slate-100 border border-transparent text-slate-900 rounded-xl pl-10 pr-12 py-3 focus:bg-white focus:border-primary-300 outline-none text-base font-medium"
            />
            {hasSupport && (
              <button 
                type="button" 
                onClick={isListening ? stopListening : startListening}
                className="absolute inset-y-0 right-0 pr-4 flex items-center focus:outline-none"
                aria-label="Voice Search"
              >
                <Mic size={20} className={`transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-primary-600'}`} />
              </button>
            )}
          </form>
          <div className="flex justify-end">{themeToggle}</div>

          <nav className="space-y-1">
            <h3 className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Explore</h3>
            {NAV_LINKS.map(link => (
              <Link key={link.name} to={link.path} className="block px-3 py-3 text-base font-semibold text-slate-800 rounded-lg hover:bg-slate-50 transition-colors">
                {link.name}
              </Link>
            ))}
          </nav>

          <hr className="border-slate-100" />

          <nav className="space-y-1">
            <h3 className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Language</h3>
            <div className="flex gap-2 px-3">
              {['en', 'hi', 'gu'].map(lng => (
                <button
                  key={lng}
                  onClick={() => changeLanguage(lng)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-colors ${i18n.language === lng ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  {lng === 'en' ? 'English' : lng === 'hi' ? 'हिन्दी' : 'ગુજરાતી'}
                </button>
              ))}
            </div>
          </nav>

          <hr className="border-slate-100" />

          {user ? (
            <nav className="space-y-2 px-3">
              <div className="flex items-center gap-3 py-2 mb-2">
                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
              <Link to="/saved" className="flex items-center gap-3 py-2 text-slate-700 font-semibold hover:text-primary-600">
                <Bookmark size={20} /> Saved Resources
              </Link>
              <Link to="/profile" className="flex items-center gap-3 py-2 text-slate-700 font-semibold hover:text-primary-600">
                <UserIcon size={20} /> Profile Settings
              </Link>
              <button onClick={logout} className="w-full mt-4 bg-red-50 text-red-600 font-bold py-3 rounded-xl hover:bg-red-100 transition-colors">
                Logout
              </button>
            </nav>
          ) : (
            <div className="flex flex-col gap-3 px-3">
              <Link to="/login" className="w-full text-center font-bold text-primary-600 bg-primary-50 py-3 rounded-xl hover:bg-primary-100 transition-colors">Log In</Link>
              <Link to="/register" className="w-full text-center font-bold text-white bg-primary-600 py-3 rounded-xl hover:bg-primary-700 transition-colors">Create Account</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
