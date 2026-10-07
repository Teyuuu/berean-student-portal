import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, Student, UserRole, StudentStatus } from '@/types';
import { api, localStore, isLiveSupabaseConfigured, supabase } from '@/lib/supabase';

interface AuthContextType {
  user: Profile | null;
  student: Student | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ error?: string }>;
  register: (data: {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    programId?: string;
  }) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  switchPersona: (role: UserRole) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        if (isLiveSupabaseConfigured) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            if (profile) {
              setUser(profile as Profile);
              if (profile.role === 'STUDENT' || profile.role === 'ALUMNI') {
                const std = await api.getStudentByProfileId(profile.id);
                setStudent(std);
              }
              setIsLoading(false);
              return;
            }
          }
        }

        // Check local saved session or default to Admin demo
        const savedUserId = localStorage.getItem('berean_current_user_id');
        const profiles = localStore.getProfiles();
        const found = savedUserId ? profiles.find((p) => p.id === savedUserId) : profiles[0]; // David MacArthur (Admin)

        if (found) {
          setUser(found);
          if (found.role === 'STUDENT' || found.role === 'ALUMNI') {
            const std = await api.getStudentByProfileId(found.id);
            setStudent(std);
          } else {
            setStudent(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const refreshUser = async () => {
    if (!user) return;
    const profiles = localStore.getProfiles();
    const current = profiles.find((p) => p.id === user.id);
    if (current) {
      setUser(current);
      if (current.role === 'STUDENT' || current.role === 'ALUMNI') {
        const std = await api.getStudentByProfileId(current.id);
        setStudent(std);
      }
    }
  };

  const login = async (email: string, _pass: string) => {
    setIsLoading(true);
    try {
      if (isLiveSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: _pass });
        if (error) return { error: error.message };
        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          if (profile) {
            setUser(profile as Profile);
            if (profile.role === 'STUDENT' || profile.role === 'ALUMNI') {
              const std = await api.getStudentByProfileId(profile.id);
              setStudent(std);
            }
            return {};
          }
        }
      }

      // Check local profiles
      const profiles = localStore.getProfiles();
      const matched = profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
      if (!matched) {
        return { error: 'No account found with this email. Please check your credentials or register.' };
      }

      setUser(matched);
      localStorage.setItem('berean_current_user_id', matched.id);

      if (matched.role === 'STUDENT' || matched.role === 'ALUMNI') {
        const std = await api.getStudentByProfileId(matched.id);
        setStudent(std);
      } else {
        setStudent(null);
      }

      return {};
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    programId?: string;
  }) => {
    setIsLoading(true);
    try {
      const newUserId = crypto.randomUUID();
      const newProfile: Profile = {
        id: newUserId,
        first_name: data.firstName,
        middle_name: data.middleName || null,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone || null,
        role: 'STUDENT',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const newStudent: Student = {
        id: crypto.randomUUID(),
        profile_id: newUserId,
        student_number: null, // assigned upon staff verification!
        program_id: data.programId || '11111111-1111-1111-1111-111111111101',
        curriculum_id: '55555555-5555-5555-5555-555555555501',
        year_level_id: '44444444-4444-4444-4444-444444444401',
        student_status: 'APPLICANT' as StudentStatus,
        admission_date: new Date().toISOString().split('T')[0],
        expected_graduation_date: null,
        graduation_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Add to store
      const profiles = localStore.getProfiles();
      localStore.saveProfiles([...profiles, newProfile]);

      const students = localStore.getStudents();
      localStore.saveStudents([...students, newStudent]);

      // Set current session
      setUser(newProfile);
      setStudent(newStudent);
      localStorage.setItem('berean_current_user_id', newUserId);

      // Create notification
      await api.createAnnouncement({
        title: `New Registration: ${newProfile.first_name} ${newProfile.last_name}`,
        content: `A new student applicant (${newProfile.email}) has submitted their registration and awaits verification.`,
        audience: 'STAFF',
        is_pinned: false,
        status: 'PUBLISHED',
      });

      return {};
    } catch (err: unknown) {
      return { error: (err as Error).message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (isLiveSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setStudent(null);
    localStorage.removeItem('berean_current_user_id');
  };

  const switchPersona = async (targetRole: UserRole) => {
    setIsLoading(true);
    try {
      const profiles = localStore.getProfiles();
      const target = profiles.find((p) => p.role === targetRole);
      if (target) {
        setUser(target);
        localStorage.setItem('berean_current_user_id', target.id);
        if (target.role === 'STUDENT' || target.role === 'ALUMNI') {
          const std = await api.getStudentByProfileId(target.id);
          setStudent(std);
        } else {
          setStudent(null);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        student,
        role: user?.role || null,
        isLoading,
        login,
        register,
        logout,
        switchPersona,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
