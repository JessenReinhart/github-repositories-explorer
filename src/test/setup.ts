import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

// Mock API responses
const handlers = [
    http.get('https://api.github.com/search/users', () => {
        return HttpResponse.json({
            items: [
                {
                    login: 'testuser',
                    id: 1,
                    html_url: 'https://github.com/testuser',
                },
            ],
        });
    }),

    http.get('https://api.github.com/users/:username/repos', () => {
        return HttpResponse.json([
            {
                id: 1,
                name: 'test-repo',
                description: 'Test repository',
                html_url: 'https://github.com/testuser/test-repo',
                stargazers_count: 10,
                owner: {
                    login: 'testuser',
                },
            },
        ]);
    }),
];

export const server = setupServer(...handlers);

beforeAll(() => {
    server.listen({ onUnhandledRequest: 'bypass' });
});

afterAll(() => {
    server.close();
});

afterEach(() => {
    server.resetHandlers();
});
