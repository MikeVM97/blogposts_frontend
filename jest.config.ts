import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  /* testEnvironment provided by jest-environment-jsdom, prevents the Error: */
  /* Test environment jest-environment-jsdom cannot be found. Make sure the testEnvironment configuration option points to an existing node module. */
  testEnvironment: 'jsdom',
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        diagnostics: {
          ignoreCodes: [1343]
        },
        astTransformers: {
          before: [
            {
              path: 'ts-jest-mock-import-meta',
            },
          ],
        },
      },
    ],
  },
  verbose: true,
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom", "./jest.setup.ts"],
  // con esta opción en true, podemos usar el método beforeEach().
  detectOpenHandles: true,
};

export default config;