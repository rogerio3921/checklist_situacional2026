-- Fase 1: esquema inicial para evolucao online
-- Nao altera as regras de calculo; apenas prepara persistencia relacional.

create table if not exists users (
  id uuid primary key,
  name text not null,
  email text not null unique,
  role text not null default 'avaliador',
  created_at timestamptz not null default now()
);

create table if not exists institutions (
  id uuid primary key,
  name text not null,
  city text,
  state text,
  type text,
  surgical_rooms integer,
  autoclaves integer,
  responsible_name text,
  position text,
  email text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists assessments (
  id uuid primary key,
  institution_id uuid not null references institutions(id),
  created_by uuid references users(id),
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  score_global integer,
  score_c integer,
  score_p integer,
  score_i integer,
  progress integer,
  answered integer,
  total integer
);

create table if not exists questions (
  id integer primary key,
  text text not null,
  module text not null,
  submodule text,
  layer text not null,
  category text not null,
  weight integer not null,
  norma text not null,
  criticality text,
  is_active boolean not null default true,
  version integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists assessment_answers (
  id bigserial primary key,
  assessment_id uuid not null references assessments(id) on delete cascade,
  question_id integer not null references questions(id),
  answer text,
  updated_at timestamptz,
  unique (assessment_id, question_id)
);

create table if not exists reports (
  id uuid primary key,
  assessment_id uuid not null references assessments(id) on delete cascade,
  kind text not null,
  generated_at timestamptz not null default now(),
  payload_json jsonb not null
);

create index if not exists idx_assessments_institution on assessments(institution_id);
create index if not exists idx_answers_assessment on assessment_answers(assessment_id);
create index if not exists idx_questions_module on questions(module);
