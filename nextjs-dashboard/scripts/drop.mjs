import pg from 'pg';
const Client = pg.Client;

async function main() {
  const client = new Client();
  await client.connect();

  await client.query('DROP TABLE IF EXISTS teams CASCADE;');
  await client.query('DROP TABLE IF EXISTS employees CASCADE;');
  await client.query('DROP TABLE IF EXISTS non_managers CASCADE;');
  await client.query('DROP TABLE IF EXISTS managers CASCADE;');
  await client.query('DROP TABLE IF EXISTS team_leaders CASCADE;');
  await client.query('DROP TABLE IF EXISTS schedules CASCADE;');
  await client.query('DROP TABLE IF EXISTS requests CASCADE;');

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to drop all tables in the database:',
    err,
  );
});
