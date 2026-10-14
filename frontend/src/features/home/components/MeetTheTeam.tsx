import React from 'react';

import hardikImg from '../../../assets/hardik.png';
import shubhamImg from '../../../assets/shubham.jpg';
import shalinImg from '../../../assets/shalin.jpg';

const teamMembers = [
  {
    name: 'Parmar Hardik Kumar',
    role: 'Researcher & Designer',
    image: hardikImg,
    bio: 'Expert in user experience research and designing intuitive interfaces that bridge the gap between complex systems and citizens.',
  },
  {
    name: 'Navik Shubham',
    role: 'Frontend Developer',
    image: shubhamImg,
    bio: 'Passionate about building responsive, accessible, and performant web applications using modern web technologies.',
  },
  {
    name: 'Chaudhary Shalin',
    role: 'Full Stack Developer',
    image: shalinImg,
    bio: 'Dedicated to architecting robust backend services and crafting seamless full-stack solutions with a keen eye for design.',
  }
];

export const MeetTheTeam = () => {
  return (
    <section className="theme-section py-20 md:py-28 bg-[#fafaf9] border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Meet The Contributors
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            The passionate minds working behind the scenes to make government services accessible to everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-sm"
            >
              <div className="relative h-72 w-full bg-slate-100 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>

              <div className="p-8 flex flex-col items-center text-center flex-grow">
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-[13px] font-bold text-orange-600 mb-4 uppercase tracking-widest">
                  {member.role}
                </p>
                <p className="text-slate-600 text-sm font-medium leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
