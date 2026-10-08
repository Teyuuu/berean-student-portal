import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BookOpen, Bell, LogOut, User, Menu, X, Edit3 } from 'lucide-react';
import { EditAccountModal } from '@/components/account/EditAccountModal';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isEditAccountOpen, setIsEditAccountOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getRoleBadgeVariant = (r?: string | null) => {
    switch (r) {
      case 'ADMIN':
        return 'default';
      case 'STAFF':
        return 'info';
      case 'STUDENT':
        return 'success';
      case 'ALUMNI':
        return 'gold';
      default:
        return 'secondary';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center space-x-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}

          <Link to="/" className="flex items-center space-x-3 text-slate-900 group">
            <img
              src="/college-logo.png"
              alt="Berean Bible Baptist College Logo"
              className="h-11 w-11 object-contain drop-shadow-xs group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="font-serif font-bold text-base leading-tight tracking-tight text-blue-950">
                Berean Bible Baptist College
              </div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Student & Alumni Portal
              </div>
            </div>
          </Link>
        </div>

        {/* Right: Notifications & User profile */}
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              {/* Role badge */}
              <div className="hidden sm:block">
                <Badge variant={getRoleBadgeVariant(role)}>
                  {role} PORTAL
                </Badge>
              </div>

              {/* Profile summary with edit account modal trigger */}
              <div className="flex items-center space-x-2 pl-2 sm:border-l sm:border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditAccountOpen(true)}
                  className="flex items-center space-x-2.5 px-2 py-1 -my-1 rounded-lg hover:bg-slate-100 transition-all text-left group cursor-pointer border border-transparent hover:border-slate-200"
                  title="Click to edit your account profile"
                >
                  <div className="relative">
                    {user.profile_photo_url ? (
                      <img
                        src={user.profile_photo_url}
                        alt={`${user.first_name} ${user.last_name}`}
                        className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-900/10 group-hover:ring-blue-900 transition-all"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-950 font-semibold text-sm group-hover:bg-blue-200 transition-colors">
                        {user.first_name[0]}
                        {user.last_name[0]}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>

                  <div className="hidden md:block text-left">
                    <div className="text-xs font-semibold text-slate-900 flex items-center group-hover:text-blue-900 transition-colors">
                      <span>{user.first_name} {user.last_name}</span>
                      <Edit3 className="w-3 h-3 ml-1.5 text-slate-400 group-hover:text-blue-900 transition-colors" />
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[130px]">
                      {user.email}
                    </div>
                  </div>
                </button>

                {/* Logout */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  title="Sign out"
                  className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Global Navbar Self-Service Account Edit Modal */}
      <EditAccountModal
        open={isEditAccountOpen}
        onOpenChange={setIsEditAccountOpen}
      />
    </header>
  );
};
