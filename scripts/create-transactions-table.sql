-- Create transactions table
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  product_id uuid references public.products(id) not null,
  listing_plan_id uuid references public.listing_plans(id) not null,
  amount numeric not null,
  status text not null, -- pending, success, failed, expired
  payment_type text, -- midtrans, simulation
  snap_token text,
  midtrans_order_id text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.transactions enable row level security;

-- Policies
create policy "Users can view their own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can create transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

-- Enable Realtime
alter publication supabase_realtime add table transactions;
