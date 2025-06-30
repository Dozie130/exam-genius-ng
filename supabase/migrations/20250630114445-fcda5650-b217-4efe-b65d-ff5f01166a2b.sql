
-- Add indexes to improve query performance for questions
CREATE INDEX IF NOT EXISTS idx_questions_exam_subject_year 
ON public.questions (exam_type, subject, year);

-- Add index for faster filtering by exam type
CREATE INDEX IF NOT EXISTS idx_questions_exam_type 
ON public.questions (exam_type);

-- Add index for subject-based queries
CREATE INDEX IF NOT EXISTS idx_questions_subject 
ON public.questions (subject);

-- Add composite index for the most common query pattern
CREATE INDEX IF NOT EXISTS idx_questions_lookup 
ON public.questions (exam_type, subject, year, created_at);
