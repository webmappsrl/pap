import {defineConfig} from 'cypress';

export default defineConfig({
  e2e: {
    defaultCommandTimeout: 5000,
    testIsolation: false,
  },
});
