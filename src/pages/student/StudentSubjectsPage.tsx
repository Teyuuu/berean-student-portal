import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/supabase';
import { Enrollment } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export const StudentSubjectsPage: React.FC = () => {
  const { student } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (student) {
      api.getStudentEnrollments(student.id).then((enrs) => {
        setEnrollments(enrs);
        setLoading(false);
      });
    }
  }, [student]);

  const activeEnrollment = enrollments.find(
    (e) => e.status === 'APPROVED' || e.status === 'SUBMITTED'
  ) || enrollments[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-950 font-serif">
            Current Enrolled Subjects
          </h1>
          <p className="text-sm text-slate-500">
            Registered courses and class syllabus schedule for the active semester
          </p>
        </div>
        <Link to="/student/enrollment">
          <Button size="sm" variant="outline">
            Modify Course Load
          </Button>
        </Link>
      </div>

      {activeEnrollment ? (
        <Card>
          <CardHeader className="bg-slate-50/70 border-b border-slate-200 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-sm font-bold text-blue-950">
                  {activeEnrollment.academic_year?.name} — {activeEnrollment.semester?.name}
                </CardTitle>
                <div className="text-xs text-slate-500">
                  Total Enrolled: {activeEnrollment.total_units} units
                </div>
              </div>
              <Badge
                variant={
                  activeEnrollment.status === 'APPROVED'
                    ? 'success'
                    : activeEnrollment.status === 'SUBMITTED'
                    ? 'warning'
                    : 'secondary'
                }
              >
                {activeEnrollment.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Course Code</th>
                    <th className="px-4 py-3 font-semibold">Course Description</th>
                    <th className="px-4 py-3 font-semibold">Units</th>
                    <th className="px-4 py-3 font-semibold">Enrollment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeEnrollment.enrollment_subjects?.map((es) => (
                    <tr key={es.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-mono font-bold text-blue-950">
                        {es.subject?.code}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{es.subject?.name}</div>
                        <div className="text-slate-500 text-[11px]">{es.subject?.description}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700">
                        {es.units} units
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="success">ENROLLED</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="p-12 text-center">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-800 text-sm">No Active Enrolled Subjects</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You do not currently have any approved or submitted subject enrollments for this term.
          </p>
          <Link to="/student/enrollment" className="mt-4 inline-block">
            <Button size="sm">Go to Course Enrollment</Button>
          </Link>
        </Card>
      )}
    </div>
  );
};
