import React from 'react';
import { SearchInput } from './components/SearchInput';
import { UserList } from './components/UserList';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useGithubStore } from './store/github';

const App: React.FC = () => {
  const { users, isLoading, error, lastSearchedTerm } = useGithubStore((state) => state.search);

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 flex flex-col items-center font-sans">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg p-6 md:p-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
            GitHub Repositories Explorer
          </h1>
        </header>
        <main>
          <SearchInput />
          {isLoading && (
            <div className="mt-6">
              <LoadingSpinner />
            </div>
          )}
          {error && !isLoading && (
            <div className="mt-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md">
              {error}
            </div>
          )}
          {!isLoading && users.length > 0 && (
            <p className="mt-6 text-sm text-slate-600">
              Showing users for "{lastSearchedTerm}"
            </p>
          )}
          {!isLoading && users.length > 0 && <UserList users={users} />}
        </main>
      </div>
      <footer className="mt-8 text-center text-sm text-slate-500">
        <p>Recruitment task submission.</p>
      </footer>
    </div>
  );
};

export default App;
