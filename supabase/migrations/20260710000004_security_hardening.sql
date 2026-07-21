-- Protect public-schema data when accessed through Supabase's Data API.
-- Server-side Prisma connections should use a least-privilege, non-browser credential.

ALTER TABLE public.organizers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read organizers"
  ON public.organizers FOR SELECT USING (true);

CREATE POLICY "Public can read events"
  ON public.events FOR SELECT USING (true);

CREATE POLICY "Users can read their profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage their follows"
  ON public.follows FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their calendars"
  ON public.user_calendars FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their reminders"
  ON public.reminders FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can create event requests"
  ON public.event_requests FOR INSERT WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can read their event requests"
  ON public.event_requests FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create feedback"
  ON public.user_feedbacks FOR INSERT WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can read their feedback"
  ON public.user_feedbacks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public can read activity logs"
  ON public.activity_logs FOR SELECT USING (true);

ALTER FUNCTION public.handle_new_user() SET search_path = public, pg_temp;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
