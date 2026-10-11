module.exports = {
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  collectCoverage: true,
  coverageDirectory: 'build/sonar',
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
};
