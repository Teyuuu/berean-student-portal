import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/supabase';
import { Student, Enrollment, StudentDocument } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  UserCheck,
  FileCheck,
  FolderOpen,
  Award,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const StaffDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [documents, setDocuments] = useState<StudentDocument[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [stds, enrs, docs] = await Promise.all([
      api.getStudents(),
      api.getEnrollments(),
      api.getStudentDocuments('c0000000-0000-0000-0000-000000000001'), // sample docs
    ]);
    setStudents(stds);
    setEnrollments(enrs);
    setDocuments(docs);
  };

  const pendingApplicants = students.filter(
    (s) => s.student_status === 'APPLICANT' || s.student_status === 'PENDING_VERIFICATION'
  );
  const pendingEnrollments = enrollments.filter(
    (e) => e.status === 'SUBMITTED' || e.status === 'UNDER_REVIEW'
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-blue-950 font-serif">
          Registrar & Academic Operations Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Review incoming student registrations, process enrollment approvals, and record official grades
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 border-amber-200 bg-amber-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
              Pending Applicants
            </span>
            <UserCheck className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-3xl font-bold text-amber-900 mt-2">
            {pendingApplicants.length}
          </div>
          <p className="text-xs text-amber-700 mt-1">Requires credential verification</p>
          <div className="mt-4 pt-3 border-t border-amber-200/60">
            <Link to="/staff/registrations">
              <Button size="sm" variant="outline" className="w-full text-xs">
                Review Applicants <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-5 border-sky-200 bg-sky-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
              Pending Enrollments
            </span>
            <FileCheck className="w-5 h-5 text-sky-600" />
          </div>
          <div className="text-3xl font-bold text-sky-900 mt-2">
            {pendingEnrollments.length}
          </div>
          <p className="text-xs text-sky-700 mt-1">Awaiting subject prerequisite checks</p>
          <div className="mt-4 pt-3 border-t border-sky-200/60">
            <Link to="/staff/enrollments">
              <Button size="sm" variant="outline" className="w-full text-xs">
                Review Course Loads <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-5 border-emerald-200 bg-emerald-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Grade Management
            </span>
            <Award className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-emerald-900 mt-2">
            Active
          </div>
          <p className="text-xs text-emerald-700 mt-1">Enter official grades for release</p>
          <div className="mt-4 pt-3 border-t border-emerald-200/60">
            <Link to="/staff/grades">
              <Button size="sm" variant="outline" className="w-full text-xs">
                Open Grade Sheet <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Action lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Applicants */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">Applicant Queue</CardTitle>
            <Link to="/staff/registrations" className="text-xs text-blue-900 hover:underline">
              View All
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 text-xs">
              {pendingApplicants.length === 0 ? (
                <div className="p-6 text-center text-slate-400">No applicants pending review.</div>
              ) : (
                pendingApplicants.map((st) => (
                  <div key={st.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                    <div>
                      <div className="font-semibold text-slate-900">
                        {st.profile?.first_name} {st.profile?.last_name}
                      </div>
                      <div className="text-slate-500">{st.profile?.email} • {st.program?.code}</div>
                    </div>
                    <Link to="/staff/registrations">
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        Verify
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending Enrollment Submissions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">Enrollment Submissions</CardTitle>
            <Link to="/staff/enrollments" className="text-xs text-blue-900 hover:underline">
              View All
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 text-xs">
              {pendingEnrollments.length === 0 ? (
                <div className="p-6 text-center text-slate-400">All submissions processed.</div>
              ) : (
                pendingEnrollments.map((enr) => (
                  <div key={enr.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                    <div>
                      <div className="font-semibold text-slate-900">
                        {enr.student?.profile?.first_name} {enr.student?.profile?.last_name}
                      </div>
                      <div className="text-slate-500">
                        {enr.total_units} units • {enr.academic_year?.name} ({enr.semester?.name})
                      </div>
                    </div>
                    <Link to="/staff/enrollments">
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        Review
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
