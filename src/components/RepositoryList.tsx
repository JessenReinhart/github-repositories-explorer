import React from 'react';
import { RepositoryItem } from './RepositoryItem';
import type { GitHubRepo } from '../types';

interface RepositoryListProps {
  repos: GitHubRepo[];
}

export const RepositoryList: React.FC<RepositoryListProps> = ({ repos }) => {
  return (
    <div className="space-y-3">
      {repos.map((repo) => (
        <RepositoryItem key={repo.id} repo={repo} />
      ))}
    </div>
  );
};
