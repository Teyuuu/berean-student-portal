import React, { useState, useEffect } from 'react';
import { api } from '@/lib/supabase';
import { Profile, UserRole, Program, YearLevel } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  KeyRound,
  Edit,
  Trash2,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  Award,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  UserX,
  Radio,
  Lock,
} from 'lucide-react';

export const AccountListPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Profile[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [yearLevels, setYearLevels] = useState<YearLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isResetPassOpen, setIsResetPassOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Profile | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    id_number: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'STUDENT' as UserRole,
    phone: '',
    is_active: true,
    programId: '',
    yearLevelId: '',
    department: 'Office of the Registrar',
    title: 'Staff Member',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [accs, progs, yls] = await Promise.all([
        api.getAccounts(),
        api.getPrograms(),
        api.getYearLevels(),
      ]);
      setAccounts(accs);
      setPrograms(progs);
      setYearLevels(yls);
      if (progs.length > 0 && !formData.programId) {
        setFormData((prev) => ({ ...prev, programId: progs[0].id }));
      }
      if (yls.length > 0 && !formData.yearLevelId) {
        setFormData((prev) => ({ ...prev, yearLevelId: yls[0].id }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered accounts
  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (acc.middle_name && acc.middle_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      acc.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (acc.id_number && acc.id_number.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = selectedRole === 'ALL' || acc.role === selectedRole;
    const matchesStatus =
      selectedStatus === 'ALL' ||
      (selectedStatus === 'ACTIVE' && acc.is_active) ||
      (selectedStatus === 'DISABLED' && !acc.is_active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let res = 'Berean@';
    for (let i = 0; i < 4; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res + '!';
  };

  const handleOpenCreate = () => {
    setFormData({
      id_number: `BBC-${new Date().getFullYear()}-${String(accounts.length + 1).padStart(4, '0')}`,
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      password: generateRandomPassword(),
      role: 'STUDENT',
      phone: '',
      is_active: true,
      programId: programs[0]?.id || '',
      yearLevelId: yearLevels[0]?.id || '',
      department: 'Office of the Registrar',
      title: 'Staff Member',
    });
    setFormError(null);
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSubmitting(true);

    try {
      if (!formData.id_number.trim() || !formData.first_name.trim() || !formData.last_name.trim() || !formData.email.trim()) {
        throw new Error('Please fill in all required fields.');
      }

      // Check duplicate email
      if (accounts.some((a) => a.email.toLowerCase() === formData.email.trim().toLowerCase())) {
        throw new Error('An account with this email address already exists.');
      }

      await api.createAccount({
        id_number: formData.id_number.trim(),
        first_name: formData.first_name.trim(),
        middle_name: formData.middle_name.trim() || undefined,
        last_name: formData.last_name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password || 'Berean2026!',
        role: formData.role,
        phone: formData.phone.trim() || undefined,
        is_active: formData.is_active,
        programId: formData.programId,
        yearLevelId: formData.yearLevelId,
        department: formData.department,
        title: formData.title,
      });

      setSuccessMessage(`Account created successfully for ${formData.first_name} ${formData.last_name}!`);
      setTimeout(() => setSuccessMessage(null), 4000);
      setIsCreateOpen(false);
      await loadData();
    } catch (err: unknown) {
      setFormError((err as Error).message || 'Failed to create account.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleToggleStatus = async (account: Profile) => {
    const nextStatus = !account.is_active;
    const confirmMsg = nextStatus
      ? `Activate access for ${account.first_name} ${account.last_name}?`
      : `Disable access for ${account.first_name} ${account.last_name}? They will be immediately blocked from signing in.`;

    if (window.confirm(confirmMsg)) {
      await api.toggleAccountStatus(account.id, nextStatus);
      await loadData();
      setSuccessMessage(
        `Account for ${account.first_name} ${account.last_name} is now ${nextStatus ? 'ACTIVE' : 'DISABLED'}.`
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleOpenEdit = (acc: Profile) => {
    setSelectedAccount(acc);
    setFormData({
      id_number: acc.id_number || '',
      first_name: acc.first_name,
      middle_name: acc.middle_name || '',
      last_name: acc.last_name,
      email: acc.email,
      password: '',
      role: acc.role,
      phone: acc.phone || '',
      is_active: acc.is_active,
      programId: programs[0]?.id || '',
      yearLevelId: yearLevels[0]?.id || '',
      department: 'Office of the Registrar',
      title: 'Staff Member',
    });
    setFormError(null);
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount) return;
    setFormSubmitting(true);
    setFormError(null);

    try {
      await api.updateAccount(selectedAccount.id, {
        id_number: formData.id_number.trim(),
        first_name: formData.first_name.trim(),
        middle_name: formData.middle_name.trim() || null,
        last_name: formData.last_name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || null,
        role: formData.role,
        is_active: formData.is_active,
      });

      setIsEditOpen(false);
      setSuccessMessage(`Account updated for ${formData.first_name} ${formData.last_name}.`);
      setTimeout(() => setSuccessMessage(null), 3000);
      await loadData();
    } catch (err: unknown) {
      setFormError((err as Error).message || 'Failed to update account.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleOpenResetPassword = (acc: Profile) => {
    setSelectedAccount(acc);
    setNewPassword(generateRandomPassword());
    setFormError(null);
    setIsResetPassOpen(true);
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount) return;
    if (!newPassword.trim() || newPassword.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }
    setFormSubmitting(true);

    try {
      await api.resetAccountPassword(selectedAccount.id, newPassword);
      setIsResetPassOpen(false);
      setSuccessMessage(`Password successfully reset for ${selectedAccount.email}!`);
      setTimeout(() => setSuccessMessage(null), 4000);
      await loadData();
    } catch (err: unknown) {
      setFormError((err as Error).message || 'Failed to reset password.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteAccount = async (acc: Profile) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete the account for ${acc.first_name} ${acc.last_name} (${acc.email})? This action cannot be undone.`
      )
    ) {
      await api.deleteAccount(acc.id);
      setSuccessMessage(`Account for ${acc.email} deleted.`);
      setTimeout(() => setSuccessMessage(null), 3000);
      await loadData();
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <ShieldCheck className="w-3 h-3 mr-1 text-purple-600" />
            ADMIN
          </span>
        );
      case 'STAFF':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
            <UserCheck className="w-3 h-3 mr-1 text-sky-600" />
            REGISTRAR
          </span>
        );
      case 'STUDENT':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <GraduationCap className="w-3 h-3 mr-1 text-emerald-600" />
            STUDENT
          </span>
        );
      case 'ALUMNI':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Award className="w-3 h-3 mr-1 text-amber-600" />
            ALUMNI
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-900" />
            Account List
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, issue, and manage system user credentials and login permissions for Berean College.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleOpenCreate} className="bg-blue-900 hover:bg-blue-950 text-white">
            <UserPlus className="w-4 h-4 mr-2" />
            Create Account
          </Button>
          <Button variant="outline" onClick={loadData} title="Refresh account list">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Success banner */}
      {successMessage && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center shadow-xs">
          <CheckCircle className="w-5 h-5 mr-2 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <div className="text-xs font-medium text-slate-500 uppercase">Total Accounts</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{accounts.length}</div>
            <div className="text-xs text-slate-400 mt-0.5">In database</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <div className="text-xs font-medium text-emerald-600 uppercase">Active Status</div>
            <div className="text-2xl font-bold text-emerald-700 mt-1">
              {accounts.filter((a) => a.is_active).length}
            </div>
            <div className="text-xs text-emerald-600/70 mt-0.5">Allowed login</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <div className="text-xs font-medium text-blue-600 uppercase">Currently Online</div>
            <div className="text-2xl font-bold text-blue-800 mt-1 flex items-center">
              {accounts.filter((a) => a.login_status === 'ONLINE').length}
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ml-2 animate-pulse" />
            </div>
            <div className="text-xs text-blue-500 mt-0.5">Active session</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <div className="text-xs font-medium text-red-600 uppercase">Disabled Accounts</div>
            <div className="text-2xl font-bold text-red-700 mt-1">
              {accounts.filter((a) => !a.is_active).length}
            </div>
            <div className="text-xs text-red-500 mt-0.5">Access blocked</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search by ID number, full name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-1">
                <span className="text-xs font-medium text-slate-500">Role:</span>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="h-9 px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-900"
                >
                  <option value="ALL">All Roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="STAFF">Registrar (Staff)</option>
                  <option value="STUDENT">Student</option>
                  <option value="ALUMNI">Alumni</option>
                </select>
              </div>

              <div className="flex items-center space-x-1">
                <span className="text-xs font-medium text-slate-500">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="h-9 px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-900"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active Only</option>
                  <option value="DISABLED">Disabled Only</option>
                </select>
              </div>

              {(searchTerm || selectedRole !== 'ALL' || selectedStatus !== 'ALL') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedRole('ALL');
                    setSelectedStatus('ALL');
                  }}
                  className="text-xs text-slate-600 h-9"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Table */}
      <Card className="border-slate-200 shadow-xs overflow-hidden">
        <CardHeader className="py-3 px-6 bg-slate-50 border-b border-slate-200 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-800">
              Registered Accounts ({filteredAccounts.length})
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              System access list with institutional ID, authentication state, and role permissions.
            </CardDescription>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">ID Number</th>
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Login Status</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-900" />
                    Loading account list...
                  </td>
                </tr>
              ) : filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500">
                    <UserX className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No user accounts match your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc) => {
                  const isOnline = acc.login_status === 'ONLINE';

                  return (
                    <tr key={acc.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* ID Number */}
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                        <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-xs border border-slate-200">
                          {acc.id_number || 'N/A'}
                        </span>
                      </td>

                      {/* Name & Photo */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2.5">
                          {acc.profile_photo_url ? (
                            <img
                              src={acc.profile_photo_url}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                              {acc.first_name[0]}
                              {acc.last_name[0]}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-slate-900 text-sm">
                              {acc.last_name}, {acc.first_name} {acc.middle_name || ''}
                            </div>
                            {acc.phone && <div className="text-[11px] text-slate-400">{acc.phone}</div>}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 font-mono text-slate-700">
                        {acc.email}
                      </td>

                      {/* Role */}
                      <td className="py-3 px-4">
                        {getRoleBadge(acc.role)}
                      </td>

                      {/* Login Status */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                            }`}
                          />
                          <span className={`font-medium ${isOnline ? 'text-emerald-700' : 'text-slate-500'}`}>
                            {isOnline ? 'ONLINE' : 'OFFLINE'}
                          </span>
                        </div>
                        {acc.last_login_at && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Last: {new Date(acc.last_login_at).toLocaleDateString()}
                          </div>
                        )}
                      </td>

                      {/* Status (Active / Disabled) */}
                      <td className="py-3 px-4">
                        {acc.is_active ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="w-3 h-3 mr-1 text-emerald-600" />
                            ACTIVE
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
                            <XCircle className="w-3 h-3 mr-1 text-red-500" />
                            DISABLED
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right space-x-1">
                        {/* Toggle Status */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(acc)}
                          className={`h-7 px-2 text-xs ${
                            acc.is_active
                              ? 'text-amber-700 hover:text-amber-800 hover:bg-amber-50'
                              : 'text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50'
                          }`}
                          title={acc.is_active ? 'Disable this account' : 'Activate this account'}
                        >
                          {acc.is_active ? 'Disable' : 'Enable'}
                        </Button>

                        {/* Reset Password */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenResetPassword(acc)}
                          className="h-7 px-2 text-blue-700 hover:bg-blue-50"
                          title="Reset Password"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </Button>

                        {/* Edit */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(acc)}
                          className="h-7 px-2 text-slate-700 hover:bg-slate-100"
                          title="Edit Details"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>

                        {/* Delete (Admin protected) */}
                        {acc.email !== 'admin@berean.edu' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAccount(acc)}
                            className="h-7 px-2 text-red-600 hover:bg-red-50"
                            title="Delete Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* CREATE ACCOUNT MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">Create New User Account</h3>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              {formError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md border border-red-200 flex items-start">
                  <AlertTriangle className="w-4 h-4 mr-2 shrink-0 text-red-500 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Role Selection */}
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Account Role *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['STUDENT', 'STAFF', 'ALUMNI', 'ADMIN'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, role: r }))}
                      className={`py-2 px-2 rounded-lg text-center font-semibold border transition-all text-xs ${
                        formData.role === r
                          ? 'bg-blue-900 text-white border-blue-950 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {r === 'STAFF' ? 'REGISTRAR' : r}
                    </button>
                  ))}
                </div>
              </div>

              {/* ID Number */}
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Institutional ID Number *
                </label>
                <Input
                  required
                  placeholder="e.g. BBC-2026-0005 or EMP-2024-002"
                  value={formData.id_number}
                  onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
                  className="h-9"
                />
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Official student matriculation number or employee staff ID.
                </p>
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    First Name *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Samuel"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Middle Name
                  </label>
                  <Input
                    placeholder="e.g. John"
                    value={formData.middle_name}
                    onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Last Name *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Miller"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="h-9"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Institutional Email *
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="e.g. smiller@berean.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <Input
                    placeholder="+63 917 000 0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-9"
                  />
                </div>
              </div>

              {/* Initial Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                    Initial Account Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, password: generateRandomPassword() })}
                    className="text-[11px] text-blue-900 hover:underline font-semibold"
                  >
                    Generate Random Password
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-9 pr-10 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role-Specific fields */}
              {(formData.role === 'STUDENT' || formData.role === 'ALUMNI') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                  <div>
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Academic Program
                    </label>
                    <select
                      value={formData.programId}
                      onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
                      className="w-full h-9 px-2.5 text-xs border border-slate-300 rounded-md bg-white text-slate-700"
                    >
                      {programs.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.code} - {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Year Level
                    </label>
                    <select
                      value={formData.yearLevelId}
                      onChange={(e) => setFormData({ ...formData, yearLevelId: e.target.value })}
                      className="w-full h-9 px-2.5 text-xs border border-slate-300 rounded-md bg-white text-slate-700"
                    >
                      {yearLevels.map((yl) => (
                        <option key={yl.id} value={yl.id}>
                          {yl.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {formData.role === 'STAFF' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                  <div>
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Department
                    </label>
                    <Input
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="h-9"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Position / Title
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="h-9"
                    />
                  </div>
                </div>
              )}

              {/* Status Toggle */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800">Account Access State</span>
                  <p className="text-[11px] text-slate-500">Allow this user to sign into the system immediately.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={formSubmitting} className="bg-blue-900 hover:bg-blue-950 text-white">
                  Create Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ACCOUNT MODAL */}
      {isEditOpen && selectedAccount && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Edit className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">Edit User Account</h3>
              </div>
              <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                &times;
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                  {formError}
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  ID Number *
                </label>
                <Input
                  required
                  value={formData.id_number}
                  onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
                  className="h-9"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">First Name *</label>
                  <Input
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">Middle Name</label>
                  <Input
                    value={formData.middle_name}
                    onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">Last Name *</label>
                  <Input
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">Email *</label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">Phone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-9"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full h-9 px-2.5 text-xs border border-slate-300 rounded-md bg-white text-slate-700"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="STAFF">STAFF (REGISTRAR)</option>
                  <option value="STUDENT">STUDENT</option>
                  <option value="ALUMNI">ALUMNI</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800">Account Access State</span>
                  <p className="text-[11px] text-slate-500">Enable or disable authentication for this user.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={formSubmitting} className="bg-blue-900 hover:bg-blue-950 text-white">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {isResetPassOpen && selectedAccount && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">Reset Account Password</h3>
              </div>
              <button
                onClick={() => setIsResetPassOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="font-semibold text-slate-800 text-sm">
                  {selectedAccount.first_name} {selectedAccount.last_name}
                </div>
                <div className="text-slate-500 font-mono text-xs">{selectedAccount.email}</div>
                <div className="mt-1">{getRoleBadge(selectedAccount.role)}</div>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                  {formError}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                    New Secure Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewPassword(generateRandomPassword())}
                    className="text-[11px] text-blue-900 hover:underline font-semibold"
                  >
                    Generate Random
                  </button>
                </div>
                <div className="relative">
                  <Input
                    required
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-9 font-mono pr-10"
                    placeholder="Enter new password"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Please copy and safely provide this new password to the user.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsResetPassOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={formSubmitting} className="bg-blue-900 hover:bg-blue-950 text-white">
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
