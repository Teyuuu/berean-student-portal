import React, { useState, useEffect } from 'react';
import { api } from '@/lib/supabase';
import { Student } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { UserCheck, CheckCircle2, Clock, Mail, Phone, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const StudentRegistrationsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [studentNumber, setStudentNumber] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getStudents();
      setStudents(data);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenVerify = (s: Student) => {
    setSelectedStudent(s);
    setStudentNumber(`BBC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setIsVerifyModalOpen(true);
  };

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !studentNumber) return;

    await api.updateStudentStatus(selectedStudent.id, 'ACTIVE', studentNumber);
    setIsVerifyModalOpen(false);
    await loadData();
  };

  const pendingList = students.filter(
    (s) => s.student_status === 'APPLICANT' || s.student_status === 'PENDING_VERIFICATION'
  );
  const verifiedList = students.filter(
    (s) => s.student_status !== 'APPLICANT' && s.student_status !== 'PENDING_VERIFICATION'
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-blue-950 font-serif">
          Applicant Verifications
        </h1>
        <p className="text-sm text-slate-500">
          Registrar queue: Verify applicant documents, assign student ID numbers, and activate accounts
        </p>
      </div>

      {/* Pending Applicants Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center">
            <Clock className="w-4 h-4 mr-2 text-amber-600" />
            Pending Verification Queue ({pendingList.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-y border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Applicant Name</th>
                  <th className="px-4 py-3 font-semibold">Contact Info</th>
                  <th className="px-4 py-3 font-semibold">Target Program</th>
                  <th className="px-4 py-3 font-semibold">Application Date</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      No pending applicants in queue.
                    </td>
                  </tr>
                ) : (
                  pendingList.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        <div className="font-semibold text-slate-900">
                          {s.profile?.first_name} {s.profile?.last_name}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <div className="flex items-center text-[11px]">
                          <Mail className="w-3 h-3 mr-1 text-slate-400" />
                          {s.profile?.email}
                        </div>
                        {s.profile?.phone && (
                          <div className="flex items-center text-[11px] text-slate-500 mt-0.5">
                            <Phone className="w-3 h-3 mr-1 text-slate-400" />
                            {s.profile?.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-medium">
                        {s.program?.code} — {s.program?.name}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {formatDate(s.admission_date)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="warning">{s.student_status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          onClick={() => handleOpenVerify(s)}
                          className="h-7 text-xs bg-emerald-700 hover:bg-emerald-800"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Verify & Assign ID
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Verified Students Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center text-slate-700">
            <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
            Recently Verified Students ({verifiedList.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-y border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Student Name</th>
                  <th className="px-4 py-3 font-semibold">Assigned ID #</th>
                  <th className="px-4 py-3 font-semibold">Program</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {verifiedList.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-2.5 font-medium text-slate-900">
                      {s.profile?.first_name} {s.profile?.last_name}
                    </td>
                    <td className="px-4 py-2.5 font-mono font-bold text-blue-900">
                      {s.student_number}
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">{s.program?.code}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant="success">{s.student_status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Verification Modal */}
      <Dialog
        open={isVerifyModalOpen}
        onOpenChange={setIsVerifyModalOpen}
        title="Approve Applicant & Assign Student Number"
        description="Assigning an official student number activates the student record and enables course enrollment."
      >
        <form onSubmit={handleApprove} className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
            <div className="font-semibold text-slate-900">
              {selectedStudent?.profile?.first_name} {selectedStudent?.profile?.last_name}
            </div>
            <div className="text-slate-600">Email: {selectedStudent?.profile?.email}</div>
            <div className="text-slate-600">
              Degree: {selectedStudent?.program?.name} ({selectedStudent?.program?.code})
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Assign Official Student Number *
            </label>
            <Input
              required
              placeholder="e.g. BBC-2026-0005"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
              className="font-mono"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsVerifyModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Approve & Activate Account
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
