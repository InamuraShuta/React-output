module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  transform: {
    // 変換のルールをここで直接指定します
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',        // これが JSX エラーを直します
        esModuleInterop: true,   // これが WARN 警告を直します
        types: ["jest", "node", "@testing-library/jest-dom"]
      }
    }],
  },
};