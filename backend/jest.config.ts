import type { Config } from "jest";

export const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  collectCoverageFrom: [
    "src/controllers/**/*.{ts,js}",
    "src/services/**/*.{ts,js}",
    "src/middlewares/**/*.{ts,js}",
  ],
  resetMocks: true,
};

export default config;
