import {
  Profile,
  Program,
  AcademicYear,
  Semester,
  YearLevel,
  Curriculum,
  Subject,
  CurriculumSubject,
  Student,
  Staff,
  EnrollmentPeriod,
  Enrollment,
  EnrollmentSubject,
  Grade,
  StudentDocument,
  AlumniProfile,
  Announcement,
  Notification,
  AuditLog,
} from '@/types';

export const INITIAL_PROGRAMS: Program[] = [
  {
    id: '11111111-1111-1111-1111-111111111101',
    code: 'BTH',
    name: 'Bachelor of Theology',
    description: 'A four-year biblical curriculum emphasizing sound doctrine, Baptist distinctives, biblical languages, expository preaching, and pastoral ministry.',
    duration_years: 4,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '11111111-1111-1111-1111-111111111102',
    code: 'BMN',
    name: 'Bachelor of Ministry',
    description: 'A four-year ministry and missions curriculum preparing students for church planting, pastoral leadership, evangelism, and local church service.',
    duration_years: 4,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '11111111-1111-1111-1111-111111111103',
    code: 'DCM',
    name: 'Diploma in Christian Ministry',
    description: 'A two-year foundational curriculum for lay leaders, teachers, and ministry staff.',
    duration_years: 2,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

export const INITIAL_ACADEMIC_YEARS: AcademicYear[] = [
  {
    id: '22222222-2222-2222-2222-222222222201',
    name: '2025-2026',
    start_date: '2025-08-15',
    end_date: '2026-05-30',
    is_current: false,
    status: 'CLOSED',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '22222222-2222-2222-2222-222222222202',
    name: '2026-2027',
    start_date: '2026-08-15',
    end_date: '2027-05-30',
    is_current: true,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '22222222-2222-2222-2222-222222222203',
    name: '2027-2028',
    start_date: '2027-08-15',
    end_date: '2028-05-30',
    is_current: false,
    status: 'UPCOMING',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

export const INITIAL_SEMESTERS: Semester[] = [
  {
    id: '33333333-3333-3333-3333-333333333301',
    name: 'First Semester',
    sequence: 1,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '33333333-3333-3333-3333-333333333302',
    name: 'Second Semester',
    sequence: 2,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '33333333-3333-3333-3333-333333333303',
    name: 'Summer Term',
    sequence: 3,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

export const INITIAL_YEAR_LEVELS: YearLevel[] = [
  {
    id: '44444444-4444-4444-4444-444444444401',
    name: 'Year 1 (Freshman)',
    level_number: 1,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '44444444-4444-4444-4444-444444444402',
    name: 'Year 2 (Sophomore)',
    level_number: 2,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '44444444-4444-4444-4444-444444444403',
    name: 'Year 3 (Junior)',
    level_number: 3,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '44444444-4444-4444-4444-444444444404',
    name: 'Year 4 (Senior)',
    level_number: 4,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

export const INITIAL_CURRICULA: Curriculum[] = [
  {
    id: '55555555-5555-5555-5555-555555555501',
    program_id: '11111111-1111-1111-1111-111111111101',
    name: 'Bachelor of Theology Curriculum 2026',
    version: '2026.1',
    effective_academic_year: '2026-2027',
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

// Official Berean Bible Baptist College Subjects
export const INITIAL_SUBJECTS: Subject[] = [
  // Year 1 - First Semester
  {
    id: '66666666-0001-0001-0001-000000000001',
    code: 'ENG-101',
    name: 'English 1',
    description: 'Foundations of collegiate English, grammar, composition, and writing skills for theological study.',
    units: 3,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '66666666-0001-0001-0001-000000000002',
    code: 'ANT-101',
    name: 'Anthropology - Doctrine of Man',
    description: 'Biblical study of the origin, nature, fall, depravity, and constitution of man from Genesis and Scripture.',
    units: 3,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '66666666-0001-0001-0001-000000000003',
    code: 'BPT-101',
    name: 'Baptist Distinctives',
    description: 'Biblical principles and historic distinctive positions of Baptists (B.I.B.L.E.S. — Biblical authority, Autonomy of local church, Priesthood of believers, Two ordinances, Individual soul liberty, Saved church membership, Two officers, Separation of Church and State).',
    units: 3,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },

  // Year 1 - Second Semester
  {
    id: '66666666-0001-0002-0001-000000000004',
    code: 'BIB-102',
    name: 'Bibliology - Doctrine of the Bible',
    description: 'Study of revelation, verbal plenary inspiration, inerrancy, preservation, canonization, and authority of the Holy Scriptures.',
    units: 3,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '66666666-0001-0002-0001-000000000005',
    code: 'HER-102',
    name: 'Hermeneutics 2',
    description: 'Advanced literal-grammatical-historical principles of biblical interpretation, typology, prophecies, and dispensational analysis.',
    units: 3,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '66666666-0001-0002-0001-000000000006',
    code: 'SOT-102',
    name: 'Soteriology - Doctrine of Salvation',
    description: 'Exhaustive biblical study of grace, repentance, faith, justification, regeneration, sanctification, and eternal security in Jesus Christ.',
    units: 3,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },

  // Year 2 - First Semester
  {
    id: '66666666-0002-0001-0001-000000000007',
    code: 'ECC-201',
    name: 'Ecclesiology - Doctrine of the Church',
    description: 'The local church: its founding, nature, ordinances (Baptism and Lord’s Supper), government, officers, and worldwide mission.',
    units: 3,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '66666666-0002-0001-0001-000000000008',
    code: 'PRA-201',
    name: 'Doctrine of Prayer and Fasting',
    description: 'Scriptural principles, power, disciplines, and spiritual warfare through intercessory prayer and biblical fasting.',
    units: 3,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '66666666-0002-0001-0001-000000000009',
    code: 'NTS-201',
    name: 'New Testament Survey',
    description: 'Historical background, themes, authors, and canonical flow of the 27 books of the New Testament.',
    units: 3,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },

  // Year 2 - Second Semester
  {
    id: '66666666-0002-0002-0001-000000000010',
    code: 'CLT-202',
    name: 'Biblical Cults',
    description: 'Examination and refutation of major theological cults, false religions, and aberrant doctrines in light of Scripture.',
    units: 3,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '66666666-0002-0002-0001-000000000011',
    code: 'ANG-202',
    name: 'Angeology - Doctrine of Angels & Satan',
    description: 'Biblical teaching on the creation, ranks, and ministry of holy angels, demonology, and Satanology.',
    units: 3,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '66666666-0002-0002-0001-000000000012',
    code: 'ESC-202',
    name: 'Eschatology - Doctrine of Last Things',
    description: 'Premillennial and pretribulational study of prophecy, Rapture, Tribulation, Second Coming, Millennial Kingdom, and Great White Throne judgment.',
    units: 3,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },

  // Year 3 - First Semester
  {
    id: '66666666-0003-0001-0001-000000000013',
    code: 'CHR-301',
    name: 'Christology - Doctrine of Christ',
    description: 'The pre-existence, deity, virgin birth, sinless life, substitutionary atonement, bodily resurrection, ascension, and present session of Jesus Christ.',
    units: 3,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '66666666-0003-0001-0001-000000000014',
    code: 'PNE-301',
    name: 'Pneumatology - Doctrine of the Holy Spirit',
    description: 'The personality, deity, work, indwelling, filling, gifts, and fruit of the Holy Spirit in the Old and New Testaments.',
    units: 3,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '66666666-0003-0001-0001-000000000015',
    code: 'APO-301',
    name: 'Problems, Apologetics, Defense of the KJV',
    description: 'Christian apologetics, resolving textual problems, and historical defense of the King James Bible and the Traditional Received Text (Textus Receptus).',
    units: 3,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },

  // Year 3 - Second Semester
  {
    id: '66666666-0003-0002-0001-000000000016',
    code: 'HOM-302',
    name: 'Homiletics - Art of Preaching',
    description: 'Preparation, structure, delivery, and passion of expository biblical sermon preaching from the Word of God.',
    units: 3,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '66666666-0003-0002-0001-000000000017',
    code: 'TCH-302',
    name: 'Teaching for Results',
    description: 'Pedagogy, Sunday School methodologies, curriculum implementation, and effective Bible teaching that produces life transformation.',
    units: 3,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '66666666-0003-0002-0001-000000000018',
    code: 'PAS-302',
    name: 'Pastoral Epistles',
    description: 'Exegetical study of 1 & 2 Timothy and Titus: ministerial qualifications, pastoral oversight, and church administration.',
    units: 3,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },

  // Year 4 - First Semester
  {
    id: '66666666-0004-0001-0001-000000000019',
    code: 'MUS-401',
    name: 'Music 1',
    description: 'Biblical philosophy of sacred music, hymnology, choral leadership, and church music ministry honoring God.',
    units: 3,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '66666666-0004-0001-0001-000000000020',
    code: 'ANT-401',
    name: 'Anthropology - Doctrine of Man',
    description: 'Senior seminar in biblical anthropology, cultural engagement, moral dilemmas, and biblical worldview.',
    units: 3,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '66666666-0004-0001-0001-000000000021',
    code: 'BPT-401',
    name: 'Baptist Distinctives',
    description: 'Senior historical and practical examination of Baptist history, martyrs, church covenants, and pastoral policy.',
    units: 3,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },

  // Year 4 - Second Semester
  {
    id: '66666666-0004-0002-0001-000000000022',
    code: 'ISR-402',
    name: 'Israelology - Doctrine of Israel',
    description: 'The biblical, covenants-based distinction between Israel and the Church, God’s promises to Abraham’s seed, and end-time role of Israel.',
    units: 3,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '66666666-0004-0002-0001-000000000023',
    code: 'MIS-402',
    name: 'Mission Immersion - Practical',
    description: 'Practical field internship, cross-cultural evangelism, local church ministry practicum, and church planting immersion.',
    units: 3,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

// Mapping to BTH Curriculum 2026
export const INITIAL_CURRICULUM_SUBJECTS: CurriculumSubject[] = [
  // Year 1 - First Semester
  {
    id: '77777777-0001-0001-0001-000000000001',
    curriculum_id: '55555555-5555-5555-5555-555555555501',
    subject_id: '66666666-0001-0001-0001-000000000001',
    year_level_id: '44444444-4444-4444-4444-444444444401', // Year 1
    semester_id: '33333333-3333-3333-3333-333333333301',   // 1st Sem
    prerequisite_subject_id: null,
    is_required: true,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '77777777-0001-0001-0001-000000000002',
    curriculum_id: '55555555-5555-5555-5555-555555555501',
    subject_id: '66666666-0001-0001-0001-000000000002',
    year_level_id: '44444444-4444-4444-4444-444444444401', // Year 1
    semester_id: '33333333-3333-3333-3333-333333333301',   // 1st Sem
    prerequisite_subject_id: null,
    is_required: true,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '77777777-0001-0001-0001-000000000003',
    curriculum_id: '55555555-5555-5555-5555-555555555501',
    subject_id: '66666666-0001-0001-0001-000000000003',
    year_level_id: '44444444-4444-4444-4444-444444444401', // Year 1
    semester_id: '33333333-3333-3333-3333-333333333301',   // 1st Sem
    prerequisite_subject_id: null,
    is_required: true,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },

  // Year 1 - Second Semester
  {
    id: '77777777-0001-0002-0001-000000000004',
    curriculum_id: '55555555-5555-5555-5555-555555555501',
    subject_id: '66666666-0001-0002-0001-000000000004',
    year_level_id: '44444444-4444-4444-4444-444444444401', // Year 1
    semester_id: '33333333-3333-3333-3333-333333333302',   // 2nd Sem
    prerequisite_subject_id: null,
    is_required: true,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '77777777-0001-0002-0001-000000000005',
    curriculum_id: '55555555-5555-5555-5555-555555555501',
    subject_id: '66666666-0001-0002-0001-000000000005',
    year_level_id: '44444444-4444-4444-4444-444444444401', // Year 1
    semester_id: '33333333-3333-3333-3333-333333333302',   // 2nd Sem
    prerequisite_subject_id: null,
    is_required: true,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '77777777-0001-0002-0001-000000000006',
    curriculum_id: '55555555-5555-5555-5555-555555555501',
    subject_id: '66666666-0001-0002-0001-000000000006',
    year_level_id: '44444444-4444-4444-4444-444444444401', // Year 1
    semester_id: '33333333-3333-3333-3333-333333333302',   // 2nd Sem
    prerequisite_subject_id: null,
    is_required: true,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },

  // Year 2 - First Semester
  {
    id: '77777777-0002-0001-0001-000000000007',
    curriculum_id: '55555555-5555-5555-5555-555555555501',
    subject_id: '66666666-0002-0001-0001-000000000007',
    year_level_id: '44444444-4444-4444-4444-444444444402', // Year 2
    semester_id: '33333333-3333-3333-3333-333333333301',   // 1st Sem
    prerequisite_subject_id: null,
    is_required: true,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '77777777-0002-0001-0001-000000000008',
    curriculum_id: '55555555-5555-5555-5555-555555555501',
    subject_id: '66666666-0002-0001-0001-000000000008',
    year_level_id: '44444444-4444-4444-4444-444444444402', // Year 2
    semester_id: '33333333-3333-3333-3333-333333333301',   // 1st Sem
    prerequisite_subject_id: null,
    is_required: true,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '77777777-0002-0001-0001-000000000009',
    curriculum_id: '55555555-5555-5555-5555-555555555501',
    subject_id: '66666666-0002-0001-0001-000000000009',
    year_level_id: '44444444-4444-4444-4444-444444444402', // Year 2
    semester_id: '33333333-3333-3333-3333-333333333301',   // 1st Sem
    prerequisite_subject_id: null,
    is_required: true,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },

  // Year 2 - Second Semester
  {
    id: '77777777-0002-0002-0001-000000000010',
    curriculum_id: '55555555-5555-5555-5555-555555555501',
    subject_id: '66666666-0002-0002-0001-000000000010',
    year_level_id: '44444444-4444-4444-4444-444444444402', // Year 2
    semester_id: '33333333-3333-3333-3333-333333333302',   // 2nd Sem
    prerequisite_subject_id: null,
    is_required: true,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '77777777-0002-0002-0001-000000000011',
    curriculum_id: '55555555-5555-5555-5555-555555555501',
    subject_id: '66666666-0002-0002-0001-000000000011',
    year_level_id: '44444444-4444-4444-4444-444444444402', // Year 2
    semester_id: '33333333-3333-3333-3333-333333333302',   // 2nd Sem
    prerequisite_subject_id: null,
    is_required: true,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '77777777-0002-0002-0001-000000000012',
    curriculum_id: '55555555-5555-5555-5555-555555555501',
    subject_id: '66666666-0002-0002-0001-000000000012',
    year_level_id: '44444444-4444-4444-4444-444444444402', // Year 2
    semester_id: '33333333-3333-3333-3333-333333333302',   // 2nd Sem
    prerequisite_subject_id: null,
    is_required: true,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },

  // Year 3 - First Semester
  {
    id: '77777777-0003-0001-0001-000000000013',
    curriculum_id: '55555555-5555-5555-5555-555555555501',
    subject_id: '66666666-0003-0001-0001-000000000013',
    year_level_id: '44444444-4444-4444-4444-444444444403', // Year 3
    semester_id: '33333333-3333-3333-3333-333333333301',   // 1st Sem
    prerequisite_subject_id: null,
    is_required: true,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '77777777-0003-0001-0001-000000000014',
    curriculum_id: '55555555-5555-5555-5555-555555555501',
    subject_id: '66666666-0003-0001-0001-000000000014',
    year_level_id: '44444444-4444-4444-4444-444444444403', // Year 3
    semester_id: '33333333-3333-3333-3333-333333333301',   // 1st Sem
    prerequisite_subject_id: null,
    is_required: true,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '77777777-0003-0001-0001-000000000015',
    curriculum_id: '55555555-5555-5555-5555-555555555501',
    subject_id: '66666666-0003-0001-0001-000000000015',
    year_level_id: '44444444-4444-4444-4444-444444444403', // Year 3
    semester_id: '33333333-3333-3333-3333-333333333301',   // 1st Sem
    prerequisite_subject_id: null,
    is_required: true,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },

  // Year 3 - Second Semester
  {
    id: '77777777-0003-0002-0001-000000000016',
    curriculum_id: '55555555-5555-5555-5555-555555555501',
    subject_id: '66666666-0003-0002-0001-000000000016',
    year_level_id: '44444444-4444-4444-4444-444444444403', // Year 3
    semester_id: '33333333-3333-3333-3333-333333333302',   // 2nd Sem
    prerequisite_subject_id: null,
    is_required: true,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '77777777-0003-0002-0001-000000000017',
    curriculum_id: '55555555-5555-5555-5555-555555555501',
    subject_id: '66666666-0003-0002-0001-000000000017',
    year_level_id: '44444444-4444-4444-4444-444444444403', // Year 3
    semester_id: '33333333-3333-3333-3333-333333333302',   // 2nd Sem
    prerequisite_subject_id: null,
    is_required: true,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '77777777-0003-0002-0001-000000000018',
    curriculum_id: '55555555-5555-5555-5555-555555555501',
    subject_id: '66666666-0003-0002-0001-000000000018',
    year_level_id: '44444444-4444-4444-4444-444444444403', // Year 3
    semester_id: '33333333-3333-3333-3333-333333333302',   // 2nd Sem
    prerequisite_subject_id: null,
    is_required: true,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },

  // Year 4 - First Semester
  {
    id: '77777777-0004-0001-0001-000000000019',
    curriculum_id: '55555555-5555-5555-5555-555555555501',
    subject_id: '66666666-0004-0001-0001-000000000019',
    year_level_id: '44444444-4444-4444-4444-444444444404', // Year 4
    semester_id: '33333333-3333-3333-3333-333333333301',   // 1st Sem
    prerequisite_subject_id: null,
    is_required: true,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '77777777-0004-0001-0001-000000000020',
    curriculum_id: '55555555-5555-5555-5555-555555555501',
    subject_id: '66666666-0004-0001-0001-000000000020',
    year_level_id: '44444444-4444-4444-4444-444444444404', // Year 4
    semester_id: '33333333-3333-3333-3333-333333333301',   // 1st Sem
    prerequisite_subject_id: '66666666-0001-0001-0001-000000000002', // Prereq: ANT-101
    is_required: true,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '77777777-0004-0001-0001-000000000021',
    curriculum_id: '55555555-5555-5555-5555-555555555501',
    subject_id: '66666666-0004-0001-0001-000000000021',
    year_level_id: '44444444-4444-4444-4444-444444444404', // Year 4
    semester_id: '33333333-3333-3333-3333-333333333301',   // 1st Sem
    prerequisite_subject_id: '66666666-0001-0001-0001-000000000003', // Prereq: BPT-101
    is_required: true,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },

  // Year 4 - Second Semester
  {
    id: '77777777-0004-0002-0001-000000000022',
    curriculum_id: '55555555-5555-5555-5555-555555555501',
    subject_id: '66666666-0004-0002-0001-000000000022',
    year_level_id: '44444444-4444-4444-4444-444444444404', // Year 4
    semester_id: '33333333-3333-3333-3333-333333333302',   // 2nd Sem
    prerequisite_subject_id: null,
    is_required: true,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '77777777-0004-0002-0001-000000000023',
    curriculum_id: '55555555-5555-5555-5555-555555555501',
    subject_id: '66666666-0004-0002-0001-000000000023',
    year_level_id: '44444444-4444-4444-4444-444444444404', // Year 4
    semester_id: '33333333-3333-3333-3333-333333333302',   // 2nd Sem
    prerequisite_subject_id: null,
    is_required: true,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

export const INITIAL_ENROLLMENT_PERIODS: EnrollmentPeriod[] = [
  {
    id: '88888888-8888-8888-8888-888888888801',
    academic_year_id: '22222222-2222-2222-2222-222222222202',
    semester_id: '33333333-3333-3333-3333-333333333301',
    start_date: '2026-08-01T00:00:00Z',
    end_date: '2026-08-30T23:59:59Z',
    status: 'OPEN',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '88888888-8888-8888-8888-888888888802',
    academic_year_id: '22222222-2222-2222-2222-222222222202',
    semester_id: '33333333-3333-3333-3333-333333333302',
    start_date: '2027-01-05T00:00:00Z',
    end_date: '2027-01-25T23:59:59Z',
    status: 'UPCOMING',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    id_number: 'ADM-2024-001',
    first_name: 'David',
    middle_name: 'K.',
    last_name: 'MacArthur',
    email: 'admin@berean.edu',
    phone: '+63 917 100 2001',
    role: 'ADMIN',
    profile_photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    login_status: 'OFFLINE',
    last_login_at: '2026-10-06T15:20:00Z',
    password: 'Admin@Berean2026!',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    id_number: 'EMP-2024-001',
    first_name: 'Hannah',
    middle_name: 'M.',
    last_name: 'Spurgeon',
    email: 'registrar@berean.edu',
    phone: '+63 917 100 2002',
    role: 'STAFF',
    profile_photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    login_status: 'OFFLINE',
    last_login_at: '2026-10-06T14:45:00Z',
    password: 'Staff@Berean2026!',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000003',
    id_number: 'BBC-2026-0001',
    first_name: 'Timothy',
    middle_name: 'J.',
    last_name: 'Barnabas',
    email: 'student@berean.edu',
    phone: '+63 917 100 2003',
    role: 'STUDENT',
    profile_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    login_status: 'OFFLINE',
    last_login_at: '2026-10-05T08:12:00Z',
    password: 'Student@Berean2026!',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000004',
    id_number: 'BBC-2026-0002',
    first_name: 'Priscilla',
    middle_name: 'A.',
    last_name: 'Aquila',
    email: 'applicant@berean.edu',
    phone: '+63 917 100 2004',
    role: 'STUDENT',
    profile_photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    login_status: 'OFFLINE',
    last_login_at: '2026-10-04T11:00:00Z',
    password: 'Applicant@Berean2026!',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000005',
    id_number: 'BBC-2021-0088',
    first_name: 'Stephen',
    middle_name: 'P.',
    last_name: 'Tyndale',
    email: 'alumni@berean.edu',
    phone: '+63 917 100 2005',
    role: 'ALUMNI',
    profile_photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    login_status: 'OFFLINE',
    last_login_at: '2026-09-28T16:30:00Z',
    password: 'Alumni@Berean2026!',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

export const INITIAL_STAFF: Staff[] = [
  {
    id: 'b0000000-0000-0000-0000-000000000001',
    profile_id: 'a0000000-0000-0000-0000-000000000002',
    employee_number: 'EMP-2024-001',
    department: 'Office of the Registrar',
    title: 'Registrar Officer',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    profile_id: 'a0000000-0000-0000-0000-000000000003',
    student_number: 'BBC-2026-0001',
    program_id: '11111111-1111-1111-1111-111111111101',
    curriculum_id: '55555555-5555-5555-5555-555555555501',
    year_level_id: '44444444-4444-4444-4444-444444444401', // Year 1
    student_status: 'ENROLLED',
    admission_date: '2026-08-01',
    expected_graduation_date: '2030-05-30',
    graduation_date: null,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
    profile_id: 'a0000000-0000-0000-0000-000000000004',
    student_number: null,
    program_id: '11111111-1111-1111-1111-111111111101',
    curriculum_id: '55555555-5555-5555-5555-555555555501',
    year_level_id: '44444444-4444-4444-4444-444444444401',
    student_status: 'PENDING_VERIFICATION',
    admission_date: '2026-08-05',
    expected_graduation_date: '2030-05-30',
    graduation_date: null,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'c0000000-0000-0000-0000-000000000003',
    profile_id: 'a0000000-0000-0000-0000-000000000005',
    student_number: 'BBC-2021-0088',
    program_id: '11111111-1111-1111-1111-111111111101',
    curriculum_id: '55555555-5555-5555-5555-555555555501',
    year_level_id: '44444444-4444-4444-4444-444444444404',
    student_status: 'ALUMNI',
    admission_date: '2021-08-01',
    expected_graduation_date: '2025-05-30',
    graduation_date: '2025-05-25',
    created_at: '2021-08-01T00:00:00Z',
    updated_at: '2025-05-25T00:00:00Z',
  },
];

export const INITIAL_ALUMNI_PROFILES: AlumniProfile[] = [
  {
    id: 'd0000000-0000-0000-0000-000000000001',
    student_id: 'c0000000-0000-0000-0000-000000000003',
    profile_id: 'a0000000-0000-0000-0000-000000000005',
    graduation_year: 2025,
    graduation_date: '2025-05-25',
    degree_conferred: 'Bachelor of Theology',
    employer: 'Grace Reformed Baptist Church',
    position: 'Associate Pastor of Youth & Discipleship',
    ministry_involvement: 'Pulpit supply, doctrinal teaching, and pastoral counseling in South Manila',
    industry: 'Pastoral Ministry & Missions',
    location: 'Metro Manila, Philippines',
    phone: '+63 917 100 2005',
    email: 'alumni@berean.edu',
    linkedin_url: 'https://linkedin.com/in/berean-alumni',
    bio: 'Proud Berean Bible Baptist College graduate serving the Lord Jesus Christ with biblical faithfulness and expositional preaching.',
    is_directory_visible: true,
    created_at: '2025-05-25T00:00:00Z',
    updated_at: '2025-05-25T00:00:00Z',
  },
];

// Sample Active Enrollment for Timothy Barnabas (Year 1, 1st Semester subjects)
export const INITIAL_ENROLLMENTS: Enrollment[] = [
  {
    id: 'e0000000-0000-0000-0000-000000000001',
    student_id: 'c0000000-0000-0000-0000-000000000001',
    academic_year_id: '22222222-2222-2222-2222-222222222202',
    semester_id: '33333333-3333-3333-3333-333333333301',
    enrollment_period_id: '88888888-8888-8888-8888-888888888801',
    status: 'APPROVED',
    total_units: 9,
    submitted_at: '2026-08-10T09:30:00Z',
    reviewed_at: '2026-08-11T14:00:00Z',
    reviewed_by: 'a0000000-0000-0000-0000-000000000002',
    remarks: 'Approved for 1st Semester 2026-2027 by Office of Registrar.',
    created_at: '2026-08-10T09:30:00Z',
    updated_at: '2026-08-11T14:00:00Z',
  },
  // Historical Completed Enrollment for Stephen Tyndale
  {
    id: 'e0000000-0000-0000-0000-000000000099',
    student_id: 'c0000000-0000-0000-0000-000000000003',
    academic_year_id: '22222222-2222-2222-2222-222222222201',
    semester_id: '33333333-3333-3333-3333-333333333301',
    status: 'COMPLETED',
    total_units: 9,
    submitted_at: '2024-08-10T09:00:00Z',
    reviewed_at: '2024-08-11T10:00:00Z',
    remarks: 'Historical cohort record permanently preserved.',
    created_at: '2024-08-10T09:00:00Z',
    updated_at: '2024-08-11T10:00:00Z',
  },
];

export const INITIAL_ENROLLMENT_SUBJECTS: EnrollmentSubject[] = [
  // Timothy's Year 1, 1st Semester Courses
  {
    id: 'f0000000-0000-0000-0000-000000000001',
    enrollment_id: 'e0000000-0000-0000-0000-000000000001',
    subject_id: '66666666-0001-0001-0001-000000000001', // English 1
    units: 3,
    status: 'ENROLLED',
    created_at: '2026-08-10T09:30:00Z',
    updated_at: '2026-08-10T09:30:00Z',
  },
  {
    id: 'f0000000-0000-0000-0000-000000000002',
    enrollment_id: 'e0000000-0000-0000-0000-000000000001',
    subject_id: '66666666-0001-0001-0001-000000000002', // Anthropology - Doctrine of Man
    units: 3,
    status: 'ENROLLED',
    created_at: '2026-08-10T09:30:00Z',
    updated_at: '2026-08-10T09:30:00Z',
  },
  {
    id: 'f0000000-0000-0000-0000-000000000003',
    enrollment_id: 'e0000000-0000-0000-0000-000000000001',
    subject_id: '66666666-0001-0001-0001-000000000003', // Baptist Distinctives
    units: 3,
    status: 'ENROLLED',
    created_at: '2026-08-10T09:30:00Z',
    updated_at: '2026-08-10T09:30:00Z',
  },

  // Stephen Tyndale Historical Enrolled Subjects
  {
    id: 'f0000000-0000-0000-0000-000000000091',
    enrollment_id: 'e0000000-0000-0000-0000-000000000099',
    subject_id: '66666666-0001-0001-0001-000000000001',
    units: 3,
    status: 'COMPLETED',
    created_at: '2024-08-10T09:00:00Z',
    updated_at: '2024-08-10T09:00:00Z',
  },
  {
    id: 'f0000000-0000-0000-0000-000000000092',
    enrollment_id: 'e0000000-0000-0000-0000-000000000099',
    subject_id: '66666666-0001-0001-0001-000000000002',
    units: 3,
    status: 'COMPLETED',
    created_at: '2024-08-10T09:00:00Z',
    updated_at: '2024-08-10T09:00:00Z',
  },
  {
    id: 'f0000000-0000-0000-0000-000000000093',
    enrollment_id: 'e0000000-0000-0000-0000-000000000099',
    subject_id: '66666666-0001-0001-0001-000000000003',
    units: 3,
    status: 'COMPLETED',
    created_at: '2024-08-10T09:00:00Z',
    updated_at: '2024-08-10T09:00:00Z',
  },
];

export const INITIAL_GRADES: Grade[] = [
  {
    id: '99999999-9999-9999-9999-999999999901',
    student_id: 'c0000000-0000-0000-0000-000000000003',
    enrollment_subject_id: 'f0000000-0000-0000-0000-000000000091',
    grade: 1.25,
    remarks: 'Superior',
    status: 'RELEASED',
    released_at: '2024-12-18T10:00:00Z',
    entered_by: 'a0000000-0000-0000-0000-000000000001',
    created_at: '2024-12-18T10:00:00Z',
    updated_at: '2024-12-18T10:00:00Z',
  },
  {
    id: '99999999-9999-9999-9999-999999999902',
    student_id: 'c0000000-0000-0000-0000-000000000003',
    enrollment_subject_id: 'f0000000-0000-0000-0000-000000000092',
    grade: 1.0,
    remarks: 'Superior',
    status: 'RELEASED',
    released_at: '2024-12-18T10:00:00Z',
    entered_by: 'a0000000-0000-0000-0000-000000000001',
    created_at: '2024-12-18T10:00:00Z',
    updated_at: '2024-12-18T10:00:00Z',
  },
  {
    id: '99999999-9999-9999-9999-999999999903',
    student_id: 'c0000000-0000-0000-0000-000000000003',
    enrollment_subject_id: 'f0000000-0000-0000-0000-000000000093',
    grade: 1.25,
    remarks: 'Superior',
    status: 'RELEASED',
    released_at: '2024-12-18T10:00:00Z',
    entered_by: 'a0000000-0000-0000-0000-000000000001',
    created_at: '2024-12-18T10:00:00Z',
    updated_at: '2024-12-18T10:00:00Z',
  },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'aa000000-0000-0000-0000-000000000001',
    title: 'Welcome to Academic Year 2026-2027',
    content: 'Welcome back students, faculty, and staff to Berean Bible Baptist College. "But ye are a chosen generation, a royal priesthood, an holy nation, a peculiar people; that ye should shew forth the praises of Him who hath called you out of darkness into His marvelous light" (1 Peter 2:9 KJB). May our hearts remain steadfast in examining the Scriptures daily (Acts 17:11).',
    audience: 'ALL',
    is_pinned: true,
    published_at: '2026-08-01T08:00:00Z',
    status: 'PUBLISHED',
    author_id: 'a0000000-0000-0000-0000-000000000001',
    created_at: '2026-08-01T08:00:00Z',
    updated_at: '2026-08-01T08:00:00Z',
  },
  {
    id: 'aa000000-0000-0000-0000-000000000002',
    title: 'First Semester 2026-2027 Enrollment Window is Open',
    content: 'Regular course enrollment for the 1st Semester is open. Year 1 students must submit enrollment for English 1, Anthropology - Doctrine of Man, and Baptist Distinctives.',
    audience: 'STUDENTS',
    is_pinned: true,
    published_at: '2026-08-05T08:00:00Z',
    status: 'PUBLISHED',
    author_id: 'a0000000-0000-0000-0000-000000000002',
    created_at: '2026-08-05T08:00:00Z',
    updated_at: '2026-08-05T08:00:00Z',
  },
  {
    id: 'aa000000-0000-0000-0000-000000000003',
    title: 'Annual Berean Alumni Fellowship Summit',
    content: 'Calling all Berean Bible Baptist College graduates! Join us for a weekend of prayer, theological encouragement, and fellowship this coming November at the Main Campus.',
    audience: 'ALUMNI',
    is_pinned: false,
    published_at: '2026-08-10T08:00:00Z',
    status: 'PUBLISHED',
    author_id: 'a0000000-0000-0000-0000-000000000001',
    created_at: '2026-08-10T08:00:00Z',
    updated_at: '2026-08-10T08:00:00Z',
  },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'bb000000-0000-0000-0000-000000000001',
    user_id: 'a0000000-0000-0000-0000-000000000003',
    title: 'Enrollment Approved',
    message: 'Your enrollment for 1st Semester 2026-2027 has been reviewed and approved by the Registrar.',
    link: '/student/enrollment',
    type: 'SUCCESS',
    is_read: false,
    created_at: '2026-08-11T14:00:00Z',
  },
  {
    id: 'bb000000-0000-0000-0000-000000000002',
    user_id: 'a0000000-0000-0000-0000-000000000004',
    title: 'Registration Under Review',
    message: 'Your applicant credentials have been received and are undergoing staff verification.',
    link: '/student/profile',
    type: 'INFO',
    is_read: false,
    created_at: '2026-08-05T09:00:00Z',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'cc000000-0000-0000-0000-000000000001',
    user_id: 'a0000000-0000-0000-0000-000000000001',
    user_email: 'admin@berean.edu',
    action: 'INITIALIZE_CURRICULUM',
    entity: 'curricula',
    entity_id: '55555555-5555-5555-5555-555555555501',
    new_data: { name: 'Bachelor of Theology Curriculum 2026', total_courses: 23 },
    created_at: '2026-01-01T00:00:00Z',
  },
];

export const INITIAL_STUDENT_DOCUMENTS: StudentDocument[] = [
  {
    id: 'dd000000-0000-0000-0000-000000000001',
    student_id: 'c0000000-0000-0000-0000-000000000001',
    document_type: 'BIRTH_CERTIFICATE',
    title: 'PSA Birth Certificate - Timothy Barnabas',
    file_path: 'mock/birth_certificate.pdf',
    file_size_bytes: 142050,
    mime_type: 'application/pdf',
    verification_status: 'VERIFIED',
    verified_by: 'a0000000-0000-0000-0000-000000000002',
    verified_at: '2026-08-02T10:00:00Z',
    created_at: '2026-08-01T12:00:00Z',
    updated_at: '2026-08-02T10:00:00Z',
  },
  {
    id: 'dd000000-0000-0000-0000-000000000002',
    student_id: 'c0000000-0000-0000-0000-000000000001',
    document_type: 'PASTOR_RECOMMENDATION',
    title: 'Pastor Recommendation Letter',
    file_path: 'mock/recommendation.pdf',
    file_size_bytes: 89400,
    mime_type: 'application/pdf',
    verification_status: 'VERIFIED',
    verified_by: 'a0000000-0000-0000-0000-000000000002',
    verified_at: '2026-08-02T10:00:00Z',
    created_at: '2026-08-01T12:05:00Z',
    updated_at: '2026-08-02T10:00:00Z',
  },
];
