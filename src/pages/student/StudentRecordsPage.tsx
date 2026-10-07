import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/supabase';
import { Enrollment, Grade, CurriculumSubject } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Award, BookOpen, CheckCircle, Clock, ShieldCheck, Printer } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const StudentRecordsPage: React.FC = () => {
  const { student } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [curriculumSubjects, setCurriculumSubjects] = useState<CurriculumSubject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (student) {
      loadAcademicHistory();
    }
  }, [student]);

  const loadAcademicHistory = async () => {
    if (!student) return;
    setLoading(true);
    try {
      const [enrs, grds, cSubs] = await Promise.all([
        api.getStudentEnrollments(student.id),
        api.getGrades(student.id),
        api.getCurriculumSubjects(student.curriculum_id || '55555555-5555-5555-5555-555555555501'),
      ]);
      setEnrollments(enrs);
      setGrades(grds.filter((g) => g.status === 'RELEASED'));
      setCurriculumSubjects(cSubs);
    } finally {
      setLoading(false);
    }
  };

  // Calculations
  const totalCurriculumUnits = curriculumSubjects.reduce(
    (acc, cs) => acc + (cs.subject?.units || 0),
    0
  );

  const attemptedUnits = enrollments.reduce((acc, e) => acc + e.total_units, 0);

  // Completed units (passed courses <= 3.00)
  const completedGrades = grades.filter((g) => g.grade != null && g.grade <= 3.0);
  const completedUnits = completedGrades.reduce(
    (acc, g) => acc + (g.enrollment_subject?.units || 3),
    0
  );

  const remainingUnits = Math.max(0, totalCurriculumUnits - completedUnits);

  // General Weighted Average (GWA)
  const totalWeightedPoints = completedGrades.reduce(
    (acc, g) => acc + (g.grade || 0) * (g.enrollment_subject?.units || 3),
    0
  );
  const gwa = completedUnits > 0 ? (totalWeightedPoints / completedUnits).toFixed(2) : '—';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-950 font-serif">
            Official Academic History & Transcript
          </h1>
          <p className="text-sm text-slate-500">
            Certified permanent collegiate record of courses completed and numerical grades
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.print()} className="print:hidden">
          <Printer className="w-4 h-4 mr-1.5" />
          Print Transcript
        </Button>
      </div>

      {/* Summary Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Units Attempted
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{attemptedUnits}</div>
          <div className="text-[11px] text-slate-400 mt-1">Enrolled term courses</div>
        </Card>

        <Card className="p-4 bg-white border-slate-200">
          <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
            Units Completed / Passed
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{completedUnits}</div>
          <div className="text-[11px] text-emerald-600 mt-1">Credits earned</div>
        </Card>

        <Card className="p-4 bg-white border-slate-200">
          <div className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">
            Units Remaining
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{remainingUnits}</div>
          <div className="text-[11px] text-amber-600 mt-1">For degree completion</div>
        </Card>

        <Card className="p-4 bg-blue-950 text-white border-blue-900">
          <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
            Cumulative GWA
          </div>
          <div className="text-2xl font-bold text-white mt-1 font-mono">{gwa}</div>
          <div className="text-[10px] text-blue-200 mt-1">General Weighted Average</div>
        </Card>
      </div>

      {/* Term by Term Transcript Tables */}
      <div className="space-y-6">
        {enrollments.map((enr) => (
          <Card key={enr.id} className="overflow-hidden border-slate-200">
            <CardHeader className="bg-slate-50 py-3.5 border-b border-slate-200 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-blue-950">
                  {enr.academic_year?.name} — {enr.semester?.name}
                </CardTitle>
                <div className="text-xs text-slate-500">
                  Total Term Load: {enr.total_units} units
                </div>
              </div>
              <Badge variant="default">{enr.status}</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white text-slate-600 border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold">Subject Code</th>
                      <th className="px-4 py-2.5 font-semibold">Subject Title</th>
                      <th className="px-4 py-2.5 font-semibold">Units</th>
                      <th className="px-4 py-2.5 font-semibold">Grade</th>
                      <th className="px-4 py-2.5 font-semibold">Remarks</th>
                      <th className="px-4 py-2.5 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {enr.enrollment_subjects?.map((es) => {
                      const gradeRecord = grades.find((g) => g.enrollment_subject_id === es.id);
                      return (
                        <tr key={es.id} className="hover:bg-slate-50/70">
                          <td className="px-4 py-3 font-mono font-bold text-blue-950">
                            {es.subject?.code}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {es.subject?.name}
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-700">
                            {es.units}
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-sm">
                            {gradeRecord?.grade != null ? (
                              <span className="text-blue-950">{gradeRecord.grade.toFixed(2)}</span>
                            ) : (
                              <span className="text-slate-400 font-normal italic">In Progress</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {gradeRecord?.remarks || 'Enrolled'}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={gradeRecord ? 'success' : 'outline'}>
                              {gradeRecord ? 'RECORDED' : 'ENROLLED'}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
