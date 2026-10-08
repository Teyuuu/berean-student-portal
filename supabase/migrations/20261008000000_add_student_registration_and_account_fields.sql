-- Berean Bible College Student and Alumni Portal
-- Migration: Add student multi-step registration details and account management columns
-- File: supabase/migrations/20261008000000_add_student_registration_and_account_fields.sql

-- 1. Add account management columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS id_number TEXT,
  ADD COLUMN IF NOT EXISTS login_status TEXT DEFAULT 'OFFLINE',
  ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS password TEXT;

-- Create an index on id_number for quick lookups
CREATE INDEX IF NOT EXISTS idx_profiles_id_number ON public.profiles(id_number);

-- 2. Add detailed registration form columns to students table
ALTER TABLE public.students
  -- Personal Background
  ADD COLUMN IF NOT EXISTS nickname TEXT,
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS age NUMERIC,
  ADD COLUMN IF NOT EXISTS gender TEXT,
  ADD COLUMN IF NOT EXISTS civil_status TEXT,
  ADD COLUMN IF NOT EXISTS nationality TEXT DEFAULT 'Filipino',
  ADD COLUMN IF NOT EXISTS present_address TEXT,
  ADD COLUMN IF NOT EXISTS mobile_no TEXT,
  ADD COLUMN IF NOT EXISTS occupation TEXT,
  ADD COLUMN IF NOT EXISTS business_address TEXT,
  ADD COLUMN IF NOT EXISTS business_tel_no TEXT,

  -- Educational Background
  ADD COLUMN IF NOT EXISTS school_graduated TEXT,
  ADD COLUMN IF NOT EXISTS date_graduated TEXT,
  ADD COLUMN IF NOT EXISTS degree_honors_awards TEXT,

  -- References & Emergency Contact
  ADD COLUMN IF NOT EXISTS character_reference_name TEXT,
  ADD COLUMN IF NOT EXISTS character_reference_no TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
  ADD COLUMN IF NOT EXISTS emergency_address TEXT,
  ADD COLUMN IF NOT EXISTS emergency_no TEXT,
  ADD COLUMN IF NOT EXISTS emergency_relation TEXT,

  -- Spiritual & Church Background
  ADD COLUMN IF NOT EXISTS home_church TEXT,
  ADD COLUMN IF NOT EXISTS church_address TEXT,
  ADD COLUMN IF NOT EXISTS pastor_name TEXT,
  ADD COLUMN IF NOT EXISTS date_saved DATE,
  ADD COLUMN IF NOT EXISTS date_baptized DATE,
  ADD COLUMN IF NOT EXISTS ministries_involved TEXT,
  ADD COLUMN IF NOT EXISTS special_skills TEXT,
  ADD COLUMN IF NOT EXISTS musical_instruments TEXT,

  -- Personal Statement & Health
  ADD COLUMN IF NOT EXISTS reason_for_enrolling TEXT,
  ADD COLUMN IF NOT EXISTS health_information TEXT,
  ADD COLUMN IF NOT EXISTS brief_testimony TEXT;
