import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { localStore } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Lock, User, Mail, Phone, BookOpen, Calendar, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const StudentProfilePage: React.FC = () => {
  const { user, student, refreshUser } = useAuth();

  // Editable fields
  const [phone, setPhone] = useState(user?.phone || '');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(user?.profile_photo_url || '');
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const profiles = localStore.getProfiles();
      const updated = profiles.map((p) =>
        p.id === user.id
          ? {
              ...p,
              phone: phone || null,
              profile_photo_url: profilePhotoUrl || null,
              updated_at: new Date().toISOString(),
            }
          : p
      );
      localStore.saveProfiles(updated);
      await refreshUser();
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-blue-950 font-serif">
          Student Academic Profile
        </h1>
        <p className="text-sm text-slate-500">
          Official academic enrollment record and student contact information
        </p>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
          Profile contact details updated successfully.
        </div>
      )}

      {/* Sensitive Academic Information (Read-Only) */}
      <Card className="border-blue-200 bg-blue-50/20">
        <CardHeader className="pb-3 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center text-blue-950">
              <BookOpen className="w-4 h-4 mr-2 text-blue-900" />
              Official Academic Records (Protected / Read-Only)
            </CardTitle>
            <span className="flex items-center text-[11px] text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
              <Lock className="w-3 h-3 mr-1 text-slate-400" />
              Verified by Registrar
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Official Student Number
            </span>
            <span className="font-mono text-sm font-bold text-blue-950 mt-1 block">
              {student?.student_number || 'Unassigned (Applicant)'}
            </span>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Academic Program
            </span>
            <span className="font-semibold text-slate-900 mt-1 block">
              {student?.program?.name || 'Bachelor of Theology'} ({student?.program?.code || 'BTH'})
            </span>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Assigned Curriculum Cohort
            </span>
            <span className="font-semibold text-slate-900 mt-1 block">
              {student?.curriculum?.name || 'Curriculum 2026'}
            </span>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Year Level
            </span>
            <span className="font-semibold text-slate-900 mt-1 block">
              {student?.year_level?.name || 'Year 1 (Freshman)'}
            </span>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Student Status
            </span>
            <span className="mt-1 block">
              <Badge variant="success">{student?.student_status || 'ACTIVE'}</Badge>
            </span>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Admission Date
            </span>
            <span className="font-semibold text-slate-900 mt-1 block">
              {formatDate(student?.admission_date)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Editable Personal & Contact Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Personal & Contact Information
          </CardTitle>
          <p className="text-xs text-slate-500">
            You may update your phone number and profile photo below.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Legal First Name
                </label>
                <Input value={user?.first_name || ''} disabled className="bg-slate-50" />
                <span className="text-[10px] text-slate-400">Name modifications require registrar approval.</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Legal Last Name
                </label>
                <Input value={user?.last_name || ''} disabled className="bg-slate-50" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                College Email Address
              </label>
              <Input value={user?.email || ''} disabled className="bg-slate-50 font-mono" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Contact Phone Number
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+63 917 123 4567"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Profile Photo URL
                </label>
                <Input
                  value={profilePhotoUrl}
                  onChange={(e) => setProfilePhotoUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button type="submit" isLoading={loading}>
                Save Contact Updates
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
