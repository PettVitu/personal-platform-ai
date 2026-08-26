import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  fullyParallel: false,
  reporter: [["list"]],
  use: { baseURL: "http://127.0.0.1:3100", trace: "on-first-retry", screenshot: "only-on-failure" },
  webServer: { command: "npm.cmd run dev -- -p 3100", url: "http://127.0.0.1:3100", reuseExistingServer: true, timeout: 120000 },
  projects: [
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    { name: "chromium", testIgnore: [/auth\.setup\.ts/, /tests[\\/]unit[\\/]/], use: { ...devices["Desktop Chrome"], storageState: "playwright/.auth/user.json" }, dependencies: ["setup"] },
  ],
});
