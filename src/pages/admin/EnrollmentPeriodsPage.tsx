import React, { useState, useEffect } from 'react';
import { api } from '@/lib/supabase';
import { EnrollmentPeriod, AcademicYear, Semester, EnrollmentPeriodStatus } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { Plus, Calendar, PlayCircle, StopCircle, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const EnrollmentPeriodsPage: React.FC = () => {
  const [periods, setPeriods] = useState<EnrollmentPeriod[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [academicYearId, setAcademicYearId] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<EnrollmentPeriodStatus>('UPCOMING');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [pList, ays, sems] = await Promise.all([
      api.getEnrollmentPeriods(),
      api.getAcademicYears(),
      api.getSemesters(),
    ]);
    setPeriods(pList);
    setAcademicYears(ays);
    setSemesters(sems);
    if (ays.length > 0) setAcademicYearId(ays[0].id);
    if (sems.length > 0) setSemesterId(sems[0].id);
  };

  const handleCreatePeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createEnrollmentPeriod({
      academic_year_id: academicYearId,
      semester_id: semesterId,
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
      status,
    });
    setIsModalOpen(false);
    await loadData();
  };

  const handleSetStatus = async (id: string, newStatus: EnrollmentPeriodStatus) => {
    await api.updateEnrollmentPeriodStatus(id, newStatus);
    await loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-950 font-serif">
            Enrollment Windows & Periods
          </h1>
          <p className="text-sm text-slate-500">
            Open and close student online enrollment access for academic semesters
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-1.5" />
          Schedule Enrollment Window
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Academic Term</th>
                  <th className="px-4 py-3 font-semibold">Window Dates</th>
                  <th className="px-4 py-3 font-semibold">Enrollment Status</th>
                  <th className="px-4 py-3 font-semibold">Student Access</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {periods.map((ep) => (
                  <tr key={ep.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <div className="font-bold text-slate-900">{ep.academic_year?.name}</div>
                      <div className="text-slate-500">{ep.semester?.name}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(ep.start_date)} — {formatDate(ep.end_date)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          ep.status === 'OPEN'
                            ? 'success'
                            : ep.status === 'UPCOMING'
                            ? 'info'
                            : 'secondary'
                        }
                      >
                        {ep.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {ep.status === 'OPEN' ? (
                        <span className="text-emerald-700 font-semibold flex items-center">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                          Accepting Student Submissions
                        </span>
                      ) : (
                        <span className="text-slate-400">Submissions Locked</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right space-x-1">
                      {ep.status !== 'OPEN' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetStatus(ep.id, 'OPEN')}
                          className="h-7 text-xs border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                        >
                          <PlayCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                          Open Enrollment
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetStatus(ep.id, 'CLOSED')}
                          className="h-7 text-xs border-red-200 text-red-700 hover:bg-red-50"
                        >
                          <StopCircle className="w-3.5 h-3.5 mr-1 text-red-600" />
                          Close Enrollment
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

      {/* Modal: Schedule Enrollment Window */}
      <Dialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Schedule Enrollment Window"
        description="Configure target academic year, semester, and valid date bounds."
      >
        <form onSubmit={handleCreatePeriod} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Academic Year *
              </label>
              <Select
                value={academicYearId}
                onChange={(e) => setAcademicYearId(e.target.value)}
              >
                {academicYears.map((ay) => (
                  <option key={ay.id} value={ay.id}>
                    {ay.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Semester *
              </label>
              <Select
                value={semesterId}
                onChange={(e) => setSemesterId(e.target.value)}
              >
                {semesters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </div>
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
              Initial Status
            </label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as EnrollmentPeriodStatus)}
            >
              <option value="OPEN">OPEN (Immediately Active)</option>
              <option value="UPCOMING">UPCOMING (Scheduled for Future)</option>
              <option value="CLOSED">CLOSED</option>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Period</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
