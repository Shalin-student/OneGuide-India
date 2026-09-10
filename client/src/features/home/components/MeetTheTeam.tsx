import React from 'react';
import { motion } from 'motion/react';
import { Link as LinkIcon, Globe, MessageSquare, Mail } from 'lucide-react';

import hardikImg from '../../../assets/hardik.png';
import shubhamImg from '../../../assets/shubham.jpg';
import shalinImg from '../../../assets/shalin.jpg';

const teamMembers = [
  {
    name: 'Parmar Hardik Kumar',
    role: 'Researcher & Designer',
    image: hardikImg,
    bio: 'Expert in user experience research and designing intuitive interfaces that bridge the gap between complex systems and citizens.',
    socials: { linkedin: '#', github: '#', twitter: '#' }
  },
  {
    name: 'Navik Shubham',
    role: 'Frontend Developer',
    image: shubhamImg,
    bio: 'Passionate about building responsive, accessible, and performant web applications using modern web technologies.',
    socials: { linkedin: '#', github: '#', twitter: '#' }
  },
  {
    name: 'Chaudhary Shalin',
    role: 'Full Stack Developer & Designer',
    image: shalinImg,
    bio: 'Dedicated to architecting robust backend services and crafting seamless full-stack solutions with a keen eye for design.',
    socials: { linkedin: '#', github: '#', twitter: '#' }
  }
];

export const MeetTheTeam = () => {
  return (
    <section className="py-20 md:py-28 bg-white overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-slate-50 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block py-1 px-3 rounded-full bg-primary-50 border border-primary-100 text-primary-600 text-sm font-semibold tracking-wider uppercase mb-4"
          >
            Our Team
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4"
          >
            Meet The <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">Contributors</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            The passionate minds working behind the scenes to make government services accessible to everyone.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -12, scale: 1.03 }}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-primary-500/20 hover:border-primary-200 transition-all duration-300 border border-slate-100 overflow-hidden group flex flex-col max-w-[340px] mx-auto w-full"
            >
              <div className="relative h-72 md:h-80 w-full overflow-hidden bg-slate-100">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <motion.img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                />

                {/* Social links that appear on hover */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-20 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <a href={member.socials.linkedin} className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-primary-500 hover:text-white transition-colors">
                    <Globe size={20} />
                  </a>
                  <a href={member.socials.github} className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-slate-800 hover:text-white transition-colors">
                    <LinkIcon size={20} />
                  </a>
                  <a href={member.socials.twitter} className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-blue-500 hover:text-white transition-colors">
                    <MessageSquare size={20} />
                  </a>
                </div>
              </div>

              <div className="p-6 md:p-8 flex-grow flex flex-col items-center text-center">
                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">
                  {member.name}
                </h3>
                <p className="text-sm font-semibold text-primary-600 mb-4 uppercase tracking-wider">
                  {member.role}
                </p>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {member.bio}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-100 w-full">
                  <a href={`mailto:contact@oneguide.in`} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary-600 transition-colors">
                    <Mail size={16} /> Get in touch
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
