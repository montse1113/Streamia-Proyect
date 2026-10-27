import dotenv from "dotenv";
import { defineConfig } from "vitest/config";

// tests use their own database (streamia_test), see .env.test
dotenv.config({ path: ".env.test", quiet: true });

export default defineConfig({
    test: {
        environment: "node",
        globals: true,
        // all files share the same test database
        fileParallelism: false,
        coverage: {
            clean: false,
            reporter: ["text", "html", "json"],
            reportsDirectory: "./coverage",
            reportOnFailure: true,
        },
    },
});
