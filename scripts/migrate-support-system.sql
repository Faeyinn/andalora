-- Support System Migration
-- Run this in Supabase SQL Editor

-- 1. Create Support Tickets Table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Support Messages Table
CREATE TABLE IF NOT EXISTS public.support_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- 'system', 'support', 'transaction'
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Users can create tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Admins can view all tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Admins can update tickets" ON public.support_tickets;

DROP POLICY IF EXISTS "Users can view messages for own tickets" ON public.support_messages;
DROP POLICY IF EXISTS "Users can create messages for own tickets" ON public.support_messages;
DROP POLICY IF EXISTS "Admins can view all messages" ON public.support_messages;
DROP POLICY IF EXISTS "Admins can create messages" ON public.support_messages;

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can create notifications" ON public.notifications;

-- Support Tickets
-- Users can view their own tickets
CREATE POLICY "Users can view own tickets" ON public.support_tickets
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create tickets
CREATE POLICY "Users can create tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all tickets
CREATE POLICY "Admins can view all tickets" ON public.support_tickets
  FOR SELECT USING (public.is_admin());

-- Admins can update tickets
CREATE POLICY "Admins can update tickets" ON public.support_tickets
  FOR UPDATE USING (public.is_admin());

-- Support Messages
-- Users can view messages for their tickets
CREATE POLICY "Users can view messages for own tickets" ON public.support_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.support_tickets
      WHERE id = ticket_id AND user_id = auth.uid()
    )
  );

-- Users can create messages for their tickets
CREATE POLICY "Users can create messages for own tickets" ON public.support_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.support_tickets
      WHERE id = ticket_id AND user_id = auth.uid()
    )
  );

-- Admins can view all messages
CREATE POLICY "Admins can view all messages" ON public.support_messages
  FOR SELECT USING (public.is_admin());

-- Admins can create messages
CREATE POLICY "Admins can create messages" ON public.support_messages
  FOR INSERT WITH CHECK (public.is_admin());

-- Notifications
-- Users can view own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can create notifications (system wide or specific)
CREATE POLICY "Admins can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (public.is_admin());

-- 6. Trigger to update updated_at on tickets
CREATE OR REPLACE FUNCTION update_ticket_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.support_tickets
  SET updated_at = NOW()
  WHERE id = NEW.ticket_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ticket_timestamp
AFTER INSERT ON public.support_messages
FOR EACH ROW
EXECUTE FUNCTION update_ticket_timestamp();
