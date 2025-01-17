/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  setupFiles: ['<rootDir>/jest.setup.js'],
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};
