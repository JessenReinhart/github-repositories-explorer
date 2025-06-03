import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '../test/utils';
import { SearchInput } from './SearchInput';
import { useGithubStore } from '../store/github';

describe('SearchInput', () => {
    it('renders search input and button', () => {
        render(<SearchInput />);

        expect(screen.getByPlaceholderText('Enter GitHub username')).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveTextContent('Search');
    });

    it('updates search term on input change', () => {
        render(<SearchInput />);

        const input = screen.getByPlaceholderText('Enter GitHub username');
        fireEvent.change(input, { target: { value: 'test' } });

        expect(useGithubStore.getState().search.term).toBe('test');
    });

    it('triggers search on button click', () => {
        render(<SearchInput />);

        const input = screen.getByPlaceholderText('Enter GitHub username');
        const button = screen.getByRole('button');

        fireEvent.change(input, { target: { value: 'test' } });
        fireEvent.click(button);

        const state = useGithubStore.getState();
        expect(state.search.isLoading).toBe(true);
    });

    it('disables input and button while loading', () => {
        // Set initial loading state
        useGithubStore.setState({
            search: {
                term: 'test',
                lastSearchedTerm: 'test',
                isLoading: true,
                error: null,
                users: [],
            },
            repositories: {
                items: [],
                isLoading: false,
                selectedUser: null,
            },
        });

        render(<SearchInput />);

        expect(screen.getByPlaceholderText('Enter GitHub username')).toBeDisabled();
        expect(screen.getByRole('button')).toBeDisabled();
        expect(screen.getByRole('button')).toHaveTextContent('Searching...');
    });

    it('triggers search on Enter key press', () => {
        render(<SearchInput />);

        const input = screen.getByPlaceholderText('Enter GitHub username');
        fireEvent.change(input, { target: { value: 'test' } });
        fireEvent.keyDown(input, { key: 'Enter' });

        const state = useGithubStore.getState();
        expect(state.search.isLoading).toBe(true);
    });
});
