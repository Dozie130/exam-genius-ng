-- Update profiles table to support premium features
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS flutterwave_transaction_id TEXT,
ADD COLUMN IF NOT EXISTS premium_expires_at TIMESTAMPTZ;

-- Update profiles table to rename is_premium to is_paid for clarity
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS is_premium;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT false;

-- Create index for better performance on payment queries
CREATE INDEX IF NOT EXISTS idx_profiles_payment_status ON public.profiles(payment_status);
CREATE INDEX IF NOT EXISTS idx_profiles_is_paid ON public.profiles(is_paid);

-- Update handle_new_user function to set default payment status
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, payment_status, is_paid)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'free',
    false
  );
  RETURN NEW;
END;
$function$;