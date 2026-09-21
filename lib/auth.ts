import { cookies } from 'next/headers';
import { getDb } from './db';
import { AUTH_COOKIE } from './constants';
import type { User } from './types';

const DEFAULT_USER_ID = 1;

export function getCurrentUser(): User {
  const cookieStore = cookies();
  const raw = cookieStore.get(AUTH_COOKIE)?.value;
  const userId = raw ? Number(raw) : DEFAULT_USER_ID;

  const db = getDb();
  const user = db.prepare('SELECT * FROM User WHERE id = ?').get(userId) as User | undefined;
  if (user) {
    return user;
  }

  return db.prepare('SELECT * FROM User WHERE id = ?').get(DEFAULT_USER_ID) as User;
}

export function listUsers(): User[] {
  const db = getDb();
  return db.prepare('SELECT * FROM User ORDER BY id ASC').all() as User[];
}
