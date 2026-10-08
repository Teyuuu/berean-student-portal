import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/supabase';
import { AlumniProfile, Announcement } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Award, BookOpen, Megaphone, User, Briefcase, MapPin, Globe } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const AlumniDashboard: React.FC = () => {
  const { user } = useAuth();
  const [alumni, setAlumni] = useState<AlumniProfile | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAlumniData(user.id);
    }
  }, [user]);

  const loadAlumniData = async (userId: string) => {
    setLoading(true);
    try {
      const [al, anns] = await Promise.all([
        api.getAlumniByProfileId(userId),
        api.getAnnouncements(),
      ]);
      setAlumni(al);
      setAnnouncements(anns.filter((a) => a.audience === 'ALL' || a.audience === 'ALUMNI'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Alumni Recognition Card */}
      <Card className="bg-gradient-to-r from-slate-900 via-blue-950 to-amber-950 text-white border-amber-900/60 p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            {user?.profile_photo_url ? (
              <img
                src={user.profile_photo_url}
                alt={user.first_name}
                className="h-16 w-16 rounded-full object-cover ring-4 ring-amber-500/50"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-amber-900 text-amber-200 flex items-center justify-center font-serif text-2xl font-bold ring-4 ring-amber-500/40">
                {user?.first_name[0]}
                {user?.last_name[0]}
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white font-serif">
                  {user?.first_name} {user?.last_name}
                </h1>
                <Badge variant="gold">BEREAN ALUMNI</Badge>
              </div>
              <div className="text-xs text-amber-300 font-semibold">
                Class of {alumni?.graduation_year || 2025} • {alumni?.degree_conferred || 'Bachelor of Theology'}
              </div>
              <div className="text-xs text-slate-300">
                {alumni?.position || 'Associate Pastor'} at {alumni?.employer || 'Grace Reformed Baptist Church'}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link to="/alumni/profile">
              <Button size="sm" variant="gold" className="text-xs">
                <User className="w-3.5 h-3.5 mr-1" />
                Update Directory
              </Button>
            </Link>
            <Link to="/alumni/records">
              <Button size="sm" variant="outline" className="text-xs bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Award className="w-3.5 h-3.5 mr-1" />
                Permanent Transcript
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Alumni Career & Ministry Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5">
          <div className="flex items-center space-x-3 text-slate-800 font-semibold text-sm mb-3">
            <Briefcase className="w-4 h-4 text-amber-600" />
            <span>Ministry & Vocation</span>
          </div>
          <div className="text-xs space-y-2 text-slate-600">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Current Ministry / Position</span>
              <strong className="text-slate-900">{alumni?.position || 'Associate Pastor'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Employer / Local Church</span>
              <strong className="text-slate-900">{alumni?.employer || 'Grace Reformed Baptist Church'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Ministry Focus</span>
              <span>{alumni?.ministry_involvement || 'Expositional preaching and youth discipleship'}</span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center space-x-3 text-slate-800 font-semibold text-sm mb-3">
            <MapPin className="w-4 h-4 text-blue-900" />
            <span>Location & Contact</span>
          </div>
          <div className="text-xs space-y-2 text-slate-600">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Location</span>
              <strong className="text-slate-900">{alumni?.location || 'Metro Manila, Philippines'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Email</span>
              <span>{alumni?.email || user?.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Phone</span>
              <span>{alumni?.phone || user?.phone || '—'}</span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center space-x-3 text-slate-800 font-semibold text-sm mb-3">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Academic Heritage</span>
          </div>
          <div className="text-xs space-y-2 text-slate-600">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Conferred Degree</span>
              <strong className="text-slate-900">{alumni?.degree_conferred || 'Bachelor of Theology'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Commencement</span>
              <span>{formatDate(alumni?.graduation_date || '2025-05-25')}</span>
            </div>
            <div className="pt-2">
              <Link to="/alumni/records" className="text-blue-900 font-semibold hover:underline">
                View Certified Transcript →
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Alumni Announcements */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-semibold flex items-center">
            <Megaphone className="w-4 h-4 mr-2 text-amber-600" />
            Alumni Network Announcements
          </CardTitle>
          <Link to="/alumni/announcements" className="text-xs text-blue-900 hover:underline">
            View All
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 text-sm">{ann.title}</span>
                  <span className="text-[11px] text-slate-400">{formatDate(ann.published_at)}</span>
                </div>
                <p className="text-slate-600">{ann.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
