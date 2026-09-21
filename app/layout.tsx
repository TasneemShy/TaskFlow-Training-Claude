import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { getCurrentUser, listUsers } from '@/lib/auth';
import { UserSwitcher } from '@/components/UserSwitcher';

export const metadata: Metadata = {
  title: 'TaskFlow',
  description: 'A lightweight project and task tracker.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const currentUser = getCurrentUser();
  const users = listUsers();

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
            <nav className="flex gap-4 text-sm font-medium">
              <Link href="/">Projects</Link>
              <Link href="/dashboard">Dashboard</Link>
            </nav>
            <UserSwitcher users={users} currentUserId={currentUser.id} />
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
