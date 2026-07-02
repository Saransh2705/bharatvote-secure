-- BharatVote — schema, RLS, indexes, and seed data
-- Applied to Supabase project xifkndmdsinvnmjwpimt (org BharatVote)

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------- tables
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  voter_id text unique,
  full_name text not null,
  phone text,
  state text,
  aadhaar_verified boolean default false,
  face_data text,
  role text default 'voter',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists elections (
  id uuid primary key default uuid_generate_v4(),
  election_type text not null,
  state text not null,
  start_date date not null,
  end_date date not null,
  status text default 'upcoming' check (status in ('active','upcoming','completed')),
  created_at timestamptz default now()
);

create table if not exists candidates (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  party text not null,
  party_symbol text,
  election_id uuid references elections(id) on delete cascade,
  photo text,
  votes integer default 0,
  created_at timestamptz default now()
);

create table if not exists votes (
  id uuid primary key default uuid_generate_v4(),
  election_id uuid references elections(id) on delete cascade,
  voter_id uuid references users(id) on delete cascade,
  candidate_id uuid references candidates(id) on delete cascade,
  encrypted_vote text not null,
  confirmation_id text unique not null,
  voted_at timestamptz default now(),
  unique(election_id, voter_id)
);

create table if not exists booths (
  id uuid primary key default uuid_generate_v4(),
  booth_number text not null,
  address text not null,
  constituency text,
  district text,
  state text not null,
  officer text,
  lat decimal(10,8),
  lng decimal(11,8),
  created_at timestamptz default now()
);

create table if not exists documents (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text not null,
  date date not null,
  file_url text not null,
  created_at timestamptz default now()
);

create table if not exists announcements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text not null,
  date date default current_date,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------- indexes
create index if not exists idx_votes_election on votes(election_id);
create index if not exists idx_votes_voter on votes(voter_id);
create index if not exists idx_votes_confirmation on votes(confirmation_id);
create index if not exists idx_candidates_election on candidates(election_id);
create index if not exists idx_elections_status on elections(status);
create index if not exists idx_users_email on users(email);
create index if not exists idx_users_voter_id on users(voter_id);

-- ---------------------------------------------------------------- RLS
alter table users         enable row level security;
alter table elections     enable row level security;
alter table candidates    enable row level security;
alter table votes         enable row level security;
alter table booths        enable row level security;
alter table documents     enable row level security;
alter table announcements enable row level security;

-- Public reference data is readable by anyone (anon key). Writes and any
-- access to users/votes go exclusively through server routes using the
-- service-role key, which bypasses RLS.
drop policy if exists "read elections"     on elections;
drop policy if exists "read candidates"    on candidates;
drop policy if exists "read booths"        on booths;
drop policy if exists "read documents"     on documents;
drop policy if exists "read announcements" on announcements;
create policy "read elections"     on elections     for select using (true);
create policy "read candidates"    on candidates    for select using (true);
create policy "read booths"        on booths        for select using (true);
create policy "read documents"     on documents     for select using (true);
create policy "read announcements" on announcements for select using (true);

-- ---------------------------------------------------------------- seed
insert into elections (election_type, state, start_date, end_date, status) values
  ('Lok Sabha Election','All India','2026-04-10','2026-05-20','upcoming'),
  ('State Assembly Election','Maharashtra','2026-03-01','2026-03-15','active'),
  ('Municipal Corporation Election','Delhi','2026-03-05','2026-03-10','active'),
  ('Nagar Panchayat Election','Uttar Pradesh','2026-02-01','2026-02-15','completed'),
  ('Mayor Election','Karnataka','2026-03-20','2026-03-20','upcoming'),
  ('Ward Election','Tamil Nadu','2026-02-20','2026-02-25','completed')
on conflict do nothing;

insert into candidates (name, party, party_symbol, election_id, votes)
  select v.name, v.party, v.sym, e.id, v.votes
  from elections e
  join (values
    ('State Assembly Election','Rajesh Kumar','National Democratic Alliance',E'\U0001FAB7',45230),
    ('State Assembly Election','Priya Sharma','United Progressive Front','✋',38920),
    ('State Assembly Election','Amit Patel','People''s Democratic Party',E'\U0001F33E',12450),
    ('State Assembly Election','Sunita Devi','Independent','⭐',8700),
    ('Municipal Corporation Election','Vikram Singh','National Democratic Alliance',E'\U0001FAB7',32100),
    ('Municipal Corporation Election','Meera Nair','United Progressive Front','✋',29800)
  ) as v(etype,name,party,sym,votes) on v.etype = e.election_type
where not exists (select 1 from candidates c where c.name = v.name);

insert into booths (booth_number,address,constituency,district,state,officer,lat,lng) values
  ('MH-001','Government School, Andheri West','Mumbai North','Mumbai','Maharashtra','Mr. R.K. Verma',19.1364,72.8296),
  ('MH-002','Community Hall, Bandra East','Mumbai South','Mumbai','Maharashtra','Mrs. S. Patil',19.0596,72.8411),
  ('DL-001','Primary School, Connaught Place','New Delhi','Central Delhi','Delhi','Mr. A. Kumar',28.6315,77.2167)
on conflict do nothing;

insert into documents (title,category,date,file_url) values
  ('General Election Notification 2026','Election Notifications','2026-02-15','#'),
  ('Candidate List — Maharashtra Assembly','Candidate Lists','2026-02-20','#'),
  ('Model Code of Conduct Guidelines','Election Rules','2026-01-10','#'),
  ('Rejected Nominations — Delhi Municipal','Rejected Candidates','2026-02-25','#'),
  ('Voter Roll Revision Notice','Voter Removal Notices','2026-01-20','#'),
  ('EVM Usage Guidelines','Public Announcements','2026-02-01','#')
on conflict do nothing;

insert into announcements (title,date,content) values
  ('Maharashtra Assembly Election Schedule Released','2026-02-15','The Election Commission has announced the schedule for Maharashtra State Assembly Elections.'),
  ('Voter ID Verification Deadline Extended','2026-02-20','Last date for voter ID verification has been extended to March 5, 2026.'),
  ('New Digital Voting Guidelines Published','2026-02-25','Updated guidelines for digital voting procedures have been published.'),
  ('Polling Booth Accessibility Improvements','2026-03-01','All polling booths will now have wheelchair access and braille signage.')
on conflict do nothing;
