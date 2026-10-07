import React, { useState, useEffect } from 'react';
import { api, localStore } from '@/lib/supabase';
import { Student, StudentStatus, Program, AlumniProfile } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { Search, Users, Award, CheckCircle, Edit2, ShieldAlert } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const StudentsManagementPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  // Status Dialog State
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<StudentStatus>('ACTIVE');
  const [assignedStudentNumber, setAssignedStudentNumber] = useState('');
  const [graduationYear, setGraduationYear] = useState<number>(2026);
  const [graduationDate, setGraduationDate] = useState<string>('2026-05-25');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [stds, progs] = await Promise.all([api.getStudents(), api.getPrograms()]);
      setStudents(stds);
      setPrograms(progs);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStatusModal = (s: Student) => {
    setSelectedStudent(s);
    setNewStatus(s.student_status);
    setAssignedStudentNumber(s.student_number || `BBC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setIsStatusModalOpen(true);
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    // Update student status & number
    await api.updateStudentStatus(
      selectedStudent.id,
      newStatus,
      assignedStudentNumber || undefined
    );

    // If graduated or alumni, preserve record and ensure alumni_profiles entry!
    if (newStatus === 'GRADUATED' || newStatus === 'ALUMNI') {
      const existingAlumni = await api.getAlumniByProfileId(selectedStudent.profile_id);
      if (!existingAlumni) {
        const newAlumni: AlumniProfile = {
          id: crypto.randomUUID(),
          student_id: selectedStudent.id,
          profile_id: selectedStudent.profile_id,
          graduation_year: Number(graduationYear),
          graduation_date: graduationDate,
          degree_conferred: selectedStudent.program?.name || 'Bachelor of Theology',
          employer: null,
          position: null,
          ministry_involvement: null,
          industry: 'Christian Ministry',
          location: 'Philippines',
          phone: selectedStudent.profile?.phone || null,
          email: selectedStudent.profile?.email || null,
          linkedin_url: null,
          bio: 'Berean Bible College Alumnus in Christian Ministry.',
          is_directory_visible: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const currentAlumni = localStore.getAlumniProfiles();
        localStore.saveAlumniProfiles([...currentAlumni, newAlumni]);

        // Update profile role to ALUMNI
        const profiles = localStore.getProfiles();
        localStore.saveProfiles(
          profiles.map((p) =>
            p.id === selectedStudent.profile_id ? { ...p, role: 'ALUMNI' } : p
          )
        );
      }
    }

    setIsStatusModalOpen(false);
    await loadData();
  };

  const filtered = students.filter((s) => {
    const fullName = `${s.profile?.first_name || ''} ${s.profile?.last_name || ''}`.toLowerCase();
    const email = (s.profile?.email || '').toLowerCase();
    const snum = (s.student_number || '').toLowerCase();
    const query = search.toLowerCase();

    const matchesSearch = fullName.includes(query) || email.includes(query) || snum.includes(query);
    const matchesStatus = statusFilter === 'ALL' || s.student_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: StudentStatus) => {
    switch (status) {
      case 'ENROLLED':
        return <Badge variant="success">ENROLLED</Badge>;
      case 'ACTIVE':
        return <Badge variant="default">ACTIVE</Badge>;
      case 'PENDING_VERIFICATION':
        return <Badge variant="warning">PENDING VERIFICATION</Badge>;
      case 'APPLICANT':
        return <Badge variant="secondary">APPLICANT</Badge>;
      case 'ALUMNI':
      case 'GRADUATED':
        return <Badge variant="gold">ALUMNI</Badge>;
      case 'ON_LEAVE':
      case 'SUSPENDED':
      case 'WITHDRAWN':
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-950 font-serif">
            Student Management & Lifecycle
          </h1>
          <p className="text-sm text-slate-500">
            Lifecycle: Applicant → Verification → Enrollment → Active → Graduation → Alumni
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input
              placeholder="Search by student name, email, or student number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          <div className="w-full sm:w-60">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="APPLICANT">APPLICANT</option>
              <option value="PENDING_VERIFICATION">PENDING VERIFICATION</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="ENROLLED">ENROLLED</option>
              <option value="GRADUATED">GRADUATED</option>
              <option value="ALUMNI">ALUMNI</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Students Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Student Name</th>
                  <th className="px-4 py-3 font-semibold">Student ID</th>
                  <th className="px-4 py-3 font-semibold">Degree Program</th>
                  <th className="px-4 py-3 font-semibold">Curriculum</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Admission Date</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <div className="font-semibold text-slate-900">
                        {s.profile?.first_name} {s.profile?.last_name}
                      </div>
                      <div className="text-[11px] text-slate-400">{s.profile?.email}</div>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-800">
                      {s.student_number || (
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                          Pending ID
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {s.program?.code} — {s.program?.name}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {s.curriculum?.name || 'Standard 2026'}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(s.student_status)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(s.admission_date)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenStatusModal(s)}
                        className="h-7 text-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5 mr-1" />
                        Update Status
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Update Student Status Dialog */}
      <Dialog
        open={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
        title="Update Student Academic Status"
        description="Transition student lifecycle, assign official student number, or promote to Graduated/Alumni."
      >
        <form onSubmit={handleSaveStatus} className="space-y-4">
          <div>
            <div className="text-xs font-semibold text-slate-800">
              {selectedStudent?.profile?.first_name} {selectedStudent?.profile?.last_name}
            </div>
            <div className="text-[11px] text-slate-500">{selectedStudent?.profile?.email}</div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Official Student Number
            </label>
            <Input
              placeholder="e.g. BBC-2026-0005"
              value={assignedStudentNumber}
              onChange={(e) => setAssignedStudentNumber(e.target.value)}
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Assigned upon applicant verification.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Lifecycle Status *
            </label>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as StudentStatus)}
            >
              <option value="APPLICANT">APPLICANT</option>
              <option value="PENDING_VERIFICATION">PENDING_VERIFICATION</option>
              <option value="ACTIVE">ACTIVE (In Good Standing)</option>
              <option value="ENROLLED">ENROLLED (Attending Classes)</option>
              <option value="NOT_ENROLLED">NOT_ENROLLED</option>
              <option value="ON_LEAVE">ON_LEAVE</option>
              <option value="GRADUATED">GRADUATED (Preserves Historical Record)</option>
              <option value="ALUMNI">ALUMNI (Active Alumni Directory)</option>
              <option value="SUSPENDED">SUSPENDED</option>
              <option value="WITHDRAWN">WITHDRAWN</option>
            </Select>
          </div>

          {(newStatus === 'GRADUATED' || newStatus === 'ALUMNI') && (
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 space-y-3">
              <div className="text-xs font-semibold text-amber-900 flex items-center">
                <Award className="w-4 h-4 mr-1 text-amber-700" />
                Graduation & Alumni Record Preservation
              </div>
              <p className="text-[11px] text-amber-800">
                Graduating does NOT delete or alter any completed historical academic records. An alumni profile will be created automatically.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-amber-900 mb-1">
                    Graduation Year
                  </label>
                  <Input
                    type="number"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(Number(e.target.value))}
                    className="bg-white text-xs h-8"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-amber-900 mb-1">
                    Commencement Date
                  </label>
                  <Input
                    type="date"
                    value={graduationDate}
                    onChange={(e) => setGraduationDate(e.target.value)}
                    className="bg-white text-xs h-8"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsStatusModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Lifecycle Status</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
