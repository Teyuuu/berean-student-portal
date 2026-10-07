import React, { useState, useEffect } from 'react';
import { api } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Announcement, AnnouncementAudience } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { Megaphone, Plus, Pin, Calendar, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const AnnouncementsPage: React.FC = () => {
  const { user, role } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filterAudience, setFilterAudience] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState<AnnouncementAudience>('ALL');
  const [isPinned, setIsPinned] = useState(false);

  const canManage = role === 'ADMIN' || role === 'STAFF';

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    const data = await api.getAnnouncements();
    setAnnouncements(data);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !user) return;

    await api.createAnnouncement({
      title,
      content,
      audience,
      is_pinned: isPinned,
      status: 'PUBLISHED',
      author_id: user.id,
      expires_at: null,
    });

    setIsModalOpen(false);
    setTitle('');
    setContent('');
    setIsPinned(false);
    await loadAnnouncements();
  };

  const filtered = announcements.filter((a) => {
    if (filterAudience === 'ALL') return true;
    return a.audience === filterAudience || a.audience === 'ALL';
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-950 font-serif">
            Institution Announcements & Notices
          </h1>
          <p className="text-sm text-slate-500">
            Official Berean Bible College updates, chapel schedules, and academic bulletins
          </p>
        </div>
        {canManage && (
          <Button onClick={() => setIsModalOpen(true)} size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Publish Announcement
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs">
        {['ALL', 'STUDENTS', 'ALUMNI', 'STAFF'].map((aud) => (
          <button
            key={aud}
            onClick={() => setFilterAudience(aud)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filterAudience === aud
                ? 'bg-blue-950 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {aud === 'ALL' ? 'All Bulletins' : `${aud} Notices`}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card className="p-8 text-center text-slate-400 text-xs">
            No announcements found under this category.
          </Card>
        ) : (
          filtered.map((ann) => (
            <Card
              key={ann.id}
              className={`p-5 transition-all ${
                ann.is_pinned ? 'border-amber-300 bg-amber-50/20 shadow-xs' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    {ann.is_pinned && (
                      <span className="flex items-center text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        <Pin className="w-3 h-3 mr-1" />
                        PINNED NOTICE
                      </span>
                    )}
                    <Badge variant="outline" className="text-[10px]">
                      Audience: {ann.audience}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{ann.title}</h3>
                </div>
                <div className="text-[11px] text-slate-400 whitespace-nowrap">
                  {formatDate(ann.published_at)}
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                {ann.content}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  Published by: {ann.author ? `${ann.author.first_name} ${ann.author.last_name}` : 'Office of Administration'}
                </span>
                <span className="font-mono text-[10px] text-slate-300">ID: {ann.id.slice(0, 8)}</span>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Publish Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Publish Institution Announcement"
        description="Broadcast official announcements to students, alumni, faculty, or staff."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Announcement Title *
            </label>
            <Input
              required
              placeholder="e.g. Fall 2026 Convocation Schedule"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Target Audience *
            </label>
            <Select
              value={audience}
              onChange={(e) => setAudience(e.target.value as AnnouncementAudience)}
            >
              <option value="ALL">ALL (College-Wide)</option>
              <option value="STUDENTS">Students Only</option>
              <option value="ALUMNI">Alumni Only</option>
              <option value="STAFF">Staff & Faculty Only</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Announcement Content & Notice Text *
            </label>
            <Textarea
              required
              placeholder="Type message text, schedule timings, and important notes..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="pinCheck"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
            />
            <label htmlFor="pinCheck" className="text-xs text-slate-700 cursor-pointer font-medium">
              Pin to the top of announcement boards
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Publish Bulletin</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
