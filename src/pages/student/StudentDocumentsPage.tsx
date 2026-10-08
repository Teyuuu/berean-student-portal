import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/supabase';
import { StudentDocument, DocumentType } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { FolderOpen, Upload, FileText, CheckCircle2, Clock, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { processDocumentFile, formatBytes, MAX_FILE_SIZE_BYTES } from '@/lib/fileCompression';

export const StudentDocumentsPage: React.FC = () => {
  const { student } = useAuth();
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState<DocumentType>('BIRTH_CERTIFICATE');
  const [fileName, setFileName] = useState('');
  const [fileSizeBytes, setFileSizeBytes] = useState(154200);
  const [fileMimeType, setFileMimeType] = useState('application/pdf');
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionStatus, setCompressionStatus] = useState<{
    originalFormatted: string;
    compressedFormatted: string;
    wasCompressed: boolean;
    savings: number;
  } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
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

  const handleFileSelection = async (file: File) => {
    setUploadError(null);
    setCompressionStatus(null);
    setIsCompressing(true);

    try {
      const res = await processDocumentFile(file, MAX_FILE_SIZE_BYTES);
      if (res.error) {
        setUploadError(res.error);
        return;
      }

      setFileName(res.file.name);
      setFileSizeBytes(res.compressedSize);
      setFileMimeType(res.mimeType);

      if (!docTitle) {
        setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
      }

      setCompressionStatus({
        originalFormatted: res.originalFormatted,
        compressedFormatted: res.compressedFormatted,
        wasCompressed: res.wasCompressed,
        savings: res.savingsPercent,
      });
    } catch (err: unknown) {
      setUploadError((err as Error).message || 'Failed to process document file.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !docTitle) return;
    if (fileSizeBytes > MAX_FILE_SIZE_BYTES) {
      setUploadError('Document exceeds the 5 MB limit. Please compress or choose a smaller file.');
      return;
    }

    await api.uploadStudentDocument({
      student_id: student.id,
      title: docTitle,
      document_type: docType,
      file_path: `documents/${student.id}/${fileName || 'document.pdf'}`,
      file_size_bytes: fileSizeBytes,
      mime_type: fileMimeType,
      remarks: null,
      verified_by: null,
      verified_at: null,
    });

    setIsUploadModalOpen(false);
    setDocTitle('');
    setFileName('');
    setCompressionStatus(null);
    setUploadError(null);
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
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Attach File (PDF, PNG, JPG) *
              </label>
              <Badge variant="info" className="text-[10px] py-0 px-1.5">
                Auto-compressed to &le; 5 MB
              </Badge>
            </div>
            <Input
              type="file"
              required
              accept="application/pdf,image/jpeg,image/png,image/webp"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileSelection(e.target.files[0]);
                }
              }}
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Images and scanned documents are automatically compressed to ensure fast upload and compliance with the 5 MB limit.
            </p>

            {isCompressing && (
              <div className="mt-2 text-xs text-blue-900 bg-blue-50 border border-blue-200 rounded p-2 flex items-center space-x-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-900 shrink-0" />
                <span>Compressing document file to comply with 5 MB maximum...</span>
              </div>
            )}

            {compressionStatus && (
              <div className="mt-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded p-2 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {compressionStatus.wasCompressed
                    ? `Auto-compressed: ${compressionStatus.originalFormatted} → ${compressionStatus.compressedFormatted} (${compressionStatus.savings}% reduction, ready to upload)`
                    : `Verified size: ${compressionStatus.compressedFormatted} (Under 5 MB limit)`}
                </span>
              </div>
            )}

            {uploadError && (
              <div className="mt-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded p-2 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsUploadModalOpen(false);
                setCompressionStatus(null);
                setUploadError(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCompressing || !fileName || !!uploadError}
            >
              Upload Document
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
