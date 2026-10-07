import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { AlertCircle, Lock, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      } else if (result.role) {
        // Direct route based on authenticated role only
        switch (result.role) {
          case 'ADMIN':
            navigate('/admin', { replace: true });
            break;
          case 'STAFF':
            navigate('/staff', { replace: true });
            break;
          case 'STUDENT':
            navigate('/student', { replace: true });
            break;
          case 'ALUMNI':
            navigate('/alumni', { replace: true });
            break;
          default:
            navigate('/', { replace: true });
        }
      }
    } catch {
      setError('An unexpected error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-950 via-slate-900 to-slate-950 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="inline-block p-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl mb-4">
          <img
            src="/college-logo.png"
            alt="Berean Bible Baptist College Seal"
            className="h-24 w-24 object-contain mx-auto drop-shadow-lg"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-serif">
          Berean Bible Baptist College
        </h1>
        <p className="mt-1 text-sm font-medium text-amber-300">
          Student and Alumni Management Portal
        </p>
        <p className="mt-2 text-xs text-slate-400 italic max-w-sm mx-auto">
          "These were more noble... in that they received the word with all readiness of mind, and searched the scriptures daily."
          <span className="block not-italic font-semibold text-slate-300 mt-0.5">— Acts 17:11 KJB</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Card className="shadow-2xl border-slate-700/60 bg-slate-800/90 backdrop-blur-md text-slate-100">
          <CardHeader className="space-y-1 pb-4 border-b border-slate-700/60">
            <div className="flex items-center space-x-2 text-blue-400">
              <ShieldCheck className="w-5 h-5" />
              <CardTitle className="text-lg font-bold text-white">Institutional Authentication</CardTitle>
            </div>
            <CardDescription className="text-slate-400 text-xs">
              Please enter your authorized Berean account email and password to proceed.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {error && (
              <div className="mb-5 rounded-lg bg-red-950/70 p-3.5 text-xs text-red-200 border border-red-700/60 flex items-start shadow-sm">
                <AlertCircle className="w-4 h-4 mr-2.5 shrink-0 mt-0.5 text-red-400" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="email"
                    required
                    placeholder="e.g. yourname@berean.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-10 bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-blue-700 hover:bg-blue-600 text-white font-semibold text-sm shadow-md mt-2"
                isLoading={isLoading}
              >
                Sign In to Portal
              </Button>
            </form>
          </CardContent>

          <CardFooter className="bg-slate-900/60 border-t border-slate-700/60 rounded-b-xl py-4 px-6 text-center justify-center">
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-300">Account Access Policy:</span> Accounts are issued and managed by College Administration. If you are an incoming student, faculty staff member, or alumnus requiring credentials, please contact the{' '}
              <span className="text-amber-300 font-medium">Office of the Registrar</span>.
            </p>
          </CardFooter>
        </Card>

        {/* Institutional notice footer */}
        <p className="text-center text-[11px] text-slate-400 mt-6">
          Berean Bible Baptist College &bull; All Rights Reserved &bull; Secured with Supabase RLS
        </p>
      </div>
    </div>
  );
};
