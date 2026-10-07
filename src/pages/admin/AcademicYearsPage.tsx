import React, { useState, useEffect } from 'react';
import { api } from '@/lib/supabase';
import { AcademicYear, Semester, YearLevel, AcademicYearStatus } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { Plus, Check, Calendar, Star, Layers } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const AcademicYearsPage: React.FC = () => {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [yearLevels, setYearLevels] = useState<YearLevel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [status, setStatus] = useState<AcademicYearStatus>('ACTIVE');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [ays, sems, yls] = await Promise.all([
      api.getAcademicYears(),
      api.getSemesters(),
      api.getYearLevels(),
    ]);
    setAcademicYears(ays);
    setSemesters(sems);
    setYearLevels(yls);
  };

  const handleCreateAY = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createAcademicYear({
      name,
      start_date: startDate,
      end_date: endDate,
      is_current: isCurrent,
      status,
    });
    setIsModalOpen(false);
    await loadData();
  };

  const handleSetCurrent = async (id: string) => {
    await api.setCurrentAcademicYear(id);
    await loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-950 font-serif">
            Academic Calendar & Terms
          </h1>
          <p className="text-sm text-slate-500">
            Configure academic calendar cycles, active school years, semesters, and year levels
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Academic Year
        </Button>
      </div>

      {/* Academic Years List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-blue-900" />
            Academic Years
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-y border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Academic Year</th>
                  <th className="px-4 py-3 font-semibold">Duration Period</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Current Active Year</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {academicYears.map((ay) => (
                  <tr key={ay.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-bold text-slate-900 text-sm">
                      {ay.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(ay.start_date)} — {formatDate(ay.end_date)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          ay.status === 'ACTIVE'
                            ? 'success'
                            : ay.status === 'UPCOMING'
                            ? 'info'
                            : 'secondary'
                        }
                      >
                        {ay.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {ay.is_current ? (
                        <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <Check className="w-3.5 h-3.5 mr-1" />
                          Current Year
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!ay.is_current && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetCurrent(ay.id)}
                          className="h-7 text-xs"
                        >
                          <Star className="w-3.5 h-3.5 mr-1 text-amber-500" />
                          Set as Current
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Semesters & Year Levels Information Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Configured Semesters / Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {semesters.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/60 text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-900">{s.name}</span>
                  <div className="text-slate-400 text-[11px]">Sequence Index: {s.sequence}</div>
                </div>
                <Badge variant="success">{s.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Configured Year Levels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {yearLevels.map((y) => (
              <div
                key={y.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/60 text-xs"
              >
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-blue-900" />
                  <span className="font-semibold text-slate-900">{y.name}</span>
                </div>
                <span className="text-slate-500 font-mono">Level {y.level_number}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Add AY Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Add Academic Year"
        description="Specify calendar year bounds (e.g. 2027-2028)."
      >
        <form onSubmit={handleCreateAY} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Academic Year Title *
            </label>
            <Input
              required
              placeholder="e.g. 2027-2028"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Start Date *
              </label>
              <Input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                End Date *
              </label>
              <Input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Status
            </label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as AcademicYearStatus)}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="UPCOMING">UPCOMING</option>
              <option value="CLOSED">CLOSED</option>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isCurrentCheck"
              checked={isCurrent}
              onChange={(e) => setIsCurrent(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
            />
            <label htmlFor="isCurrentCheck" className="text-xs text-slate-700 font-medium cursor-pointer">
              Mark as currently active academic year
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Academic Year</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
