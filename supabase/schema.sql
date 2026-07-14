-- 1. PROFILES TABLE (Tied to Auth Users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  first_name text,
  last_name text,
  email text,
  city text,
  country text,
  bank_name text,
  account_number text,
  routing_number text,
  swift_code text,
  account_type text,
  bank_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Profile RLS Policies
create policy "Allow users to read their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Allow users to insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Allow users to update their own profile" on public.profiles
  for update using (auth.uid() = id);


-- 2. CLIENTS TABLE
create table public.clients (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  client_name text not null,
  client_email text not null,
  client_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.clients enable row level security;

-- Clients RLS Policy
create policy "Users can fully manage their own clients" on public.clients
  for all using (auth.uid() = user_id);


-- 3. INVOICES TABLE (Cascades on Client deletion)
create table public.invoices (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  client_id uuid references public.clients on delete cascade not null,
  invoice_number text not null,
  issue_date date not null,
  due_date date,
  status text check (status in ('draft', 'sent', 'paid')) default 'draft' not null,
  notes text,
  currency text default 'NGN',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.invoices enable row level security;

-- Invoices RLS Policy
create policy "Users can fully manage their own invoices" on public.invoices
  for all using (auth.uid() = user_id);


-- 4. LINE ITEMS TABLE (Cascades on Invoice deletion)
create table public.line_items (
  id uuid default gen_random_uuid() primary key,
  invoice_id uuid references public.invoices on delete cascade not null,
  description text not null,
  quantity integer not null,
  rate numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.line_items enable row level security;

-- Line Items RLS Policy
create policy "Users can fully manage line items of their owned invoices" on public.line_items
  for all using (
    exists (
      select 1 from public.invoices
      where public.invoices.id = public.line_items.invoice_id
      and public.invoices.user_id = auth.uid()
    )
  );
