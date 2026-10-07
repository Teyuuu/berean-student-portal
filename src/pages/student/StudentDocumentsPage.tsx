import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/supabase';
import { StudentDocument, DocumentType } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { FolderOpen, Upload, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const StudentDocumentsPage: React.FC = () => {
  const { student } = useAuth();
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState<DocumentType>('BIRTH_CERTIFICATE');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (student) {
      loadDocs();
    }
  }, [student]);

  const loadDocs = async () => {
    if (!student) return;
    setLoading(true);
    try {
      const data = await api.getStudentDocuments(student.id);
      setDocuments(data);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !docTitle) return;

    await api.uploadStudentDocument({
      student_id: student.id,
      title: docTitle,
      document_type: docType,
      file_path: `documents/${student.id}/${fileName || 'document.pdf'}`,
      file_size_bytes: 154200,
      mime_type: 'application/pdf',
      remarks: null,
      verified_by: null,
      verified_at: null,
    });

    setIsUploadModalOpen(false);
    setDocTitle('');
    setFileName('');
    await loadDocs();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-950 font-serif">
            Student Documents & Credentials
          </h1>
          <p className="text-sm text-slate-500">
            Upload and monitor verification of admissions requirements, certifications, and recommendations
          </p>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)} size="sm">
          <Upload className="w-4 h-4 mr-1.5" />
          Upload New Document
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Document Title</th>
                  <th className="px-4 py-3 font-semibold">Document Type</th>
                  <th className="px-4 py-3 font-semibold">Date Uploaded</th>
                  <th className="px-4 py-3 font-semibold">Verification Status</th>
                  <th className="px-4 py-3 font-semibold">Registrar Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                      No documents uploaded yet. Click Upload New Document above.
                    </td>
                  </tr>
                ) : (
                  documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-semibold text-blue-950 flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-slate-400" />
                        {doc.title}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
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
                      <td className="px-4 py-3 text-slate-600">
                        {doc.remarks || 'Pending staff review'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        title="Upload Required Student Document"
        description="Official documents will be submitted to the Registrar's Office for verification."
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Document Title *
            </label>
            <Input
              required
              placeholder="e.g. PSA Birth Certificate"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Document Category *
            </label>
            <Select
              value={docType}
              onChange={(e) => setDocType(e.target.value as DocumentType)}
            >
              <option value="BIRTH_CERTIFICATE">Birth Certificate</option>
              <option value="PASTOR_RECOMMENDATION">Pastor Recommendation Letter</option>
              <option value="HIGH_SCHOOL_CARD">High School Form 137 / Report Card</option>
              <option value="TRANSCRIPT_OF_RECORDS">Official Transcript of Records (TOR)</option>
              <option value="ID_PHOTO">Formal 2x2 ID Photo</option>
              <option value="ENROLLMENT_FORM">Signed Enrollment Agreement</option>
              <option value="OTHER">Other Academic Credential</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Attach File (PDF, PNG, JPG) *
            </label>
            <Input
              type="file"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFileName(e.target.files[0].name);
                  if (!docTitle) setDocTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                }
              }}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Upload Document</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
