import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { localStore } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Lock, User, Mail, Phone, BookOpen, Calendar, CheckCircle2, Edit3, Camera, Upload, RefreshCw, Sparkles } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { EditAccountModal } from '@/components/account/EditAccountModal';
import { compressImageFile, MAX_FILE_SIZE_BYTES } from '@/lib/fileCompression';

export const StudentProfilePage: React.FC = () => {
  const { user, student, refreshUser, updateProfile } = useAuth();

  // Editable fields
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(user?.profile_photo_url || '');
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionBadge, setCompressionBadge] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handlePhotoUpload = async (file: File) => {
    setIsCompressing(true);
    setCompressionBadge(null);
    try {
      const res = await compressImageFile(file, { maxSizeBytes: MAX_FILE_SIZE_BYTES });
      setProfilePhotoUrl(res.dataUrl);
      setCompressionBadge(
        res.wasCompressed
          ? `Auto-compressed: ${res.originalFormatted} → ${res.compressedFormatted} (${res.savingsPercent}% reduction)`
          : `Optimized: ${res.compressedFormatted} (Under 5 MB)`
      );
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to compress image.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await updateProfile({
        first_name: firstName.trim() || user.first_name,
        last_name: lastName.trim() || user.last_name,
        email: email.trim().toLowerCase() || user.email,
        phone: phone.trim() || null,
        profile_photo_url: profilePhotoUrl || null,
      });
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                Personal & Contact Information
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your name, institutional email, phone number, and profile picture (auto-compressed to &le; 5 MB).
              </p>
            </div>
            <Badge variant="info" className="text-[10px]">Auto-compress &le; 5 MB</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            {/* Profile Photo with Compression */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-900/20 shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-950 flex items-center justify-center font-bold text-lg">
                  {firstName?.[0] || user?.first_name?.[0] || 'S'}
                  {lastName?.[0] || user?.last_name?.[0] || ''}
                </div>
              )}
              <div className="flex-1 space-y-1 text-center sm:text-left">
                <div className="text-xs font-semibold text-slate-800">Student Profile Photo</div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handlePhotoUpload(e.target.files[0]);
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs pointer-events-none"
                      disabled={isCompressing}
                    >
                      {isCompressing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 mr-1 animate-spin text-blue-900" />
                          Compressing...
                        </>
                      ) : (
                        <>
                          <Camera className="w-3.5 h-3.5 mr-1 text-slate-600" />
                          Upload & Compress Photo
                        </>
                      )}
                    </Button>
                  </label>
                  {profilePhotoUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-slate-500 hover:text-red-600"
                      onClick={() => {
                        setProfilePhotoUrl('');
                        setCompressionBadge(null);
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                {compressionBadge && (
                  <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded p-1 flex items-center space-x-1 mt-1">
                    <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{compressionBadge}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Legal First Name
                </label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-white text-xs h-9"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Legal Last Name
                </label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-white text-xs h-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                College Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white font-mono text-xs h-9"
              />
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
                  className="text-xs h-9"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Photo URL (Optional Direct Link)
                </label>
                <Input
                  value={profilePhotoUrl}
                  onChange={(e) => setProfilePhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button type="submit" isLoading={loading} size="sm">
                Save Account Updates
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
