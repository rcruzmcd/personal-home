-- Local dev seed data. Loaded automatically by `supabase db reset` (see
-- supabase/config.toml's [db.seed]), or re-run any time against a running
-- local stack with:
--   supabase db execute --file supabase/seed.sql --local
--
-- The actual demo-user + sample-data logic lives in reset_demo_data()
-- (see supabase/migrations/20260902000000_create_reset_demo_data_function.sql)
-- so local dev seeding and the nightly production reset
-- (20260902000001_schedule_demo_reset.sql) can never drift apart.
--
-- Login: demo@example.com / devpassword123

select reset_demo_data();
