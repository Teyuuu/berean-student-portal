import React, { useState, useEffect } from 'react';
import { api, localStore } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { StudentDocument, Student } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FolderOpen, CheckCircle, XCircle, FileText, Download } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const StaffDocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [docs, stds] = await Promise.all([
        Promise.resolve(localStore.getDocuments()),
        api.getStudents(),
      ]);
      setDocuments(docs);
      setStudents(stds);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (docId: string, status: 'VERIFIED' | 'REJECTED') => {
    if (!user) return;
    await api.verifyDocument(docId, status, user.id, `Reviewed by Registrar`);
    await loadData();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-blue-950 font-serif">
          Document Verification & Credential Review
        </h1>
        <p className="text-sm text-slate-500">
          Verify student admissions credentials, recommendation letters, and official certificates
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Student</th>
                  <th className="px-4 py-3 font-semibold">Document Title</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Date Uploaded</th>
                  <th className="px-4 py-3 font-semibold">Verification Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((doc) => {
                  const student = students.find((s) => s.id === doc.student_id);
                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        <div>
                          {student?.profile?.first_name} {student?.profile?.last_name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {student?.student_number || 'Applicant'}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-blue-950 flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-slate-400" />
                        {doc.title}
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">
                        {doc.document_type}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {formatDate(doc.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            doc.verification_status === 'VERIFIED'
                              ? 'success'
                              : doc.verification_status === 'REJECTED'
                              ? 'destructive'
                              : 'warning'
                          }
                        >
                          {doc.verification_status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right space-x-1">
                        {doc.verification_status !== 'VERIFIED' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVerify(doc.id, 'VERIFIED')}
                            className="h-7 text-xs border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                          >
                            <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                            Verify
                          </Button>
                        )}
                        {doc.verification_status !== 'REJECTED' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVerify(doc.id, 'REJECTED')}
                            className="h-7 text-xs border-red-200 text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1 text-red-600" />
                            Reject
                          </Button>
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
    </div>
  );
};
