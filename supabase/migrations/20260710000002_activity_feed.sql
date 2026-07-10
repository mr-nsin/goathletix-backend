-- 1. Create Activity Feed Table
CREATE TYPE activity_action AS ENUM ('save', 'follow', 'calendar_add');

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Nullable if user wants to hide profile/remain anonymous
  user_display_name TEXT, -- Cached name to avoid constant joins (e.g. "Arjun S.")
  action_type activity_action NOT NULL,
  target_id UUID NOT NULL, -- References event_id or organizer_id
  target_name TEXT NOT NULL, -- Cached target name (e.g. "Tata Mumbai Marathon 2027")
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Index on created_at for fast descending queries
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- 3. Triggers to automatically log activity when actions occur
-- A. Trigger for Saved Events (Calendar Bookmarks)
CREATE OR REPLACE FUNCTION log_calendar_activity()
RETURNS TRIGGER AS $$
DECLARE
    u_name TEXT;
    e_name TEXT;
BEGIN
    SELECT full_name INTO u_name FROM public.profiles WHERE id = NEW.user_id;
    SELECT event_name INTO e_name FROM public.events WHERE id = NEW.event_id;
    
    INSERT INTO public.activity_logs (user_id, user_display_name, action_type, target_id, target_name)
    VALUES (NEW.user_id, COALESCE(u_name, 'An Athlete'), 'save', NEW.event_id, e_name);
    RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER trigger_log_calendar
    AFTER INSERT ON public.user_calendars
    FOR EACH ROW
    EXECUTE FUNCTION log_calendar_activity();

-- B. Trigger for Follows
CREATE OR REPLACE FUNCTION log_follow_activity()
RETURNS TRIGGER AS $$
DECLARE
    u_name TEXT;
    t_name TEXT;
BEGIN
    SELECT full_name INTO u_name FROM public.profiles WHERE id = NEW.user_id;
    
    IF NEW.target_type = 'organizer' THEN
        SELECT name INTO t_name FROM public.organizers WHERE id = NEW.organizer_id;
        INSERT INTO public.activity_logs (user_id, user_display_name, action_type, target_id, target_name)
        VALUES (NEW.user_id, COALESCE(u_name, 'An Athlete'), 'follow', NEW.organizer_id, t_name);
    ELSE
        SELECT event_name INTO t_name FROM public.events WHERE id = NEW.event_id;
        INSERT INTO public.activity_logs (user_id, user_display_name, action_type, target_id, target_name)
        VALUES (NEW.user_id, COALESCE(u_name, 'An Athlete'), 'follow', NEW.event_id, t_name);
    END IF;
    
    RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER trigger_log_follow
    AFTER INSERT ON public.follows
    FOR EACH ROW
    EXECUTE FUNCTION log_follow_activity();
