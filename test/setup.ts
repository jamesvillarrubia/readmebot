import { vi } from 'vitest';

// Mock environment variables
process.env.OPENAI_API_KEY = 'test-api-key';

// Mock console methods
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
}; 