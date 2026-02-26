import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 2,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:8080",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    viewport: { width: 390, height: 844 },
  },
  projects: [
    { name: "iPhone SE", use: { viewport: { width: 320, height: 568 } } },
    { name: "iPhone 14", use: { viewport: { width: 390, height: 844 } } },
    { name: "iPhone 15 Pro Max", use: { viewport: { width: 430, height: 932 } } },
    { name: "iPad", use: { viewport: { width: 768, height: 1024 } } },
    { name: "Desktop", use: { viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:8080",
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
