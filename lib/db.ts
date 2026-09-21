import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { seed } from './seed';

declare global {
  // eslint-disable-next-line no-var
  var __taskflowDb: Database.Database | undefined;
}

function createDatabase(): Database.Database {
  const db = new Database(':memory:');
  db.pragma('foreign_keys = ON');

  const schemaPath = path.join(process.cwd(), 'lib', 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);

  seed(db);

  return db;
}

export function getDb(): Database.Database {
  if (!globalThis.__taskflowDb) {
    globalThis.__taskflowDb = createDatabase();
  }
  return globalThis.__taskflowDb;
}

/** Test-only: forces the next getDb() call to build a fresh in-memory database. */
export function resetDbForTests(): void {
  globalThis.__taskflowDb?.close();
  globalThis.__taskflowDb = undefined;
}
