// TypeScript interfaces matching Berean Bible College database schema

export type UserRole = 'ADMIN' | 'STAFF' | 'STUDENT' | 'ALUMNI';

export type StudentStatus =
  | 'APPLICANT'
  | 'PENDING_VERIFICATION'
  | 'ACTIVE'
  | 'ENROLLED'
  | 'NOT_ENROLLED'
  | 'ON_LEAVE'
  | 'INACTIVE'
  | 'SUSPENDED'
  | 'WITHDRAWN'
  | 'GRADUATED'
  | 'ALUMNI';

export type AcademicStatus = 'ACTIVE' | 'ARCHIVED' | 'INACTIVE';
export type AcademicYearStatus = 'ACTIVE' | 'CLOSED' | 'UPCOMING';
export type EnrollmentPeriodStatus = 'UPCOMING' | 'OPEN' | 'CLOSED';
export type EnrollmentStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'COMPLETED';

export type EnrollmentSubjectStatus = 'ENROLLED' | 'DROPPED' | 'COMPLETED' | 'FAILED';
export type GradeStatus = 'DRAFT' | 'SUBMITTED' | 'RELEASED';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type DocumentType =
  | 'BIRTH_CERTIFICATE'
  | 'HIGH_SCHOOL_CARD'
  | 'TRANSCRIPT_OF_RECORDS'
  | 'PASTOR_RECOMMENDATION'
  | 'ID_PHOTO'
  | 'ENROLLMENT_FORM'
  | 'CERTIFICATE_OF_GRADUATION'
  | 'OTHER';

export type AnnouncementAudience = 'ALL' | 'STUDENTS' | 'ALUMNI' | 'STAFF' | 'APPLICANTS';
export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';

export interface Profile {
  id: string;
  id_number?: string | null;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  profile_photo_url?: string | null;
  is_active: boolean;
  login_status?: 'ONLINE' | 'OFFLINE';
  last_login_at?: string | null;
  password?: string;
  created_at: string;
  updated_at: string;
}

export interface Program {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  duration_years: number;
  status: AcademicStatus;
  created_at: string;
  updated_at: string;
}

export interface AcademicYear {
  id: string;
  name: string; // e.g. "2026-2027"
  start_date: string;
  end_date: string;
  is_current: boolean;
  status: AcademicYearStatus;
  created_at: string;
  updated_at: string;
}

export interface Semester {
  id: string;
  name: string; // e.g. "First Semester"
  sequence: number;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
}

export interface YearLevel {
  id: string;
  name: string; // e.g. "Year 1"
  level_number: number;
  created_at: string;
  updated_at: string;
}

export interface Curriculum {
  id: string;
  program_id: string;
  name: string;
  version: string;
  effective_academic_year: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  created_at: string;
  updated_at: string;
  program?: Program;
}

export interface Subject {
  id: string;
  code: string; // e.g. "BTH-101"
  name: string;
  description?: string | null;
  units: number;
  status: AcademicStatus;
  created_at: string;
  updated_at: string;
}

export interface CurriculumSubject {
  id: string;
  curriculum_id: string;
  subject_id: string;
  year_level_id: string;
  semester_id: string;
  prerequisite_subject_id?: string | null;
  is_required: boolean;
  status: 'ACTIVE' | 'ARCHIVED';
  created_at: string;
  updated_at: string;
  subject?: Subject;
  prerequisite_subject?: Subject | null;
  year_level?: YearLevel;
  semester?: Semester;
}

export interface Student {
  id: string;
  profile_id: string;
  student_number?: string | null;
  program_id?: string | null;
  curriculum_id?: string | null;
  year_level_id?: string | null;
  student_status: StudentStatus;
  admission_date?: string | null;
  expected_graduation_date?: string | null;
  graduation_date?: string | null;

  // Detailed Registration Form Fields
  nickname?: string | null;
  date_of_birth?: string | null;
  age?: number | string | null;
  gender?: string | null;
  civil_status?: string | null;
  nationality?: string | null;
  present_address?: string | null;
  mobile_no?: string | null;
  occupation?: string | null;
  business_address?: string | null;
  business_tel_no?: string | null;
  school_graduated?: string | null;
  date_graduated?: string | null;
  degree_honors_awards?: string | null;

  // Emergency & Reference Details
  character_reference_name?: string | null;
  character_reference_no?: string | null;
  emergency_contact_name?: string | null;
  emergency_address?: string | null;
  emergency_no?: string | null;
  emergency_relation?: string | null;

  // Spiritual / Church Background
  home_church?: string | null;
  church_address?: string | null;
  pastor_name?: string | null;
  date_saved?: string | null;
  date_baptized?: string | null;
  ministries_involved?: string | null;
  special_skills?: string | null;
  musical_instruments?: string | null;

  // Personal Statement & Health
  reason_for_enrolling?: string | null;
  health_information?: string | null;
  brief_testimony?: string | null;

  created_at: string;
  updated_at: string;
  profile?: Profile;
  program?: Program;
  curriculum?: Curriculum;
  year_level?: YearLevel;
}

export interface Staff {
  id: string;
  profile_id: string;
  employee_number?: string | null;
  department: string;
  title?: string | null;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface EnrollmentPeriod {
  id: string;
  academic_year_id: string;
  semester_id: string;
  start_date: string;
  end_date: string;
  status: EnrollmentPeriodStatus;
  created_at: string;
  updated_at: string;
  academic_year?: AcademicYear;
  semester?: Semester;
}

export interface Enrollment {
  id: string;
  student_id: string;
  academic_year_id: string;
  semester_id: string;
  enrollment_period_id?: string | null;
  status: EnrollmentStatus;
  total_units: number;
  submitted_at?: string | null;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  remarks?: string | null;
  created_at: string;
  updated_at: string;
  student?: Student;
  academic_year?: AcademicYear;
  semester?: Semester;
  reviewer_profile?: Profile;
  enrollment_subjects?: EnrollmentSubject[];
}

export interface EnrollmentSubject {
  id: string;
  enrollment_id: string;
  subject_id: string;
  units: number;
  status: EnrollmentSubjectStatus;
  created_at: string;
  updated_at: string;
  subject?: Subject;
  grade?: Grade;
}

export interface Grade {
  id: string;
  student_id: string;
  enrollment_subject_id: string;
  grade?: number | null; // e.g. 1.00, 1.25, 2.00, 5.00
  remarks?: string | null;
  status: GradeStatus;
  released_at?: string | null;
  entered_by?: string | null;
  created_at: string;
  updated_at: string;
  entered_by_profile?: Profile;
  enrollment_subject?: EnrollmentSubject;
}

export interface StudentDocument {
  id: string;
  student_id: string;
  document_type: DocumentType;
  title: string;
  file_path: string;
  file_size_bytes?: number | null;
  mime_type?: string | null;
  verification_status: VerificationStatus;
  verified_by?: string | null;
  verified_at?: string | null;
  remarks?: string | null;
  created_at: string;
  updated_at: string;
  student?: Student;
  verifier_profile?: Profile;
}

export interface AlumniProfile {
  id: string;
  student_id: string;
  profile_id: string;
  graduation_year: number;
  graduation_date?: string | null;
  degree_conferred: string;
  employer?: string | null;
  position?: string | null;
  ministry_involvement?: string | null;
  industry?: string | null;
  location?: string | null;
  phone?: string | null;
  email?: string | null;
  linkedin_url?: string | null;
  bio?: string | null;
  is_directory_visible: boolean;
  created_at: string;
  updated_at: string;
  profile?: Profile;
  student?: Student;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  audience: AnnouncementAudience;
  is_pinned: boolean;
  published_at: string;
  expires_at?: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  author_id?: string | null;
  created_at: string;
  updated_at: string;
  author?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  link?: string | null;
  type: NotificationType;
  is_read: boolean;
  read_at?: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string | null;
  user_email?: string | null;
  action: string;
  entity: string;
  entity_id?: string | null;
  previous_data?: Record<string, unknown> | null;
  new_data?: Record<string, unknown> | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: string;
  user?: Profile;
}
