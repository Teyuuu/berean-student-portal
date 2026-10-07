import { z } from 'zod';

// Authentication & Profile Schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please provide a valid phone number').optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  programId: z.string().min(1, 'Please select your target degree program').optional().or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const passwordResetSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const profileUpdateSchema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  middle_name: z.string().optional().nullable(),
  last_name: z.string().min(2, 'Last name is required'),
  phone: z.string().optional().nullable(),
  profile_photo_url: z.string().optional().nullable(),
});

// Academic Schemas
export const programSchema = z.object({
  code: z.string().min(2, 'Program code is required (e.g. BTH)').max(10),
  name: z.string().min(3, 'Program name is required'),
  description: z.string().optional().nullable(),
  duration_years: z.coerce.number().min(1, 'Duration must be at least 1 year').max(8),
  status: z.enum(['ACTIVE', 'ARCHIVED', 'INACTIVE']).default('ACTIVE'),
});

export const subjectSchema = z.object({
  code: z.string().min(2, 'Subject code is required (e.g. BTH-101)').max(20),
  name: z.string().min(3, 'Subject name is required'),
  description: z.string().optional().nullable(),
  units: z.coerce.number().min(1, 'Units must be between 1 and 10').max(10),
  status: z.enum(['ACTIVE', 'ARCHIVED', 'INACTIVE']).default('ACTIVE'),
});

export const academicYearSchema = z.object({
  name: z.string().min(9, 'e.g. 2026-2027').max(9),
  start_date: z.string().min(10, 'Start date is required'),
  end_date: z.string().min(10, 'End date is required'),
  is_current: z.boolean().default(false),
  status: z.enum(['ACTIVE', 'CLOSED', 'UPCOMING']).default('ACTIVE'),
});

export const semesterSchema = z.object({
  name: z.string().min(3, 'Semester name is required'),
  sequence: z.coerce.number().min(1).max(4),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const curriculumSchema = z.object({
  program_id: z.string().uuid('Please select a program'),
  name: z.string().min(3, 'Curriculum name is required'),
  version: z.string().min(1, 'Version is required (e.g. 2026.1)'),
  effective_academic_year: z.string().min(4, 'Effective academic year is required'),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']).default('ACTIVE'),
});

export const curriculumSubjectSchema = z.object({
  curriculum_id: z.string().uuid(),
  subject_id: z.string().uuid('Please select a subject'),
  year_level_id: z.string().uuid('Please select a year level'),
  semester_id: z.string().uuid('Please select a semester'),
  prerequisite_subject_id: z.string().uuid().optional().nullable(),
  is_required: z.boolean().default(true),
  status: z.enum(['ACTIVE', 'ARCHIVED']).default('ACTIVE'),
});

export const enrollmentPeriodSchema = z.object({
  academic_year_id: z.string().uuid('Please select an academic year'),
  semester_id: z.string().uuid('Please select a semester'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  status: z.enum(['UPCOMING', 'OPEN', 'CLOSED']).default('UPCOMING'),
});

export const gradeEntrySchema = z.object({
  grade: z.coerce.number().min(1.00).max(5.00),
  remarks: z.string().min(1, 'Remarks are required (e.g. Passed, Failed, Incomplete)'),
  status: z.enum(['DRAFT', 'SUBMITTED', 'RELEASED']).default('DRAFT'),
});

export const alumniProfileSchema = z.object({
  graduation_year: z.coerce.number().min(1950).max(2050),
  graduation_date: z.string().optional().nullable(),
  degree_conferred: z.string().min(3, 'Degree title is required'),
  employer: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
  ministry_involvement: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  linkedin_url: z.string().url().optional().nullable().or(z.literal('')),
  bio: z.string().max(1000).optional().nullable(),
  is_directory_visible: z.boolean().default(true),
});

export const announcementSchema = z.object({
  title: z.string().min(3, 'Announcement title is required'),
  content: z.string().min(10, 'Content is required'),
  audience: z.enum(['ALL', 'STUDENTS', 'ALUMNI', 'STAFF', 'APPLICANTS']).default('ALL'),
  is_pinned: z.boolean().default(false),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
});
