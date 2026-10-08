import { createClient } from '@supabase/supabase-js';
import {
  INITIAL_PROGRAMS,
  INITIAL_ACADEMIC_YEARS,
  INITIAL_SEMESTERS,
  INITIAL_YEAR_LEVELS,
  INITIAL_CURRICULA,
  INITIAL_SUBJECTS,
  INITIAL_CURRICULUM_SUBJECTS,
  INITIAL_ENROLLMENT_PERIODS,
  INITIAL_PROFILES,
  INITIAL_STAFF,
  INITIAL_STUDENTS,
  INITIAL_ALUMNI_PROFILES,
  INITIAL_ENROLLMENTS,
  INITIAL_ENROLLMENT_SUBJECTS,
  INITIAL_GRADES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_STUDENT_DOCUMENTS,
} from './mockData';
import {
  Profile,
  Program,
  AcademicYear,
  Semester,
  YearLevel,
  Curriculum,
  Subject,
  CurriculumSubject,
  Student,
  Staff,
  EnrollmentPeriod,
  Enrollment,
  EnrollmentSubject,
  Grade,
  StudentDocument,
  AlumniProfile,
  Announcement,
  Notification,
  AuditLog,
  StudentStatus,
  EnrollmentStatus,
  UserRole,
} from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock-berean.supabase.co';
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const rawPublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabaseAnonKey =
  (rawAnonKey && !rawAnonKey.includes('mock') ? rawAnonKey : '') ||
  (rawPublishableKey && !rawPublishableKey.includes('mock') ? rawPublishableKey : '') ||
  rawAnonKey ||
  'mock-anon-key';

export const isLiveSupabaseConfigured =
  Boolean(supabaseUrl) &&
  supabaseUrl !== 'https://mock-berean.supabase.co' &&
  !supabaseUrl.includes('mock') &&
  Boolean(supabaseAnonKey) &&
  !supabaseAnonKey.includes('mock') &&
  supabaseAnonKey.length > 20;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Local state store for standalone execution / seed demo
class LocalDataStore {
  private keyPrefix = 'berean_db_';

  private load<T>(key: string, initial: T[]): T[] {
    try {
      const data = localStorage.getItem(this.keyPrefix + key);
      if (data) return JSON.parse(data);
    } catch {
      // fallback to initial
    }
    return initial;
  }

  private save<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(this.keyPrefix + key, JSON.stringify(data));
    } catch {
      // ignore
    }
  }

  public resetToDefaults() {
    localStorage.clear();
  }

  // Programs
  getPrograms(): Program[] {
    return this.load('programs', INITIAL_PROGRAMS);
  }
  savePrograms(items: Program[]) {
    this.save('programs', items);
  }

  // Academic Years
  getAcademicYears(): AcademicYear[] {
    return this.load('academic_years', INITIAL_ACADEMIC_YEARS);
  }
  saveAcademicYears(items: AcademicYear[]) {
    this.save('academic_years', items);
  }

  // Semesters
  getSemesters(): Semester[] {
    return this.load('semesters', INITIAL_SEMESTERS);
  }

  // Year Levels
  getYearLevels(): YearLevel[] {
    return this.load('year_levels', INITIAL_YEAR_LEVELS);
  }

  // Curricula
  getCurricula(): Curriculum[] {
    return this.load('curricula', INITIAL_CURRICULA);
  }
  saveCurricula(items: Curriculum[]) {
    this.save('curricula', items);
  }

  // Subjects
  getSubjects(): Subject[] {
    const list = this.load('subjects', INITIAL_SUBJECTS);
    if (list.length < INITIAL_SUBJECTS.length) {
      this.save('subjects', INITIAL_SUBJECTS);
      return INITIAL_SUBJECTS;
    }
    return list;
  }
  saveSubjects(items: Subject[]) {
    this.save('subjects', items);
  }

  // Curriculum Subjects
  getCurriculumSubjects(): CurriculumSubject[] {
    const list = this.load('curriculum_subjects', INITIAL_CURRICULUM_SUBJECTS);
    if (list.length < INITIAL_CURRICULUM_SUBJECTS.length) {
      this.save('curriculum_subjects', INITIAL_CURRICULUM_SUBJECTS);
      return INITIAL_CURRICULUM_SUBJECTS;
    }
    return list;
  }
  saveCurriculumSubjects(items: CurriculumSubject[]) {
    this.save('curriculum_subjects', items);
  }

  // Enrollment Periods
  getEnrollmentPeriods(): EnrollmentPeriod[] {
    return this.load('enrollment_periods', INITIAL_ENROLLMENT_PERIODS);
  }
  saveEnrollmentPeriods(items: EnrollmentPeriod[]) {
    this.save('enrollment_periods', items);
  }

  // Profiles
  getProfiles(): Profile[] {
    return this.load('profiles', INITIAL_PROFILES);
  }
  saveProfiles(items: Profile[]) {
    this.save('profiles', items);
  }

  // Staff
  getStaff(): Staff[] {
    return this.load('staff', INITIAL_STAFF);
  }
  saveStaff(items: Staff[]) {
    this.save('staff', items);
  }

  // Students
  getStudents(): Student[] {
    return this.load('students', INITIAL_STUDENTS);
  }
  saveStudents(items: Student[]) {
    this.save('students', items);
  }

  // Alumni
  getAlumniProfiles(): AlumniProfile[] {
    return this.load('alumni_profiles', INITIAL_ALUMNI_PROFILES);
  }
  saveAlumniProfiles(items: AlumniProfile[]) {
    this.save('alumni_profiles', items);
  }

  // Enrollments
  getEnrollments(): Enrollment[] {
    return this.load('enrollments', INITIAL_ENROLLMENTS);
  }
  saveEnrollments(items: Enrollment[]) {
    this.save('enrollments', items);
  }

  // Enrollment Subjects
  getEnrollmentSubjects(): EnrollmentSubject[] {
    return this.load('enrollment_subjects', INITIAL_ENROLLMENT_SUBJECTS);
  }
  saveEnrollmentSubjects(items: EnrollmentSubject[]) {
    this.save('enrollment_subjects', items);
  }

  // Grades
  getGrades(): Grade[] {
    return this.load('grades', INITIAL_GRADES);
  }
  saveGrades(items: Grade[]) {
    this.save('grades', items);
  }

  // Student Documents
  getDocuments(): StudentDocument[] {
    return this.load('student_documents', INITIAL_STUDENT_DOCUMENTS);
  }
  saveDocuments(items: StudentDocument[]) {
    this.save('student_documents', items);
  }

  // Announcements
  getAnnouncements(): Announcement[] {
    return this.load('announcements', INITIAL_ANNOUNCEMENTS);
  }
  saveAnnouncements(items: Announcement[]) {
    this.save('announcements', items);
  }

  // Notifications
  getNotifications(): Notification[] {
    return this.load('notifications', INITIAL_NOTIFICATIONS);
  }
  saveNotifications(items: Notification[]) {
    this.save('notifications', items);
  }

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return this.load('audit_logs', INITIAL_AUDIT_LOGS);
  }
  saveAuditLogs(items: AuditLog[]) {
    this.save('audit_logs', items);
  }
}

export const localStore = new LocalDataStore();

// Unified API Service
export const api = {
  // Programs
  async getPrograms(): Promise<Program[]> {
    if (isLiveSupabaseConfigured) {
      const { data, error } = await supabase.from('programs').select('*').order('code');
      if (!error && data) return data as Program[];
    }
    return localStore.getPrograms();
  },

  async createProgram(program: Omit<Program, 'id' | 'created_at' | 'updated_at'>): Promise<Program> {
    const newProg: Program = {
      ...program,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (isLiveSupabaseConfigured) {
      const { data, error } = await supabase.from('programs').insert(newProg).select().single();
      if (!error && data) return data as Program;
    }
    const current = localStore.getPrograms();
    localStore.savePrograms([...current, newProg]);
    return newProg;
  },

  async updateProgram(id: string, updates: Partial<Program>): Promise<Program> {
    if (isLiveSupabaseConfigured) {
      const { data, error } = await supabase
        .from('programs')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data as Program;
    }
    const current = localStore.getPrograms();
    const updated = current.map((p) => (p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p));
    localStore.savePrograms(updated);
    return updated.find((p) => p.id === id)!;
  },

  // Academic Years
  async getAcademicYears(): Promise<AcademicYear[]> {
    if (isLiveSupabaseConfigured) {
      const { data, error } = await supabase.from('academic_years').select('*').order('name', { ascending: false });
      if (!error && data) return data as AcademicYear[];
    }
    return localStore.getAcademicYears();
  },

  async createAcademicYear(ay: Omit<AcademicYear, 'id' | 'created_at' | 'updated_at'>): Promise<AcademicYear> {
    const newAy: AcademicYear = {
      ...ay,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (isLiveSupabaseConfigured) {
      const { data, error } = await supabase.from('academic_years').insert(newAy).select().single();
      if (!error && data) return data as AcademicYear;
    }
    const current = localStore.getAcademicYears();
    // If marked current, clear other current flags
    const updated = ay.is_current ? current.map((item) => ({ ...item, is_current: false })) : current;
    localStore.saveAcademicYears([...updated, newAy]);
    return newAy;
  },

  async setCurrentAcademicYear(id: string): Promise<void> {
    if (isLiveSupabaseConfigured) {
      await supabase.from('academic_years').update({ is_current: false }).neq('id', id);
      await supabase.from('academic_years').update({ is_current: true }).eq('id', id);
      return;
    }
    const current = localStore.getAcademicYears();
    const updated = current.map((ay) => ({ ...ay, is_current: ay.id === id }));
    localStore.saveAcademicYears(updated);
  },

  // Semesters & Year Levels
  async getSemesters(): Promise<Semester[]> {
    if (isLiveSupabaseConfigured) {
      const { data, error } = await supabase.from('semesters').select('*').order('sequence');
      if (!error && data) return data as Semester[];
    }
    return localStore.getSemesters();
  },

  async getYearLevels(): Promise<YearLevel[]> {
    if (isLiveSupabaseConfigured) {
      const { data, error } = await supabase.from('year_levels').select('*').order('level_number');
      if (!error && data) return data as YearLevel[];
    }
    return localStore.getYearLevels();
  },

  // Subjects
  async getSubjects(): Promise<Subject[]> {
    if (isLiveSupabaseConfigured) {
      const { data, error } = await supabase.from('subjects').select('*').order('code');
      if (!error && data) return data as Subject[];
    }
    return localStore.getSubjects();
  },

  async createSubject(subject: Omit<Subject, 'id' | 'created_at' | 'updated_at'>): Promise<Subject> {
    const newSub: Subject = {
      ...subject,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (isLiveSupabaseConfigured) {
      const { data, error } = await supabase.from('subjects').insert(newSub).select().single();
      if (!error && data) return data as Subject;
    }
    const current = localStore.getSubjects();
    localStore.saveSubjects([...current, newSub]);
    return newSub;
  },

  async updateSubject(id: string, updates: Partial<Subject>): Promise<Subject> {
    if (isLiveSupabaseConfigured) {
      const { data, error } = await supabase
        .from('subjects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data as Subject;
    }
    const current = localStore.getSubjects();
    const updated = current.map((s) => (s.id === id ? { ...s, ...updates, updated_at: new Date().toISOString() } : s));
    localStore.saveSubjects(updated);
    return updated.find((s) => s.id === id)!;
  },

  // Curricula & Curriculum Subjects
  async getCurricula(): Promise<Curriculum[]> {
    const curricula = localStore.getCurricula();
    const programs = localStore.getPrograms();
    return curricula.map((c) => ({
      ...c,
      program: programs.find((p) => p.id === c.program_id),
    }));
  },

  async createCurriculum(curr: Omit<Curriculum, 'id' | 'created_at' | 'updated_at'>): Promise<Curriculum> {
    const newCurr: Curriculum = {
      ...curr,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const current = localStore.getCurricula();
    localStore.saveCurricula([...current, newCurr]);
    return newCurr;
  },

  async getCurriculumSubjects(curriculumId: string): Promise<CurriculumSubject[]> {
    const csList = localStore.getCurriculumSubjects().filter((cs) => cs.curriculum_id === curriculumId);
    const subjects = localStore.getSubjects();
    const yearLevels = localStore.getYearLevels();
    const semesters = localStore.getSemesters();

    return csList.map((cs) => ({
      ...cs,
      subject: subjects.find((s) => s.id === cs.subject_id),
      prerequisite_subject: subjects.find((s) => s.id === cs.prerequisite_subject_id) || null,
      year_level: yearLevels.find((y) => y.id === cs.year_level_id),
      semester: semesters.find((s) => s.id === cs.semester_id),
    }));
  },

  async addCurriculumSubject(cs: Omit<CurriculumSubject, 'id' | 'created_at' | 'updated_at'>): Promise<CurriculumSubject> {
    const newCs: CurriculumSubject = {
      ...cs,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const current = localStore.getCurriculumSubjects();
    localStore.saveCurriculumSubjects([...current, newCs]);
    return newCs;
  },

  async removeCurriculumSubject(id: string): Promise<void> {
    const current = localStore.getCurriculumSubjects();
    localStore.saveCurriculumSubjects(current.filter((c) => c.id !== id));
  },

  // Enrollment Periods
  async getEnrollmentPeriods(): Promise<EnrollmentPeriod[]> {
    const periods = localStore.getEnrollmentPeriods();
    const ays = localStore.getAcademicYears();
    const sems = localStore.getSemesters();
    return periods.map((ep) => ({
      ...ep,
      academic_year: ays.find((a) => a.id === ep.academic_year_id),
      semester: sems.find((s) => s.id === ep.semester_id),
    }));
  },

  async createEnrollmentPeriod(ep: Omit<EnrollmentPeriod, 'id' | 'created_at' | 'updated_at'>): Promise<EnrollmentPeriod> {
    const newEp: EnrollmentPeriod = {
      ...ep,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const current = localStore.getEnrollmentPeriods();
    localStore.saveEnrollmentPeriods([...current, newEp]);
    return newEp;
  },

  async updateEnrollmentPeriodStatus(id: string, status: 'UPCOMING' | 'OPEN' | 'CLOSED'): Promise<void> {
    const current = localStore.getEnrollmentPeriods();
    localStore.saveEnrollmentPeriods(
      current.map((ep) => (ep.id === id ? { ...ep, status, updated_at: new Date().toISOString() } : ep))
    );
  },

  // Students & Staff
  async getStudents(): Promise<Student[]> {
    const students = localStore.getStudents();
    const profiles = localStore.getProfiles();
    const programs = localStore.getPrograms();
    const curricula = localStore.getCurricula();
    const yearLevels = localStore.getYearLevels();

    return students.map((s) => ({
      ...s,
      profile: profiles.find((p) => p.id === s.profile_id),
      program: programs.find((p) => p.id === s.program_id),
      curriculum: curricula.find((c) => c.id === s.curriculum_id),
      year_level: yearLevels.find((y) => y.id === s.year_level_id),
    }));
  },

  async getStudentByProfileId(profileId: string): Promise<Student | null> {
    const students = await this.getStudents();
    return students.find((s) => s.profile_id === profileId) || null;
  },

  async updateStudentStatus(studentId: string, status: StudentStatus, studentNumber?: string): Promise<Student> {
    const current = localStore.getStudents();
    const updated = current.map((s) =>
      s.id === studentId
        ? {
            ...s,
            student_status: status,
            student_number: studentNumber || s.student_number,
            updated_at: new Date().toISOString(),
          }
        : s
    );
    localStore.saveStudents(updated);
    const full = await this.getStudents();
    return full.find((s) => s.id === studentId)!;
  },

  async registerStudent(data: {
    student_number: string;
    full_name: string;
    email: string;
    password?: string;
    program_id?: string;
    year_level_id?: string;
    curriculum_id?: string;
    student_status?: StudentStatus;

    nickname?: string;
    date_of_birth?: string;
    age?: number | string;
    gender?: string;
    civil_status?: string;
    nationality?: string;
    present_address?: string;
    mobile_no?: string;
    occupation?: string;
    business_address?: string;
    business_tel_no?: string;
    school_graduated?: string;
    date_graduated?: string;
    degree_honors_awards?: string;

    character_reference_name?: string;
    character_reference_no?: string;
    emergency_contact_name?: string;
    emergency_address?: string;
    emergency_no?: string;
    emergency_relation?: string;

    home_church?: string;
    church_address?: string;
    pastor_name?: string;
    date_saved?: string;
    date_baptized?: string;
    ministries_involved?: string;
    special_skills?: string;
    musical_instruments?: string;

    reason_for_enrolling?: string;
    health_information?: string;
    brief_testimony?: string;
  }): Promise<Student> {
    const parts = data.full_name.trim().split(' ');
    const firstName = parts[0] || 'Student';
    const lastName = parts.length > 1 ? parts.slice(1).join(' ') : 'Applicant';

    const newProfileId = crypto.randomUUID();
    const newStudentId = crypto.randomUUID();

    const newProfile: Profile = {
      id: newProfileId,
      id_number: data.student_number || `BBC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      first_name: firstName,
      middle_name: null,
      last_name: lastName,
      email: data.email.trim().toLowerCase(),
      phone: data.mobile_no || null,
      role: 'STUDENT',
      profile_photo_url: null,
      is_active: true,
      login_status: 'OFFLINE',
      last_login_at: null,
      password: data.password || 'Student@Berean2026!',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const newStudent: Student = {
      id: newStudentId,
      profile_id: newProfileId,
      student_number: data.student_number || newProfile.id_number,
      program_id: data.program_id || '11111111-1111-1111-1111-111111111101',
      curriculum_id: data.curriculum_id || '55555555-5555-5555-5555-555555555501',
      year_level_id: data.year_level_id || '44444444-4444-4444-4444-444444444401',
      student_status: data.student_status || 'ENROLLED',
      admission_date: new Date().toISOString().split('T')[0],
      expected_graduation_date: null,
      graduation_date: null,

      nickname: data.nickname || null,
      date_of_birth: data.date_of_birth || null,
      age: data.age || null,
      gender: data.gender || null,
      civil_status: data.civil_status || null,
      nationality: data.nationality || 'Filipino',
      present_address: data.present_address || null,
      mobile_no: data.mobile_no || null,
      occupation: data.occupation || null,
      business_address: data.business_address || null,
      business_tel_no: data.business_tel_no || null,
      school_graduated: data.school_graduated || null,
      date_graduated: data.date_graduated || null,
      degree_honors_awards: data.degree_honors_awards || null,

      character_reference_name: data.character_reference_name || null,
      character_reference_no: data.character_reference_no || null,
      emergency_contact_name: data.emergency_contact_name || null,
      emergency_address: data.emergency_address || null,
      emergency_no: data.emergency_no || null,
      emergency_relation: data.emergency_relation || null,

      home_church: data.home_church || null,
      church_address: data.church_address || null,
      pastor_name: data.pastor_name || null,
      date_saved: data.date_saved || null,
      date_baptized: data.date_baptized || null,
      ministries_involved: data.ministries_involved || null,
      special_skills: data.special_skills || null,
      musical_instruments: data.musical_instruments || null,

      reason_for_enrolling: data.reason_for_enrolling || null,
      health_information: data.health_information || null,
      brief_testimony: data.brief_testimony || null,

      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save profile and student locally
    const currentProfiles = localStore.getProfiles();
    localStore.saveProfiles([...currentProfiles, newProfile]);

    const currentStudents = localStore.getStudents();
    localStore.saveStudents([...currentStudents, newStudent]);

    // Live Supabase sync
    if (isLiveSupabaseConfigured) {
      try {
        await supabase.from('profiles').insert([newProfile]);
        await supabase.from('students').insert([newStudent]);
      } catch (err) {
        console.warn('Live Supabase student insert warning:', err);
      }
    }

    await this.logAudit('REGISTER_STUDENT', 'students', newStudentId, null, {
      student_number: newStudent.student_number,
      name: data.full_name,
      email: data.email,
    });

    const all = await this.getStudents();
    return all.find((s) => s.id === newStudentId)!;
  },

  async updateStudent(studentId: string, data: Partial<Student> & { full_name?: string; email?: string }): Promise<Student> {
    const currentStudents = localStore.getStudents();
    const existing = currentStudents.find((s) => s.id === studentId);
    if (!existing) throw new Error('Student not found');

    const updatedStudent: Student = {
      ...existing,
      ...data,
      updated_at: new Date().toISOString(),
    };

    localStore.saveStudents(
      currentStudents.map((s) => (s.id === studentId ? updatedStudent : s))
    );

    // If profile info was provided, update profile as well
    if (data.full_name || data.email || data.mobile_no || data.student_number) {
      const profiles = localStore.getProfiles();
      const existingProfile = profiles.find((p) => p.id === existing.profile_id);
      if (existingProfile) {
        let firstName = existingProfile.first_name;
        let lastName = existingProfile.last_name;
        if (data.full_name) {
          const parts = data.full_name.trim().split(' ');
          firstName = parts[0] || firstName;
          lastName = parts.length > 1 ? parts.slice(1).join(' ') : lastName;
        }

        const updatedProfile: Profile = {
          ...existingProfile,
          first_name: firstName,
          last_name: lastName,
          email: data.email ? data.email.trim().toLowerCase() : existingProfile.email,
          phone: data.mobile_no !== undefined ? data.mobile_no : existingProfile.phone,
          id_number: data.student_number !== undefined ? data.student_number : existingProfile.id_number,
          updated_at: new Date().toISOString(),
        };

        localStore.saveProfiles(
          profiles.map((p) => (p.id === existing.profile_id ? updatedProfile : p))
        );
      }
    }

    await this.logAudit('UPDATE_STUDENT', 'students', studentId, existing, updatedStudent);
    const all = await this.getStudents();
    return all.find((s) => s.id === studentId)!;
  },

  async deleteStudent(studentId: string): Promise<void> {
    const currentStudents = localStore.getStudents();
    const target = currentStudents.find((s) => s.id === studentId);
    if (!target) return;

    localStore.saveStudents(currentStudents.filter((s) => s.id !== studentId));

    // Also remove or deactivate profile
    if (target.profile_id) {
      const profiles = localStore.getProfiles();
      localStore.saveProfiles(profiles.filter((p) => p.id !== target.profile_id));
    }

    // Clean enrollments
    const enrollments = localStore.getEnrollments();
    localStore.saveEnrollments(enrollments.filter((e) => e.student_id !== studentId));

    if (isLiveSupabaseConfigured) {
      try {
        await supabase.from('students').delete().eq('id', studentId);
        if (target.profile_id) {
          await supabase.from('profiles').delete().eq('id', target.profile_id);
        }
      } catch (err) {
        console.warn('Live Supabase student delete warning:', err);
      }
    }

    await this.logAudit('DELETE_STUDENT', 'students', studentId, target, null);
  },

  // Enrollments
  async getEnrollments(): Promise<Enrollment[]> {
    const enrollments = localStore.getEnrollments();
    const students = await this.getStudents();
    const ays = localStore.getAcademicYears();
    const sems = localStore.getSemesters();
    const profiles = localStore.getProfiles();
    const subjects = localStore.getSubjects();
    const enrSubjects = localStore.getEnrollmentSubjects();

    return enrollments.map((enr) => ({
      ...enr,
      student: students.find((s) => s.id === enr.student_id),
      academic_year: ays.find((a) => a.id === enr.academic_year_id),
      semester: sems.find((s) => s.id === enr.semester_id),
      reviewer_profile: profiles.find((p) => p.id === enr.reviewed_by),
      enrollment_subjects: enrSubjects
        .filter((es) => es.enrollment_id === enr.id)
        .map((es) => ({
          ...es,
          subject: subjects.find((s) => s.id === es.subject_id),
        })),
    }));
  },

  async getStudentEnrollments(studentId: string): Promise<Enrollment[]> {
    const all = await this.getEnrollments();
    return all.filter((e) => e.student_id === studentId);
  },

  async submitEnrollment(
    studentId: string,
    academicYearId: string,
    semesterId: string,
    enrollmentPeriodId: string | null,
    subjectIds: string[]
  ): Promise<Enrollment> {
    const subjects = localStore.getSubjects();
    const selectedSubjects = subjects.filter((s) => subjectIds.includes(s.id));
    const totalUnits = selectedSubjects.reduce((acc, curr) => acc + curr.units, 0);

    const enrollmentId = crypto.randomUUID();
    const newEnr: Enrollment = {
      id: enrollmentId,
      student_id: studentId,
      academic_year_id: academicYearId,
      semester_id: semesterId,
      enrollment_period_id: enrollmentPeriodId,
      status: 'SUBMITTED',
      total_units: totalUnits,
      submitted_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const newEnrSubjects: EnrollmentSubject[] = selectedSubjects.map((s) => ({
      id: crypto.randomUUID(),
      enrollment_id: enrollmentId,
      subject_id: s.id,
      units: s.units,
      status: 'ENROLLED',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // Update students state
    const currentStudents = localStore.getStudents();
    localStore.saveStudents(
      currentStudents.map((st) => (st.id === studentId ? { ...st, student_status: 'ENROLLED' as StudentStatus } : st))
    );

    // Save enrollments
    const enrollments = localStore.getEnrollments();
    localStore.saveEnrollments([...enrollments, newEnr]);

    const enrSubjects = localStore.getEnrollmentSubjects();
    localStore.saveEnrollmentSubjects([...enrSubjects, ...newEnrSubjects]);

    // Record audit log
    await this.logAudit('SUBMIT_ENROLLMENT', 'enrollments', enrollmentId, null, newEnr);

    return newEnr;
  },

  async reviewEnrollment(
    enrollmentId: string,
    status: EnrollmentStatus,
    reviewerId: string,
    remarks?: string
  ): Promise<Enrollment> {
    const enrollments = localStore.getEnrollments();
    const updated = enrollments.map((e) =>
      e.id === enrollmentId
        ? {
            ...e,
            status,
            reviewed_at: new Date().toISOString(),
            reviewed_by: reviewerId,
            remarks: remarks || e.remarks,
            updated_at: new Date().toISOString(),
          }
        : e
    );
    localStore.saveEnrollments(updated);

    const target = updated.find((e) => e.id === enrollmentId);
    if (target && status === 'APPROVED') {
      const students = localStore.getStudents();
      localStore.saveStudents(
        students.map((s) => (s.id === target.student_id ? { ...s, student_status: 'ENROLLED' } : s))
      );
    }

    await this.logAudit('REVIEW_ENROLLMENT', 'enrollments', enrollmentId, null, { status, remarks });
    const full = await this.getEnrollments();
    return full.find((e) => e.id === enrollmentId)!;
  },

  // Grades & Academic History
  async getGrades(studentId?: string): Promise<Grade[]> {
    const grades = localStore.getGrades();
    const profiles = localStore.getProfiles();
    const enrSubjects = localStore.getEnrollmentSubjects();
    const subjects = localStore.getSubjects();

    const filtered = studentId ? grades.filter((g) => g.student_id === studentId) : grades;

    return filtered.map((g) => {
      const es = enrSubjects.find((item) => item.id === g.enrollment_subject_id);
      return {
        ...g,
        entered_by_profile: profiles.find((p) => p.id === g.entered_by),
        enrollment_subject: es
          ? {
              ...es,
              subject: subjects.find((s) => s.id === es.subject_id),
            }
          : undefined,
      };
    });
  },

  async saveGrade(
    enrollmentSubjectId: string,
    studentId: string,
    gradeVal: number,
    remarks: string,
    enteredBy: string,
    status: 'DRAFT' | 'SUBMITTED' | 'RELEASED' = 'RELEASED'
  ): Promise<Grade> {
    const grades = localStore.getGrades();
    const existing = grades.find((g) => g.enrollment_subject_id === enrollmentSubjectId);

    let result: Grade;
    if (existing) {
      result = {
        ...existing,
        grade: gradeVal,
        remarks,
        status,
        released_at: status === 'RELEASED' ? new Date().toISOString() : existing.released_at,
        entered_by: enteredBy,
        updated_at: new Date().toISOString(),
      };
      localStore.saveGrades(grades.map((g) => (g.id === existing.id ? result : g)));
    } else {
      result = {
        id: crypto.randomUUID(),
        student_id: studentId,
        enrollment_subject_id: enrollmentSubjectId,
        grade: gradeVal,
        remarks,
        status,
        released_at: status === 'RELEASED' ? new Date().toISOString() : null,
        entered_by: enteredBy,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      localStore.saveGrades([...grades, result]);
    }

    await this.logAudit('ENTER_GRADE', 'grades', result.id, existing, result);
    return result;
  },

  // Alumni
  async getAlumniProfiles(): Promise<AlumniProfile[]> {
    const alumni = localStore.getAlumniProfiles();
    const profiles = localStore.getProfiles();
    const students = await this.getStudents();

    return alumni.map((a) => ({
      ...a,
      profile: profiles.find((p) => p.id === a.profile_id),
      student: students.find((s) => s.id === a.student_id),
    }));
  },

  async getAlumniByProfileId(profileId: string): Promise<AlumniProfile | null> {
    const list = await this.getAlumniProfiles();
    return list.find((a) => a.profile_id === profileId) || null;
  },

  async updateAlumniProfile(profileId: string, data: Partial<AlumniProfile>): Promise<AlumniProfile> {
    const alumni = localStore.getAlumniProfiles();
    const updated = alumni.map((a) =>
      a.profile_id === profileId ? { ...a, ...data, updated_at: new Date().toISOString() } : a
    );
    localStore.saveAlumniProfiles(updated);
    const list = await this.getAlumniProfiles();
    return list.find((a) => a.profile_id === profileId)!;
  },

  // Student Documents
  async getStudentDocuments(studentId: string): Promise<StudentDocument[]> {
    const docs = localStore.getDocuments().filter((d) => d.student_id === studentId);
    const profiles = localStore.getProfiles();
    return docs.map((d) => ({
      ...d,
      verifier_profile: profiles.find((p) => p.id === d.verified_by),
    }));
  },

  async uploadStudentDocument(
    doc: Omit<StudentDocument, 'id' | 'created_at' | 'updated_at' | 'verification_status'>
  ): Promise<StudentDocument> {
    const newDoc: StudentDocument = {
      ...doc,
      id: crypto.randomUUID(),
      verification_status: 'PENDING',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const current = localStore.getDocuments();
    localStore.saveDocuments([...current, newDoc]);
    return newDoc;
  },

  async verifyDocument(
    docId: string,
    status: 'VERIFIED' | 'REJECTED',
    verifierId: string,
    remarks?: string
  ): Promise<void> {
    const current = localStore.getDocuments();
    localStore.saveDocuments(
      current.map((d) =>
        d.id === docId
          ? {
              ...d,
              verification_status: status,
              verified_by: verifierId,
              verified_at: new Date().toISOString(),
              remarks: remarks || d.remarks,
              updated_at: new Date().toISOString(),
            }
          : d
      )
    );
  },

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    const announcements = localStore.getAnnouncements();
    const profiles = localStore.getProfiles();
    return announcements
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .map((ann) => ({
        ...ann,
        author: profiles.find((p) => p.id === ann.author_id),
      }));
  },

  async createAnnouncement(
    ann: Omit<Announcement, 'id' | 'created_at' | 'updated_at' | 'published_at'>
  ): Promise<Announcement> {
    const newAnn: Announcement = {
      ...ann,
      id: crypto.randomUUID(),
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const current = localStore.getAnnouncements();
    localStore.saveAnnouncements([newAnn, ...current]);
    await this.logAudit('CREATE_ANNOUNCEMENT', 'announcements', newAnn.id, null, newAnn);
    return newAnn;
  },

  // Notifications
  async getNotifications(profileId: string): Promise<Notification[]> {
    return localStore
      .getNotifications()
      .filter((n) => n.user_id === profileId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async markNotificationRead(id: string): Promise<void> {
    const current = localStore.getNotifications();
    localStore.saveNotifications(
      current.map((n) => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
    );
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    const logs = localStore.getAuditLogs();
    const profiles = localStore.getProfiles();
    return logs
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map((l) => ({
        ...l,
        user: profiles.find((p) => p.id === l.user_id),
      }));
  },

  async logAudit(
    action: string,
    entity: string,
    entityId: string | null,
    previousData: unknown,
    newData: unknown
  ): Promise<void> {
    const newLog: AuditLog = {
      id: crypto.randomUUID(),
      action,
      entity,
      entity_id: entityId,
      previous_data: previousData as Record<string, unknown>,
      new_data: newData as Record<string, unknown>,
      created_at: new Date().toISOString(),
    };
    const logs = localStore.getAuditLogs();
    localStore.saveAuditLogs([newLog, ...logs]);
  },

  // ==========================================
  // USER ACCOUNT LIST & MANAGEMENT (ADMIN)
  // ==========================================
  async getAccounts(): Promise<Profile[]> {
    const profiles = localStore.getProfiles();
    const students = localStore.getStudents();
    const staff = localStore.getStaff();

    return profiles.map((p) => {
      let idNum = p.id_number;
      if (!idNum) {
        if (p.role === 'STUDENT' || p.role === 'ALUMNI') {
          const std = students.find((s) => s.profile_id === p.id);
          idNum = std?.student_number || null;
        } else if (p.role === 'STAFF') {
          const stf = staff.find((s) => s.profile_id === p.id);
          idNum = stf?.employee_number || null;
        }
      }
      return {
        ...p,
        id_number: idNum || (p.role === 'ADMIN' ? 'ADM-2024-001' : 'N/A'),
      };
    });
  },

  async createAccount(data: {
    id_number: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    is_active: boolean;
    programId?: string;
    yearLevelId?: string;
    department?: string;
    title?: string;
  }): Promise<Profile> {
    const newProfileId = crypto.randomUUID();
    const cleanEmail = data.email.trim().toLowerCase();

    const newProfile: Profile = {
      id: newProfileId,
      id_number: data.id_number.trim(),
      first_name: data.first_name.trim(),
      middle_name: data.middle_name ? data.middle_name.trim() : null,
      last_name: data.last_name.trim(),
      email: cleanEmail,
      phone: data.phone || null,
      role: data.role,
      profile_photo_url: null,
      is_active: data.is_active,
      login_status: 'OFFLINE',
      last_login_at: null,
      password: data.password || 'Berean2026!',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const profiles = localStore.getProfiles();
    localStore.saveProfiles([newProfile, ...profiles]);

    // Role-specific complementary records
    if (data.role === 'STUDENT' || data.role === 'ALUMNI') {
      const newStudent: Student = {
        id: crypto.randomUUID(),
        profile_id: newProfileId,
        student_number: data.id_number.trim(),
        program_id: data.programId || '11111111-1111-1111-1111-111111111101',
        curriculum_id: '55555555-5555-5555-5555-555555555501',
        year_level_id: data.yearLevelId || '44444444-4444-4444-4444-444444444401',
        student_status: data.role === 'ALUMNI' ? 'ALUMNI' : 'ACTIVE',
        admission_date: new Date().toISOString().split('T')[0],
        expected_graduation_date: null,
        graduation_date: data.role === 'ALUMNI' ? new Date().toISOString().split('T')[0] : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const students = localStore.getStudents();
      localStore.saveStudents([...students, newStudent]);

      if (data.role === 'ALUMNI') {
        const alumniProfile: AlumniProfile = {
          id: crypto.randomUUID(),
          student_id: newStudent.id,
          profile_id: newProfileId,
          graduation_year: new Date().getFullYear(),
          graduation_date: new Date().toISOString().split('T')[0],
          degree_conferred: 'Bachelor of Theology',
          email: cleanEmail,
          phone: data.phone || null,
          is_directory_visible: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const alumniProfiles = localStore.getAlumniProfiles();
        localStore.saveAlumniProfiles([...alumniProfiles, alumniProfile]);
      }
    } else if (data.role === 'STAFF') {
      const newStaff: Staff = {
        id: crypto.randomUUID(),
        profile_id: newProfileId,
        employee_number: data.id_number.trim(),
        department: data.department || 'Office of the Registrar',
        title: data.title || 'Staff Officer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const staffList = localStore.getStaff();
      localStore.saveStaff([...staffList, newStaff]);
    }

    await this.logAudit('CREATE_USER_ACCOUNT', 'profiles', newProfileId, null, {
      id_number: data.id_number,
      email: cleanEmail,
      role: data.role,
      name: `${data.first_name} ${data.last_name}`,
    });

    return newProfile;
  },

  async updateAccount(id: string, updates: Partial<Profile>): Promise<Profile> {
    const profiles = localStore.getProfiles();
    const target = profiles.find((p) => p.id === id);
    if (!target) throw new Error('Account not found');

    const updated = profiles.map((p) =>
      p.id === id
        ? {
            ...p,
            ...updates,
            updated_at: new Date().toISOString(),
          }
        : p
    );
    localStore.saveProfiles(updated);

    if (updates.id_number) {
      if (target.role === 'STUDENT' || target.role === 'ALUMNI') {
        const students = localStore.getStudents();
        localStore.saveStudents(
          students.map((s) => (s.profile_id === id ? { ...s, student_number: updates.id_number! } : s))
        );
      } else if (target.role === 'STAFF') {
        const staff = localStore.getStaff();
        localStore.saveStaff(
          staff.map((st) => (st.profile_id === id ? { ...st, employee_number: updates.id_number! } : st))
        );
      }
    }

    await this.logAudit('UPDATE_USER_ACCOUNT', 'profiles', id, target, updates);
    return updated.find((p) => p.id === id)!;
  },

  async toggleAccountStatus(id: string, is_active: boolean): Promise<Profile> {
    return this.updateAccount(id, { is_active });
  },

  async resetAccountPassword(id: string, newPassword: string): Promise<Profile> {
    return this.updateAccount(id, { password: newPassword });
  },

  async deleteAccount(id: string): Promise<void> {
    const profiles = localStore.getProfiles();
    const target = profiles.find((p) => p.id === id);
    localStore.saveProfiles(profiles.filter((p) => p.id !== id));
    if (target?.role === 'STUDENT' || target?.role === 'ALUMNI') {
      const students = localStore.getStudents();
      localStore.saveStudents(students.filter((s) => s.profile_id !== id));
    } else if (target?.role === 'STAFF') {
      const staff = localStore.getStaff();
      localStore.saveStaff(staff.filter((s) => s.profile_id !== id));
    }
    await this.logAudit('DELETE_USER_ACCOUNT', 'profiles', id, target, null);
  },

  // ==========================================
  // USER SELF-SERVICE PROFILE UPDATE
  // (Allowed fields: first_name, last_name, email, phone, profile_photo_url)
  // ==========================================
  async updateMyProfile(
    userId: string,
    data: {
      first_name: string;
      last_name: string;
      email: string;
      phone?: string | null;
      profile_photo_url?: string | null;
    }
  ): Promise<Profile> {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanFirstName = data.first_name.trim();
    const cleanLastName = data.last_name.trim();

    if (!cleanFirstName || !cleanLastName) {
      throw new Error('First and last name are required.');
    }
    if (!cleanEmail) {
      throw new Error('Email address is required.');
    }

    // Try live Supabase if configured
    if (isLiveSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            first_name: cleanFirstName,
            last_name: cleanLastName,
            email: cleanEmail,
            phone: data.phone || null,
            profile_photo_url: data.profile_photo_url || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);
        if (error) console.warn('Supabase profile update warning:', error);
      } catch (err) {
        console.warn('Supabase remote update failed, persisting locally:', err);
      }
    }

    const profiles = localStore.getProfiles();
    const target = profiles.find((p) => p.id === userId);
    if (!target) throw new Error('Account profile not found.');

    const updatedProfile: Profile = {
      ...target,
      first_name: cleanFirstName,
      last_name: cleanLastName,
      email: cleanEmail,
      phone: data.phone !== undefined ? data.phone : target.phone,
      profile_photo_url:
        data.profile_photo_url !== undefined ? data.profile_photo_url : target.profile_photo_url,
      updated_at: new Date().toISOString(),
    };

    localStore.saveProfiles(
      profiles.map((p) => (p.id === userId ? updatedProfile : p))
    );

    // Synchronize complementary student record if applicable
    if (target.role === 'STUDENT' || target.role === 'ALUMNI') {
      const students = localStore.getStudents();
      localStore.saveStudents(
        students.map((s) => {
          if (s.profile_id === userId) {
            return {
              ...s,
              mobile_no: data.phone || s.mobile_no,
              profile: updatedProfile,
              updated_at: new Date().toISOString(),
            };
          }
          return s;
        })
      );

      if (target.role === 'ALUMNI') {
        const alumniProfiles = localStore.getAlumniProfiles();
        localStore.saveAlumniProfiles(
          alumniProfiles.map((a) => {
            if (a.profile_id === userId) {
              return {
                ...a,
                email: cleanEmail,
                phone: data.phone || a.phone,
                updated_at: new Date().toISOString(),
              };
            }
            return a;
          })
        );
      }
    }

    await this.logAudit('UPDATE_SELF_PROFILE', 'profiles', userId, target, {
      first_name: cleanFirstName,
      last_name: cleanLastName,
      email: cleanEmail,
      phone: data.phone,
      has_photo: !!data.profile_photo_url,
    });

    return updatedProfile;
  },
};
