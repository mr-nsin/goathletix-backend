-- 1. Create Profiles Table (extends Supabase's auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  preferred_location TEXT, -- Preferred City/Region
  sports_interest sport_category[], -- Array of interests: ['running', 'cycling']
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger to automatically create a profile record when a new user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, preferred_location, onboarding_completed)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', NULL, FALSE);
  RETURN NEW;
END;
$$ language plpgsql security definer;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 2. Create Follows Table (to track organizers and events)
CREATE TYPE follow_target AS ENUM ('organizer', 'event');

CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type follow_target NOT NULL,
  organizer_id UUID REFERENCES public.organizers(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Prevent double following
  CONSTRAINT unique_user_follow_organizer UNIQUE (user_id, organizer_id),
  CONSTRAINT unique_user_follow_event UNIQUE (user_id, event_id),
  
  -- Ensure that exactly one reference is filled based on type
  CONSTRAINT check_follow_reference CHECK (
    (target_type = 'organizer' AND organizer_id IS NOT NULL AND event_id IS NULL) OR
    (target_type = 'event' AND event_id IS NOT NULL AND organizer_id IS NULL)
  )
);

-- 3. Create User Saved Calendars Table (Bookmarks)
CREATE TABLE IF NOT EXISTS user_calendars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  CONSTRAINT unique_user_event_calendar UNIQUE (user_id, event_id)
);

-- 4. Create Reminders / Notifications Table
CREATE TYPE reminder_type AS ENUM ('registration_open', 'registration_close', 'event_date');

CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  trigger_type reminder_type NOT NULL,
  is_triggered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  CONSTRAINT unique_user_event_reminder UNIQUE (user_id, event_id, trigger_type)
);

-- 5. Create Event Requests Table (Add Event Form Submission)
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE IF NOT EXISTS event_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Optional, can be anonymous
  event_name TEXT NOT NULL,
  sport_type sport_category NOT NULL,
  event_date DATE NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  venue TEXT NOT NULL,
  registration_url TEXT NOT NULL,
  description TEXT,
  organizer_name TEXT NOT NULL,
  status request_status DEFAULT 'pending'::request_status NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create Feedback & Feature Requests Table
CREATE TYPE feedback_type AS ENUM ('feature_request', 'general_feedback', 'bug_report');

CREATE TABLE IF NOT EXISTS user_feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Optional
  feedback_type feedback_type NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Add Indexes for Social and Dashboard Lookups
CREATE INDEX IF NOT EXISTS idx_follows_user_id ON follows(user_id);
CREATE INDEX IF NOT EXISTS idx_user_calendars_user_id ON user_calendars(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_trigger ON reminders(event_id, trigger_type) WHERE NOT is_triggered;
CREATE INDEX IF NOT EXISTS idx_event_requests_status ON event_requests(status);
