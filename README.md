# iMajor - Major Exploration Depth Quiz Platform

A professional quiz platform built with Next.js 14, TypeScript, Tailwind CSS, and Supabase that helps students assess their major exploration depth.

## Features

- **Landing Page**: Clean, professional design with coral/orange theme
- **Quiz Flow**: Interactive question-by-question navigation with progress tracking
- **Results Page**: Personalized score with interpretation levels and unique ID
- **PDF Download**: Downloadable to-do list for 0-point questions
- **Telegram Integration**: Link to join community
- **Secure**: Unique ID-based result retrieval (no email login required)

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS with custom coral/orange theme
- **Database**: Supabase (PostgreSQL)
- **PDF Generation**: jsPDF
- **Deployment**: Vercel-ready

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- Supabase account and project created
- Database schema already run (✅ completed)

### 2. Installation

```bash
npm install
```

### 3. Environment Variables

Your `.env.local` file is already configured with:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ADMIN_PASSWORD`

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Database Schema

The database schema has been applied and includes:

### Tables:
1. **sections** - Quiz sections (e.g., "BREADTH OF EXPLORATION")
2. **questions** - Questions with active/inactive toggle
3. **answer_choices** - Answer options with point values
4. **interpretation_levels** - Admin-defined score ranges and labels
5. **quiz_submissions** - User submissions with unique IDs
6. **submission_answers** - Individual answer tracking

### Security:
- Row Level Security (RLS) enabled on all tables
- Public read access for quiz content
- Public write access for submissions only
- Admin operations via service role key

## Adding Quiz Content

To populate your quiz with questions, you need to insert data into Supabase:

### Option 1: Using Supabase Dashboard

1. Go to your Supabase project → Table Editor
2. Add sections, questions, and answer choices manually

### Option 2: Using SQL (Recommended)

Run this in your Supabase SQL Editor:

```sql
-- Insert sections
INSERT INTO sections (title, order_index) VALUES
('SECTION 1: BREADTH OF EXPLORATION', 1),
('SECTION 2: RESEARCH & INFORMATION GATHERING', 2);

-- Get section IDs (run this to see the IDs)
SELECT id, title FROM sections ORDER BY order_index;

-- Insert questions (replace <section-id-1> with actual UUID)
INSERT INTO questions (section_id, question_text, order_index, is_active) VALUES
('<section-id-1>', 'How many different majors/career fields have you researched?', 1, true),
('<section-id-1>', 'How many majors can you name that interest you?', 2, true);

-- Get question IDs
SELECT id, question_text FROM questions ORDER BY order_index;

-- Insert answer choices (replace <question-id-1> with actual UUID)
INSERT INTO answer_choices (question_id, choice_text, points, order_index) VALUES
('<question-id-1>', 'None', 0, 1),
('<question-id-1>', '1-2', 10, 2),
('<question-id-1>', '3-5', 25, 3),
('<question-id-1>', '6+', 50, 4);

-- Insert interpretation levels
INSERT INTO interpretation_levels (min_score, max_score, level_label, description, order_index) VALUES
(0, 49, 'Just Getting Started', 'There''s plenty of room to explore!', 1),
(50, 99, 'Early Explorer', 'You''re beginning your exploration journey!', 2),
(100, 149, 'Active Researcher', 'Great progress on your exploration journey!', 3),
(150, 199, 'Well-Informed Explorer', 'You''ve done significant exploration!', 4),
(200, 9999, 'Expert Navigator', 'Exceptional exploration depth!', 5);
```

## Project Structure

```
├── app/
│   ├── page.tsx                  # Landing page
│   ├── quiz/
│   │   └── page.tsx             # Quiz interface
│   ├── results/
│   │   └── [id]/
│   │       └── page.tsx         # Results page
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── lib/
│   └── supabase.ts              # Supabase client
├── types/
│   ├── database.ts              # Database types
│   └── quiz.ts                  # Quiz types
├── supabase-schema.sql          # Database schema
└── README.md
```

## User Flow

1. **Landing Page** → User clicks "Start Assessment"
2. **Quiz Page** → User answers questions one by one
3. **User Info Form** → User enters name and email
4. **Results Page** → Shows score, interpretation, unique ID, and to-do list

## Next Steps for Admin Panel

The admin panel needs to be built next. It will include:
- Password authentication
- CRUD operations for sections, questions, and answers
- Interpretation levels management
- Analytics dashboard
- Question activation/deactivation toggle

## Deployment

### Deploy to Vercel:

```bash
npm run build
```

Then:
1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Support

For issues or questions, check the documentation or contact support.

---

Built with ❤️ using Next.js and Supabase
