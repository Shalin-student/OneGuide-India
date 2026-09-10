import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ChatBot } from '../../features/chatbot/ChatBot';


export const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen relative w-full text-slate-900 items-stretch justify-start">
      {/* Global ambient atmospheric background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop')" }}
      />
      {/* Overlay to ensure text readability */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#FCFDFD]/90 backdrop-blur-[1px]" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow z-10 w-full relative pt-20">
          <Outlet />
        </main>
        <Footer />
        <ChatBot />
      </div>
    </div>
  );
};
