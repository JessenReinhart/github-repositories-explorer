import React from 'react';
import { UserItem } from './UserItem';
import { useGithubStore } from '../store/github';
import type { GitHubUser } from '../types';

interface UserListProps {
  users: GitHubUser[];
}

export const UserList: React.FC<UserListProps> = ({ users }) => {
  const selectedUser = useGithubStore((state) => state.repositories.selectedUser);
  const handleUserSelect = useGithubStore((state) => state.handleUserSelect);

  if (users.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-3">
      {users.map((user) => (
        <UserItem
          key={user.id}
          user={user}
          isSelected={selectedUser === user.login}
          onSelect={handleUserSelect}
        />
      ))}
    </div>
  );
};
