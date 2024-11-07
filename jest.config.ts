import type { Config } from "jest";

const config: Config = {
  automock: true,
  collectCoverage: true,
  collectCoverageFrom: ["scc/**/*.{js,jsx}", "scc/**/*.{ts,tsx}"],
  coverageProvider: "babel",
  maxConcurrency: 5,
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
};

export default config;
