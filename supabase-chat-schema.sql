-- Run this entire file in the Supabase SQL Editor before publishing the inbox.
-- Create a Supabase Auth user first, then replace the UUID in the final insert.
-- Never expose a service_role key in the browser.

create extension if not exists pgcrypto;

create table if not exists public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  visitor_name text not null,
  visitor_email text not null,
  source_page text,
  visitor_token uuid not null default gen_random_uuid(),
  status text not null default 'new' check (status in ('new', 'open', 'closed')),
  last_message_preview text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
alter table public.chat_conversations add column if not exists visitor_token uuid;
update public.chat_conversations set visitor_token = gen_random_uuid() where visitor_token is null;
alter table public.chat_conversations alter column visitor_token set default gen_random_uuid(), alter column visitor_token set not null;
create unique index if not exists chat_conversations_visitor_token_idx on public.chat_conversations(visitor_token);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chat_conversations(id) on delete cascade,
  sender_type text not null check (sender_type in ('visitor', 'agent')),
  message text not null check (char_length(trim(message)) between 1 and 4000),
  created_at timestamptz not null default timezone('utc', now())
);
create table if not exists public.chat_owner_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now())
);
create index if not exists chat_conversations_status_idx on public.chat_conversations(status, updated_at desc);
create index if not exists chat_messages_conversation_idx on public.chat_messages(conversation_id, created_at asc);

create or replace function public.touch_chat_conversation()
returns trigger language plpgsql as $$
begin
  update public.chat_conversations set updated_at = timezone('utc', now()), last_message_preview = left(new.message, 180),
    status = case when new.sender_type = 'agent' then 'open' else status end
  where id = new.conversation_id;
  return new;
end; $$;
drop trigger if exists chat_messages_touch_conversation on public.chat_messages;
create trigger chat_messages_touch_conversation after insert on public.chat_messages for each row execute function public.touch_chat_conversation();

create or replace function public.is_chat_owner()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.chat_owner_users where user_id = auth.uid());
$$;

-- Anonymous visitors cannot access tables. They use these token-scoped RPC functions.
create or replace function public.start_chat_conversation(p_visitor_name text, p_visitor_email text, p_source_page text, p_message text)
returns table(conversation_id uuid, visitor_token uuid, created_at timestamptz)
language plpgsql security definer set search_path = public as $$
declare v_conversation public.chat_conversations;
begin
  if char_length(trim(coalesce(p_visitor_name, ''))) not between 1 and 160
     or char_length(trim(coalesce(p_visitor_email, ''))) not between 3 and 320
     or char_length(trim(coalesce(p_message, ''))) not between 1 and 4000 then raise exception 'Invalid chat message'; end if;
  insert into public.chat_conversations (visitor_name, visitor_email, source_page)
  values (trim(p_visitor_name), trim(p_visitor_email), left(p_source_page, 2000)) returning * into v_conversation;
  insert into public.chat_messages (conversation_id, sender_type, message) values (v_conversation.id, 'visitor', trim(p_message));
  return query select v_conversation.id, v_conversation.visitor_token, v_conversation.created_at;
end; $$;

create or replace function public.send_visitor_chat_message(p_conversation_id uuid, p_visitor_token uuid, p_message text)
returns table(id uuid, created_at timestamptz)
language plpgsql security definer set search_path = public as $$
begin
  if char_length(trim(coalesce(p_message, ''))) not between 1 and 4000 then raise exception 'Invalid chat message'; end if;
  if not exists (select 1 from public.chat_conversations c where c.id = p_conversation_id and c.visitor_token = p_visitor_token) then raise exception 'Conversation not found'; end if;
  return query insert into public.chat_messages (conversation_id, sender_type, message)
  values (p_conversation_id, 'visitor', trim(p_message)) returning chat_messages.id, chat_messages.created_at;
end; $$;

create or replace function public.get_visitor_chat_messages(p_conversation_id uuid, p_visitor_token uuid)
returns table(sender_type text, message text, created_at timestamptz)
language sql stable security definer set search_path = public as $$
  select m.sender_type, m.message, m.created_at from public.chat_messages m
  join public.chat_conversations c on c.id = m.conversation_id
  where c.id = p_conversation_id and c.visitor_token = p_visitor_token order by m.created_at asc;
$$;

alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;
alter table public.chat_owner_users enable row level security;
drop policy if exists "Owners can manage conversations" on public.chat_conversations;
create policy "Owners can manage conversations" on public.chat_conversations for all to authenticated using (public.is_chat_owner()) with check (public.is_chat_owner());
drop policy if exists "Owners can manage messages" on public.chat_messages;
create policy "Owners can manage messages" on public.chat_messages for all to authenticated using (public.is_chat_owner()) with check (public.is_chat_owner());
drop policy if exists "Anon can create conversations" on public.chat_conversations;
drop policy if exists "Anon can create visitor messages" on public.chat_messages;

revoke all on public.chat_conversations, public.chat_messages, public.chat_owner_users from anon;
revoke all on function public.start_chat_conversation(text, text, text, text) from public;
revoke all on function public.send_visitor_chat_message(uuid, uuid, text) from public;
revoke all on function public.get_visitor_chat_messages(uuid, uuid) from public;
grant execute on function public.start_chat_conversation(text, text, text, text) to anon;
grant execute on function public.send_visitor_chat_message(uuid, uuid, text) to anon;
grant execute on function public.get_visitor_chat_messages(uuid, uuid) to anon;
grant execute on function public.is_chat_owner() to authenticated;
grant select, insert, update, delete on public.chat_conversations to authenticated;
grant select, insert, update, delete on public.chat_messages to authenticated;

-- Provision each permitted owner manually:
-- insert into public.chat_owner_users (user_id) values ('PASTE_AUTH_USER_UUID_HERE');