import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { BookOpen, ShieldCheck, UserCheck, GraduationCap, Award, AlertCircle } from 'lucide-react';
import { UserRole } from '@/types';

export const LoginPage: React.FC = () => {
  const { login, switchPersona, role } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.error) {
        setError(result.error);
      } else {
        // Redirection handled based on user role
        navigate('/');
      }
    } catch {
      setError('An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (targetRole: UserRole) => {
    setIsLoading(true);
    setError(null);
    try {
      await switchPersona(targetRole);
      switch (targetRole) {
        case 'ADMIN':
          navigate('/admin');
          break;
        case 'STAFF':
          navigate('/staff');
          break;
        case 'STUDENT':
          navigate('/student');
          break;
        case 'ALUMNI':
          navigate('/alumni');
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <img
          src="/college-logo.png"
          alt="Berean Bible Baptist College Logo"
          className="h-24 w-24 object-contain mx-auto drop-shadow-md hover:scale-105 transition-transform"
        />
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-blue-950 font-serif">
          Berean Bible Baptist College
        </h2>
        <p className="mt-1 text-sm text-slate-600 font-medium">
          Student and Alumni Management Portal
        </p>
        <p className="text-xs text-amber-800 italic mt-0.5">
          "A chosen generation, a royal priesthood, an holy nation..." — 1 Peter 2:9 KJB
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-bold text-slate-900">Sign in to your account</CardTitle>
            <CardDescription>
              Enter your college credentials to access your dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200 flex items-start">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0 mt-0.5 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  required
                  placeholder="e.g. student@berean.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-blue-900 hover:text-blue-950 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full h-10" isLoading={isLoading}>
                Sign In
              </Button>
            </form>

            {/* Quick Demo Personas */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 text-center mb-3">
                Instant Demo Access (Click to test roles)
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickDemoLogin('ADMIN')}
                  className="justify-start text-xs border-slate-300 hover:bg-blue-50 hover:border-blue-300"
                >
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-blue-800" />
                  Admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickDemoLogin('STAFF')}
                  className="justify-start text-xs border-slate-300 hover:bg-sky-50 hover:border-sky-300"
                >
                  <UserCheck className="w-3.5 h-3.5 mr-1.5 text-sky-700" />
                  Registrar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickDemoLogin('STUDENT')}
                  className="justify-start text-xs border-slate-300 hover:bg-emerald-50 hover:border-emerald-300"
                >
                  <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-emerald-700" />
                  Student
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickDemoLogin('ALUMNI')}
                  className="justify-start text-xs border-slate-300 hover:bg-amber-50 hover:border-amber-300"
                >
                  <Award className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
                  Alumni
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-slate-50 border-t border-slate-100 rounded-b-xl py-3 text-center justify-center">
            <span className="text-xs text-slate-600">
              New applicant?{' '}
              <Link to="/register" className="font-semibold text-blue-900 hover:underline">
                Submit Online Registration
              </Link>
            </span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
