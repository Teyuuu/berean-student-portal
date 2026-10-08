import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { compressImageFile, formatBytes, MAX_FILE_SIZE_BYTES } from '@/lib/fileCompression';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  User,
  Mail,
  Phone,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  Lock,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';

interface EditAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const EditAccountModal: React.FC<EditAccountModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editable fields strictly: name (first, last), email, phone, profile photo
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');

  // Compression & upload state
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<{
    originalSize: string;
    compressedSize: string;
    savings: number;
    wasCompressed: boolean;
  } | null>(null);

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync state whenever modal opens or user changes
  useEffect(() => {
    if (user && open) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setProfilePhotoUrl(user.profile_photo_url || '');
      setCompressionInfo(null);
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [user, open]);

  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WebP, etc.).');
      return;
    }

    setIsCompressing(true);
    setErrorMessage(null);

    try {
      // Automatically compress to <= 5 MB maximum
      const result = await compressImageFile(file, {
        maxSizeBytes: MAX_FILE_SIZE_BYTES, // 5 MB
        maxDimension: 1920,
      });

      setProfilePhotoUrl(result.dataUrl);
      setCompressionInfo({
        originalSize: result.originalFormatted,
        compressedSize: result.compressedFormatted,
        savings: result.savingsPercent,
        wasCompressed: result.wasCompressed,
      });
    } catch (err: unknown) {
      console.error('Image compression error:', err);
      setErrorMessage((err as Error).message || 'Failed to process image.');
    } finally {
      setIsCompressing(false);
      // Reset input value so re-selecting same file triggers onChange
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('First and last name are required.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('A valid email address is required.');
      return;
    }

    setSaving(true);
    try {
      const res = await updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || null,
        profile_photo_url: profilePhotoUrl || null,
      });

      if (res.error) {
        setErrorMessage(res.error);
      } else {
        setSuccessMessage('Account details updated successfully!');
        if (onSuccess) onSuccess();
        setTimeout(() => {
          onOpenChange(false);
        }, 1200);
      }
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Failed to update account.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      maxWidth="lg"
      title="Edit Account Information"
      description="Update your personal contact information and institutional profile picture. Changes take effect across your portal immediately."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Profile Picture Upload with Automatic Compression */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative group shrink-0">
            {profilePhotoUrl ? (
              <img
                src={profilePhotoUrl}
                alt="Profile Preview"
                className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-900/10 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-900 text-amber-300 flex items-center justify-center font-bold text-xl shadow-sm ring-4 ring-blue-900/10">
                {firstName?.[0] || 'U'}
                {lastName?.[0] || ''}
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isCompressing}
              className="absolute inset-0 bg-black/40 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-medium"
              title="Change Photo"
            >
              <Camera className="w-5 h-5 mb-0.5" />
              <span>Change</span>
            </button>
          </div>

          <div className="flex-1 space-y-1.5 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-bold text-slate-800">Profile Photo</span>
              <Badge variant="info" className="text-[10px] py-0 px-1.5">
                Auto-compressed to &le; 5 MB
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500">
              Upload a clear photo. Large files are automatically compressed down to 5 MB max for fast loading.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoFileChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs font-medium"
                onClick={() => fileInputRef.current?.click()}
                disabled={isCompressing}
              >
                {isCompressing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin text-blue-900" />
                    Compressing...
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
                    Upload Photo
                  </>
                )}
              </Button>

              {profilePhotoUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-slate-500 hover:text-red-600"
                  onClick={() => {
                    setProfilePhotoUrl('');
                    setCompressionInfo(null);
                  }}
                >
                  Remove
                </Button>
              )}
            </div>

            {/* Compression Feedback Banner */}
            {compressionInfo && (
              <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md p-1.5 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  {compressionInfo.wasCompressed
                    ? `Auto-compressed: ${compressionInfo.originalSize} → ${compressionInfo.compressedSize} (${compressionInfo.savings}% reduction, within 5 MB limit)`
                    : `Optimized: ${compressionInfo.compressedSize} (Under 5 MB limit)`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Protected / System Read-Only Attributes */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50/60 rounded-lg border border-slate-200 text-xs text-slate-600">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center">
              <Lock className="w-3 h-3 mr-1 text-slate-400" />
              Assigned Role
            </div>
            <div className="font-semibold text-slate-900 mt-0.5">{user?.role}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center">
              <ShieldCheck className="w-3 h-3 mr-1 text-slate-400" />
              Official ID Number
            </div>
            <div className="font-mono font-semibold text-slate-900 mt-0.5">
              {user?.id_number || 'N/A'}
            </div>
          </div>
        </div>

        {/* Editable Fields: ONLY Name, Email, Phone */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <Input
                  required
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="pl-9 h-10 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <Input
                  required
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="pl-9 h-10 text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Institutional Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <Input
                type="email"
                required
                placeholder="user@berean.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 h-10 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Contact Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <Input
                placeholder="e.g. 0917-123-4567 or +63 917 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-9 h-10 text-xs"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Used for official college SMS alerts and emergency notifications.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            isLoading={saving}
            size="sm"
            className="bg-blue-950 hover:bg-blue-900 text-white font-semibold px-4"
          >
            Save Account Updates
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
