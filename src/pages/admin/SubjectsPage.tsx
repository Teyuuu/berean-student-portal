import React, { useState, useEffect } from 'react';
import { api } from '@/lib/supabase';
import { Subject, AcademicStatus } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { Plus, Edit2, Search, Archive, CheckCircle, FileSpreadsheet } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const SubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [units, setUnits] = useState(3);
  const [status, setStatus] = useState<AcademicStatus>('ACTIVE');

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const data = await api.getSubjects();
      setSubjects(data);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingSubject(null);
    setCode('');
    setName('');
    setDescription('');
    setUnits(3);
    setStatus('ACTIVE');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Subject) => {
    setEditingSubject(s);
    setCode(s.code);
    setName(s.name);
    setDescription(s.description || '');
    setUnits(s.units);
    setStatus(s.status);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSubject) {
      await api.updateSubject(editingSubject.id, {
        code,
        name,
        description,
        units: Number(units),
        status,
      });
    } else {
      await api.createSubject({
        code,
        name,
        description,
        units: Number(units),
        status,
      });
    }
    setIsModalOpen(false);
    await loadSubjects();
  };

  const handleToggleStatus = async (subject: Subject) => {
    const nextStatus: AcademicStatus = subject.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE';
    await api.updateSubject(subject.id, { status: nextStatus });
    await loadSubjects();
  };

  const filtered = subjects.filter(
    (s) =>
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-950 font-serif">
            Subject Course Catalog
          </h1>
          <p className="text-sm text-slate-500">
            Manage biblical and general academic subjects, unit allocations, and descriptions
          </p>
        </div>
        <Button onClick={handleOpenCreate} size="sm">
          <Plus className="w-4 h-4 mr-1.5" />
          Add New Subject
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <Input
            placeholder="Search subjects by code or title (e.g. BTH-101 or Greek)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
      </Card>

      {/* Subjects Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Subject Code</th>
                  <th className="px-4 py-3 font-semibold">Course Title</th>
                  <th className="px-4 py-3 font-semibold">Units</th>
                  <th className="px-4 py-3 font-semibold">Description</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-blue-950">
                      {s.code}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {s.name}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {s.units} units
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-xs truncate">
                      {s.description || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={s.status === 'ACTIVE' ? 'success' : 'secondary'}>
                        {s.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(s)}
                        className="h-7 text-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(s)}
                        className="h-7 text-xs text-slate-500"
                      >
                        {s.status === 'ACTIVE' ? (
                          <Archive className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Subject Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingSubject ? 'Edit Subject Record' : 'Register New Subject'}
        description="Official subject details used across all academic curricula."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Subject Code *
              </label>
              <Input
                required
                placeholder="e.g. BTH-101"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Academic Units *
              </label>
              <Input
                type="number"
                min="1"
                max="10"
                required
                value={units}
                onChange={(e) => setUnits(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Course Title *
            </label>
            <Input
              required
              placeholder="e.g. Old Testament Survey"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Course Description & Objectives
            </label>
            <Textarea
              placeholder="Syllabus overview and core topics..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Status
            </label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as AcademicStatus)}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="ARCHIVED">ARCHIVED</option>
              <option value="INACTIVE">INACTIVE</option>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingSubject ? 'Save Changes' : 'Create Subject'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
