import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageSEO } from '@/hooks/usePageSEO';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { BookOpen, CheckCircle, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  usePageSEO();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <img
          src="/college-logo.png"
          alt="Berean Bible Baptist College Logo"
          className="h-20 w-20 object-contain mx-auto drop-shadow-md"
        />
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-blue-950 font-serif">
          Password Recovery
        </h2>
        <p className="mt-1 text-sm text-slate-600 font-medium">
          Berean Bible Baptist College Portal
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Reset your password</CardTitle>
            <CardDescription>
              Enter your college email address and we will send you a password reset link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="rounded-lg bg-emerald-50 p-4 border border-emerald-200 text-center space-y-2">
                <CheckCircle className="h-8 w-8 text-emerald-600 mx-auto" />
                <div className="text-sm font-semibold text-emerald-900">
                  Reset link sent
                </div>
                <div className="text-xs text-emerald-700">
                  If an account exists for {email}, a recovery link has been sent to that inbox.
                </div>
              </div>
            ) : (
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
                <Button type="submit" className="w-full">
                  Send Recovery Link
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="bg-slate-50 border-t border-slate-100 rounded-b-xl py-3 justify-center">
            <Link to="/login" className="inline-flex items-center text-xs font-semibold text-blue-900 hover:underline">
              <ArrowLeft className="mr-1 h-3.5 w-3.5" />
              Return to Sign In
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
