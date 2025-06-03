import React from 'react';
import { useGithubStore } from '../store/github';

export const SearchInput: React.FC = () => {
  const { term, isLoading } = useGithubStore((state) => state.search);
  const setSearchTerm = useGithubStore((state) => state.setSearchTerm);
  const handleSearch = useGithubStore((state) => state.handleSearch);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        value={term}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter GitHub username"
        className="flex-grow px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
        disabled={isLoading}
      />
      <button
        onClick={handleSearch}
        disabled={isLoading || !term.trim()}
        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
};
