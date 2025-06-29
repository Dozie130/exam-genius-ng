
-- Create enum types for better data consistency
CREATE TYPE exam_type AS ENUM ('WAEC', 'JAMB', 'NECO');
CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed');
CREATE TYPE payment_method AS ENUM ('Paystack', 'Flutterwave');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  registered_date TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions table
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  exam_type exam_type NOT NULL,
  year INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- Store as {"A": "option1", "B": "option2", etc}
  correct_option TEXT NOT NULL,
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI word explanations history
CREATE TABLE public.word_explanations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  explanation TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exam attempts/results
CREATE TABLE public.exam_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  exam_type exam_type NOT NULL,
  questions_answered INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  score_percent INTEGER NOT NULL,
  time_taken_minutes INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  payment_method payment_method NOT NULL,
  status payment_status DEFAULT 'pending',
  payment_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subjects configuration
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_name TEXT NOT NULL,
  exam_type exam_type NOT NULL,
  time_limit_minutes INTEGER NOT NULL,
  is_free BOOLEAN DEFAULT FALSE,
  total_questions INTEGER NOT NULL,
  icon TEXT DEFAULT '📚',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookmarked questions
CREATE TABLE public.bookmarked_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.word_explanations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarked_questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for word_explanations
CREATE POLICY "Users can view own word explanations" ON public.word_explanations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create word explanations" ON public.word_explanations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for exam_attempts
CREATE POLICY "Users can view own exam attempts" ON public.exam_attempts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create exam attempts" ON public.exam_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for payments
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for bookmarked_questions
CREATE POLICY "Users can view own bookmarks" ON public.bookmarked_questions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookmarks" ON public.bookmarked_questions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON public.bookmarked_questions
  FOR DELETE USING (auth.uid() = user_id);

-- Questions and subjects are publicly readable
CREATE POLICY "Anyone can view questions" ON public.questions FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Anyone can view subjects" ON public.subjects FOR SELECT TO PUBLIC USING (true);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample subjects
INSERT INTO public.subjects (subject_name, exam_type, time_limit_minutes, is_free, total_questions, icon) VALUES
('English', 'WAEC', 45, true, 40, '📘'),
('Mathematics', 'WAEC', 60, true, 40, '📐'),
('Biology', 'WAEC', 60, false, 40, '🧪'),
('Physics', 'WAEC', 60, false, 40, '⚡'),
('Chemistry', 'WAEC', 60, false, 40, '🧪'),
('English', 'JAMB', 30, true, 40, '📘'),
('Mathematics', 'JAMB', 30, true, 40, '📐'),
('Biology', 'JAMB', 30, false, 40, '🧪'),
('Physics', 'JAMB', 30, false, 40, '⚡'),
('Chemistry', 'JAMB', 30, false, 40, '🧪');
