import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/supabase';
import { Student, Enrollment, AcademicYear, Announcement } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Users,
  GraduationCap,
  FileCheck,
  Award,
  Calendar,
  BookOpen,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const AdminDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [stdData, enrData, ayData, annData] = await Promise.all([
        api.getStudents(),
        api.getEnrollments(),
        api.getAcademicYears(),
        api.getAnnouncements(),
      ]);
      setStudents(stdData);
      setEnrollments(enrData);
      setAcademicYears(ayData);
      setAnnouncements(annData);
    } finally {
      setLoading(false);
    }
  };

  const currentAy = academicYears.find((ay) => ay.is_current) || academicYears[0];
  const totalStudents = students.length;
  const activeStudents = students.filter(
    (s) => s.student_status === 'ACTIVE' || s.student_status === 'ENROLLED'
  ).length;
  const currentlyEnrolled = students.filter((s) => s.student_status === 'ENROLLED').length;
  const pendingRegistrations = students.filter(
    (s) => s.student_status === 'APPLICANT' || s.student_status === 'PENDING_VERIFICATION'
  ).length;
  const pendingEnrollments = enrollments.filter(
    (e) => e.status === 'SUBMITTED' || e.status === 'UNDER_REVIEW'
  ).length;
  const totalAlumni = students.filter(
    (s) => s.student_status === 'GRADUATED' || s.student_status === 'ALUMNI'
  ).length;

  const recentRegistrations = students.slice(0, 5);
  const recentEnrollments = enrollments.slice(0, 5);

  const getStatusBadge = (status: string) => {
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
      case 'APPROVED':
        return <Badge variant="success">APPROVED</Badge>;
      case 'SUBMITTED':
        return <Badge variant="warning">SUBMITTED</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-950 font-serif">
            Administrative Overview
          </h1>
          <p className="text-sm text-slate-500">
            Berean Bible College — Central Academic & Student Administration
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link to="/admin/curriculum">
            <Button variant="outline" size="sm">
              <BookOpen className="w-4 h-4 mr-2" />
              Curriculum Builder
            </Button>
          </Link>
          <Link to="/admin/students">
            <Button size="sm">
              <Users className="w-4 h-4 mr-2" />
              Manage Students
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <Card className="p-4 bg-white border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Students
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalStudents}</div>
          <div className="text-[11px] text-slate-400 mt-1">All cohorts</div>
        </Card>

        <Card className="p-4 bg-white border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Active Students
          </div>
          <div className="text-2xl font-bold text-blue-900 mt-1">{activeStudents}</div>
          <div className="text-[11px] text-blue-600 mt-1">In good standing</div>
        </Card>

        <Card className="p-4 bg-white border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Currently Enrolled
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{currentlyEnrolled}</div>
          <div className="text-[11px] text-emerald-600 mt-1">Active semester</div>
        </Card>

        <Card className="p-4 bg-white border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Pending Applicants
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{pendingRegistrations}</div>
          <div className="text-[11px] text-amber-700 mt-1">Requires review</div>
        </Card>

        <Card className="p-4 bg-white border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Enrollment Requests
          </div>
          <div className="text-2xl font-bold text-sky-600 mt-1">{pendingEnrollments}</div>
          <div className="text-[11px] text-sky-700 mt-1">Awaiting approval</div>
        </Card>

        <Card className="p-4 bg-white border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Alumni
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{totalAlumni}</div>
          <div className="text-[11px] text-slate-400 mt-1">Graduated records</div>
        </Card>

        <Card className="p-4 bg-blue-950 text-white border-blue-900">
          <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
            Current Academic Yr
          </div>
          <div className="text-xl font-bold mt-1 text-white">{currentAy?.name || '2026-2027'}</div>
          <div className="text-[10px] text-blue-200 mt-1">Status: {currentAy?.status}</div>
        </Card>
      </div>

      {/* Main tables grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Registrations Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Recent Registrations</CardTitle>
              <p className="text-xs text-slate-500">Latest applicants and student profile creations</p>
            </div>
            <Link to="/admin/students" className="text-xs text-blue-900 hover:underline flex items-center font-medium">
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-y border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold">Student Name</th>
                    <th className="px-4 py-2.5 font-semibold">Program</th>
                    <th className="px-4 py-2.5 font-semibold">Status</th>
                    <th className="px-4 py-2.5 font-semibold">Student #</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentRegistrations.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {st.profile ? `${st.profile.first_name} ${st.profile.last_name}` : 'Student'}
                        <div className="text-[11px] text-slate-400">{st.profile?.email}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {st.program?.code || '—'}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(st.student_status)}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-700">
                        {st.student_number || <span className="text-slate-400 italic">Unassigned</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Enrollment Requests Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Recent Enrollment Submissions</CardTitle>
              <p className="text-xs text-slate-500">Student subject loads submitted for review</p>
            </div>
            <Link to="/admin/enrollments" className="text-xs text-blue-900 hover:underline flex items-center font-medium">
              Manage <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-y border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold">Student</th>
                    <th className="px-4 py-2.5 font-semibold">Term</th>
                    <th className="px-4 py-2.5 font-semibold">Units</th>
                    <th className="px-4 py-2.5 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentEnrollments.map((enr) => (
                    <tr key={enr.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {enr.student?.profile ? `${enr.student.profile.first_name} ${enr.student.profile.last_name}` : 'Student'}
                        <div className="text-[11px] text-slate-400">{enr.student?.student_number || 'Applicant'}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {enr.academic_year?.name} ({enr.semester?.name})
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {enr.total_units} units
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(enr.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* College Announcements Banner */}
      <Card className="border-amber-200/80 bg-gradient-to-r from-amber-50/40 via-white to-blue-50/40">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center text-slate-900">
              <BookOpen className="w-4 h-4 mr-2 text-amber-600" />
              Latest Institution Announcements
            </CardTitle>
            <Link to="/admin/announcements">
              <Button variant="ghost" size="sm" className="text-xs text-blue-900">
                Manage Announcements
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {announcements.slice(0, 2).map((ann) => (
              <div key={ann.id} className="p-3 bg-white rounded-lg border border-slate-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-900">{ann.title}</span>
                  <Badge variant="secondary">{ann.audience}</Badge>
                </div>
                <p className="text-slate-600 line-clamp-2">{ann.content}</p>
                <div className="mt-1 text-[10px] text-slate-400">
                  Published: {formatDate(ann.published_at)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
