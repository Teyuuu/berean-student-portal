import React, { useState, useEffect } from 'react';
import { api } from '@/lib/supabase';
import { Program, AcademicStatus } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { Plus, Edit2, Archive, CheckCircle, Layers } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const ProgramsPage: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [durationYears, setDurationYears] = useState(4);
  const [status, setStatus] = useState<AcademicStatus>('ACTIVE');

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    setLoading(true);
    try {
      const data = await api.getPrograms();
      setPrograms(data);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingProgram(null);
    setCode('');
    setName('');
    setDescription('');
    setDurationYears(4);
    setStatus('ACTIVE');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Program) => {
    setEditingProgram(p);
    setCode(p.code);
    setName(p.name);
    setDescription(p.description || '');
    setDurationYears(p.duration_years);
    setStatus(p.status);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProgram) {
      await api.updateProgram(editingProgram.id, {
        code,
        name,
        description,
        duration_years: Number(durationYears),
        status,
      });
    } else {
      await api.createProgram({
        code,
        name,
        description,
        duration_years: Number(durationYears),
        status,
      });
    }
    setIsModalOpen(false);
    await loadPrograms();
  };

  const handleToggleStatus = async (program: Program) => {
    const nextStatus: AcademicStatus = program.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE';
    await api.updateProgram(program.id, { status: nextStatus });
    await loadPrograms();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-950 font-serif">
            Academic Degree Programs
          </h1>
          <p className="text-sm text-slate-500">
            Configure programs offered by Berean Bible College
          </p>
        </div>
        <Button onClick={handleOpenCreate} size="sm">
          <Plus className="w-4 h-4 mr-1.5" />
          Add New Program
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((p) => (
          <Card key={p.id} className="flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant={p.status === 'ACTIVE' ? 'success' : 'secondary'}>
                  {p.status}
                </Badge>
                <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {p.code}
                </span>
              </div>
              <CardTitle className="text-base font-bold text-blue-950 mt-2">
                {p.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 flex-1">
              <p className="text-xs text-slate-600 line-clamp-3">
                {p.description || 'No description provided.'}
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Standard Duration:</span>
                <span className="font-semibold text-slate-800">{p.duration_years} Years</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Created:</span>
                <span>{formatDate(p.created_at)}</span>
              </div>
            </CardContent>
            <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenEdit(p)}
                className="text-xs flex-1"
              >
                <Edit2 className="w-3.5 h-3.5 mr-1" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleStatus(p)}
                className="text-xs text-slate-600"
              >
                {p.status === 'ACTIVE' ? (
                  <>
                    <Archive className="w-3.5 h-3.5 mr-1 text-amber-600" />
                    Archive
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Activate
                  </>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Program Create/Edit Dialog */}
      <Dialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingProgram ? 'Edit Academic Program' : 'Create New Academic Program'}
        description="Define degree program code, title, and normal duration in years."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Program Code *
              </label>
              <Input
                required
                placeholder="e.g. BTH"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Duration (Years) *
              </label>
              <Input
                type="number"
                min="1"
                max="8"
                required
                value={durationYears}
                onChange={(e) => setDurationYears(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Program Full Name *
            </label>
            <Input
              required
              placeholder="e.g. Bachelor of Theology"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Description & Objectives
            </label>
            <Textarea
              placeholder="Program overview and ministry preparation focus..."
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
              {editingProgram ? 'Save Changes' : 'Create Program'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
