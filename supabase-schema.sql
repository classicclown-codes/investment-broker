-- Supabase schema for Aurum Capital
-- Run this SQL in the Supabase SQL editor to create the required tables.

create extension if not exists "uuid-ossp";

create table if not exists accounts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  portfolio_value numeric(14,2) default 0 not null,
  invested_amount numeric(14,2) default 0 not null,
  pending_deposits numeric(14,2) default 0 not null,
  active_strategies text,
  strategy text,
  last_activity date,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create index if not exists accounts_user_id_idx on accounts(user_id);

create table if not exists clients (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid,
  email text not null,
  name text,
  portfolio_value numeric(14,2) default 0 not null,
  status text default 'Pending' not null,
  strategy text,
  holdings integer default 0 not null,
  last_activity date,
  account_id uuid,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create index if not exists clients_user_id_idx on clients(user_id);
create index if not exists clients_email_idx on clients(email);
create index if not exists clients_account_id_idx on clients(account_id);

create table if not exists transactions (
  id uuid primary key default uuid_generate_v4(),
  account_id uuid,
  user_id uuid,
  amount numeric(14,2) default 0 not null,
  asset text,
  status text default 'pending' not null,
  date date,
  reference text,
  funding_source text,
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create index if not exists transactions_account_id_idx on transactions(account_id);
create index if not exists transactions_user_id_idx on transactions(user_id);
create index if not exists transactions_status_idx on transactions(status);

create table if not exists holdings (
  id uuid primary key default uuid_generate_v4(),
  account_id uuid not null,
  asset text not null,
  value numeric(14,2) default 0 not null,
  color text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create index if not exists holdings_account_id_idx on holdings(account_id);
