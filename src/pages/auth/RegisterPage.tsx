import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/supabase';
import { Program } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { BookOpen, CheckCircle, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [programId, setProgramId] = useState('');

  useEffect(() => {
    api.getPrograms().then((data) => {
      setPrograms(data.filter((p) => p.status === 'ACTIVE'));
      if (data.length > 0) {
        setProgramId(data[0].id);
      }
    });
  }, []);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step === 1) {
      if (!firstName.trim() || !lastName.trim() || !email.trim()) {
        setError('Please complete all required personal information fields.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!programId) {
        setError('Please select your preferred academic program.');
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await register({
        firstName,
        middleName,
        lastName,
        email,
        phone,
        password,
        programId,
      });

      if (res.error) {
        setError(res.error);
      } else {
        setIsSubmitted(true);
      }
    } catch {
      setError('An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Card className="text-center shadow-lg border-emerald-200">
            <CardHeader>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-2">
                <CheckCircle className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">
                Application Submitted Successfully!
              </CardTitle>
              <CardDescription className="text-slate-600">
                Welcome to Berean Bible College, {firstName}!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <p>
                Your application has been registered in the system under status{' '}
                <strong className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  APPLICANT (Pending Staff Verification)
                </strong>.
              </p>
              <div className="bg-slate-50 p-4 rounded-lg text-left text-xs space-y-2 border border-slate-200">
                <div className="font-semibold text-slate-800">Next Steps:</div>
                <div className="flex items-start space-x-2">
                  <span className="font-bold text-blue-900">1.</span>
                  <span>Registrar staff reviews your academic profile and credentials.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-bold text-blue-900">2.</span>
                  <span>An official student number will be assigned upon verification.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-bold text-blue-900">3.</span>
                  <span>You may sign in right now to explore your applicant dashboard and upload requirements.</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button onClick={() => navigate('/student')} className="w-full">
                Proceed to Student Portal
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <img
          src="/college-logo.png"
          alt="Berean Bible Baptist College Logo"
          className="h-20 w-20 object-contain mx-auto drop-shadow-md"
        />
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-blue-950 font-serif">
          Student Registration
        </h2>
        <p className="mt-1 text-sm text-slate-600 font-medium">
          Berean Bible Baptist College Admissions & Enrollment
        </p>

        {/* Multi-step progress indicator */}
        <div className="mt-6 flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                step >= 1 ? 'bg-blue-900 text-white' : 'bg-slate-300 text-slate-600'
              }`}
            >
              1
            </span>
            <span className={`text-xs font-medium ${step >= 1 ? 'text-blue-950' : 'text-slate-400'}`}>
              Personal
            </span>
          </div>
          <div className="h-0.5 w-8 bg-slate-300" />
          <div className="flex items-center space-x-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                step >= 2 ? 'bg-blue-900 text-white' : 'bg-slate-300 text-slate-600'
              }`}
            >
              2
            </span>
            <span className={`text-xs font-medium ${step >= 2 ? 'text-blue-950' : 'text-slate-400'}`}>
              Program
            </span>
          </div>
          <div className="h-0.5 w-8 bg-slate-300" />
          <div className="flex items-center space-x-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                step >= 3 ? 'bg-blue-900 text-white' : 'bg-slate-300 text-slate-600'
              }`}
            >
              3
            </span>
            <span className={`text-xs font-medium ${step >= 3 ? 'text-blue-950' : 'text-slate-400'}`}>
              Security
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <Card className="shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">
              {step === 1 && 'Step 1: Personal & Contact Information'}
              {step === 2 && 'Step 2: Choose Your Academic Program'}
              {step === 3 && 'Step 3: Security & Credentials'}
            </CardTitle>
            <CardDescription>
              {step === 1 && 'Provide your official legal name and contact details.'}
              {step === 2 && 'Select the theological degree you wish to pursue.'}
              {step === 3 && 'Create a password for signing in to the student portal.'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200 flex items-start">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0 mt-0.5 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleNext} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      First Name *
                    </label>
                    <Input
                      required
                      placeholder="e.g. Priscilla"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Middle Name
                    </label>
                    <Input
                      placeholder="Optional"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Last Name *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Aquila"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      required
                      placeholder="e.g. applicant@berean.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Contact Phone
                    </label>
                    <Input
                      placeholder="+63 917 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit">
                    Continue to Program Selection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleNext} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Target Academic Program *
                  </label>
                  <Select
                    value={programId}
                    onChange={(e) => setProgramId(e.target.value)}
                    className="w-full"
                  >
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.code} — {p.name} ({p.duration_years} Years)
                      </option>
                    ))}
                  </Select>
                </div>

                {programs.find((p) => p.id === programId) && (
                  <div className="p-4 bg-blue-50/60 rounded-lg border border-blue-200/80 text-xs text-blue-900 space-y-1">
                    <div className="font-semibold text-blue-950">
                      {programs.find((p) => p.id === programId)?.name}
                    </div>
                    <div>{programs.find((p) => p.id === programId)?.description}</div>
                  </div>
                )}

                <div className="pt-2 flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button type="submit">
                    Continue to Credentials
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Account Password *
                  </label>
                  <Input
                    type="password"
                    required
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Confirm Password *
                  </label>
                  <Input
                    type="password"
                    required
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800">
                  By clicking Submit Registration, you attest that all information provided is accurate and agree to abide by the Berean Bible College Student Handbook and Code of Christian Conduct.
                </div>

                <div className="pt-2 flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button type="submit" isLoading={isLoading} variant="gold">
                    Submit Registration
                  </Button>
                </div>
              </form>
            )}
          </CardContent>

          <CardFooter className="bg-slate-50 border-t border-slate-100 rounded-b-xl py-3 justify-center">
            <span className="text-xs text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-blue-900 hover:underline">
                Sign In here
              </Link>
            </span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
