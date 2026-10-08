import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ROUTE_TITLES: Record<string, string> = {
  '/login': 'Admissions & Portal Login | Berean Bible Baptist College',
  '/register': 'Online Student Registration | Berean Bible Baptist College',
  '/forgot-password': 'Password Recovery | Berean Bible Baptist College',

  // Admin
  '/admin': 'Administrative Dashboard | Berean College Portal',
  '/admin/accounts': 'User Account Management | Berean College Portal',
  '/admin/programs': 'Academic Degree Programs | Berean College Portal',
  '/admin/curriculum': 'Curriculum Builder & Courses | Berean College Portal',
  '/admin/subjects': 'Course Catalog & Subjects | Berean College Portal',
  '/admin/academic-years': 'Academic Calendar & Terms | Berean College Portal',
  '/admin/enrollment-periods': 'Enrollment Periods | Berean College Portal',
  '/admin/enrollments': 'Student Enrollment Approvals | Berean College Portal',
  '/admin/students': 'Official Student Directory | Berean College Portal',
  '/admin/grades': 'Official Grade Records | Berean College Portal',
  '/admin/announcements': 'Campus Announcements | Berean College Portal',
  '/admin/audit-logs': 'System Security & Audit Logs | Berean College Portal',

  // Staff
  '/staff': 'Registrar Operations Dashboard | Berean College Portal',
  '/staff/registrations': 'Admissions & Registrations | Berean College Portal',
  '/staff/enrollments': 'Enrollment Processing | Berean College Portal',
  '/staff/students': 'Student Directory & Admissions | Berean College Portal',
  '/staff/grades': 'Grading Sheet & Records | Berean College Portal',
  '/staff/documents': 'Document Verification | Berean College Portal',
  '/staff/announcements': 'Announcements Management | Berean College Portal',

  // Student
  '/student': 'Student Academic Dashboard | Berean College Portal',
  '/student/profile': 'Student Academic Profile | Berean College Portal',
  '/student/enrollment': 'Online Term Enrollment | Berean College Portal',
  '/student/subjects': 'Enrolled Subjects & Class Schedule | Berean College Portal',
  '/student/records': 'Official Academic Records & Grades | Berean College Portal',
  '/student/documents': 'Student Credentials & Requirements | Berean College Portal',
  '/student/announcements': 'College Announcements | Berean College Portal',

  // Alumni
  '/alumni': 'Alumni Ministry & Career Dashboard | Berean College Portal',
  '/alumni/profile': 'Alumni Directory Profile | Berean College Portal',
  '/alumni/records': 'Permanent Academic Transcript | Berean College Portal',
  '/alumni/documents': 'Alumni Documents & Certifications | Berean College Portal',
  '/alumni/announcements': 'Alumni Network News | Berean College Portal',
};

export function usePageSEO(customTitle?: string) {
  const location = useLocation();

  useEffect(() => {
    const title =
      customTitle ||
      ROUTE_TITLES[location.pathname] ||
      'Berean Bible Baptist College — Student & Alumni Portal';

    document.title = title;

    // Update og:title as well if meta element exists
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
  }, [location.pathname, customTitle]);
}
