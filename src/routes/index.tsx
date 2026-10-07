import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '@/layouts/AppLayout';

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';

// Admin Pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { ProgramsPage } from '@/pages/admin/ProgramsPage';
import { CurriculumBuilderPage } from '@/pages/admin/CurriculumBuilderPage';
import { SubjectsPage } from '@/pages/admin/SubjectsPage';
import { AcademicYearsPage } from '@/pages/admin/AcademicYearsPage';
import { EnrollmentPeriodsPage } from '@/pages/admin/EnrollmentPeriodsPage';
import { StudentsManagementPage } from '@/pages/admin/StudentsManagementPage';
import { AuditLogsPage } from '@/pages/admin/AuditLogsPage';

// Staff Pages
import { StaffDashboard } from '@/pages/staff/StaffDashboard';
import { StudentRegistrationsPage } from '@/pages/staff/StudentRegistrationsPage';
import { EnrollmentRequestsPage } from '@/pages/staff/EnrollmentRequestsPage';
import { StaffGradesPage } from '@/pages/staff/StaffGradesPage';
import { StaffDocumentsPage } from '@/pages/staff/StaffDocumentsPage';

// Student Pages
import { StudentDashboard } from '@/pages/student/StudentDashboard';
import { StudentProfilePage } from '@/pages/student/StudentProfilePage';
import { StudentEnrollmentPage } from '@/pages/student/StudentEnrollmentPage';
import { StudentSubjectsPage } from '@/pages/student/StudentSubjectsPage';
import { StudentRecordsPage } from '@/pages/student/StudentRecordsPage';
import { StudentDocumentsPage } from '@/pages/student/StudentDocumentsPage';

// Alumni Pages
import { AlumniDashboard } from '@/pages/alumni/AlumniDashboard';
import { AlumniProfilePage } from '@/pages/alumni/AlumniProfilePage';
import { AlumniRecordsPage } from '@/pages/alumni/AlumniRecordsPage';

// Common
import { AnnouncementsPage } from '@/pages/common/AnnouncementsPage';

export const AppRoutes: React.FC = () => {
  const { user, role } = useAuth();

  // Root redirector based on authenticated role
  const getRoleHome = () => {
    if (!user) return '/login';
    switch (role) {
      case 'ADMIN':
        return '/admin';
      case 'STAFF':
        return '/staff';
      case 'STUDENT':
        return '/student';
      case 'ALUMNI':
        return '/alumni';
      default:
        return '/login';
    }
  };

  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route path="/login" element={user ? <Navigate to={getRoleHome()} replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to={getRoleHome()} replace /> : <RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Root redirect */}
      <Route path="/" element={<Navigate to={getRoleHome()} replace />} />

      {/* Authenticated Application Shell */}
      <Route element={<AppLayout />}>
        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/programs" element={<ProgramsPage />} />
          <Route path="/admin/curriculum" element={<CurriculumBuilderPage />} />
          <Route path="/admin/subjects" element={<SubjectsPage />} />
          <Route path="/admin/academic-years" element={<AcademicYearsPage />} />
          <Route path="/admin/enrollment-periods" element={<EnrollmentPeriodsPage />} />
          <Route path="/admin/enrollments" element={<EnrollmentRequestsPage />} />
          <Route path="/admin/students" element={<StudentsManagementPage />} />
          <Route path="/admin/grades" element={<StaffGradesPage />} />
          <Route path="/admin/announcements" element={<AnnouncementsPage />} />
          <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
        </Route>

        {/* Staff Routes */}
        <Route element={<ProtectedRoute allowedRoles={['STAFF', 'ADMIN']} />}>
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/staff/registrations" element={<StudentRegistrationsPage />} />
          <Route path="/staff/enrollments" element={<EnrollmentRequestsPage />} />
          <Route path="/staff/students" element={<StudentsManagementPage />} />
          <Route path="/staff/grades" element={<StaffGradesPage />} />
          <Route path="/staff/documents" element={<StaffDocumentsPage />} />
          <Route path="/staff/announcements" element={<AnnouncementsPage />} />
        </Route>

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']} />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfilePage />} />
          <Route path="/student/enrollment" element={<StudentEnrollmentPage />} />
          <Route path="/student/subjects" element={<StudentSubjectsPage />} />
          <Route path="/student/records" element={<StudentRecordsPage />} />
          <Route path="/student/documents" element={<StudentDocumentsPage />} />
          <Route path="/student/announcements" element={<AnnouncementsPage />} />
        </Route>

        {/* Alumni Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ALUMNI', 'ADMIN']} />}>
          <Route path="/alumni" element={<AlumniDashboard />} />
          <Route path="/alumni/profile" element={<AlumniProfilePage />} />
          <Route path="/alumni/records" element={<AlumniRecordsPage />} />
          <Route path="/alumni/documents" element={<StudentDocumentsPage />} />
          <Route path="/alumni/announcements" element={<AnnouncementsPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
