import { db } from '@vercel/postgres';

// NOTE: Objects dropped by this function should be created by `seed.mjs`.
async function main() {
  const client = await db.connect();

  await client.query('DROP TABLE IF EXISTS teams CASCADE;');
  await client.query('DROP TABLE IF EXISTS employees CASCADE;');
  await client.query('DROP TABLE IF EXISTS non_managers CASCADE;');
  await client.query('DROP TABLE IF EXISTS managers CASCADE;');
  await client.query('DROP TABLE IF EXISTS schedules CASCADE;');
  await client.query('DROP TABLE IF EXISTS requests CASCADE;');

  // These tables are no longer used but will still be dropped.
  await client.query('DROP TABLE IF EXISTS team_leaders CASCADE;');

  await client.release();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to drop all tables in the database:',
    err,
  );
});
