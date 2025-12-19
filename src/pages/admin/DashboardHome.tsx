import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Image, ArrowRight, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function DashboardHome() {
  const { user } = useAuth();

  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-light text-gray-900 tracking-wide">Dashboard</h1>
          <p className="mt-2 text-gray-600">Quick access to content modules and site controls.</p>
        </div>
        <div className="hidden sm:block text-xs text-gray-500 tracking-wide">
          {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/projects"
          className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all"
        >
          <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mb-5 shadow-sm shadow-black/20 group-hover:scale-[1.03] transition-transform">
            <Image size={22} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Projects</h3>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">Add, edit, or remove portfolio projects.</p>
          <div className="mt-5 inline-flex items-center text-sm text-gray-900 font-medium">
            Manage Projects <ArrowRight size={16} className="ml-2 opacity-70 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          to="/admin/pages/home"
          className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all"
        >
          <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mb-5 shadow-sm shadow-black/20 group-hover:scale-[1.03] transition-transform">
            <FileText size={22} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Home Page</h3>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">Update hero text, taglines, and featured content.</p>
          <div className="mt-5 inline-flex items-center text-sm text-gray-900 font-medium">
            Edit Home <ArrowRight size={16} className="ml-2 opacity-70 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          to="/admin/pages/about"
          className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all"
        >
          <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mb-5 shadow-sm shadow-black/20 group-hover:scale-[1.03] transition-transform">
            <FileText size={22} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">About Page</h3>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">Edit your bio, philosophy, and brand story.</p>
          <div className="mt-5 inline-flex items-center text-sm text-gray-900 font-medium">
            Edit About <ArrowRight size={16} className="ml-2 opacity-70 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
          <Activity size={18} />
          Status
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-gray-700">Admin UI online</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-500">Signed in as {userLabel(user?.email)}</span>
        </div>
      </div>
    </div>
  );
}

function userLabel(email?: string) {
  if (!email) return 'Admin';
  return email;
}
