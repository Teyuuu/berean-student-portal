import React, { useState, useEffect } from 'react';
import { api } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Enrollment, EnrollmentSubject, Grade, Student } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { Award, CheckCircle2, Clock, Edit2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const StaffGradesPage: React.FC = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  // Grade Entry Modal
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedEnrollmentSubject, setSelectedEnrollmentSubject] = useState<{
    enrollmentSubject: EnrollmentSubject;
    student: Student;
    existingGrade?: Grade;
  } | null>(null);

  const [gradeValue, setGradeValue] = useState<number>(1.25);
  const [remarks, setRemarks] = useState('Passed');
  const [gradeStatus, setGradeStatus] = useState<'DRAFT' | 'SUBMITTED' | 'RELEASED'>('RELEASED');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [enrList, gradeList] = await Promise.all([
        api.getEnrollments(),
        api.getGrades(),
      ]);
      setEnrollments(enrList);
      setGrades(gradeList);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGradeModal = (
    es: EnrollmentSubject,
    student: Student,
    existingGrade?: Grade
  ) => {
    setSelectedEnrollmentSubject({ enrollmentSubject: es, student, existingGrade });
    setGradeValue(existingGrade?.grade ?? 1.25);
    setRemarks(existingGrade?.remarks ?? 'Passed');
    setGradeStatus(existingGrade?.status ?? 'RELEASED');
    setIsGradeModalOpen(true);
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnrollmentSubject || !user) return;

    await api.saveGrade(
      selectedEnrollmentSubject.enrollmentSubject.id,
      selectedEnrollmentSubject.student.id,
      Number(gradeValue),
      remarks,
      user.id,
      gradeStatus
    );

    setIsGradeModalOpen(false);
    await loadData();
  };

  // Flatten enrollment subjects with student context for easy grade entry
  const rows: {
    student: Student;
    enrollment: Enrollment;
    enrollmentSubject: EnrollmentSubject;
    grade?: Grade;
  }[] = [];

  enrollments.forEach((enr) => {
    if (enr.student && enr.enrollment_subjects) {
      enr.enrollment_subjects.forEach((es) => {
        const matchingGrade = grades.find((g) => g.enrollment_subject_id === es.id);
        rows.push({
          student: enr.student!,
          enrollment: enr,
          enrollmentSubject: es,
          grade: matchingGrade,
        });
      });
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-950 font-serif">
            Official Grades & Registrar Records
          </h1>
          <p className="text-sm text-slate-500">
            Record, verify, and release official course grades to student academic transcripts
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Student</th>
                  <th className="px-4 py-3 font-semibold">Course Subject</th>
                  <th className="px-4 py-3 font-semibold">Term</th>
                  <th className="px-4 py-3 font-semibold">Units</th>
                  <th className="px-4 py-3 font-semibold">Numerical Grade</th>
                  <th className="px-4 py-3 font-semibold">Remarks</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <div>
                        {row.student.profile?.first_name} {row.student.profile?.last_name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {row.student.student_number || 'No ID'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-blue-950 font-mono">
                        {row.enrollmentSubject.subject?.code}
                      </div>
                      <div className="text-slate-600">{row.enrollmentSubject.subject?.name}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {row.enrollment.academic_year?.name} ({row.enrollment.semester?.name})
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">
                      {row.enrollmentSubject.units}
                    </td>
                    <td className="px-4 py-3 font-bold font-mono text-sm">
                      {row.grade?.grade != null ? (
                        <span className="text-blue-900">{row.grade.grade.toFixed(2)}</span>
                      ) : (
                        <span className="text-slate-400 font-normal italic">Unrecorded</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {row.grade?.remarks || '—'}
                    </td>
                    <td className="px-4 py-3">
                      {row.grade ? (
                        <Badge
                          variant={
                            row.grade.status === 'RELEASED'
                              ? 'success'
                              : row.grade.status === 'SUBMITTED'
                              ? 'info'
                              : 'secondary'
                          }
                        >
                          {row.grade.status}
                        </Badge>
                      ) : (
                        <Badge variant="outline">PENDING</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleOpenGradeModal(
                            row.enrollmentSubject,
                            row.student,
                            row.grade
                          )
                        }
                        className="h-7 text-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5 mr-1" />
                        {row.grade ? 'Edit Grade' : 'Enter Grade'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Grade Entry Dialog */}
      <Dialog
        open={isGradeModalOpen}
        onOpenChange={setIsGradeModalOpen}
        title="Official Grade Entry"
        description="Grades marked as RELEASED will be instantly visible on the student's official academic transcript."
      >
        {selectedEnrollmentSubject && (
          <form onSubmit={handleSaveGrade} className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="font-semibold text-slate-900">
                {selectedEnrollmentSubject.student.profile?.first_name}{' '}
                {selectedEnrollmentSubject.student.profile?.last_name}
              </div>
              <div className="text-slate-600">
                Course: {selectedEnrollmentSubject.enrollmentSubject.subject?.code} —{' '}
                {selectedEnrollmentSubject.enrollmentSubject.subject?.name} (
                {selectedEnrollmentSubject.enrollmentSubject.units} units)
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Grade (1.00 to 5.00) *
                </label>
                <Input
                  type="number"
                  step="0.25"
                  min="1.00"
                  max="5.00"
                  required
                  value={gradeValue}
                  onChange={(e) => setGradeValue(Number(e.target.value))}
                  className="font-mono text-base font-bold"
                />
                <p className="text-[10px] text-slate-400 mt-1">1.00 = Superior, 3.00 = Passed, 5.00 = Failed</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Remarks *
                </label>
                <Select
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                >
                  <option value="Passed">Passed</option>
                  <option value="Superior">Superior</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Satisfactory">Satisfactory</option>
                  <option value="Conditional">Conditional</option>
                  <option value="Incomplete">Incomplete</option>
                  <option value="Failed">Failed</option>
                  <option value="Dropped">Dropped</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Release Status *
              </label>
              <Select
                value={gradeStatus}
                onChange={(e) => setGradeStatus(e.target.value as 'DRAFT' | 'SUBMITTED' | 'RELEASED')}
              >
                <option value="RELEASED">RELEASED (Visible to Student & Official)</option>
                <option value="SUBMITTED">SUBMITTED (Pending Registrar Seal)</option>
                <option value="DRAFT">DRAFT (Faculty Draft Only)</option>
              </Select>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setIsGradeModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save & Release Grade</Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
};
