import { describe, it, expect, beforeEach } from 'vitest';
import { useGithubStore } from './github';
import { act } from '@testing-library/react';

describe('Github Store Integration', () => {
    beforeEach(() => {
        // Reset store before each test
        useGithubStore.setState({
            search: {
                term: '',
                lastSearchedTerm: '',
                isLoading: false,
                error: null,
                users: [],
            },
            repositories: {
                items: [],
                isLoading: false,
                selectedUser: null,
            },
        });
    });

    it('performs a user search successfully', async () => {
        await act(async () => {
            useGithubStore.getState().setSearchTerm('testuser');
            await useGithubStore.getState().handleSearch();
        });

        const state = useGithubStore.getState();
        expect(state.search.term).toBe('testuser');
        expect(state.search.lastSearchedTerm).toBe('testuser');
        expect(state.search.isLoading).toBe(false);
        expect(state.search.error).toBeNull();
        expect(state.search.users).toHaveLength(1);
        expect(state.search.users[0].login).toBe('testuser');
    });

    it('handles empty search term', async () => {
        await act(async () => {
            useGithubStore.getState().setSearchTerm('');
            await useGithubStore.getState().handleSearch();
        });

        const state = useGithubStore.getState();
        expect(state.search.error).toBe('Please enter a username to search.');
        expect(state.search.users).toHaveLength(0);
    });

    it('loads user repositories when selecting a user', async () => {
        await act(async () => {
            await useGithubStore.getState().handleUserSelect('testuser');
        });

        const state = useGithubStore.getState();
        expect(state.repositories.isLoading).toBe(false);
        expect(state.repositories.selectedUser).toBe('testuser');
        expect(state.repositories.items).toHaveLength(1);
        expect(state.repositories.items[0].name).toBe('test-repo');
    });

    it('clears repositories when deselecting a user', async () => {
        // First select a user
        await act(async () => {
            await useGithubStore.getState().handleUserSelect('testuser');
        });

        // Then deselect the same user
        await act(async () => {
            await useGithubStore.getState().handleUserSelect('testuser');
        });

        const state = useGithubStore.getState();
        expect(state.repositories.selectedUser).toBeNull();
        expect(state.repositories.items).toHaveLength(0);
    });
});
