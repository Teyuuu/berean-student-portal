-- Berean Bible College Student and Alumni Portal
-- Development Seed Data
-- File: supabase/seed.sql

-- Clear existing demo data if re-running
TRUNCATE public.audit_logs CASCADE;
TRUNCATE public.notifications CASCADE;
TRUNCATE public.announcements CASCADE;
TRUNCATE public.grades CASCADE;
TRUNCATE public.enrollment_subjects CASCADE;
TRUNCATE public.enrollments CASCADE;
TRUNCATE public.enrollment_periods CASCADE;
TRUNCATE public.student_documents CASCADE;
TRUNCATE public.alumni_profiles CASCADE;
TRUNCATE public.curriculum_subjects CASCADE;
TRUNCATE public.curricula CASCADE;
TRUNCATE public.subjects CASCADE;
TRUNCATE public.year_levels CASCADE;
TRUNCATE public.semesters CASCADE;
TRUNCATE public.academic_years CASCADE;
TRUNCATE public.programs CASCADE;
TRUNCATE public.students CASCADE;
TRUNCATE public.staff CASCADE;

-- Note: In production Supabase, users are created via auth.users and trigger handle_new_user().
-- For local PostgreSQL / mock seeding, we insert sample UUIDs into profiles directly.

-- 1. Programs
INSERT INTO public.programs (id, code, name, description, duration_years, status) VALUES
('11111111-1111-1111-1111-111111111101', 'BTH', 'Bachelor of Theology', 'A four-year rigorous theological program focusing on biblical languages, systematic theology, church history, and pastoral ministry.', 4, 'ACTIVE'),
('11111111-1111-1111-1111-111111111102', 'BMN', 'Bachelor of Ministry', 'A four-year practical ministry curriculum equipping students for pastoral leadership, evangelism, and community outreach.', 4, 'ACTIVE'),
('11111111-1111-1111-1111-111111111103', 'DCM', 'Diploma in Christian Ministry', 'A two-year foundational program designed for lay leaders, Sunday school teachers, and church workers.', 2, 'ACTIVE');

-- 2. Academic Years
INSERT INTO public.academic_years (id, name, start_date, end_date, is_current, status) VALUES
('22222222-2222-2222-2222-222222222201', '2025-2026', '2025-08-15', '2026-05-30', FALSE, 'CLOSED'),
('22222222-2222-2222-2222-222222222202', '2026-2027', '2026-08-15', '2027-05-30', TRUE, 'ACTIVE'),
('22222222-2222-2222-2222-222222222203', '2027-2028', '2027-08-15', '2028-05-30', FALSE, 'UPCOMING');

-- 3. Semesters
INSERT INTO public.semesters (id, name, sequence, status) VALUES
('33333333-3333-3333-3333-333333333301', 'First Semester', 1, 'ACTIVE'),
('33333333-3333-3333-3333-333333333302', 'Second Semester', 2, 'ACTIVE'),
('33333333-3333-3333-3333-333333333303', 'Summer Term', 3, 'ACTIVE');

-- 4. Year Levels
INSERT INTO public.year_levels (id, name, level_number) VALUES
('44444444-4444-4444-4444-444444444401', 'Year 1 (Freshman)', 1),
('44444444-4444-4444-4444-444444444402', 'Year 2 (Sophomore)', 2),
('44444444-4444-4444-4444-444444444403', 'Year 3 (Junior)', 3),
('44444444-4444-4444-4444-444444444404', 'Year 4 (Senior)', 4);

-- 5. Curricula
INSERT INTO public.curricula (id, program_id, name, version, effective_academic_year, status) VALUES
('55555555-5555-5555-5555-555555555501', '11111111-1111-1111-1111-111111111101', 'BTH Curriculum 2026', '2026.1', '2026-2027', 'ACTIVE'),
('55555555-5555-5555-5555-555555555502', '11111111-1111-1111-1111-111111111102', 'BMN Curriculum 2026', '2026.1', '2026-2027', 'ACTIVE');

-- 6. Official Subjects
INSERT INTO public.subjects (id, code, name, description, units, status) VALUES
-- Year 1 - First Semester
('66666666-0001-0001-0001-000000000001', 'ENG-101', 'English 1', 'Foundations of collegiate English, grammar, composition, and writing skills for theological study.', 3, 'ACTIVE'),
('66666666-0001-0001-0001-000000000002', 'ANT-101', 'Anthropology - Doctrine of Man', 'Biblical study of the origin, nature, fall, depravity, and constitution of man from Genesis and Scripture.', 3, 'ACTIVE'),
('66666666-0001-0001-0001-000000000003', 'BPT-101', 'Baptist Distinctives', 'Biblical principles and historic distinctive positions of Baptists.', 3, 'ACTIVE'),
-- Year 1 - Second Semester
('66666666-0001-0002-0001-000000000004', 'BIB-102', 'Bibliology - Doctrine of the Bible', 'Study of revelation, verbal plenary inspiration, inerrancy, preservation, and authority of the Holy Scriptures.', 3, 'ACTIVE'),
('66666666-0001-0002-0001-000000000005', 'HER-102', 'Hermeneutics 2', 'Advanced literal-grammatical-historical principles of biblical interpretation and typology.', 3, 'ACTIVE'),
('66666666-0001-0002-0001-000000000006', 'SOT-102', 'Soteriology - Doctrine of Salvation', 'Exhaustive biblical study of grace, repentance, faith, justification, regeneration, and eternal security.', 3, 'ACTIVE'),
-- Year 2 - First Semester
('66666666-0002-0001-0001-000000000007', 'ECC-201', 'Ecclesiology - Doctrine of the Church', 'The local church: its founding, nature, ordinances, government, and worldwide mission.', 3, 'ACTIVE'),
('66666666-0002-0001-0001-000000000008', 'PRA-201', 'Doctrine of Prayer and Fasting', 'Scriptural principles and spiritual disciplines through intercessory prayer and biblical fasting.', 3, 'ACTIVE'),
('66666666-0002-0001-0001-000000000009', 'NTS-201', 'New Testament Survey', 'Historical background, themes, authors, and canonical flow of the 27 New Testament books.', 3, 'ACTIVE'),
-- Year 2 - Second Semester
('66666666-0002-0002-0001-000000000010', 'CLT-202', 'Biblical Cults', 'Examination and refutation of major theological cults and false religions in light of Scripture.', 3, 'ACTIVE'),
('66666666-0002-0002-0001-000000000011', 'ANG-202', 'Angeology - Doctrine of Angels & Satan', 'Biblical teaching on the creation, ministry of holy angels, demonology, and Satanology.', 3, 'ACTIVE'),
('66666666-0002-0002-0001-000000000012', 'ESC-202', 'Eschatology - Doctrine of Last Things', 'Premillennial prophecy: Rapture, Tribulation, Second Coming, Millennial Kingdom, and Great White Throne judgment.', 3, 'ACTIVE'),
-- Year 3 - First Semester
('66666666-0003-0001-0001-000000000013', 'CHR-301', 'Christology - Doctrine of Christ', 'The deity, virgin birth, sinless life, substitutionary atonement, bodily resurrection, and ascension of Christ.', 3, 'ACTIVE'),
('66666666-0003-0001-0001-000000000014', 'PNE-301', 'Pneumatology - Doctrine of the Holy Spirit', 'The personality, deity, work, indwelling, filling, gifts, and fruit of the Holy Spirit.', 3, 'ACTIVE'),
('66666666-0003-0001-0001-000000000015', 'APO-301', 'Problems, Apologetics, Defense of the KJV', 'Apologetics, textual problems, and defense of the King James Bible and Textus Receptus.', 3, 'ACTIVE'),
-- Year 3 - Second Semester
('66666666-0003-0002-0001-000000000016', 'HOM-302', 'Homiletics - Art of Preaching', 'Preparation, structure, delivery, and passion of expository biblical sermon preaching.', 3, 'ACTIVE'),
('66666666-0003-0002-0001-000000000017', 'TCH-302', 'Teaching for Results', 'Pedagogy, Sunday School methodologies, and effective Bible teaching producing life transformation.', 3, 'ACTIVE'),
('66666666-0003-0002-0001-000000000018', 'PAS-302', 'Pastoral Epistles', 'Exegetical study of 1 & 2 Timothy and Titus: qualifications, pastoral oversight, and administration.', 3, 'ACTIVE'),
-- Year 4 - First Semester
('66666666-0004-0001-0001-000000000019', 'MUS-401', 'Music 1', 'Biblical philosophy of sacred music, hymnology, choral leadership, and church music honoring God.', 3, 'ACTIVE'),
('66666666-0004-0001-0001-000000000020', 'ANT-401', 'Anthropology - Doctrine of Man', 'Senior seminar in biblical anthropology, cultural engagement, moral dilemmas, and biblical worldview.', 3, 'ACTIVE'),
('66666666-0004-0001-0001-000000000021', 'BPT-401', 'Baptist Distinctives', 'Senior historical and practical examination of Baptist history, martyrs, covenants, and policy.', 3, 'ACTIVE'),
-- Year 4 - Second Semester
('66666666-0004-0002-0001-000000000022', 'ISR-402', 'Israelology - Doctrine of Israel', 'Biblical distinction between Israel and Church, God’s covenants to Abraham’s seed, and Israel’s prophetic role.', 3, 'ACTIVE'),
('66666666-0004-0002-0001-000000000023', 'MIS-402', 'Mission Immersion - Practical', 'Field internship, evangelism practicum, and local church planting immersion.', 3, 'ACTIVE');

-- 7. Curriculum Subjects Mapping (BTH Curriculum 2026)
INSERT INTO public.curriculum_subjects (id, curriculum_id, subject_id, year_level_id, semester_id, prerequisite_subject_id, is_required, status) VALUES
-- Year 1, 1st Semester
('77777777-0001-0001-0001-000000000001', '55555555-5555-5555-5555-555555555501', '66666666-0001-0001-0001-000000000001', '44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333301', NULL, TRUE, 'ACTIVE'),
('77777777-0001-0001-0001-000000000002', '55555555-5555-5555-5555-555555555501', '66666666-0001-0001-0001-000000000002', '44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333301', NULL, TRUE, 'ACTIVE'),
('77777777-0001-0001-0001-000000000003', '55555555-5555-5555-5555-555555555501', '66666666-0001-0001-0001-000000000003', '44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333301', NULL, TRUE, 'ACTIVE'),
-- Year 1, 2nd Semester
('77777777-0001-0002-0001-000000000004', '55555555-5555-5555-5555-555555555501', '66666666-0001-0002-0001-000000000004', '44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333302', NULL, TRUE, 'ACTIVE'),
('77777777-0001-0002-0001-000000000005', '55555555-5555-5555-5555-555555555501', '66666666-0001-0002-0001-000000000005', '44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333302', NULL, TRUE, 'ACTIVE'),
('77777777-0001-0002-0001-000000000006', '55555555-5555-5555-5555-555555555501', '66666666-0001-0002-0001-000000000006', '44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333302', NULL, TRUE, 'ACTIVE'),
-- Year 2, 1st Semester
('77777777-0002-0001-0001-000000000007', '55555555-5555-5555-5555-555555555501', '66666666-0002-0001-0001-000000000007', '44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333301', NULL, TRUE, 'ACTIVE'),
('77777777-0002-0001-0001-000000000008', '55555555-5555-5555-5555-555555555501', '66666666-0002-0001-0001-000000000008', '44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333301', NULL, TRUE, 'ACTIVE'),
('77777777-0002-0001-0001-000000000009', '55555555-5555-5555-5555-555555555501', '66666666-0002-0001-0001-000000000009', '44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333301', NULL, TRUE, 'ACTIVE'),
-- Year 2, 2nd Semester
('77777777-0002-0002-0001-000000000010', '55555555-5555-5555-5555-555555555501', '66666666-0002-0002-0001-000000000010', '44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333302', NULL, TRUE, 'ACTIVE'),
('77777777-0002-0002-0001-000000000011', '55555555-5555-5555-5555-555555555501', '66666666-0002-0002-0001-000000000011', '44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333302', NULL, TRUE, 'ACTIVE'),
('77777777-0002-0002-0001-000000000012', '55555555-5555-5555-5555-555555555501', '66666666-0002-0002-0001-000000000012', '44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333302', NULL, TRUE, 'ACTIVE'),
-- Year 3, 1st Semester
('77777777-0003-0001-0001-000000000013', '55555555-5555-5555-5555-555555555501', '66666666-0003-0001-0001-000000000013', '44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333301', NULL, TRUE, 'ACTIVE'),
('77777777-0003-0001-0001-000000000014', '55555555-5555-5555-5555-555555555501', '66666666-0003-0001-0001-000000000014', '44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333301', NULL, TRUE, 'ACTIVE'),
('77777777-0003-0001-0001-000000000015', '55555555-5555-5555-5555-555555555501', '66666666-0003-0001-0001-000000000015', '44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333301', NULL, TRUE, 'ACTIVE'),
-- Year 3, 2nd Semester
('77777777-0003-0002-0001-000000000016', '55555555-5555-5555-5555-555555555501', '66666666-0003-0002-0001-000000000016', '44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333302', NULL, TRUE, 'ACTIVE'),
('77777777-0003-0002-0001-000000000017', '55555555-5555-5555-5555-555555555501', '66666666-0003-0002-0001-000000000017', '44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333302', NULL, TRUE, 'ACTIVE'),
('77777777-0003-0002-0001-000000000018', '55555555-5555-5555-5555-555555555501', '66666666-0003-0002-0001-000000000018', '44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333302', NULL, TRUE, 'ACTIVE'),
-- Year 4, 1st Semester
('77777777-0004-0001-0001-000000000019', '55555555-5555-5555-5555-555555555501', '66666666-0004-0001-0001-000000000019', '44444444-4444-4444-4444-444444444404', '33333333-3333-3333-3333-333333333301', NULL, TRUE, 'ACTIVE'),
('77777777-0004-0001-0001-000000000020', '55555555-5555-5555-5555-555555555501', '66666666-0004-0001-0001-000000000020', '44444444-4444-4444-4444-444444444404', '33333333-3333-3333-3333-333333333301', '66666666-0001-0001-0001-000000000002', TRUE, 'ACTIVE'),
('77777777-0004-0001-0001-000000000021', '55555555-5555-5555-5555-555555555501', '66666666-0004-0001-0001-000000000021', '44444444-4444-4444-4444-444444444404', '33333333-3333-3333-3333-333333333301', '66666666-0001-0001-0001-000000000003', TRUE, 'ACTIVE'),
-- Year 4, 2nd Semester
('77777777-0004-0002-0001-000000000022', '55555555-5555-5555-5555-555555555501', '66666666-0004-0002-0001-000000000022', '44444444-4444-4444-4444-444444444404', '33333333-3333-3333-3333-333333333302', NULL, TRUE, 'ACTIVE'),
('77777777-0004-0002-0001-000000000023', '55555555-5555-5555-5555-555555555501', '66666666-0004-0002-0001-000000000023', '44444444-4444-4444-4444-444444444404', '33333333-3333-3333-3333-333333333302', NULL, TRUE, 'ACTIVE');

-- 8. Enrollment Periods
INSERT INTO public.enrollment_periods (id, academic_year_id, semester_id, start_date, end_date, status) VALUES
('88888888-8888-8888-8888-888888888801', '22222222-2222-2222-2222-222222222202', '33333333-3333-3333-3333-333333333301', '2026-08-01 00:00:00+00', '2026-08-30 23:59:59+00', 'OPEN'),
('88888888-8888-8888-8888-888888888802', '22222222-2222-2222-2222-222222222202', '33333333-3333-3333-3333-333333333302', '2027-01-05 00:00:00+00', '2027-01-25 23:59:59+00', 'UPCOMING');

-- 9. Seed Auth Users and Profiles (Admin, Staff, Student, Alumni)
DO $$
BEGIN
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES
    ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@berean.edu', crypt('Admin@Berean2026!', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"role":"ADMIN","first_name":"David","last_name":"MacArthur"}', NOW(), NOW()),
    ('a0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'registrar@berean.edu', crypt('Staff@Berean2026!', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"role":"STAFF","first_name":"Hannah","last_name":"Spurgeon"}', NOW(), NOW()),
    ('a0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'student@berean.edu', crypt('Student@Berean2026!', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"role":"STUDENT","first_name":"Timothy","last_name":"Barnabas"}', NOW(), NOW()),
    ('a0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'applicant@berean.edu', crypt('Applicant@Berean2026!', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"role":"STUDENT","first_name":"Priscilla","last_name":"Aquila"}', NOW(), NOW()),
    ('a0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'alumni@berean.edu', crypt('Alumni@Berean2026!', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"role":"ALUMNI","first_name":"Stephen","last_name":"Tyndale"}', NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Skipping auth.users insert: %', SQLERRM;
END $$;

INSERT INTO public.profiles (id, first_name, middle_name, last_name, email, phone, role, is_active) VALUES
('a0000000-0000-0000-0000-000000000001', 'David', 'K.', 'MacArthur', 'admin@berean.edu', '+63 917 100 2001', 'ADMIN', TRUE),
('a0000000-0000-0000-0000-000000000002', 'Hannah', 'M.', 'Spurgeon', 'registrar@berean.edu', '+63 917 100 2002', 'STAFF', TRUE),
('a0000000-0000-0000-0000-000000000003', 'Timothy', 'J.', 'Barnabas', 'student@berean.edu', '+63 917 100 2003', 'STUDENT', TRUE),
('a0000000-0000-0000-0000-000000000004', 'Priscilla', 'A.', 'Aquila', 'applicant@berean.edu', '+63 917 100 2004', 'STUDENT', TRUE),
('a0000000-0000-0000-0000-000000000005', 'Stephen', 'P.', 'Tyndale', 'alumni@berean.edu', '+63 917 100 2005', 'ALUMNI', TRUE)
ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = EXCLUDED.role;

-- Staff Record
INSERT INTO public.staff (id, profile_id, employee_number, department, title) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'EMP-2024-001', 'Office of the Registrar', 'Registrar Officer');

-- Student Records
INSERT INTO public.students (id, profile_id, student_number, program_id, curriculum_id, year_level_id, student_status, admission_date, expected_graduation_date) VALUES
-- Enrolled Student
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'BBC-2026-0001', '11111111-1111-1111-1111-111111111101', '55555555-5555-5555-5555-555555555501', '44444444-4444-4444-4444-444444444401', 'ENROLLED', '2026-08-01', '2030-05-30'),
-- Applicant Student
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000004', NULL, '11111111-1111-1111-1111-111111111102', '55555555-5555-5555-5555-555555555502', '44444444-4444-4444-4444-444444444401', 'PENDING_VERIFICATION', '2026-08-05', '2030-05-30'),
-- Alumni Student Record (Preserved!)
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000005', 'BBC-2021-0088', '11111111-1111-1111-1111-111111111101', '55555555-5555-5555-5555-555555555501', '44444444-4444-4444-4444-444444444404', 'ALUMNI', '2021-08-01', '2025-05-30');

-- Alumni Profile
INSERT INTO public.alumni_profiles (
    id, student_id, profile_id, graduation_year, graduation_date, degree_conferred,
    employer, position, ministry_involvement, industry, location, email, phone, bio
) VALUES (
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000005',
    2025,
    '2025-05-25',
    'Bachelor of Theology',
    'Grace Reformed Baptist Church',
    'Associate Pastor of Youth & Discipleship',
    'Pulpit supply and pastoral counseling in South Manila',
    'Ministry & Non-Profit',
    'Metro Manila, Philippines',
    'alumni@berean.edu',
    '+63 917 100 2005',
    'Proud Berean graduate serving God’s flock with biblical faithfulness and expositional preaching.'
);

-- 10. Sample Enrollments
INSERT INTO public.enrollments (
    id, student_id, academic_year_id, semester_id, enrollment_period_id,
    status, total_units, submitted_at, reviewed_at, reviewed_by, remarks
) VALUES
-- Approved Enrollment for Timothy
(
    'e0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '22222222-2222-2222-2222-222222222202',
    '33333333-3333-3333-3333-333333333301',
    '88888888-8888-8888-8888-888888888801',
    'APPROVED',
    12,
    '2026-08-10 09:30:00+00',
    '2026-08-11 14:00:00+00',
    'a0000000-0000-0000-0000-000000000002',
    'All prerequisites verified. Enrolled for 1st Semester 2026-2027.'
);

-- Enrolled Subjects for Timothy
INSERT INTO public.enrollment_subjects (id, enrollment_id, subject_id, units, status) VALUES
('f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', '66666666-6666-6666-6666-666666666601', 3, 'ENROLLED'),
('f0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', '66666666-6666-6666-6666-666666666602', 3, 'ENROLLED'),
('f0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000001', '66666666-6666-6666-6666-666666666603', 3, 'ENROLLED'),
('f0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000001', '66666666-6666-6666-6666-666666666610', 3, 'ENROLLED');

-- Grades for Completed Historical Subjects (e.g., Stephen Tyndale - Alumni historical records)
-- Historical Enrollment for Stephen
INSERT INTO public.enrollments (
    id, student_id, academic_year_id, semester_id,
    status, total_units, submitted_at, reviewed_at, remarks
) VALUES (
    'e0000000-0000-0000-0000-000000000099',
    'c0000000-0000-0000-0000-000000000003',
    '22222222-2222-2222-2222-222222222201',
    '33333333-3333-3333-3333-333333333301',
    'COMPLETED',
    9,
    '2025-08-10 09:00:00+00',
    '2025-08-11 10:00:00+00',
    'Graduated cohort record.'
);

INSERT INTO public.enrollment_subjects (id, enrollment_id, subject_id, units, status) VALUES
('f0000000-0000-0000-0000-000000000091', 'e0000000-0000-0000-0000-000000000099', '66666666-6666-6666-6666-666666666601', 3, 'COMPLETED'),
('f0000000-0000-0000-0000-000000000092', 'e0000000-0000-0000-0000-000000000099', '66666666-6666-6666-6666-666666666602', 3, 'COMPLETED'),
('f0000000-0000-0000-0000-000000000093', 'e0000000-0000-0000-0000-000000000099', '66666666-6666-6666-6666-666666666603', 3, 'COMPLETED');

INSERT INTO public.grades (id, student_id, enrollment_subject_id, grade, remarks, status, released_at, entered_by) VALUES
('99999999-9999-9999-9999-999999999901', 'c0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000091', 1.25, 'Excellent', 'RELEASED', '2025-12-18 10:00:00+00', 'a0000000-0000-0000-0000-000000000001'),
('99999999-9999-9999-9999-999999999902', 'c0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000092', 1.00, 'Superior', 'RELEASED', '2025-12-18 10:00:00+00', 'a0000000-0000-0000-0000-000000000001'),
('99999999-9999-9999-9999-999999999903', 'c0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000093', 1.50, 'Very Good', 'RELEASED', '2025-12-18 10:00:00+00', 'a0000000-0000-0000-0000-000000000001');

-- 11. Announcements
INSERT INTO public.announcements (id, title, content, audience, is_pinned, published_at, status, author_id) VALUES
('aa000000-0000-0000-0000-000000000001', 'Welcome to Academic Year 2026-2027', 'Welcome back esteemed students, faculty, and staff to Berean Bible College. May our hearts remain steadfast in examining the Scriptures daily (Acts 17:11). Please review your enrollment subjects and course syllabi.', 'ALL', TRUE, NOW(), 'PUBLISHED', 'a0000000-0000-0000-0000-000000000001'),
('aa000000-0000-0000-0000-000000000002', 'First Semester 2026-2027 Enrollment Period is Now Open', 'Regular enrollment for the 1st Semester is officially open until August 30, 2026. All students must submit subject requests via the Student Portal. Ensure prerequisites are satisfied before submitting.', 'STUDENTS', TRUE, NOW(), 'PUBLISHED', 'a0000000-0000-0000-0000-000000000002'),
('aa000000-0000-0000-0000-000000000003', 'Annual Alumni Ministry & Fellowship Summit 2026', 'Calling all Berean Bible College alumni! Join us for a weekend of prayer, theological reflections, and fellowship this coming November at the Main Campus Auditorium. Registration details will be sent via email.', 'ALUMNI', FALSE, NOW(), 'PUBLISHED', 'a0000000-0000-0000-0000-000000000001');

-- 12. Notifications
INSERT INTO public.notifications (user_id, title, message, link, type, is_read) VALUES
('a0000000-0000-0000-0000-000000000003', 'Enrollment Approved', 'Your enrollment for 1st Semester 2026-2027 has been reviewed and approved by the Registrar.', '/student/enrollment', 'SUCCESS', FALSE),
('a0000000-0000-0000-0000-000000000004', 'Registration Under Review', 'Your applicant credentials have been received and are currently undergoing verification.', '/student/profile', 'INFO', FALSE);

-- 13. Audit Log
INSERT INTO public.audit_logs (user_id, user_email, action, entity, entity_id, new_data) VALUES
('a0000000-0000-0000-0000-000000000001', 'admin@berean.edu', 'SYSTEM_INITIALIZATION', 'system', 'system', '{"status": "Database successfully initialized with initial schema and academic programs"}'::jsonb);
