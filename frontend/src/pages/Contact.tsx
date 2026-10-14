import React from 'react';
import { Mail, MessageSquare } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Contact & Support</h1>
          <p className="text-lg text-slate-600">We are here to help you navigate OneGuide India.</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row items-center gap-8 justify-center">
            <div className="flex flex-col items-center p-6 bg-slate-50 rounded-xl w-full">
              <Mail className="text-primary-600 mb-4" size={40} />
              <h3 className="font-bold text-slate-900 mb-2">Email Support</h3>
              <p className="text-slate-600 text-sm mb-4">Reach out to our team directly via email.</p>
              <a href="mailto:ghemarpatel5893@gmail.com" className="text-primary-600 font-semibold hover:underline">
                ghemarpatel5893@gmail.com
              </a>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-slate-50 rounded-xl w-full">
              <MessageSquare className="text-blue-600 mb-4" size={40} />
              <h3 className="font-bold text-slate-900 mb-2">AI Assistant</h3>
              <p className="text-slate-600 text-sm mb-4">Use our chatbot for instant guidance and answers.</p>
              <span className="text-blue-600 font-semibold">Available 24/7 on screen</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
