import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import WebsiteLogo from "../../assets/website-logo.png";

const footerLinks = [
  {
    label: "SERVICES",
    links: [
      { title: "Government Schemes", href: "/services/category/Government%20Schemes" },
      { title: "Jobs & Exams", href: "/services/category/Jobs%20%26%20Exams" },
      { title: "Scholarships", href: "/services/category/Scholarships" },
      { title: "Agriculture", href: "/services/category/Agriculture%20Services" },
      { title: "Documents", href: "/services/category/Documents%20%26%20Certificates" }
    ]
  },
  {
    label: "COMPANY",
    links: [
      { title: "About Us", href: "/about" },
      { title: "Contact", href: "/contact" },
      { title: "Privacy Policy", href: "/privacy" },
      { title: "Terms of Service", href: "/terms" }
    ]
  }
];

export const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Left Column - Brand & Info */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <img src={WebsiteLogo} alt="OneGuide India logo" className="h-8 w-8 object-contain" />
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-slate-900 leading-none">
                  OneGuide <span className="text-slate-500 font-medium">India</span>
                </span>
              </div>
            </div>
            <p className="text-slate-600 font-medium text-[15px] leading-relaxed max-w-xs">
              Simplifying access to Indian government schemes, jobs, scholarships, and digital services.
            </p>
            <p className="text-slate-500 text-sm font-bold mt-auto">
              Made with ☕ and ❤️ in India by GuideSpark
            </p>
          </div>

          {/* Middle Columns - Services and Company */}
          {footerLinks.map((section) => (
            <div key={section.label}>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">
                {section.label}
              </h3>
              <ul className="space-y-4 text-[15px] font-bold">
                {section.links.map((link) => (
                  <li key={link.title}>
                    <Link
                      to={link.href}
                      className="text-slate-700 hover:text-orange-600 transition-colors block"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Right Column - Contact & Support */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">
              CONTACT & SUPPORT
            </h3>
            <div className="flex flex-col gap-6">
              <a
                href="mailto:ghemarpatel5893@gmail.com"
                className="inline-flex items-center gap-2 text-[15px] font-bold text-slate-700 hover:text-orange-600 transition-colors"
              >
                <Mail size={18} />
                ghemarpatel5893@gmail.com
              </a>

              <div className="pt-2">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                  Follow Us
                </h4>
                <div className="flex items-center gap-4">
                  <a href="https://www.instagram.com/shalin_g_chaudhary" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white transition-colors" aria-label="Instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                  </a>
                  <a href="https://www.linkedin.com/in/shalin-chaudhary-2bbb09350" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white transition-colors" aria-label="LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
