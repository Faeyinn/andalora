-- Enable Realtime for all major features

-- 1. Enable replication for notifications (User alerts)
alter publication supabase_realtime add table notifications;

-- 2. Enable replication for support_messages (Chat)
alter publication supabase_realtime add table support_messages;

-- 3. Enable replication for products (Marketplace feed & Admin list)
alter publication supabase_realtime add table products;

-- 4. Enable replication for support_tickets (Admin ticket list & User ticket status)
alter publication supabase_realtime add table support_tickets;

-- Note: You can verify this in the Supabase Dashboard under Database > Replication
