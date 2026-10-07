import React, { useState, useEffect } from 'react';
import { api } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Enrollment, EnrollmentStatus } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { FileCheck, CheckCircle2, XCircle, AlertCircle, Eye, BookOpen } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const EnrollmentRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    setLoading(true);
    try {
      const data = await api.getEnrollments();
      setEnrollments(data);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReview = (enr: Enrollment) => {
    setSelectedEnrollment(enr);
    setRemarks(enr.remarks || '');
    setIsReviewModalOpen(true);
  };

  const handleDecision = async (status: EnrollmentStatus) => {
    if (!selectedEnrollment || !user) return;

    await api.reviewEnrollment(
      selectedEnrollment.id,
      status,
      user.id,
      remarks
    );

    setIsReviewModalOpen(false);
    await loadEnrollments();
  };

  const getStatusBadge = (status: EnrollmentStatus) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="success">APPROVED</Badge>;
      case 'SUBMITTED':
        return <Badge variant="warning">SUBMITTED</Badge>;
      case 'UNDER_REVIEW':
        return <Badge variant="info">UNDER REVIEW</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">REJECTED</Badge>;
      case 'COMPLETED':
        return <Badge variant="default">COMPLETED</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-blue-950 font-serif">
          Enrollment Review & Subject Validation
        </h1>
        <p className="text-sm text-slate-500">
          Registrar queue: Verify student course loads, prerequisite compliance, and issue official approvals
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Student Name</th>
                  <th className="px-4 py-3 font-semibold">Student ID</th>
                  <th className="px-4 py-3 font-semibold">Academic Term</th>
                  <th className="px-4 py-3 font-semibold">Subjects / Units</th>
                  <th className="px-4 py-3 font-semibold">Submission Date</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enrollments.map((enr) => (
                  <tr key={enr.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <div className="font-semibold text-slate-900">
                        {enr.student?.profile?.first_name} {enr.student?.profile?.last_name}
                      </div>
                      <div className="text-[11px] text-slate-400">{enr.student?.profile?.email}</div>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-800">
                      {enr.student?.student_number || 'Pending'}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {enr.academic_year?.name} — {enr.semester?.name}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-blue-950 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {enr.enrollment_subjects?.length || 0} subjects ({enr.total_units} units)
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDate(enr.submitted_at || enr.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(enr.status)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenReview(enr)}
                        className="h-7 text-xs"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Review Subjects
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog
        open={isReviewModalOpen}
        onOpenChange={setIsReviewModalOpen}
        title="Review Student Subject Load"
        description="Verify curriculum alignment and prerequisite satisfaction before issuing official approval."
        maxWidth="lg"
      >
        {selectedEnrollment && (
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedEnrollment.student?.profile?.first_name}{' '}
                  {selectedEnrollment.student?.profile?.last_name}
                </span>
                <div className="text-slate-500">
                  ID: {selectedEnrollment.student?.student_number} • Program:{' '}
                  {selectedEnrollment.student?.program?.code}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-blue-900">
                  Total Requested: {selectedEnrollment.total_units} Units
                </span>
                <div className="text-[11px] text-slate-400">
                  {selectedEnrollment.academic_year?.name} ({selectedEnrollment.semester?.name})
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Selected Subjects
              </div>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                {selectedEnrollment.enrollment_subjects?.map((es) => (
                  <div key={es.id} className="p-3 bg-white flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-blue-950 font-mono">
                        {es.subject?.code} — {es.subject?.name}
                      </div>
                      <div className="text-[11px] text-slate-500">{es.subject?.description}</div>
                    </div>
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {es.units} units
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Registrar Remarks & Notes
              </label>
              <Textarea
                placeholder="Enter remarks, conditions, or prerequisites verified note..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={2}
              />
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setIsReviewModalOpen(false)}>
                Close
              </Button>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDecision('REJECTED')}
                >
                  <XCircle className="w-3.5 h-3.5 mr-1" />
                  Reject Request
                </Button>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  className="bg-emerald-700 hover:bg-emerald-800"
                  onClick={() => handleDecision('APPROVED')}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Approve Enrollment
                </Button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};
