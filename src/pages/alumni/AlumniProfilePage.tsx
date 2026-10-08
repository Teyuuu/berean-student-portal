import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/supabase';
import { AlumniProfile } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Award, Briefcase, MapPin, CheckCircle2, Edit3 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { EditAccountModal } from '@/components/account/EditAccountModal';

export const AlumniProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [alumni, setAlumni] = useState<AlumniProfile | null>(null);
  const [employer, setEmployer] = useState('');
  const [position, setPosition] = useState('');
  const [ministryInvolvement, setMinistryInvolvement] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [bio, setBio] = useState('');
  const [isDirectoryVisible, setIsDirectoryVisible] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      api.getAlumniByProfileId(user.id).then((al) => {
        if (al) {
          setAlumni(al);
          setEmployer(al.employer || '');
          setPosition(al.position || '');
          setMinistryInvolvement(al.ministry_involvement || '');
          setIndustry(al.industry || 'Christian Ministry');
          setLocation(al.location || '');
          setPhone(al.phone || user.phone || '');
          setEmail(al.email || user.email || '');
          setLinkedinUrl(al.linkedin_url || '');
          setBio(al.bio || '');
          setIsDirectoryVisible(al.is_directory_visible);
        }
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await api.updateAlumniProfile(user.id, {
        employer,
        position,
        ministry_involvement: ministryInvolvement,
        industry,
        location,
        phone,
        email,
        linkedin_url: linkedinUrl,
        bio,
        is_directory_visible: isDirectoryVisible,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-blue-950 font-serif">
          Alumni Directory Profile
        </h1>
        <p className="text-sm text-slate-500">
          Share your ongoing ministry, pastoral station, and career calling with fellow alumni
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
          Alumni directory information updated successfully.
        </div>
      )}

      {/* Degree Conferred (Read-only) */}
      <Card className="bg-amber-50/40 border-amber-200 p-4 text-xs">
        <div className="flex items-center space-x-3">
          <Award className="w-6 h-6 text-amber-700" />
          <div>
            <div className="font-bold text-amber-950 text-sm">
              {alumni?.degree_conferred || 'Bachelor of Theology'} — Class of {alumni?.graduation_year || 2025}
            </div>
            <div className="text-amber-800">
              Commencement Date: {formatDate(alumni?.graduation_date || '2025-05-25')}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Vocation & Ministry Calling
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Current Ministry / Position
                </label>
                <Input
                  placeholder="e.g. Associate Pastor of Youth"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Local Church / Employer
                </label>
                <Input
                  placeholder="e.g. Grace Reformed Baptist Church"
                  value={employer}
                  onChange={(e) => setEmployer(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Ministry Involvement & Responsibilities
              </label>
              <Textarea
                placeholder="Description of preaching, counseling, or missionary field..."
                value={ministryInvolvement}
                onChange={(e) => setMinistryInvolvement(e.target.value)}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Location / City
                </label>
                <Input
                  placeholder="e.g. Metro Manila, Philippines"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Vocation Sector / Industry
                </label>
                <Input
                  placeholder="e.g. Pastoral Ministry / Christian Education"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Contact Phone
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+63 917 100 2005"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  LinkedIn Profile / Website
                </label>
                <Input
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Alumni Testimonial & Biography
              </label>
              <Textarea
                placeholder="Share your encouragement with current Berean students..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="visCheck"
                checked={isDirectoryVisible}
                onChange={(e) => setIsDirectoryVisible(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
              />
              <label htmlFor="visCheck" className="text-xs text-slate-700 cursor-pointer">
                Display my profile in the verified Berean Alumni Directory
              </label>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button type="submit" isLoading={loading} variant="gold">
                Save Alumni Information
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
