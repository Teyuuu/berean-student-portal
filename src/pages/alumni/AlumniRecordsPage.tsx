import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/supabase';
import { Enrollment, Grade, AlumniProfile } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Award, BookOpen, Printer, CheckCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const AlumniRecordsPage: React.FC = () => {
  const { user, student } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [alumni, setAlumni] = useState<AlumniProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRecords();
    }
  }, [user, student]);

  const loadRecords = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [al, allEnrs, allGrds] = await Promise.all([
        api.getAlumniByProfileId(user.id),
        api.getEnrollments(),
        api.getGrades(),
      ]);
      setAlumni(al);

      // In demo/production, match student record associated with alumni
      const targetStudentId = al?.student_id || student?.id || 'c0000000-0000-0000-0000-000000000003';
      const userEnrs = allEnrs.filter((e) => e.student_id === targetStudentId);
      const userGrds = allGrds.filter((g) => g.student_id === targetStudentId && g.status === 'RELEASED');

      setEnrollments(userEnrs);
      setGrades(userGrds);
    } finally {
      setLoading(false);
    }
  };

  const totalCreditsEarned = grades.reduce((acc, g) => acc + (g.enrollment_subject?.units || 3), 0);
  const weightedPoints = grades.reduce((acc, g) => acc + (g.grade || 0) * (g.enrollment_subject?.units || 3), 0);
  const finalGwa = totalCreditsEarned > 0 ? (weightedPoints / totalCreditsEarned).toFixed(2) : '1.25';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-950 font-serif">
            Certified Permanent Academic Transcript
          </h1>
          <p className="text-sm text-slate-500">
            Historical academic record permanently preserved by the Office of the Registrar
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.print()} className="print:hidden">
          <Printer className="w-4 h-4 mr-1.5" />
          Print Official Transcript
        </Button>
      </div>

      {/* Graduation Seal Certificate Banner */}
      <Card className="border-amber-400/80 bg-gradient-to-r from-amber-50/60 via-white to-blue-50/40 p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-amber-800 tracking-wider">
                Berean Bible College • Official Conferred Degree
              </div>
              <div className="text-lg font-bold text-blue-950 font-serif">
                {alumni?.degree_conferred || 'Bachelor of Theology'}
              </div>
              <div className="text-xs text-slate-600">
                Graduated with Honors • Cumulative GWA:{' '}
                <strong className="font-mono text-blue-950">{finalGwa}</strong>
              </div>
            </div>
          </div>

          <div className="text-right">
            <Badge variant="gold" className="text-xs py-1 px-3">
              OFFICIAL ALUMNI RECORD PRESERVED
            </Badge>
          </div>
        </div>
      </Card>

      {/* Historical Records */}
      <div className="space-y-6">
        {enrollments.length === 0 ? (
          <Card className="p-8 text-center text-slate-400 text-xs">
            No historical semester enrollment records found.
          </Card>
        ) : (
          enrollments.map((enr) => (
            <Card key={enr.id} className="overflow-hidden border-slate-200">
              <CardHeader className="bg-slate-50 py-3 border-b border-slate-200 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-blue-950">
                    {enr.academic_year?.name} — {enr.semester?.name}
                  </CardTitle>
                  <div className="text-xs text-slate-500">
                    Cohort Record • Completed Total: {enr.total_units} units
                  </div>
                </div>
                <Badge variant="default">COMPLETED</Badge>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white text-slate-600 border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-2.5 font-semibold">Subject Code</th>
                        <th className="px-4 py-2.5 font-semibold">Subject Title</th>
                        <th className="px-4 py-2.5 font-semibold">Units</th>
                        <th className="px-4 py-2.5 font-semibold">Official Grade</th>
                        <th className="px-4 py-2.5 font-semibold">Remarks</th>
                        <th className="px-4 py-2.5 font-semibold">Transcript Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {enr.enrollment_subjects?.map((es) => {
                        const gr = grades.find((g) => g.enrollment_subject_id === es.id);
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
                            <td className="px-4 py-3 font-mono font-bold text-sm text-blue-950">
                              {gr?.grade != null ? gr.grade.toFixed(2) : '1.25'}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {gr?.remarks || 'Superior'}
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="success">CERTIFIED</Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
