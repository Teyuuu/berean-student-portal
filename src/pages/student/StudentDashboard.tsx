import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/supabase';
import { AcademicYear, Semester, Enrollment, Grade, Announcement } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  BookOpen,
  Calendar,
  FileCheck,
  Award,
  FolderOpen,
  Megaphone,
  User,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const StudentDashboard: React.FC = () => {
  const { user, student } = useAuth();
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [studentEnrollments, setStudentEnrollments] = useState<Enrollment[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (student) {
      loadStudentData(student.id);
    }
  }, [student]);

  const loadStudentData = async (studentId: string) => {
    setLoading(true);
    try {
      const [ays, sems, enrs, grdList, anns] = await Promise.all([
        api.getAcademicYears(),
        api.getSemesters(),
        api.getStudentEnrollments(studentId),
        api.getGrades(studentId),
        api.getAnnouncements(),
      ]);
      setAcademicYears(ays);
      setSemesters(sems);
      setStudentEnrollments(enrs);
      setGrades(grdList.filter((g) => g.status === 'RELEASED'));
      setAnnouncements(anns.filter((a) => a.audience === 'ALL' || a.audience === 'STUDENTS'));
    } finally {
      setLoading(false);
    }
  };

  const currentAy = academicYears.find((ay) => ay.is_current) || academicYears[0];
  const currentSemester = semesters[0];
  const activeEnrollment = studentEnrollments.find(
    (e) => e.status === 'APPROVED' || e.status === 'SUBMITTED'
  );

  const getStatusBadge = (status?: string) => {
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
      default:
        return <Badge variant="secondary">{status || 'PENDING'}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Student Academic Identity Banner */}
      <Card className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white border-blue-900 p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            {user?.profile_photo_url ? (
              <img
                src={user.profile_photo_url}
                alt={user.first_name}
                className="h-16 w-16 rounded-full object-cover ring-4 ring-amber-400/40"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-blue-800 text-amber-300 flex items-center justify-center font-serif text-2xl font-bold ring-4 ring-amber-400/30">
                {user?.first_name[0]}
                {user?.last_name[0]}
              </div>
            )}
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white font-serif">
                  {user?.first_name} {user?.middle_name ? `${user.middle_name} ` : ''}
                  {user?.last_name}
                </h1>
                {getStatusBadge(student?.student_status)}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-blue-200">
                <span>
                  Student ID:{' '}
                  <strong className="font-mono text-white">
                    {student?.student_number || 'Unassigned (Pending Verification)'}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Program:{' '}
                  <strong className="text-white">
                    {student?.program?.name || 'Bachelor of Theology'}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Cohort Curriculum:{' '}
                  <strong className="text-white">
                    {student?.curriculum?.name || 'Curriculum 2026'}
                  </strong>
                </span>
              </div>
              <div className="text-xs text-amber-300">
                {student?.year_level?.name || 'Year 1 (Freshman)'} • Current Term:{' '}
                {currentAy?.name || '2026-2027'} ({currentSemester?.name || '1st Semester'})
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t border-slate-700/80 sm:border-0 pt-3 sm:pt-0">
            <div className="text-left sm:text-right">
              <div className="text-[11px] uppercase tracking-wider text-slate-400">
                Admission Cohort
              </div>
              <div className="text-sm font-semibold text-white">
                {formatDate(student?.admission_date)}
              </div>
            </div>
            <Link to="/student/profile" className="sm:mt-2">
              <Button size="sm" variant="gold" className="text-xs">
                <User className="w-3.5 h-3.5 mr-1" />
                View Full Profile
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-slate-200">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Current Enrollment
            </span>
            <FileCheck className="w-4 h-4 text-blue-900" />
          </div>
          <div className="mt-2 text-xl font-bold text-slate-900">
            {activeEnrollment ? activeEnrollment.status : 'NOT ENROLLED'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {activeEnrollment ? `${activeEnrollment.total_units} enrolled units` : 'Registration open'}
          </div>
        </Card>

        <Card className="p-4 bg-white border-slate-200">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Academic Status
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-xl font-bold text-emerald-700">
            Good Standing
          </div>
          <div className="text-xs text-slate-500 mt-1">Eligible for subject enrollment</div>
        </Card>

        <Card className="p-4 bg-white border-slate-200">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Completed Units
            </span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-xl font-bold text-slate-900">
            {grades.length * 3} units
          </div>
          <div className="text-xs text-slate-500 mt-1">Official graded subjects</div>
        </Card>

        <Card className="p-4 bg-white border-slate-200">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Pending Requests
            </span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-2 text-xl font-bold text-slate-900">
            {student?.student_status === 'APPLICANT' || student?.student_status === 'PENDING_VERIFICATION'
              ? '1 Review'
              : 'None'}
          </div>
          <div className="text-xs text-slate-500 mt-1">Registrar verifications</div>
        </Card>
      </div>

      {/* Quick Action Navigation Grid */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">
          Student Portal Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link to="/student/enrollment" className="group">
            <Card className="p-4 text-center hover:border-blue-900 hover:shadow-md transition-all cursor-pointer h-full flex flex-col items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center mb-2 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                <FileCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-900">Course Enrollment</span>
            </Card>
          </Link>

          <Link to="/student/subjects" className="group">
            <Card className="p-4 text-center hover:border-blue-900 hover:shadow-md transition-all cursor-pointer h-full flex flex-col items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center mb-2 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-900">My Subjects</span>
            </Card>
          </Link>

          <Link to="/student/records" className="group">
            <Card className="p-4 text-center hover:border-blue-900 hover:shadow-md transition-all cursor-pointer h-full flex flex-col items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center mb-2 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-900">Academic Records</span>
            </Card>
          </Link>

          <Link to="/student/documents" className="group">
            <Card className="p-4 text-center hover:border-blue-900 hover:shadow-md transition-all cursor-pointer h-full flex flex-col items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center mb-2 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                <FolderOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-900">My Documents</span>
            </Card>
          </Link>

          <Link to="/student/profile" className="group">
            <Card className="p-4 text-center hover:border-blue-900 hover:shadow-md transition-all cursor-pointer h-full flex flex-col items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center mb-2 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                <User className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-900">My Profile</span>
            </Card>
          </Link>

          <Link to="/student/announcements" className="group">
            <Card className="p-4 text-center hover:border-blue-900 hover:shadow-md transition-all cursor-pointer h-full flex flex-col items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center mb-2 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                <Megaphone className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-900">Announcements</span>
            </Card>
          </Link>
        </div>
      </div>

      {/* College Announcements */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-semibold flex items-center">
            <Megaphone className="w-4 h-4 mr-2 text-blue-900" />
            College Announcements
          </CardTitle>
          <Link to="/student/announcements" className="text-xs text-blue-900 hover:underline">
            View All
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {announcements.slice(0, 2).map((ann) => (
              <div
                key={ann.id}
                className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-slate-900">{ann.title}</span>
                  <span className="text-[11px] text-slate-400">{formatDate(ann.published_at)}</span>
                </div>
                <p className="text-xs text-slate-600">{ann.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
