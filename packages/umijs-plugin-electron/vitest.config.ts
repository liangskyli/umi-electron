import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    include: ['./**/*.test.{ts,js}'],
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    testTimeout: 1000 * 60,
  },
});
