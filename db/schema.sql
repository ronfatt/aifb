create extension if not exists pgcrypto;

create table if not exists config (
  id uuid primary key default gen_random_uuid(),
  page_id text not null unique,
  page_name text,
  publish_frequency_per_day int not null default 1,
  dry_run boolean not null default true,
  image_generation_enabled boolean not null default true,
  image_style text not null default 'cinematic human realism, warm editorial lighting, facebook-friendly portrait poster',
  language text not null default 'ms-MY',
  tone text not null,
  prompt_profile jsonb not null default '{}'::jsonb,
  constraints jsonb not null default '[]'::jsonb,
  content_types jsonb not null default '[]'::jsonb,
  target_emotions jsonb not null default '[]'::jsonb,
  cta_styles jsonb not null default '[]'::jsonb,
  hook_patterns jsonb not null default '[]'::jsonb,
  story_slots jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists runs (
  id uuid primary key default gen_random_uuid(),
  run_id text not null unique,
  page_id text not null,
  workflow_name text not null,
  status text not null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  error_message text,
  meta jsonb not null default '{}'::jsonb
);

create table if not exists drafts (
  id uuid primary key default gen_random_uuid(),
  run_id text not null references runs(run_id) on delete cascade,
  page_id text not null,
  story_slot text not null default 'story-a',
  draft_json jsonb not null,
  qa_result_json jsonb,
  formatted_text text,
  content_hash text not null,
  qa_status text not null default 'PENDING',
  review_status text not null default 'PASS_AUTO',
  publish_scheduled_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid references drafts(id) on delete set null,
  page_id text not null,
  story_slot text not null default 'story-a',
  fb_post_id text not null unique,
  publish_mode text not null default 'live',
  content_hash text not null,
  status text not null,
  published_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists metrics_daily (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  metric_date date not null,
  likes int not null default 0,
  comments int not null default 0,
  shares int not null default 0,
  reach int not null default 0,
  engagement_rate numeric(8,4) not null default 0,
  created_at timestamptz not null default now(),
  unique (post_id, metric_date)
);

create table if not exists post_metrics_snapshots (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  snapshot_at timestamptz not null,
  likes int not null default 0,
  comments int not null default 0,
  shares int not null default 0,
  reach int not null default 0,
  engagement_rate numeric(8,4) not null default 0
);
