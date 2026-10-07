# Berean Bible Baptist College — Student and Alumni Portal

A centralized, production-ready Student, Registrar, and Alumni Management Portal built for **Berean Bible Baptist College** ("A chosen generation, a royal priesthood, an holy nation..." — *1 Peter 2:9 KJB*).

The portal manages the entire student academic lifecycle:
$$\text{Applicant} \longrightarrow \text{Registration} \longrightarrow \text{Verification} \longrightarrow \text{Enrollment} \longrightarrow \text{Active Student} \longrightarrow \text{Academic Records} \longrightarrow \text{Graduation} \longrightarrow \text{Alumni}$$

Historical academic records are permanently preserved and never destroyed upon graduation.

---

## 🛠️ Technology Stack

### Frontend
- **React 19** + **TypeScript**
- **Vite** (Bundler & dev server)
- **React Router v7** (Role-based protected routing)
- **Tailwind CSS v4** (Berean academic aesthetic: deep navy blue, gold accents, crisp slate)
- **shadcn/ui** design patterns
- **Lucide Icons**
- **React Hook Form** + **Zod** (Form validation & type safety)

### Backend & Database
- **Supabase** (PostgreSQL 15+)
- **Supabase Authentication** (Session persistence, JWTs)
- **PostgreSQL Row Level Security (RLS)** on all 19 relational tables
- **Supabase Storage** (Document uploads: private buckets with RLS)
- **Official Supabase JS Client** (`@supabase/supabase-js`)

### Hosting & Deployment
- **Netlify** (Configured with SPA redirects `/* -> /index.html 200`)
- **GitHub** (Continuous integration & deployment)

---

## 📂 Project Architecture

```
berean-student-portal/
├── public/
│   └── college-logo.png              # Official Berean Bible Baptist College seal
├── src/
│   ├── assets/
│   │   └── college-logo.png          # High-resolution emblem
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx            # Sticky header with logo & profile
│   │   │   ├── Sidebar.tsx           # Role-aware navigation (Admin/Staff/Student/Alumni)
│   │   │   └── TopBanner.tsx         # Database connection status & Quick Persona Switcher
│   │   └── ui/                       # shadcn/ui primitives
│   │       ├── Button.tsx
│   │       ├── Badge.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       └── Dialog.tsx
│   ├── features/
│   │   └── auth/
│   │       └── AuthContext.tsx       # Auth provider & multi-role demo switcher
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── layouts/
│   │   └── AppLayout.tsx             # Application layout shell
│   ├── lib/
│   │   ├── supabase.ts               # Supabase client & unified API service
│   │   ├── mockData.ts               # Pre-seeded database state matching PostgreSQL seed
│   │   ├── utils.ts                  # cn, formatters
│   │   └── validation/
│   │       └── index.ts              # Zod validation schemas
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx      # Multi-step applicant registration
│   │   │   └── ForgotPasswordPage.tsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── ProgramsPage.tsx
│   │   │   ├── CurriculumBuilderPage.tsx # Visual curriculum pathway builder
│   │   │   ├── SubjectsPage.tsx      # Subject course catalog
│   │   │   ├── AcademicYearsPage.tsx # School years, semesters, year levels
│   │   │   ├── EnrollmentPeriodsPage.tsx # Open/Close enrollment windows
│   │   │   ├── StudentsManagementPage.tsx # Student lifecycle & graduation promotion
│   │   │   └── AuditLogsPage.tsx     # Security audit trail
│   │   ├── staff/
│   │   │   ├── StaffDashboard.tsx
│   │   │   ├── StudentRegistrationsPage.tsx # Applicant verification & ID assignment
│   │   │   ├── EnrollmentRequestsPage.tsx   # Subject load & prerequisite validation
│   │   │   ├── StaffGradesPage.tsx          # Grade entry (1.00-5.00) & release
│   │   │   └── StaffDocumentsPage.tsx       # Document verification
│   │   ├── student/
│   │   │   ├── StudentDashboard.tsx
│   │   │   ├── StudentProfilePage.tsx       # Read-only academic info & contact updates
│   │   │   ├── StudentEnrollmentPage.tsx    # Online course enrollment with checks
│   │   │   ├── StudentSubjectsPage.tsx      # Enrolled subjects for active term
│   │   │   ├── StudentRecordsPage.tsx       # Permanent transcript & GWA calculation
│   │   │   └── StudentDocumentsPage.tsx     # Requirement document uploads
│   │   ├── alumni/
│   │   │   ├── AlumniDashboard.tsx
│   │   │   ├── AlumniProfilePage.tsx        # Career, ministry station & directory toggle
│   │   │   └── AlumniRecordsPage.tsx        # Historical transcript preservation
│   │   └── common/
│   │       └── AnnouncementsPage.tsx        # Institution bulletins by audience
│   ├── routes/
│   │   ├── index.tsx                 # Central route tree
│   │   └── ProtectedRoute.tsx        # Role-based authorization guard
│   ├── types/
│   │   └── database.ts               # TypeScript interfaces matching DB schema
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── supabase/
│   ├── migrations/
│   │   └── 20261001000000_initial_schema.sql # 19 tables, indexes, triggers & RLS
│   └── seed.sql                      # Preloaded seed data with official subjects
├── netlify.toml                      # Netlify SPA routing configuration
├── .env.example                      # Environment variables template
└── vite.config.ts
```

---

## 🏛️ Official Berean Bible Baptist College Subjects

The curriculum follows the sound doctrinal sequence of the college:

| Year Level | Semester | Subject Code | Subject Name | Units |
| :--- | :--- | :--- | :--- | :---: |
| **Year 1** | **First Semester** | `ENG-101` | English 1 | 3 |
| | | `ANT-101` | Anthropology - Doctrine of Man | 3 |
| | | `BPT-101` | Baptist Distinctives | 3 |
| | **Second Semester** | `BIB-102` | Bibliology - Doctrine of the Bible | 3 |
| | | `HER-102` | Hermeneutics 2 | 3 |
| | | `SOT-102` | Soteriology - Doctrine of Salvation | 3 |
| **Year 2** | **First Semester** | `ECC-201` | Ecclesiology - Doctrine of the Church | 3 |
| | | `PRA-201` | Doctrine of Prayer and Fasting | 3 |
| | | `NTS-201` | New Testament Survey | 3 |
| | **Second Semester** | `CLT-202` | Biblical Cults | 3 |
| | | `ANG-202` | Angeology - Doctrine of Angels & Satan | 3 |
| | | `ESC-202` | Eschatology - Doctrine of Last Things | 3 |
| **Year 3** | **First Semester** | `CHR-301` | Christology - Doctrine of Christ | 3 |
| | | `PNE-301` | Pneumatology - Doctrine of the Holy Spirit | 3 |
| | | `APO-301` | Problems, Apologetics, Defense of the KJV | 3 |
| | **Second Semester** | `HOM-302` | Homiletics - Art of Preaching | 3 |
| | | `TCH-302` | Teaching for Results | 3 |
| | | `PAS-302` | Pastoral Epistles | 3 |
| **Year 4** | **First Semester** | `MUS-401` | Music 1 | 3 |
| | | `ANT-401` | Anthropology - Doctrine of Man | 3 |
| | | `BPT-401` | Baptist Distinctives | 3 |
| | **Second Semester** | `ISR-402` | Israelology - Doctrine of Israel | 3 |
| | | `MIS-402` | Mission Immersion - Practical | 3 |

---

## 👥 User Roles & Access Matrix

| Role | Permissions & Access Scope |
| :--- | :--- |
| **ADMIN** | Full administrative control: Programs, versioned curricula, subject catalog, school years, enrollment periods, student status transitions, grade overrides, announcements, and security audit logs. |
| **STAFF** (Registrar) | Operational registrar access: Review applicant registrations, assign official student numbers (`BBC-YYYY-XXXX`), validate prerequisite compliance, approve course enrollments, enter grades, and verify documents. |
| **STUDENT** | Student self-service: View personal and read-only academic details, enroll during open registration periods, review current classes, inspect grades & GWA, and upload admission documents. |
| **ALUMNI** | Permanent graduate portal: Update ministry vocation, pastoral station, and career in the alumni directory, and access certified permanent historical transcripts. |

---

## 🚀 Quick Start & Local Development

### 1. Prerequisites
- Node.js 18+
- npm or pnpm

### 2. Installation
```bash
git clone https://github.com/Teyuuu/berean-student-portal.git
cd berean-student-portal
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Default configuration runs in **Interactive Demo Sandbox Mode** with immediate access to all 4 roles. To connect to a live Supabase database, set:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```

### 4. Running the Dev Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Production Build
```bash
npm run build
```

---

## 🗄️ Supabase & PostgreSQL Setup

### Step 1: Run Database Migration
Open your Supabase project's **SQL Editor** and run the contents of:
[`supabase/migrations/20261001000000_initial_schema.sql`](supabase/migrations/20261001000000_initial_schema.sql)

This script sets up:
- 19 relational tables with foreign keys and check constraints
- Automatic `updated_at` triggers
- `handle_new_user()` trigger for automated user profiles
- `recalculate_enrollment_units()` trigger
- Row Level Security (RLS) policies on every table
- Storage buckets (`profile-photos`, `student-documents`) with access policies

### Step 2: Seed Initial College Data
Run the contents of:
[`supabase/seed.sql`](supabase/seed.sql)

This populates:
- Academic Year `2026-2027` (Current Active)
- 3 Degree Programs (`BTH`, `BMN`, `DCM`)
- All 23 Berean Bible Baptist College courses
- Full 4-year curriculum pathway
- Open enrollment window
- Sample demo accounts across all 4 roles

### Step 3: Creating the First Administrator
In Supabase Dashboard:
1. Navigate to **Authentication > Users** and click **Add User**.
2. Create an account with email `admin@berean.edu` and a secure password.
3. In **Table Editor > profiles**, set the `role` column for this user ID to `ADMIN`.

---

## 🔒 Row Level Security (RLS) Principles

1. **Least-Privilege Authorization**:
   - Students can only query their own student record, enrollments, documents, and released grades.
   - Staff can read and review applicants, approve course enrollments, and enter grades, but cannot modify core curricula or delete academic programs.
   - Administrators possess complete system oversight and audit log access.
2. **Never Expose Service-Role Keys**:
   - The frontend communicates only with the publishable `anon` key.
   - Database RLS policies validate the authenticated user's JWT (`auth.uid()`) to enforce authorization at the database level.
3. **Data Immutability & Preservation**:
   - When students graduate, their records are transitioned to `GRADUATED` or `ALUMNI`, preserving their entire academic history for permanent transcript verification.

---

## 🌐 Netlify Deployment

The project is configured for continuous deployment on Netlify:

1. Link your GitHub repository to Netlify.
2. Set Build Settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. Add Environment Variables in Netlify (**Site configuration > Environment variables**):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Direct SPA routing is handled automatically by [`netlify.toml`](netlify.toml):
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

---

## 📜 License

Created for **Berean Bible Baptist College**. All rights reserved.
*"Examining the Scriptures daily"* — Acts 17:11
