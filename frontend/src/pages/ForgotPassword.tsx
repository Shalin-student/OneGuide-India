import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      {/* Back Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-50 flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg transition shadow-sm font-semibold border border-slate-200"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Account Recovery
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Currently, automated password resets are not enabled.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-slate-200 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 mb-4">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">Need help accessing your account?</h3>
          <p className="text-sm text-slate-500 mb-6">
            Please contact our support team from your registered email address to recover your account manually.
          </p>
          <a
            href="mailto:ghemarpatel5893@gmail.com"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            Contact Support
          </a>
          
          <div className="mt-6">
            <Link to="/login" className="flex justify-center items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft size={16} /> Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
