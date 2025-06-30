
-- Remove all premium restrictions by setting all subjects to free
UPDATE public.subjects 
SET is_free = true;

-- Set all users as non-premium since premium is being removed
UPDATE public.profiles 
SET is_premium = false;
