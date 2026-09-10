import React, { type ComponentProps, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { Mail } from 'lucide-react';

const footerLinks = [
  {
    label: "SERVICES",
    links: [
      { title: "Government Schemes", href: "/services?category=Government%20Schemes" },
      { title: "Jobs & Exams", href: "/services?category=Jobs%20%26%20Exams" },
      { title: "Scholarships", href: "/services?category=Scholarships" },
      { title: "Agriculture", href: "/services?category=Agriculture%20Services" },
      { title: "Documents", href: "/services?category=Documents%20%26%20Certificates" }
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

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>['className'];
  children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const Footer = () => {
  return (
    <footer className="relative w-full bg-white border-t border-gray-100 pt-20 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Left Column - Brand & Info */}
          <AnimatedContainer className="space-y-6">
            <div className="flex items-center gap-1 font-extrabold text-3xl tracking-tighter">
              <span className="text-slate-900">OneGuide</span>
              <span className="text-orange-600">In</span>
              <span className="text-slate-900">d</span>
              <span className="text-green-600">ia</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Simplifying access to Indian government schemes, jobs, scholarships, and digital services.
            </p>
            <p className="text-gray-400 text-sm font-medium">
              Made with ❤️ and ☕ in India
            </p>
          </AnimatedContainer>

          {/* Middle Columns - Services and Company */}
          {footerLinks.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.2 + index * 0.1}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-6">
                {section.label}
              </h3>
              <ul className="space-y-4 text-sm font-medium">
                {section.links.map((link) => (
                  <li key={link.title}>
                    <Link
                      to={link.href}
                      className="text-gray-500 hover:text-orange-600 transition-colors duration-200 block"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </AnimatedContainer>
          ))}

          {/* Right Column - Contact & Support */}
          <AnimatedContainer delay={0.4}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-6">
              CONTACT & SUPPORT
            </h3>
            <div className="space-y-4">
              <a
                href="mailto:ghemarpatel5893@gmail.com"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors duration-200"
              >
                <Mail size={16} />
                ghemarpatel5893@gmail.com
              </a>

              <div className="pt-4">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Follow Us
                </h4>
                <div className="flex items-center gap-4">
                  <a href="#" className="text-gray-400 hover:text-orange-600 transition-colors duration-200" aria-label="Twitter">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-orange-600 transition-colors duration-200" aria-label="Facebook">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                  </a>
                  <a href="https://www.instagram.com/shalin_g_chaudhary?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw%3D%3D" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-600 transition-colors duration-200" aria-label="Instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                  </a>
                  <a href="https://www.linkedin.com/in/shalin-chaudhary-2bbb09350/?isSelfProfile=true" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-600 transition-colors duration-200" aria-label="Linkdin">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                  </a>
                </div>
              </div>
            </div>
          </AnimatedContainer>

        </div>
      </div>
    </footer>
  );
};
