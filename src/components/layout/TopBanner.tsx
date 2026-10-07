import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { isLiveSupabaseConfigured } from '@/lib/supabase';
import { UserRole } from '@/types';
import { ShieldCheck, UserCheck, GraduationCap, Award, Database, RefreshCw } from 'lucide-react';

export const TopBanner: React.FC = () => {
  const { user, role, switchPersona } = useAuth();

  const personas: { role: UserRole; label: string; icon: React.ReactNode }[] = [
    { role: 'ADMIN', label: 'Admin (MacArthur)', icon: <ShieldCheck className="w-3.5 h-3.5 mr-1" /> },
    { role: 'STAFF', label: 'Registrar (Spurgeon)', icon: <UserCheck className="w-3.5 h-3.5 mr-1" /> },
    { role: 'STUDENT', label: 'Student (Barnabas)', icon: <GraduationCap className="w-3.5 h-3.5 mr-1" /> },
    { role: 'ALUMNI', label: 'Alumni (Tyndale)', icon: <Award className="w-3.5 h-3.5 mr-1" /> },
  ];

  return (
    <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 z-50">
      <div className="flex items-center space-x-3">
        <span className="flex items-center text-slate-400 font-medium">
          <Database className="w-3.5 h-3.5 mr-1 text-emerald-400" />
          {isLiveSupabaseConfigured ? (
            <span className="text-emerald-400">Live Supabase Connected</span>
          ) : (
            <span className="text-amber-400">Demo Sandbox Database</span>
          )}
        </span>
        <span className="hidden sm:inline text-slate-600">|</span>
        <span className="hidden sm:inline text-slate-300">
          Berean Bible Baptist College • 1 Peter 2:9 KJB
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-slate-400 font-medium hidden md:inline">Quick Role Switch:</span>
        <div className="flex items-center space-x-1">
          {personas.map((p) => {
            const isActive = role === p.role;
            return (
              <button
                key={p.role}
                onClick={() => switchPersona(p.role)}
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title={`Switch to ${p.label}`}
              >
                {p.icon}
                <span className="hidden sm:inline">{p.label}</span>
                <span className="sm:hidden">{p.role}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
