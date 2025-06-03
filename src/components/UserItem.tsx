import React from 'react';
import { RepositoryList } from './RepositoryList';
import { LoadingSpinner } from './LoadingSpinner';
import { ChevronDownIcon, ChevronUpIcon } from './icons';
import { useGithubStore } from '../store/github';
import type { GitHubUser } from '../types';

interface UserItemProps {
  user: GitHubUser;
  isSelected: boolean;
  onSelect: (login: string) => void;
}

export const UserItem: React.FC<UserItemProps> = ({
  user,
  isSelected,
  onSelect,
}) => {
  const repositories = useGithubStore((state) => state.repositories);
  const userRepositories = isSelected ? repositories.items : [];
  const isLoadingRepos = isSelected && repositories.isLoading;

  return (
    <div className="border border-slate-200 rounded-md shadow-sm overflow-hidden">
      <button
        onClick={() => onSelect(user.login)}
        className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-expanded={isSelected}
      >
        <span className="font-medium text-slate-700">{user.login}</span>
        {isSelected ? (
          <ChevronUpIcon className="w-5 h-5 text-slate-500" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-slate-500" />
        )}
      </button>
      {isSelected && (
        <div className="p-4 border-t border-slate-200 bg-white">
          {isLoadingRepos && <LoadingSpinner />}
          {!isLoadingRepos && userRepositories.length === 0 && (
            <p className="text-sm text-slate-500">
              This user has no public repositories or none were found.
            </p>
          )}
          {!isLoadingRepos && userRepositories.length > 0 && (
            <RepositoryList repos={userRepositories} />
          )}
        </div>
      )}
    </div>
  );
};
