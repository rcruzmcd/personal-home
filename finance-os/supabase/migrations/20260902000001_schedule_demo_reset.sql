-- Nightly reset for the shared "Try Demo" account (src/app/login/actions.ts
-- signInDemo signs visitors into a single fixed demo user; this self-heals
-- whatever they broke). Local dev never needs this — a developer runs
-- `bun run db:reset` manually — so this migration only matters once
-- applied to the hosted project.

create extension if not exists pg_cron;

-- cron.schedule() upserts by job name, so re-running this (e.g. on a local
-- `supabase db reset`, which replays every migration from scratch) is safe.
select cron.schedule(
  'reset-demo-data',
  '0 9 * * *', -- 09:00 UTC nightly
  $$select reset_demo_data();$$
);
