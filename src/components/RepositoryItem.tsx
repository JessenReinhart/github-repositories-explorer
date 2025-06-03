import React from 'react';
import type { GitHubRepo } from '../types';
import { StarIcon } from './icons';

interface RepositoryItemProps {
  repo: GitHubRepo;
}

export const RepositoryItem: React.FC<RepositoryItemProps> = ({ repo }) => {
  return (
    <div className="p-4 border border-slate-200 rounded-md hover:shadow-md transition-shadow bg-white">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-blue-700 hover:text-blue-800">
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
            {repo.name}
          </a>
        </h3>
        <div className="flex items-center space-x-1 text-sm text-slate-600 shrink-0 ml-2">
          <span>{repo.stargazers_count}</span>
          <StarIcon className="w-4 h-4 text-amber-400" />
        </div>
      </div>
      {repo.description && (
        <p className="mt-1 text-sm text-slate-600">{repo.description}</p>
      )}
    </div>
  );
};
