import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { resetDprForTesting } from '../core/dpr';
import { resetStaticInfoForTesting } from '../core/static';
import { resetStoreForTesting } from '../core/store';

// Clean up after each test: unmount React trees, restore stubbed globals, and clear the module-level session caches so stubbed navigators take effect per test.
afterEach(() => {
  cleanup();
  resetStoreForTesting();
  resetDprForTesting();
  resetStaticInfoForTesting();
  vi.unstubAllGlobals();
});
