import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Calendar,
  Layers,
  FileCheck,
  Award,
  Users,
  FileText,
  Megaphone,
  History,
  Shield,
  FileSpreadsheet,
  CheckCircle2,
  FolderOpen,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role } = useAuth();

  const getNavItems = (): { title: string; items: NavItem[] }[] => {
    switch (role) {
      case 'ADMIN':
        return [
          {
            title: 'Overview',
            items: [
              { label: 'Admin Dashboard', to: '/admin', icon: <LayoutDashboard className="w-4 h-4 mr-3" /> },
            ],
          },
          {
            title: 'Academic Structure',
            items: [
              { label: 'Academic Programs', to: '/admin/programs', icon: <Layers className="w-4 h-4 mr-3" /> },
              { label: 'Curriculum Builder', to: '/admin/curriculum', icon: <BookOpen className="w-4 h-4 mr-3" /> },
              { label: 'Subject Catalog', to: '/admin/subjects', icon: <FileSpreadsheet className="w-4 h-4 mr-3" /> },
              { label: 'Academic Years & Terms', to: '/admin/academic-years', icon: <Calendar className="w-4 h-4 mr-3" /> },
            ],
          },
          {
            title: 'Admissions & Enrollment',
            items: [
              { label: 'Enrollment Periods', to: '/admin/enrollment-periods', icon: <Calendar className="w-4 h-4 mr-3" /> },
              { label: 'Enrollment Requests', to: '/admin/enrollments', icon: <FileCheck className="w-4 h-4 mr-3" /> },
              { label: 'Student Directory', to: '/admin/students', icon: <Users className="w-4 h-4 mr-3" /> },
              { label: 'Grades & Records', to: '/admin/grades', icon: <Award className="w-4 h-4 mr-3" /> },
            ],
          },
          {
            title: 'System & Governance',
            items: [
              { label: 'Announcements', to: '/admin/announcements', icon: <Megaphone className="w-4 h-4 mr-3" /> },
              { label: 'Audit Trail Logs', to: '/admin/audit-logs', icon: <History className="w-4 h-4 mr-3" /> },
            ],
          },
        ];

      case 'STAFF':
        return [
          {
            title: 'Overview',
            items: [
              { label: 'Registrar Dashboard', to: '/staff', icon: <LayoutDashboard className="w-4 h-4 mr-3" /> },
            ],
          },
          {
            title: 'Registrar Operations',
            items: [
              { label: 'Applicant Verifications', to: '/staff/registrations', icon: <CheckCircle2 className="w-4 h-4 mr-3" /> },
              { label: 'Enrollment Requests', to: '/staff/enrollments', icon: <FileCheck className="w-4 h-4 mr-3" /> },
              { label: 'Student Records', to: '/staff/students', icon: <Users className="w-4 h-4 mr-3" /> },
              { label: 'Grades Management', to: '/staff/grades', icon: <Award className="w-4 h-4 mr-3" /> },
              { label: 'Document Review', to: '/staff/documents', icon: <FolderOpen className="w-4 h-4 mr-3" /> },
              { label: 'Announcements', to: '/staff/announcements', icon: <Megaphone className="w-4 h-4 mr-3" /> },
            ],
          },
        ];

      case 'STUDENT':
        return [
          {
            title: 'Student Portal',
            items: [
              { label: 'My Dashboard', to: '/student', icon: <LayoutDashboard className="w-4 h-4 mr-3" /> },
              { label: 'My Profile', to: '/student/profile', icon: <Users className="w-4 h-4 mr-3" /> },
            ],
          },
          {
            title: 'Academics & Enrollment',
            items: [
              { label: 'Course Enrollment', to: '/student/enrollment', icon: <FileCheck className="w-4 h-4 mr-3" /> },
              { label: 'Current Subjects', to: '/student/subjects', icon: <BookOpen className="w-4 h-4 mr-3" /> },
              { label: 'Academic Records & Grades', to: '/student/records', icon: <Award className="w-4 h-4 mr-3" /> },
              { label: 'Student Documents', to: '/student/documents', icon: <FolderOpen className="w-4 h-4 mr-3" /> },
              { label: 'College Announcements', to: '/student/announcements', icon: <Megaphone className="w-4 h-4 mr-3" /> },
            ],
          },
        ];

      case 'ALUMNI':
        return [
          {
            title: 'Alumni Portal',
            items: [
              { label: 'Alumni Dashboard', to: '/alumni', icon: <LayoutDashboard className="w-4 h-4 mr-3" /> },
              { label: 'My Alumni Profile', to: '/alumni/profile', icon: <Users className="w-4 h-4 mr-3" /> },
              { label: 'Official Academic History', to: '/alumni/records', icon: <Award className="w-4 h-4 mr-3" /> },
              { label: 'Documents & Transcripts', to: '/alumni/documents', icon: <FolderOpen className="w-4 h-4 mr-3" /> },
              { label: 'Alumni Announcements', to: '/alumni/announcements', icon: <Megaphone className="w-4 h-4 mr-3" /> },
            ],
          },
        ];

      default:
        return [];
    }
  };

  const sections = getNavItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-900 text-slate-200 transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-800 flex flex-col`}
      >
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <h4 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {sec.title}
              </h4>
              <div className="space-y-0.5 mt-2">
                {sec.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/admin' || item.to === '/staff' || item.to === '/student' || item.to === '/alumni'}
                    onClick={() => {
                      if (window.innerWidth < 768) onClose();
                    }}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info in sidebar */}
        <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400">
          <div className="font-medium text-slate-300">Berean Bible Baptist College</div>
          <div className="text-[10px] text-slate-400">Student & Alumni Management v1.0</div>
        </div>
      </aside>
    </>
  );
};
