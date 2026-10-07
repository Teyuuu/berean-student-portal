import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/supabase';
import {
  EnrollmentPeriod,
  CurriculumSubject,
  Enrollment,
  Grade,
} from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  FileCheck,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Lock,
  Clock,
  BookOpen,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const StudentEnrollmentPage: React.FC = () => {
  const { student } = useAuth();
  const [openPeriod, setOpenPeriod] = useState<EnrollmentPeriod | null>(null);
  const [curriculumSubjects, setCurriculumSubjects] = useState<CurriculumSubject[]>([]);
  const [studentGrades, setStudentGrades] = useState<Grade[]>([]);
  const [currentEnrollment, setCurrentEnrollment] = useState<Enrollment | null>(null);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnrollmentData();
  }, [student]);

  const loadEnrollmentData = async () => {
    if (!student) return;
    setLoading(true);
    try {
      const [periods, grades, enrs] = await Promise.all([
        api.getEnrollmentPeriods(),
        api.getGrades(student.id),
        api.getStudentEnrollments(student.id),
      ]);

      const activeOpen = periods.find((p) => p.status === 'OPEN') || null;
      setOpenPeriod(activeOpen);
      setStudentGrades(grades);

      // Check current active term enrollment
      const existing = enrs.find(
        (e) => activeOpen && e.academic_year_id === activeOpen.academic_year_id && e.semester_id === activeOpen.semester_id
      );
      setCurrentEnrollment(existing || null);

      if (existing && existing.enrollment_subjects) {
        setSelectedSubjectIds(existing.enrollment_subjects.map((es) => es.subject_id));
      }

      // Load subjects from student's curriculum
      const currId = student.curriculum_id || '55555555-5555-5555-5555-555555555501';
      const cSubs = await api.getCurriculumSubjects(currId);
      setCurriculumSubjects(cSubs);
    } finally {
      setLoading(false);
    }
  };

  // Toggle subject selection
  const handleToggleSubject = (subjectId: string) => {
    if (currentEnrollment && currentEnrollment.status === 'APPROVED') return;

    if (selectedSubjectIds.includes(subjectId)) {
      setSelectedSubjectIds(selectedSubjectIds.filter((id) => id !== subjectId));
    } else {
      setSelectedSubjectIds([...selectedSubjectIds, subjectId]);
    }
  };

  // Live client-side preview validation
  const validateSelection = (): boolean => {
    const errors: string[] = [];

    if (!openPeriod) {
      errors.push('Enrollment is currently CLOSED. Submissions are not accepted at this time.');
    }

    if (student?.student_status === 'APPLICANT' || student?.student_status === 'PENDING_VERIFICATION') {
      errors.push('Your applicant account is awaiting staff verification before course enrollment can be submitted.');
    }

    if (selectedSubjectIds.length === 0) {
      errors.push('Please select at least one subject to enroll in.');
    }

    // Check prerequisites
    const completedSubjectIds = studentGrades
      .filter((g) => g.status === 'RELEASED' && (g.grade ?? 5.0) <= 3.0)
      .map((g) => g.enrollment_subject?.subject_id)
      .filter(Boolean);

    selectedSubjectIds.forEach((sId) => {
      const cs = curriculumSubjects.find((item) => item.subject_id === sId);
      if (cs && cs.prerequisite_subject_id) {
        if (!completedSubjectIds.includes(cs.prerequisite_subject_id)) {
          errors.push(
            `Prerequisite not satisfied: ${cs.subject?.code} requires prior completion of ${cs.prerequisite_subject?.code} (${cs.prerequisite_subject?.name}).`
          );
        }
      }
    });

    const totalSelectedUnits = curriculumSubjects
      .filter((cs) => selectedSubjectIds.includes(cs.subject_id))
      .reduce((acc, curr) => acc + (curr.subject?.units || 0), 0);

    if (totalSelectedUnits > 24) {
      errors.push(`Unit overload: Total selected units (${totalSelectedUnits}) exceed maximum semester limit of 24 units.`);
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmitEnrollment = async () => {
    if (!student || !openPeriod) return;
    if (!validateSelection()) return;

    setIsSubmitting(true);
    try {
      await api.submitEnrollment(
        student.id,
        openPeriod.academic_year_id,
        openPeriod.semester_id,
        openPeriod.id,
        selectedSubjectIds
      );
      await loadEnrollmentData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedUnits = curriculumSubjects
    .filter((cs) => selectedSubjectIds.includes(cs.subject_id))
    .reduce((acc, curr) => acc + (curr.subject?.units || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-blue-950 font-serif">
          Online Course Enrollment
        </h1>
        <p className="text-sm text-slate-500">
          Official enrollment submission and course subject registration for the active term
        </p>
      </div>

      {/* Enrollment Period Status Banner */}
      {openPeriod ? (
        <Card className="border-emerald-300 bg-emerald-50/40 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Enrollment Window Open
                </span>
                <div className="text-sm font-semibold text-emerald-950">
                  {openPeriod.academic_year?.name} — {openPeriod.semester?.name}
                </div>
                <div className="text-xs text-emerald-700">
                  Window active until {formatDate(openPeriod.end_date)}
                </div>
              </div>
            </div>

            <div className="text-right">
              <Badge variant="success">ACCEPTING REGISTRATIONS</Badge>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="border-amber-300 bg-amber-50/50 p-4">
          <div className="flex items-center space-x-3">
            <Lock className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Enrollment Window Closed
              </div>
              <div className="text-xs text-amber-700">
                There is no active open enrollment window at this time. Please monitor announcements for the upcoming registration schedule.
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Existing Enrollment Status Card */}
      {currentEnrollment && (
        <Card className="p-5 border-blue-200 bg-blue-50/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Current Term Enrollment Submission
              </div>
              <div className="text-base font-bold text-blue-950 mt-1 flex items-center gap-2">
                Status: {currentEnrollment.status}
                <Badge
                  variant={
                    currentEnrollment.status === 'APPROVED'
                      ? 'success'
                      : currentEnrollment.status === 'SUBMITTED'
                      ? 'warning'
                      : 'secondary'
                  }
                >
                  {currentEnrollment.status}
                </Badge>
              </div>
              <div className="text-xs text-slate-600 mt-1">
                Total Confirmed Load: <strong>{currentEnrollment.total_units} Units</strong> • Submitted on {formatDate(currentEnrollment.submitted_at)}
              </div>
              {currentEnrollment.remarks && (
                <div className="mt-2 text-xs text-blue-900 bg-white p-2.5 rounded border border-blue-200">
                  <strong>Registrar Remarks:</strong> {currentEnrollment.remarks}
                </div>
              )}
            </div>

            {currentEnrollment.status === 'APPROVED' && (
              <div className="p-3 bg-emerald-100/70 border border-emerald-300 rounded-lg text-emerald-900 text-xs text-center font-medium">
                Enrollment Officially Approved for Classes
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Validation alert banner */}
      {validationErrors.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-1">
          <div className="text-xs font-bold text-red-900 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1.5 text-red-600" />
            Please resolve the following enrollment requirements:
          </div>
          <ul className="list-disc list-inside text-xs text-red-800 space-y-0.5">
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Subject Selection Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-semibold">
              Available Curriculum Subjects ({curriculumSubjects.length})
            </CardTitle>
            <p className="text-xs text-slate-500">
              Select courses according to your cohort pathway. Prerequisites must be satisfied.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500">Selected Load:</span>{' '}
            <span className="text-sm font-bold text-blue-950 font-mono">
              {selectedUnits} Units
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-y border-slate-200">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">Select</th>
                  <th className="px-4 py-3 font-semibold">Subject Code</th>
                  <th className="px-4 py-3 font-semibold">Course Title</th>
                  <th className="px-4 py-3 font-semibold">Units</th>
                  <th className="px-4 py-3 font-semibold">Pathway Year & Term</th>
                  <th className="px-4 py-3 font-semibold">Prerequisite</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {curriculumSubjects.map((cs) => {
                  const isChecked = selectedSubjectIds.includes(cs.subject_id);
                  const isLocked = currentEnrollment?.status === 'APPROVED';

                  return (
                    <tr
                      key={cs.id}
                      onClick={() => !isLocked && handleToggleSubject(cs.subject_id)}
                      className={`cursor-pointer transition-colors ${
                        isChecked ? 'bg-blue-50/50' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isLocked}
                          onChange={() => handleToggleSubject(cs.subject_id)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-blue-950">
                        {cs.subject?.code}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {cs.subject?.name}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700">
                        {cs.subject?.units} units
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {cs.year_level?.name} • {cs.semester?.name}
                      </td>
                      <td className="px-4 py-3">
                        {cs.prerequisite_subject ? (
                          <span className="text-amber-700 font-medium">
                            {cs.prerequisite_subject.code}
                          </span>
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {cs.is_required ? (
                          <Badge variant="outline" className="text-[10px]">Required</Badge>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Elective</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Submission Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200">
        <div>
          <span className="text-xs text-slate-500">Summary:</span>{' '}
          <strong className="text-slate-900 text-sm">
            {selectedSubjectIds.length} Subjects Selected ({selectedUnits} Total Academic Units)
          </strong>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            size="lg"
            variant="default"
            disabled={
              !openPeriod ||
              (currentEnrollment && currentEnrollment.status === 'APPROVED') ||
              selectedSubjectIds.length === 0
            }
            isLoading={isSubmitting}
            onClick={handleSubmitEnrollment}
            className="w-full sm:w-auto"
          >
            <FileCheck className="w-4 h-4 mr-2" />
            {currentEnrollment ? 'Update & Re-Submit Load' : 'Submit Enrollment Request'}
          </Button>
        </div>
      </div>
    </div>
  );
};
