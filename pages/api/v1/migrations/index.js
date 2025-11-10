import { runner } from "node-pg-migrate";
import { resolve } from 'path'
import database from "infra/database.js";

// Get the project root directory - use process.cwd() which points to project root
// In production, Next.js sets cwd to the project root
const projectRoot = process.cwd();

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();

  try {
    const defaultMigrationOptions = {
      dbClient: dbClient,
      dryRun: true,
      dir: resolve(projectRoot, 'infra', 'migrations'),
      direction: 'up',
      verbose: true,
      migrationsTable: 'pgmigrations',
    };
    if (request.method === 'GET') {
      const pendingMigrations = await runner(defaultMigrationOptions);
      return response.status(200).json(pendingMigrations);
    }
    if (request.method === 'POST') {
      const migratedMigrations = await runner({
         ...defaultMigrationOptions,
         dryRun: false
      });

      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }

      return response.status(200).json(migratedMigrations);
    }

    return response.status(405).json({ error: 'Method not allowed' });
  } finally {
    await dbClient.end();
  }
}