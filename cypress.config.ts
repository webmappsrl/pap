import {defineConfig} from 'cypress';

export default defineConfig({
  e2e: {
    defaultCommandTimeout: 20000,
    testIsolation: false,
  },
});
