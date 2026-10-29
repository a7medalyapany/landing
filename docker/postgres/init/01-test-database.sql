-- Runs once, when the postgres volume is first created.
-- Tests use this database (TEST_DATABASE_URL) so they never touch dev data.
CREATE DATABASE landing_test;
