import React, { useState, useEffect } from 'react';
import { api, localStore } from '@/lib/supabase';
import { Student, StudentStatus, Program, YearLevel, Curriculum, AlumniProfile } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import {
  Search,
  Users,
  Award,
  CheckCircle,
  Edit2,
  Trash2,
  Eye,
  UserPlus,
  Info,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Building,
  GraduationCap,
  BookOpen,
  Church,
  Lock,
  HeartHandshake,
  HeartPulse,
  FileText,
  Music,
  Sparkles,
  X,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const StudentsManagementPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [yearLevels, setYearLevels] = useState<YearLevel[]>([]);
  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  // Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Status Dialog State
  const [newStatus, setNewStatus] = useState<StudentStatus>('ACTIVE');
  const [assignedStudentNumber, setAssignedStudentNumber] = useState('');
  const [graduationYear, setGraduationYear] = useState<number>(2026);
  const [graduationDate, setGraduationDate] = useState<string>('2026-05-25');

  // Form State for Register / Edit
  const [formData, setFormData] = useState({
    // Header & Essential
    student_number: '',
    full_name: '',
    email: '',
    password: '',
    program_id: '',
    year_level_id: '',
    curriculum_id: '',
    student_status: 'ENROLLED' as StudentStatus,

    // Personal Information
    nickname: '',
    date_of_birth: '',
    age: '',
    gender: 'Male',
    civil_status: 'Single',
    nationality: 'Filipino',
    present_address: '',
    mobile_no: '',
    occupation: '',
    business_address: '',
    business_tel_no: '',
    school_graduated: '',
    date_graduated: '',
    degree_honors_awards: '',

    // Character & Emergency Reference
    character_reference_name: '',
    character_reference_no: '',
    emergency_contact_name: '',
    emergency_address: '',
    emergency_no: '',
    emergency_relation: '',

    // Spiritual / Church Background
    home_church: '',
    church_address: '',
    pastor_name: '',
    date_saved: '',
    date_baptized: '',
    ministries_involved: '',
    special_skills: '',
    musical_instruments: '',

    // Personal Statements
    reason_for_enrolling: '',
    health_information: '',
    brief_testimony: '',
  });

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [stds, progs, yls, currs] = await Promise.all([
        api.getStudents(),
        api.getPrograms(),
        api.getYearLevels(),
        api.getCurricula(),
      ]);
      setStudents(stds);
      setPrograms(progs);
      setYearLevels(yls);
      setCurricula(currs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getNextStudentNumber = (currentList: Student[]) => {
    // Generate sequential auto ID matching "# Student No. (Auto)" pattern
    const year = new Date().getFullYear();
    const count = currentList.length + 1;
    const padded = String(count).padStart(4, '0');
    return padded;
  };

  const handleOpenRegister = () => {
    const autoNumber = getNextStudentNumber(students);
    setFormData({
      student_number: autoNumber,
      full_name: '',
      email: '',
      password: 'Student@Berean2026!',
      program_id: programs[0]?.id || '',
      year_level_id: yearLevels[0]?.id || '',
      curriculum_id: curricula[0]?.id || '',
      student_status: 'ENROLLED',

      nickname: '',
      date_of_birth: '',
      age: '',
      gender: 'Male',
      civil_status: 'Single',
      nationality: 'Filipino',
      present_address: '',
      mobile_no: '',
      occupation: '',
      business_address: '',
      business_tel_no: '',
      school_graduated: '',
      date_graduated: '',
      degree_honors_awards: '',

      character_reference_name: '',
      character_reference_no: '',
      emergency_contact_name: '',
      emergency_address: '',
      emergency_no: '',
      emergency_relation: '',

      home_church: '',
      church_address: '',
      pastor_name: '',
      date_saved: '',
      date_baptized: '',
      ministries_involved: '',
      special_skills: '',
      musical_instruments: '',

      reason_for_enrolling: '',
      health_information: '',
      brief_testimony: '',
    });
    setFormError(null);
    setIsRegisterOpen(true);
  };

  const handleOpenEdit = (s: Student) => {
    setSelectedStudent(s);
    setFormData({
      student_number: s.student_number || '',
      full_name: s.profile ? `${s.profile.first_name} ${s.profile.last_name}` : '',
      email: s.profile?.email || '',
      password: '',
      program_id: s.program_id || programs[0]?.id || '',
      year_level_id: s.year_level_id || yearLevels[0]?.id || '',
      curriculum_id: s.curriculum_id || curricula[0]?.id || '',
      student_status: s.student_status,

      nickname: s.nickname || '',
      date_of_birth: s.date_of_birth || '',
      age: s.age ? String(s.age) : '',
      gender: s.gender || 'Male',
      civil_status: s.civil_status || 'Single',
      nationality: s.nationality || 'Filipino',
      present_address: s.present_address || '',
      mobile_no: s.mobile_no || s.profile?.phone || '',
      occupation: s.occupation || '',
      business_address: s.business_address || '',
      business_tel_no: s.business_tel_no || '',
      school_graduated: s.school_graduated || '',
      date_graduated: s.date_graduated || '',
      degree_honors_awards: s.degree_honors_awards || '',

      character_reference_name: s.character_reference_name || '',
      character_reference_no: s.character_reference_no || '',
      emergency_contact_name: s.emergency_contact_name || '',
      emergency_address: s.emergency_address || '',
      emergency_no: s.emergency_no || '',
      emergency_relation: s.emergency_relation || '',

      home_church: s.home_church || '',
      church_address: s.church_address || '',
      pastor_name: s.pastor_name || '',
      date_saved: s.date_saved || '',
      date_baptized: s.date_baptized || '',
      ministries_involved: s.ministries_involved || '',
      special_skills: s.special_skills || '',
      musical_instruments: s.musical_instruments || '',

      reason_for_enrolling: s.reason_for_enrolling || '',
      health_information: s.health_information || '',
      brief_testimony: s.brief_testimony || '',
    });
    setFormError(null);
    setIsEditOpen(true);
  };

  const handleOpenView = (s: Student) => {
    setSelectedStudent(s);
    setIsViewOpen(true);
  };

  const handleDeleteStudent = async (s: Student) => {
    const studentName = s.profile ? `${s.profile.first_name} ${s.profile.last_name}` : 'this student';
    if (window.confirm(`Are you sure you want to permanently delete ${studentName} (${s.student_number || 'No ID'}) from the student records?`)) {
      try {
        await api.deleteStudent(s.id);
        setNotification(`Successfully deleted ${studentName}.`);
        setTimeout(() => setNotification(null), 3500);
        await loadData();
      } catch (err: unknown) {
        alert((err as Error).message || 'Failed to delete student.');
      }
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.full_name.trim()) {
      setFormError('Full Name is required.');
      return;
    }

    if (!formData.email.trim()) {
      setFormError('Email Address is required.');
      return;
    }

    setFormSubmitting(true);
    try {
      await api.registerStudent({
        student_number: formData.student_number.trim(),
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        password: formData.password.trim() || 'Student@Berean2026!',
        program_id: formData.program_id,
        year_level_id: formData.year_level_id,
        curriculum_id: formData.curriculum_id,
        student_status: formData.student_status,

        nickname: formData.nickname.trim() || undefined,
        date_of_birth: formData.date_of_birth || undefined,
        age: formData.age ? Number(formData.age) : undefined,
        gender: formData.gender,
        civil_status: formData.civil_status,
        nationality: formData.nationality.trim(),
        present_address: formData.present_address.trim() || undefined,
        mobile_no: formData.mobile_no.trim() || undefined,
        occupation: formData.occupation.trim() || undefined,
        business_address: formData.business_address.trim() || undefined,
        business_tel_no: formData.business_tel_no.trim() || undefined,
        school_graduated: formData.school_graduated.trim() || undefined,
        date_graduated: formData.date_graduated || undefined,
        degree_honors_awards: formData.degree_honors_awards.trim() || undefined,

        character_reference_name: formData.character_reference_name.trim() || undefined,
        character_reference_no: formData.character_reference_no.trim() || undefined,
        emergency_contact_name: formData.emergency_contact_name.trim() || undefined,
        emergency_address: formData.emergency_address.trim() || undefined,
        emergency_no: formData.emergency_no.trim() || undefined,
        emergency_relation: formData.emergency_relation.trim() || undefined,

        home_church: formData.home_church.trim() || undefined,
        church_address: formData.church_address.trim() || undefined,
        pastor_name: formData.pastor_name.trim() || undefined,
        date_saved: formData.date_saved || undefined,
        date_baptized: formData.date_baptized || undefined,
        ministries_involved: formData.ministries_involved.trim() || undefined,
        special_skills: formData.special_skills.trim() || undefined,
        musical_instruments: formData.musical_instruments.trim() || undefined,

        reason_for_enrolling: formData.reason_for_enrolling.trim() || undefined,
        health_information: formData.health_information.trim() || undefined,
        brief_testimony: formData.brief_testimony.trim() || undefined,
      });

      setIsRegisterOpen(false);
      setNotification(`Student ${formData.full_name} successfully registered with Student ID ${formData.student_number}.`);
      setTimeout(() => setNotification(null), 4000);
      await loadData();
    } catch (err: unknown) {
      setFormError((err as Error).message || 'Failed to register new student.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setFormError(null);

    setFormSubmitting(true);
    try {
      await api.updateStudent(selectedStudent.id, {
        student_number: formData.student_number.trim(),
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        program_id: formData.program_id,
        year_level_id: formData.year_level_id,
        curriculum_id: formData.curriculum_id,
        student_status: formData.student_status,

        nickname: formData.nickname.trim() || null,
        date_of_birth: formData.date_of_birth || null,
        age: formData.age ? Number(formData.age) : null,
        gender: formData.gender,
        civil_status: formData.civil_status,
        nationality: formData.nationality.trim(),
        present_address: formData.present_address.trim() || null,
        mobile_no: formData.mobile_no.trim() || null,
        occupation: formData.occupation.trim() || null,
        business_address: formData.business_address.trim() || null,
        business_tel_no: formData.business_tel_no.trim() || null,
        school_graduated: formData.school_graduated.trim() || null,
        date_graduated: formData.date_graduated || null,
        degree_honors_awards: formData.degree_honors_awards.trim() || null,

        character_reference_name: formData.character_reference_name.trim() || null,
        character_reference_no: formData.character_reference_no.trim() || null,
        emergency_contact_name: formData.emergency_contact_name.trim() || null,
        emergency_address: formData.emergency_address.trim() || null,
        emergency_no: formData.emergency_no.trim() || null,
        emergency_relation: formData.emergency_relation.trim() || null,

        home_church: formData.home_church.trim() || null,
        church_address: formData.church_address.trim() || null,
        pastor_name: formData.pastor_name.trim() || null,
        date_saved: formData.date_saved || null,
        date_baptized: formData.date_baptized || null,
        ministries_involved: formData.ministries_involved.trim() || null,
        special_skills: formData.special_skills.trim() || null,
        musical_instruments: formData.musical_instruments.trim() || null,

        reason_for_enrolling: formData.reason_for_enrolling.trim() || null,
        health_information: formData.health_information.trim() || null,
        brief_testimony: formData.brief_testimony.trim() || null,
      });

      setIsEditOpen(false);
      setNotification(`Student details for ${formData.full_name} updated successfully.`);
      setTimeout(() => setNotification(null), 4000);
      await loadData();
    } catch (err: unknown) {
      setFormError((err as Error).message || 'Failed to update student.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleOpenStatusModal = (s: Student) => {
    setSelectedStudent(s);
    setNewStatus(s.student_status);
    setAssignedStudentNumber(s.student_number || `BBC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setIsStatusModalOpen(true);
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    // Update student status & number
    await api.updateStudentStatus(
      selectedStudent.id,
      newStatus,
      assignedStudentNumber || undefined
    );

    // If graduated or alumni, preserve record and ensure alumni_profiles entry!
    if (newStatus === 'GRADUATED' || newStatus === 'ALUMNI') {
      const existingAlumni = await api.getAlumniByProfileId(selectedStudent.profile_id);
      if (!existingAlumni) {
        const newAlumni: AlumniProfile = {
          id: crypto.randomUUID(),
          student_id: selectedStudent.id,
          profile_id: selectedStudent.profile_id,
          graduation_year: Number(graduationYear),
          graduation_date: graduationDate,
          degree_conferred: selectedStudent.program?.name || 'Bachelor of Theology',
          employer: null,
          position: null,
          ministry_involvement: null,
          industry: 'Christian Ministry',
          location: 'Philippines',
          phone: selectedStudent.profile?.phone || null,
          email: selectedStudent.profile?.email || null,
          linkedin_url: null,
          bio: 'Berean Bible College Alumnus in Christian Ministry.',
          is_directory_visible: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const currentAlumni = localStore.getAlumniProfiles();
        localStore.saveAlumniProfiles([...currentAlumni, newAlumni]);

        // Update profile role to ALUMNI
        const profiles = localStore.getProfiles();
        localStore.saveProfiles(
          profiles.map((p) =>
            p.id === selectedStudent.profile_id ? { ...p, role: 'ALUMNI' } : p
          )
        );
      }
    }

    setIsStatusModalOpen(false);
    setNotification(`Updated status for ${selectedStudent.profile?.first_name} ${selectedStudent.profile?.last_name}.`);
    setTimeout(() => setNotification(null), 3500);
    await loadData();
  };

  const filtered = students.filter((s) => {
    const fullName = `${s.profile?.first_name || ''} ${s.profile?.last_name || ''}`.toLowerCase();
    const email = (s.profile?.email || '').toLowerCase();
    const snum = (s.student_number || '').toLowerCase();
    const query = search.toLowerCase();

    const matchesSearch = fullName.includes(query) || email.includes(query) || snum.includes(query);
    const matchesStatus = statusFilter === 'ALL' || s.student_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: StudentStatus) => {
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
      case 'ON_LEAVE':
      case 'SUSPENDED':
      case 'WITHDRAWN':
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg shadow-sm flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-950 font-serif">
            Student List
          </h1>
          <p className="text-sm text-slate-500">
            Berean Bible Baptist College &bull; Official Student Directory & Admissions
          </p>
        </div>
        <div>
          <Button
            onClick={handleOpenRegister}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-sm flex items-center"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Register Student
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input
              placeholder="Search by student name, email, or student number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          <div className="w-full sm:w-60">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="ENROLLED">ENROLLED</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="APPLICANT">APPLICANT</option>
              <option value="PENDING_VERIFICATION">PENDING VERIFICATION</option>
              <option value="GRADUATED">GRADUATED</option>
              <option value="ALUMNI">ALUMNI</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Students Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Student ID</th>
                  <th className="px-4 py-3 font-semibold">Student Name</th>
                  <th className="px-4 py-3 font-semibold">Degree Program</th>
                  <th className="px-4 py-3 font-semibold">Curriculum</th>
                  <th className="px-4 py-3 font-semibold">Contact / Phone</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                      Loading student directory...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                      No registered students found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-xs border border-slate-200">
                          {s.student_number || <span className="text-amber-700 italic">Pending ID</span>}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        <div className="font-semibold text-slate-900 text-sm">
                          {s.profile?.first_name} {s.profile?.last_name}
                        </div>
                        <div className="text-[11px] text-slate-400">{s.profile?.email}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        <div className="font-medium">{s.program?.code || 'BTH'}</div>
                        <div className="text-[11px] text-slate-400">{s.program?.name || 'Bachelor of Theology'}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {s.curriculum?.name || 'Standard 2026'}
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">
                        {s.mobile_no || s.profile?.phone || '—'}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(s.student_status)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenView(s)}
                            title="View Full Profile"
                            className="h-7 px-2 text-slate-600 hover:text-blue-900 hover:bg-blue-50"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(s)}
                            title="Edit Student Info"
                            className="h-7 px-2 text-slate-600 hover:text-amber-800 hover:bg-amber-50"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenStatusModal(s)}
                            title="Lifecycle Status"
                            className="h-7 px-2 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50"
                          >
                            <Award className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteStudent(s)}
                            title="Delete Student Record"
                            className="h-7 px-2 text-slate-400 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* REGISTER / EDIT STUDENT MODAL (EXACT FORM FIELDS AS PICTURED)             */}
      {/* ========================================================================= */}
      {(isRegisterOpen || isEditOpen) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-6 overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-900">
              <div className="flex items-center space-x-2.5">
                <UserPlus className="w-5 h-5 text-emerald-200" />
                <h2 className="text-lg font-bold">
                  {isRegisterOpen ? 'Register New Student' : 'Edit Student Information'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsRegisterOpen(false);
                  setIsEditOpen(false);
                }}
                className="text-emerald-200 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Instruction banner */}
            <div className="mx-6 mt-6 p-3 bg-sky-50 border border-sky-200 rounded-lg flex items-center space-x-2 text-sky-800 text-xs">
              <Info className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Fill in the student information below. Fields marked with <span className="text-red-500 font-bold">*</span> are required.</span>
            </div>

            {formError && (
              <div className="mx-6 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                {formError}
              </div>
            )}

            {/* Form Body */}
            <form onSubmit={isRegisterOpen ? handleRegisterSubmit : handleEditSubmit} className="p-6 space-y-6">
              {/* Row 1: Student No. (Auto) & Full Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                    <span className="font-mono mr-1">#</span> Student No. (Auto)
                  </label>
                  <Input
                    value={formData.student_number}
                    onChange={(e) => setFormData({ ...formData, student_number: e.target.value })}
                    placeholder="0003"
                    className="h-10 bg-slate-50 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1 text-slate-600" />
                    Full Name <span className="text-red-500 ml-1">*</span>
                  </label>
                  <Input
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Enter full name"
                    className="h-10"
                  />
                </div>
              </div>

              {/* Row 2: Nickname & Date of Birth */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                    <FileText className="w-3.5 h-3.5 mr-1 text-slate-600" />
                    Nickname
                  </label>
                  <Input
                    value={formData.nickname}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    placeholder="Enter nickname"
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-600" />
                    Date of Birth <span className="text-red-500 ml-1">*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    className="h-10"
                  />
                </div>
              </div>

              {/* Row 3: Age & Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                    <span className="font-mono text-xs mr-1">123</span>
                    Age <span className="text-red-500 ml-1">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="Enter age"
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1 text-slate-600" />
                    Gender <span className="text-red-500 ml-1">*</span>
                  </label>
                  <Select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="h-10 text-xs"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Select>
                </div>
              </div>

              {/* Row 4: Civil Status & Nationality */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                    <HeartHandshake className="w-3.5 h-3.5 mr-1 text-slate-600" />
                    Civil Status
                  </label>
                  <Input
                    value={formData.civil_status}
                    onChange={(e) => setFormData({ ...formData, civil_status: e.target.value })}
                    placeholder="e.g., Single, Married"
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-600" />
                    Nationality
                  </label>
                  <Input
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    placeholder="Filipino"
                    className="h-10"
                  />
                </div>
              </div>

              {/* Row 5: Present Address (Full width) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-600" />
                  Present Address
                </label>
                <Input
                  value={formData.present_address}
                  onChange={(e) => setFormData({ ...formData, present_address: e.target.value })}
                  placeholder="Enter complete address"
                  className="h-10"
                />
              </div>

              {/* Row 6: Mobile No. & Occupation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-1 text-slate-600" />
                    Mobile No.
                  </label>
                  <Input
                    value={formData.mobile_no}
                    onChange={(e) => setFormData({ ...formData, mobile_no: e.target.value })}
                    placeholder="e.g., 0912-345-6789"
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                    <Building className="w-3.5 h-3.5 mr-1 text-slate-600" />
                    Occupation
                  </label>
                  <Input
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    placeholder="Enter occupation"
                    className="h-10"
                  />
                </div>
              </div>

              {/* Row 7: Business/Company Address (Full width) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                  <Building className="w-3.5 h-3.5 mr-1 text-slate-600" />
                  Business/Company Address
                </label>
                <Input
                  value={formData.business_address}
                  onChange={(e) => setFormData({ ...formData, business_address: e.target.value })}
                  placeholder="Enter business address"
                  className="h-10"
                />
              </div>

              {/* Row 8: Business Tel No. & School Graduated */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-1 text-slate-600" />
                    Business Tel No.
                  </label>
                  <Input
                    value={formData.business_tel_no}
                    onChange={(e) => setFormData({ ...formData, business_tel_no: e.target.value })}
                    placeholder="e.g., 02-123-4567"
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                    <GraduationCap className="w-3.5 h-3.5 mr-1 text-slate-600" />
                    School Graduated
                  </label>
                  <Input
                    value={formData.school_graduated}
                    onChange={(e) => setFormData({ ...formData, school_graduated: e.target.value })}
                    placeholder="Enter school name"
                    className="h-10"
                  />
                </div>
              </div>

              {/* Row 9: Date Graduated */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-600" />
                  Date Graduated
                </label>
                <Input
                  type="date"
                  value={formData.date_graduated}
                  onChange={(e) => setFormData({ ...formData, date_graduated: e.target.value })}
                  className="h-10"
                />
              </div>

              {/* Row 10: Degree/Honors/Awards (Full width) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                  <Award className="w-3.5 h-3.5 mr-1 text-slate-600" />
                  Degree/Honors/Awards
                </label>
                <Input
                  value={formData.degree_honors_awards}
                  onChange={(e) => setFormData({ ...formData, degree_honors_awards: e.target.value })}
                  placeholder="Enter degrees, honors, or awards"
                  className="h-10"
                />
              </div>

              {/* Row 11: Character Reference Name & Reference No. */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1 text-slate-600" />
                    Character Reference Name
                  </label>
                  <Input
                    value={formData.character_reference_name}
                    onChange={(e) => setFormData({ ...formData, character_reference_name: e.target.value })}
                    placeholder="Enter reference name"
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-1 text-slate-600" />
                    Emergency No.
                  </label>
                  <Input
                    value={formData.character_reference_no}
                    onChange={(e) => setFormData({ ...formData, character_reference_no: e.target.value })}
                    placeholder="e.g., 0912-345-6789"
                    className="h-10"
                  />
                </div>
              </div>

              {/* Row 12: Emergency Contact Name (Full width) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                  <Users className="w-3.5 h-3.5 mr-1 text-slate-600" />
                  Emergency Contact Name
                </label>
                <Input
                  value={formData.emergency_contact_name}
                  onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                  placeholder="Enter emergency contact name"
                  className="h-10"
                />
              </div>

              {/* Row 13: Emergency Address (Full width) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-600" />
                  Emergency Address
                </label>
                <Input
                  value={formData.emergency_address}
                  onChange={(e) => setFormData({ ...formData, emergency_address: e.target.value })}
                  placeholder="Enter emergency contact address"
                  className="h-10"
                />
              </div>

              {/* Row 14: Emergency No. & Relation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-1 text-slate-600" />
                    Emergency No.
                  </label>
                  <Input
                    value={formData.emergency_no}
                    onChange={(e) => setFormData({ ...formData, emergency_no: e.target.value })}
                    placeholder="e.g., 0912-345-6789"
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1 text-slate-600" />
                    Relation
                  </label>
                  <Input
                    value={formData.emergency_relation}
                    onChange={(e) => setFormData({ ...formData, emergency_relation: e.target.value })}
                    placeholder="e.g., Father, Mother, Sibling"
                    className="h-10"
                  />
                </div>
              </div>

              {/* Row 15: Home Church (Full width) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                  <Church className="w-3.5 h-3.5 mr-1 text-slate-600" />
                  Home Church
                </label>
                <Input
                  value={formData.home_church}
                  onChange={(e) => setFormData({ ...formData, home_church: e.target.value })}
                  placeholder="Enter church name"
                  className="h-10"
                />
              </div>

              {/* Row 16: Church Address (Full width) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-600" />
                  Church Address
                </label>
                <Input
                  value={formData.church_address}
                  onChange={(e) => setFormData({ ...formData, church_address: e.target.value })}
                  placeholder="Enter church address"
                  className="h-10"
                />
              </div>

              {/* Row 17: Pastor's Name & Date Saved */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1 text-slate-600" />
                    Pastor's Name
                  </label>
                  <Input
                    value={formData.pastor_name}
                    onChange={(e) => setFormData({ ...formData, pastor_name: e.target.value })}
                    placeholder="Enter pastor's name"
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-600" />
                    Date Saved
                  </label>
                  <Input
                    type="date"
                    value={formData.date_saved}
                    onChange={(e) => setFormData({ ...formData, date_saved: e.target.value })}
                    className="h-10"
                  />
                </div>
              </div>

              {/* Row 18: Date Baptized */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-600" />
                  Date Baptized
                </label>
                <Input
                  type="date"
                  value={formData.date_baptized}
                  onChange={(e) => setFormData({ ...formData, date_baptized: e.target.value })}
                  className="h-10"
                />
              </div>

              {/* Row 19: Ministries Involved (Full width) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 mr-1 text-slate-600" />
                  Ministries Involved
                </label>
                <Input
                  value={formData.ministries_involved}
                  onChange={(e) => setFormData({ ...formData, ministries_involved: e.target.value })}
                  placeholder="Enter ministries (comma separated)"
                  className="h-10"
                />
              </div>

              {/* Row 20: Special Skills (Full width) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-slate-600" />
                  Special Skills
                </label>
                <Input
                  value={formData.special_skills}
                  onChange={(e) => setFormData({ ...formData, special_skills: e.target.value })}
                  placeholder="Enter special skills"
                  className="h-10"
                />
              </div>

              {/* Row 21: Musical Instruments (Full width) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                  <Music className="w-3.5 h-3.5 mr-1 text-slate-600" />
                  Musical Instruments
                </label>
                <Input
                  value={formData.musical_instruments}
                  onChange={(e) => setFormData({ ...formData, musical_instruments: e.target.value })}
                  placeholder="Enter instruments"
                  className="h-10"
                />
              </div>

              {/* Row 22: Portal Credentials & Academic Program */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                <div className="text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center">
                  <Lock className="w-4 h-4 mr-1.5 text-blue-900" />
                  Portal Account & Academic Placement
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                      <Mail className="w-3.5 h-3.5 mr-1 text-slate-600" />
                      Institutional Email <span className="text-red-500 ml-1">*</span>
                    </label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g., student@berean.edu"
                      className="h-10 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                      <Lock className="w-3.5 h-3.5 mr-1 text-slate-600" />
                      Password <span className="text-red-500 ml-1">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder={isEditOpen ? 'Leave blank to retain password' : 'Enter password'}
                      className="h-10 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Academic Degree Program
                    </label>
                    <Select
                      value={formData.program_id}
                      onChange={(e) => setFormData({ ...formData, program_id: e.target.value })}
                      className="h-10 bg-white text-xs"
                    >
                      {programs.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.code} — {p.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Initial Year Level
                    </label>
                    <Select
                      value={formData.year_level_id}
                      onChange={(e) => setFormData({ ...formData, year_level_id: e.target.value })}
                      className="h-10 bg-white text-xs"
                    >
                      {yearLevels.map((y) => (
                        <option key={y.id} value={y.id}>
                          {y.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>

              {/* Row 23: Reason for Enrolling */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                  <FileText className="w-3.5 h-3.5 mr-1 text-slate-600" />
                  Reason for Enrolling
                </label>
                <textarea
                  rows={3}
                  value={formData.reason_for_enrolling}
                  onChange={(e) => setFormData({ ...formData, reason_for_enrolling: e.target.value })}
                  placeholder="Share your reason for enrolling..."
                  className="w-full rounded-md border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Row 24: Health Information */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                  <HeartPulse className="w-3.5 h-3.5 mr-1 text-slate-600" />
                  Health Information
                </label>
                <textarea
                  rows={3}
                  value={formData.health_information}
                  onChange={(e) => setFormData({ ...formData, health_information: e.target.value })}
                  placeholder="Any medical conditions, allergies, or health concerns..."
                  className="w-full rounded-md border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Row 25: Brief Testimony */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                  <FileText className="w-3.5 h-3.5 mr-1 text-slate-600" />
                  Brief Testimony
                </label>
                <textarea
                  rows={3}
                  value={formData.brief_testimony}
                  onChange={(e) => setFormData({ ...formData, brief_testimony: e.target.value })}
                  placeholder="Share your testimony..."
                  className="w-full rounded-md border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsRegisterOpen(false);
                    setIsEditOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={formSubmitting}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold"
                >
                  {isRegisterOpen ? 'Submit & Register Student' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW STUDENT DETAILS MODAL                                                */}
      {/* ========================================================================= */}
      {isViewOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full my-6 overflow-hidden border border-slate-200">
            <div className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">
                  Student Profile: {selectedStudent.profile?.first_name} {selectedStudent.profile?.last_name}
                </h3>
              </div>
              <button onClick={() => setIsViewOpen(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs text-slate-700 max-h-[80vh] overflow-y-auto">
              {/* Basic & Academic Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Student Number</div>
                  <div className="font-mono font-bold text-sm text-slate-900 mt-0.5">{selectedStudent.student_number || 'Pending'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Status</div>
                  <div className="mt-0.5">{getStatusBadge(selectedStudent.student_status)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Degree Program</div>
                  <div className="font-semibold text-slate-900 mt-0.5">{selectedStudent.program?.code} - {selectedStudent.program?.name}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Curriculum</div>
                  <div className="font-semibold text-slate-900 mt-0.5">{selectedStudent.curriculum?.name || 'Standard'}</div>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h4 className="font-bold text-sm text-blue-950 mb-3 border-b border-slate-200 pb-1 flex items-center">
                  <Users className="w-4 h-4 mr-1.5 text-blue-900" /> Personal Information
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div><span className="text-slate-400 block">Full Name:</span> {selectedStudent.profile?.first_name} {selectedStudent.profile?.last_name}</div>
                  <div><span className="text-slate-400 block">Nickname:</span> {selectedStudent.nickname || '—'}</div>
                  <div><span className="text-slate-400 block">Date of Birth:</span> {selectedStudent.date_of_birth ? formatDate(selectedStudent.date_of_birth) : '—'}</div>
                  <div><span className="text-slate-400 block">Age:</span> {selectedStudent.age || '—'}</div>
                  <div><span className="text-slate-400 block">Gender:</span> {selectedStudent.gender || '—'}</div>
                  <div><span className="text-slate-400 block">Civil Status:</span> {selectedStudent.civil_status || '—'}</div>
                  <div><span className="text-slate-400 block">Nationality:</span> {selectedStudent.nationality || 'Filipino'}</div>
                  <div><span className="text-slate-400 block">Mobile No.:</span> {selectedStudent.mobile_no || selectedStudent.profile?.phone || '—'}</div>
                  <div><span className="text-slate-400 block">Email Address:</span> {selectedStudent.profile?.email || '—'}</div>
                  <div className="col-span-2 sm:col-span-3"><span className="text-slate-400 block">Present Address:</span> {selectedStudent.present_address || '—'}</div>
                </div>
              </div>

              {/* Educational & Employment */}
              <div>
                <h4 className="font-bold text-sm text-blue-950 mb-3 border-b border-slate-200 pb-1 flex items-center">
                  <GraduationCap className="w-4 h-4 mr-1.5 text-blue-900" /> Educational & Employment Background
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div><span className="text-slate-400 block">School Graduated:</span> {selectedStudent.school_graduated || '—'}</div>
                  <div><span className="text-slate-400 block">Date Graduated:</span> {selectedStudent.date_graduated ? formatDate(selectedStudent.date_graduated) : '—'}</div>
                  <div><span className="text-slate-400 block">Degree / Honors:</span> {selectedStudent.degree_honors_awards || '—'}</div>
                  <div><span className="text-slate-400 block">Occupation:</span> {selectedStudent.occupation || '—'}</div>
                  <div><span className="text-slate-400 block">Business Tel No.:</span> {selectedStudent.business_tel_no || '—'}</div>
                  <div className="col-span-2 sm:col-span-3"><span className="text-slate-400 block">Business Address:</span> {selectedStudent.business_address || '—'}</div>
                </div>
              </div>

              {/* Emergency Contact & References */}
              <div>
                <h4 className="font-bold text-sm text-blue-950 mb-3 border-b border-slate-200 pb-1 flex items-center">
                  <HeartHandshake className="w-4 h-4 mr-1.5 text-blue-900" /> Emergency & Character Reference
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div><span className="text-slate-400 block">Emergency Contact:</span> {selectedStudent.emergency_contact_name || '—'}</div>
                  <div><span className="text-slate-400 block">Relation:</span> {selectedStudent.emergency_relation || '—'}</div>
                  <div><span className="text-slate-400 block">Emergency No.:</span> {selectedStudent.emergency_no || '—'}</div>
                  <div className="col-span-2 sm:col-span-3"><span className="text-slate-400 block">Emergency Address:</span> {selectedStudent.emergency_address || '—'}</div>
                  <div><span className="text-slate-400 block">Character Reference:</span> {selectedStudent.character_reference_name || '—'}</div>
                  <div><span className="text-slate-400 block">Reference Phone:</span> {selectedStudent.character_reference_no || '—'}</div>
                </div>
              </div>

              {/* Spiritual Background */}
              <div>
                <h4 className="font-bold text-sm text-blue-950 mb-3 border-b border-slate-200 pb-1 flex items-center">
                  <Church className="w-4 h-4 mr-1.5 text-blue-900" /> Spiritual & Church Background
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div><span className="text-slate-400 block">Home Church:</span> {selectedStudent.home_church || '—'}</div>
                  <div><span className="text-slate-400 block">Pastor's Name:</span> {selectedStudent.pastor_name || '—'}</div>
                  <div><span className="text-slate-400 block">Date Saved:</span> {selectedStudent.date_saved ? formatDate(selectedStudent.date_saved) : '—'}</div>
                  <div><span className="text-slate-400 block">Date Baptized:</span> {selectedStudent.date_baptized ? formatDate(selectedStudent.date_baptized) : '—'}</div>
                  <div className="col-span-2 sm:col-span-3"><span className="text-slate-400 block">Church Address:</span> {selectedStudent.church_address || '—'}</div>
                  <div className="col-span-2 sm:col-span-3"><span className="text-slate-400 block">Ministries Involved:</span> {selectedStudent.ministries_involved || '—'}</div>
                  <div><span className="text-slate-400 block">Special Skills:</span> {selectedStudent.special_skills || '—'}</div>
                  <div><span className="text-slate-400 block">Musical Instruments:</span> {selectedStudent.musical_instruments || '—'}</div>
                </div>
              </div>

              {/* Personal Statements */}
              {(selectedStudent.reason_for_enrolling || selectedStudent.health_information || selectedStudent.brief_testimony) && (
                <div>
                  <h4 className="font-bold text-sm text-blue-950 mb-3 border-b border-slate-200 pb-1 flex items-center">
                    <FileText className="w-4 h-4 mr-1.5 text-blue-900" /> Statements & Health
                  </h4>
                  <div className="space-y-3">
                    {selectedStudent.reason_for_enrolling && (
                      <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <div className="font-semibold text-slate-800 mb-1">Reason for Enrolling:</div>
                        <p className="text-slate-600 whitespace-pre-wrap">{selectedStudent.reason_for_enrolling}</p>
                      </div>
                    )}
                    {selectedStudent.health_information && (
                      <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <div className="font-semibold text-slate-800 mb-1">Health Information:</div>
                        <p className="text-slate-600 whitespace-pre-wrap">{selectedStudent.health_information}</p>
                      </div>
                    )}
                    {selectedStudent.brief_testimony && (
                      <div className="p-3 bg-slate-50 rounded border border-slate-200">
                        <div className="font-semibold text-slate-800 mb-1">Brief Testimony:</div>
                        <p className="text-slate-600 whitespace-pre-wrap">{selectedStudent.brief_testimony}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
              <Button onClick={() => setIsViewOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* UPDATE STUDENT STATUS DIALOG                                              */}
      {/* ========================================================================= */}
      <Dialog
        open={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
        title="Update Student Academic Status"
        description="Transition student lifecycle, assign official student number, or promote to Graduated/Alumni."
      >
        <form onSubmit={handleSaveStatus} className="space-y-4">
          <div>
            <div className="text-xs font-semibold text-slate-800">
              {selectedStudent?.profile?.first_name} {selectedStudent?.profile?.last_name}
            </div>
            <div className="text-[11px] text-slate-500">{selectedStudent?.profile?.email}</div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Official Student Number
            </label>
            <Input
              placeholder="e.g. BBC-2026-0005"
              value={assignedStudentNumber}
              onChange={(e) => setAssignedStudentNumber(e.target.value)}
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Assigned upon applicant verification.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Lifecycle Status *
            </label>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as StudentStatus)}
            >
              <option value="APPLICANT">APPLICANT</option>
              <option value="PENDING_VERIFICATION">PENDING_VERIFICATION</option>
              <option value="ACTIVE">ACTIVE (In Good Standing)</option>
              <option value="ENROLLED">ENROLLED (Attending Classes)</option>
              <option value="NOT_ENROLLED">NOT_ENROLLED</option>
              <option value="ON_LEAVE">ON_LEAVE</option>
              <option value="GRADUATED">GRADUATED (Preserves Historical Record)</option>
              <option value="ALUMNI">ALUMNI (Active Alumni Directory)</option>
              <option value="SUSPENDED">SUSPENDED</option>
              <option value="WITHDRAWN">WITHDRAWN</option>
            </Select>
          </div>

          {(newStatus === 'GRADUATED' || newStatus === 'ALUMNI') && (
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 space-y-3">
              <div className="text-xs font-semibold text-amber-900 flex items-center">
                <Award className="w-4 h-4 mr-1 text-amber-700" />
                Graduation & Alumni Record Preservation
              </div>
              <p className="text-[11px] text-amber-800">
                Graduating does NOT delete or alter any completed historical academic records. An alumni profile will be created automatically.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-amber-900 mb-1">
                    Graduation Year
                  </label>
                  <Input
                    type="number"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(Number(e.target.value))}
                    className="bg-white text-xs h-8"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-amber-900 mb-1">
                    Commencement Date
                  </label>
                  <Input
                    type="date"
                    value={graduationDate}
                    onChange={(e) => setGraduationDate(e.target.value)}
                    className="bg-white text-xs h-8"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsStatusModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Lifecycle Status</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
