import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/utils';
import { RepositoryItem } from './RepositoryItem';
import type { GitHubRepo } from '../types';

describe('RepositoryItem', () => {
    const mockRepo: GitHubRepo = {
        id: 1,
        name: 'test-repo',
        description: 'Test repository description',
        html_url: 'https://github.com/testuser/test-repo',
        stargazers_count: 42,
    };

    it('renders repository information correctly', () => {
        render(<RepositoryItem repo={mockRepo} />);

        // Check if repository name is rendered and linked correctly
        const repoLink = screen.getByRole('link', { name: 'test-repo' });
        expect(repoLink).toBeInTheDocument();
        expect(repoLink).toHaveAttribute('href', mockRepo.html_url);
        expect(repoLink).toHaveAttribute('target', '_blank');
        expect(repoLink).toHaveAttribute('rel', 'noopener noreferrer');

        // Check if description is rendered
        expect(screen.getByText(mockRepo.description!)).toBeInTheDocument();

        // Check if star count is rendered
        expect(screen.getByText('42')).toBeInTheDocument();
    });
});
