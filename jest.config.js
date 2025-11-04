module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleFileExtensions: ["js", "jsx", "json", "node"],
  testPathIgnorePatterns: ["/node_modules/", "/build/"],

  // Configuração de cobertura
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/**/*.test.{js,jsx}",
    "!src/**/*.spec.{js,jsx}",
    "!src/**/__tests__/**",
    "!src/**/__mocks__/**",
    "!src/index.js",
    "!src/setupTests.js",
    "!src/**/*.stories.{js,jsx}",
    "!src/**/*.config.{js,jsx}",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/build/",
    "/coverage/",
    "\\.test\\.(js|jsx)$",
    "\\.spec\\.(js|jsx)$",
    "\\.css$",
    "\\.scss$",
    "setupTests\\.js$",
    "index\\.js$",
  ],
  coverageReporters: ["json", "lcov", "text", "clover"],
  coverageDirectory: "coverage",
};
