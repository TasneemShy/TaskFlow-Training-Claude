'use client';

import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { AUTH_COOKIE } from '@/lib/constants';

interface UserSwitcherProps {
  users: User[];
  currentUserId: number;
}

export function UserSwitcher({ users, currentUserId }: UserSwitcherProps) {
  const router = useRouter();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    document.cookie = `${AUTH_COOKIE}=${event.target.value}; path=/`;
    router.refresh();
  }

  return (
    <label className="flex items-center gap-2 text-sm text-gray-600">
      Signed in as
      <select
        value={currentUserId}
        onChange={handleChange}
        className="rounded border border-gray-300 px-2 py-1"
      >
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </label>
  );
}
