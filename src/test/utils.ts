import { cleanup, render } from '@testing-library/react';
import { afterEach } from 'vitest';
import { useGithubStore } from '../store/github';

afterEach(() => {
    cleanup();
    // Reset the store state after each test
    const store = useGithubStore.getState();
    store.search = {
        term: '',
        lastSearchedTerm: '',
        isLoading: false,
        error: null,
        users: [],
    };
    store.repositories = {
        items: [],
        isLoading: false,
        selectedUser: null,
    };
});

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
