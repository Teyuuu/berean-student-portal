-- Berean Bible College Student and Alumni Portal
-- Comprehensive Database Schema & Row Level Security (RLS)
-- File: supabase/migrations/20261001000000_initial_schema.sql

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. PROFILES & CORE ROLES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('ADMIN', 'STAFF', 'STUDENT', 'ALUMNI');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'STUDENT',
    profile_photo_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================================================
-- 2. ACADEMIC STRUCTURE (PROGRAMS, YEARS, SEMESTERS, YEAR LEVELS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    duration_years INTEGER NOT NULL DEFAULT 4 CHECK (duration_years > 0),
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ARCHIVED', 'INACTIVE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS public.academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE, -- e.g. '2026-2027'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CLOSED', 'UPCOMING')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT valid_dates CHECK (end_date > start_date)
);

CREATE TABLE IF NOT EXISTS public.semesters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL, -- 'First Semester', 'Second Semester', 'Summer'
    sequence INTEGER NOT NULL CHECK (sequence > 0),
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(name, sequence)
);

CREATE TABLE IF NOT EXISTS public.year_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE, -- 'Year 1', 'Year 2', 'Year 3', 'Year 4'
    level_number INTEGER NOT NULL UNIQUE CHECK (level_number > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================================================
-- 3. CURRICULUM & SUBJECTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.curricula (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE RESTRICT,
    name TEXT NOT NULL, -- e.g. 'Bachelor of Theology Curriculum 2026'
    version TEXT NOT NULL, -- e.g. '2026.1'
    effective_academic_year TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DRAFT', 'ARCHIVED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(program_id, version)
);

CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE, -- e.g. 'BTH-101'
    name TEXT NOT NULL, -- e.g. 'Old Testament Survey'
    description TEXT,
    units INTEGER NOT NULL CHECK (units > 0),
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ARCHIVED', 'INACTIVE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS public.curriculum_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curriculum_id UUID NOT NULL REFERENCES public.curricula(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE RESTRICT,
    year_level_id UUID NOT NULL REFERENCES public.year_levels(id) ON DELETE RESTRICT,
    semester_id UUID NOT NULL REFERENCES public.semesters(id) ON DELETE RESTRICT,
    prerequisite_subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ARCHIVED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(curriculum_id, subject_id)
);

-- ============================================================================
-- 4. STUDENTS & STAFF
-- ============================================================================
DO $$ BEGIN
    CREATE TYPE student_status_type AS ENUM (
        'APPLICANT',
        'PENDING_VERIFICATION',
        'ACTIVE',
        'ENROLLED',
        'NOT_ENROLLED',
        'ON_LEAVE',
        'INACTIVE',
        'SUSPENDED',
        'WITHDRAWN',
        'GRADUATED',
        'ALUMNI'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_number TEXT UNIQUE, -- e.g. 'BBC-2026-0001'
    program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
    curriculum_id UUID REFERENCES public.curricula(id) ON DELETE SET NULL,
    year_level_id UUID REFERENCES public.year_levels(id) ON DELETE SET NULL,
    student_status student_status_type NOT NULL DEFAULT 'APPLICANT',
    admission_date DATE,
    expected_graduation_date DATE,
    graduation_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    employee_number TEXT UNIQUE,
    department TEXT NOT NULL DEFAULT 'Registrar',
    title TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================================================
-- 5. ENROLLMENT SYSTEM
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.enrollment_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
    semester_id UUID NOT NULL REFERENCES public.semesters(id) ON DELETE CASCADE,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'UPCOMING' CHECK (status IN ('UPCOMING', 'OPEN', 'CLOSED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT enrollment_period_dates CHECK (end_date > start_date)
);

DO $$ BEGIN
    CREATE TYPE enrollment_status_type AS ENUM (
        'DRAFT',
        'SUBMITTED',
        'UNDER_REVIEW',
        'APPROVED',
        'REJECTED',
        'CANCELLED',
        'COMPLETED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE RESTRICT,
    semester_id UUID NOT NULL REFERENCES public.semesters(id) ON DELETE RESTRICT,
    enrollment_period_id UUID REFERENCES public.enrollment_periods(id) ON DELETE SET NULL,
    status enrollment_status_type NOT NULL DEFAULT 'DRAFT',
    total_units INTEGER NOT NULL DEFAULT 0,
    submitted_at TIMESTAMPTZ,
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(student_id, academic_year_id, semester_id)
);

CREATE TABLE IF NOT EXISTS public.enrollment_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE RESTRICT,
    units INTEGER NOT NULL CHECK (units > 0),
    status TEXT NOT NULL DEFAULT 'ENROLLED' CHECK (status IN ('ENROLLED', 'DROPPED', 'COMPLETED', 'FAILED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(enrollment_id, subject_id)
);

-- ============================================================================
-- 6. GRADES & ACADEMIC RECORDS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    enrollment_subject_id UUID NOT NULL UNIQUE REFERENCES public.enrollment_subjects(id) ON DELETE CASCADE,
    grade NUMERIC(4,2), -- e.g. 1.00, 1.25, 1.50 ... 3.00, 5.00
    remarks TEXT, -- e.g. 'Passed', 'Failed', 'Incomplete', 'Dropped'
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SUBMITTED', 'RELEASED')),
    released_at TIMESTAMPTZ,
    entered_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================================================
-- 7. STUDENT DOCUMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.student_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN (
        'BIRTH_CERTIFICATE',
        'HIGH_SCHOOL_CARD',
        'TRANSCRIPT_OF_RECORDS',
        'PASTOR_RECOMMENDATION',
        'ID_PHOTO',
        'ENROLLMENT_FORM',
        'CERTIFICATE_OF_GRADUATION',
        'OTHER'
    )),
    title TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size_bytes BIGINT,
    mime_type TEXT,
    verification_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================================================
-- 8. ALUMNI PROFILES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.alumni_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL UNIQUE REFERENCES public.students(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    graduation_year INTEGER NOT NULL CHECK (graduation_year >= 1950),
    graduation_date DATE,
    degree_conferred TEXT NOT NULL,
    employer TEXT,
    position TEXT,
    ministry_involvement TEXT,
    industry TEXT,
    location TEXT,
    phone TEXT,
    email TEXT,
    linkedin_url TEXT,
    bio TEXT,
    is_directory_visible BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================================================
-- 9. ANNOUNCEMENTS & NOTIFICATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    audience TEXT NOT NULL DEFAULT 'ALL' CHECK (audience IN ('ALL', 'STUDENTS', 'ALUMNI', 'STAFF', 'APPLICANTS')),
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    expires_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    type TEXT NOT NULL DEFAULT 'INFO' CHECK (type IN ('INFO', 'SUCCESS', 'WARNING', 'ALERT')),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================================================
-- 10. AUDIT LOGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_email TEXT,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    previous_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================================================
-- 11. INDEXES FOR HIGH QUERY PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_students_profile_id ON public.students(profile_id);
CREATE INDEX IF NOT EXISTS idx_students_status ON public.students(student_status);
CREATE INDEX IF NOT EXISTS idx_students_number ON public.students(student_number);
CREATE INDEX IF NOT EXISTS idx_curriculum_subjects_curriculum ON public.curriculum_subjects(curriculum_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON public.enrollments(status);
CREATE INDEX IF NOT EXISTS idx_enrollment_subjects_enrollment ON public.enrollment_subjects(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_grades_student ON public.grades(student_id);
CREATE INDEX IF NOT EXISTS idx_student_docs_student ON public.student_documents(student_id);
CREATE INDEX IF NOT EXISTS idx_announcements_audience ON public.announcements(audience, status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id, created_at DESC);

-- ============================================================================
-- 12. HELPER FUNCTIONS & TRIGGERS
-- ============================================================================

-- Automatic updated_at timestamp refresher
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger across all stateful tables
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN 
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN (
            'profiles', 'programs', 'academic_years', 'semesters', 
            'year_levels', 'curricula', 'subjects', 'curriculum_subjects',
            'students', 'staff', 'enrollment_periods', 'enrollments',
            'enrollment_subjects', 'grades', 'student_documents',
            'alumni_profiles', 'announcements'
        )
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS trigger_updated_at ON public.%I;', tbl);
        EXECUTE format('CREATE TRIGGER trigger_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();', tbl);
    END LOOP;
END;
$$;

-- Automatic user profile creation on Supabase Auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_role user_role := 'STUDENT';
BEGIN
    -- Allow role metadata override if provided during registration
    IF NEW.raw_user_meta_data->>'role' IS NOT NULL THEN
        default_role := (NEW.raw_user_meta_data->>'role')::user_role;
    END IF;

    INSERT INTO public.profiles (
        id,
        first_name,
        middle_name,
        last_name,
        email,
        phone,
        role,
        profile_photo_url
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'first_name', 'Student'),
        NEW.raw_user_meta_data->>'middle_name',
        COALESCE(NEW.raw_user_meta_data->>'last_name', 'User'),
        NEW.email,
        NEW.raw_user_meta_data->>'phone',
        default_role,
        NEW.raw_user_meta_data->>'profile_photo_url'
    );

    -- If registered as STUDENT or APPLICANT, initialize students record
    IF default_role = 'STUDENT' THEN
        INSERT INTO public.students (
            profile_id,
            student_status
        )
        VALUES (
            NEW.id,
            'APPLICANT'
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to recalculate total units on enrollments when enrollment_subjects change
CREATE OR REPLACE FUNCTION public.recalculate_enrollment_units()
RETURNS TRIGGER AS $$
DECLARE
    target_enrollment_id UUID;
    computed_units INTEGER;
BEGIN
    IF TG_OP = 'DELETE' THEN
        target_enrollment_id := OLD.enrollment_id;
    ELSE
        target_enrollment_id := NEW.enrollment_id;
    END IF;

    SELECT COALESCE(SUM(units), 0)
    INTO computed_units
    FROM public.enrollment_subjects
    WHERE enrollment_id = target_enrollment_id
    AND status != 'DROPPED';

    UPDATE public.enrollments
    SET total_units = computed_units
    WHERE id = target_enrollment_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_enrollment_subject_change ON public.enrollment_subjects;
CREATE TRIGGER on_enrollment_subject_change
    AFTER INSERT OR UPDATE OR DELETE ON public.enrollment_subjects
    FOR EACH ROW EXECUTE FUNCTION public.recalculate_enrollment_units();

-- ============================================================================
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on ALL tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.year_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curricula ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper functions to check roles safely
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'ADMIN' AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_staff_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('ADMIN', 'STAFF') AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_current_student_id()
RETURNS UUID AS $$
DECLARE
    sid UUID;
BEGIN
    SELECT id INTO sid FROM public.students WHERE profile_id = auth.uid();
    RETURN sid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- --- Profiles RLS ---
DROP POLICY IF EXISTS "Public profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Public profiles are viewable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (TRUE);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (
        id = auth.uid() AND
        role = (SELECT role FROM public.profiles WHERE id = auth.uid()) -- Cannot elevate own role
    );

DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
CREATE POLICY "Admins have full access to profiles"
    ON public.profiles FOR ALL
    TO authenticated
    USING (public.is_admin());

-- --- Academic Catalog RLS (Programs, Academic Years, Semesters, Year Levels, Curricula, Subjects) ---
-- Readable by all authenticated users; writable only by Admins
DROP POLICY IF EXISTS "Academic programs readable by authenticated" ON public.programs;
CREATE POLICY "Academic programs readable by authenticated"
    ON public.programs FOR SELECT TO authenticated USING (TRUE);
DROP POLICY IF EXISTS "Admins manage programs" ON public.programs;
CREATE POLICY "Admins manage programs"
    ON public.programs FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Academic years readable by authenticated" ON public.academic_years;
CREATE POLICY "Academic years readable by authenticated"
    ON public.academic_years FOR SELECT TO authenticated USING (TRUE);
DROP POLICY IF EXISTS "Admins manage academic years" ON public.academic_years;
CREATE POLICY "Admins manage academic years"
    ON public.academic_years FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Semesters readable by authenticated" ON public.semesters;
CREATE POLICY "Semesters readable by authenticated"
    ON public.semesters FOR SELECT TO authenticated USING (TRUE);
DROP POLICY IF EXISTS "Admins manage semesters" ON public.semesters;
CREATE POLICY "Admins manage semesters"
    ON public.semesters FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Year levels readable by authenticated" ON public.year_levels;
CREATE POLICY "Year levels readable by authenticated"
    ON public.year_levels FOR SELECT TO authenticated USING (TRUE);
DROP POLICY IF EXISTS "Admins manage year levels" ON public.year_levels;
CREATE POLICY "Admins manage year levels"
    ON public.year_levels FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Curricula readable by authenticated" ON public.curricula;
CREATE POLICY "Curricula readable by authenticated"
    ON public.curricula FOR SELECT TO authenticated USING (TRUE);
DROP POLICY IF EXISTS "Admins manage curricula" ON public.curricula;
CREATE POLICY "Admins manage curricula"
    ON public.curricula FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Subjects readable by authenticated" ON public.subjects;
CREATE POLICY "Subjects readable by authenticated"
    ON public.subjects FOR SELECT TO authenticated USING (TRUE);
DROP POLICY IF EXISTS "Admins manage subjects" ON public.subjects;
CREATE POLICY "Admins manage subjects"
    ON public.subjects FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Curriculum subjects readable by authenticated" ON public.curriculum_subjects;
CREATE POLICY "Curriculum subjects readable by authenticated"
    ON public.curriculum_subjects FOR SELECT TO authenticated USING (TRUE);
DROP POLICY IF EXISTS "Admins manage curriculum subjects" ON public.curriculum_subjects;
CREATE POLICY "Admins manage curriculum subjects"
    ON public.curriculum_subjects FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Enrollment periods readable by authenticated" ON public.enrollment_periods;
CREATE POLICY "Enrollment periods readable by authenticated"
    ON public.enrollment_periods FOR SELECT TO authenticated USING (TRUE);
DROP POLICY IF EXISTS "Staff and admin manage enrollment periods" ON public.enrollment_periods;
CREATE POLICY "Staff and admin manage enrollment periods"
    ON public.enrollment_periods FOR ALL TO authenticated USING (public.is_staff_or_admin());

-- --- Students Table RLS ---
DROP POLICY IF EXISTS "Students can view their own student record" ON public.students;
CREATE POLICY "Students can view their own student record"
    ON public.students FOR SELECT
    TO authenticated
    USING (profile_id = auth.uid() OR public.is_staff_or_admin());

DROP POLICY IF EXISTS "Staff and Admins can manage student records" ON public.students;
CREATE POLICY "Staff and Admins can manage student records"
    ON public.students FOR ALL
    TO authenticated
    USING (public.is_staff_or_admin());

-- --- Staff Table RLS ---
DROP POLICY IF EXISTS "Staff records viewable by staff and admin" ON public.staff;
CREATE POLICY "Staff records viewable by staff and admin"
    ON public.staff FOR SELECT
    TO authenticated
    USING (profile_id = auth.uid() OR public.is_staff_or_admin());

DROP POLICY IF EXISTS "Admins manage staff records" ON public.staff;
CREATE POLICY "Admins manage staff records"
    ON public.staff FOR ALL
    TO authenticated
    USING (public.is_admin());

-- --- Enrollments RLS ---
DROP POLICY IF EXISTS "Students view their own enrollments" ON public.enrollments;
CREATE POLICY "Students view their own enrollments"
    ON public.enrollments FOR SELECT
    TO authenticated
    USING (student_id = public.get_current_student_id() OR public.is_staff_or_admin());

DROP POLICY IF EXISTS "Students can insert draft or submitted enrollment" ON public.enrollments;
CREATE POLICY "Students can insert draft or submitted enrollment"
    ON public.enrollments FOR INSERT
    TO authenticated
    WITH CHECK (
        student_id = public.get_current_student_id() AND
        status IN ('DRAFT', 'SUBMITTED')
    );

DROP POLICY IF EXISTS "Students can update draft enrollment" ON public.enrollments;
CREATE POLICY "Students can update draft enrollment"
    ON public.enrollments FOR UPDATE
    TO authenticated
    USING (student_id = public.get_current_student_id() AND status = 'DRAFT')
    WITH CHECK (student_id = public.get_current_student_id() AND status IN ('DRAFT', 'SUBMITTED'));

DROP POLICY IF EXISTS "Staff and Admins can manage all enrollments" ON public.enrollments;
CREATE POLICY "Staff and Admins can manage all enrollments"
    ON public.enrollments FOR ALL
    TO authenticated
    USING (public.is_staff_or_admin());

-- --- Enrollment Subjects RLS ---
DROP POLICY IF EXISTS "Students view their own enrollment subjects" ON public.enrollment_subjects;
CREATE POLICY "Students view their own enrollment subjects"
    ON public.enrollment_subjects FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.enrollments e
            WHERE e.id = enrollment_subjects.enrollment_id
            AND e.student_id = public.get_current_student_id()
        )
        OR public.is_staff_or_admin()
    );

DROP POLICY IF EXISTS "Students manage subjects in draft enrollment" ON public.enrollment_subjects;
CREATE POLICY "Students manage subjects in draft enrollment"
    ON public.enrollment_subjects FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.enrollments e
            WHERE e.id = enrollment_subjects.enrollment_id
            AND e.student_id = public.get_current_student_id()
            AND e.status = 'DRAFT'
        )
    );

DROP POLICY IF EXISTS "Staff and Admins manage all enrollment subjects" ON public.enrollment_subjects;
CREATE POLICY "Staff and Admins manage all enrollment subjects"
    ON public.enrollment_subjects FOR ALL
    TO authenticated
    USING (public.is_staff_or_admin());

-- --- Grades RLS ---
DROP POLICY IF EXISTS "Students view released grades only" ON public.grades;
CREATE POLICY "Students view released grades only"
    ON public.grades FOR SELECT
    TO authenticated
    USING (
        (student_id = public.get_current_student_id() AND status = 'RELEASED')
        OR public.is_staff_or_admin()
    );

DROP POLICY IF EXISTS "Staff and Admins manage grades" ON public.grades;
CREATE POLICY "Staff and Admins manage grades"
    ON public.grades FOR ALL
    TO authenticated
    USING (public.is_staff_or_admin());

-- --- Student Documents RLS ---
DROP POLICY IF EXISTS "Students view and upload their own documents" ON public.student_documents;
CREATE POLICY "Students view and upload their own documents"
    ON public.student_documents FOR SELECT
    TO authenticated
    USING (student_id = public.get_current_student_id() OR public.is_staff_or_admin());

DROP POLICY IF EXISTS "Students upload own documents" ON public.student_documents;
CREATE POLICY "Students upload own documents"
    ON public.student_documents FOR INSERT
    TO authenticated
    WITH CHECK (student_id = public.get_current_student_id());

DROP POLICY IF EXISTS "Staff and Admins manage all student documents" ON public.student_documents;
CREATE POLICY "Staff and Admins manage all student documents"
    ON public.student_documents FOR ALL
    TO authenticated
    USING (public.is_staff_or_admin());

-- --- Alumni Profiles RLS ---
DROP POLICY IF EXISTS "Alumni directory viewable by authenticated users" ON public.alumni_profiles;
CREATE POLICY "Alumni directory viewable by authenticated users"
    ON public.alumni_profiles FOR SELECT
    TO authenticated
    USING (is_directory_visible = TRUE OR profile_id = auth.uid() OR public.is_staff_or_admin());

DROP POLICY IF EXISTS "Alumni can update their own alumni profile" ON public.alumni_profiles;
CREATE POLICY "Alumni can update their own alumni profile"
    ON public.alumni_profiles FOR UPDATE
    TO authenticated
    USING (profile_id = auth.uid() OR public.is_staff_or_admin())
    WITH CHECK (profile_id = auth.uid() OR public.is_staff_or_admin());

DROP POLICY IF EXISTS "Staff and Admins manage alumni profiles" ON public.alumni_profiles;
CREATE POLICY "Staff and Admins manage alumni profiles"
    ON public.alumni_profiles FOR ALL
    TO authenticated
    USING (public.is_staff_or_admin());

-- --- Announcements RLS ---
DROP POLICY IF EXISTS "Announcements viewable based on role" ON public.announcements;
CREATE POLICY "Announcements viewable based on role"
    ON public.announcements FOR SELECT
    TO authenticated
    USING (
        status = 'PUBLISHED' AND (
            audience = 'ALL' OR
            (audience = 'STUDENTS' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'STUDENT')) OR
            (audience = 'ALUMNI' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ALUMNI')) OR
            (audience = 'STAFF' AND public.is_staff_or_admin())
        )
    );

DROP POLICY IF EXISTS "Staff and Admins manage announcements" ON public.announcements;
CREATE POLICY "Staff and Admins manage announcements"
    ON public.announcements FOR ALL
    TO authenticated
    USING (public.is_staff_or_admin());

-- --- Notifications RLS ---
DROP POLICY IF EXISTS "Users view and update their own notifications" ON public.notifications;
CREATE POLICY "Users view and update their own notifications"
    ON public.notifications FOR ALL
    TO authenticated
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Staff and Admins can create notifications" ON public.notifications;
CREATE POLICY "Staff and Admins can create notifications"
    ON public.notifications FOR INSERT
    TO authenticated
    WITH CHECK (TRUE);

-- --- Audit Logs RLS ---
DROP POLICY IF EXISTS "Admins view audit logs" ON public.audit_logs;
CREATE POLICY "Admins view audit logs"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS "System and staff can insert audit logs" ON public.audit_logs;
CREATE POLICY "System and staff can insert audit logs"
    ON public.audit_logs FOR INSERT
    TO authenticated
    WITH CHECK (TRUE);

-- ============================================================================
-- 14. SUPABASE STORAGE BUCKETS SETUP
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('profile-photos', 'profile-photos', true),
    ('student-documents', 'student-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: profile-photos (Public read, user write)
DROP POLICY IF EXISTS "Profile photos are publicly accessible" ON storage.objects;
CREATE POLICY "Profile photos are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'profile-photos');

DROP POLICY IF EXISTS "Users can upload their own profile photo" ON storage.objects;
CREATE POLICY "Users can upload their own profile photo"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Storage RLS: student-documents (Private, owner and staff access only)
DROP POLICY IF EXISTS "Students and staff access student documents" ON storage.objects;
CREATE POLICY "Students and staff access student documents"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'student-documents' AND (
            (storage.foldername(name))[1] = auth.uid()::text OR
            public.is_staff_or_admin()
        )
    );

DROP POLICY IF EXISTS "Students upload own documents" ON storage.objects;
CREATE POLICY "Students upload own documents"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'student-documents' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );
