/*
███████████████████████████████████████████████████████████████████████████████
██******************** PRESENTED BY t33n Software ***************************██
██                                                                           ██
██                  ████████╗██████╗ ██████╗ ███╗   ██╗                      ██
██                  ╚══██╔══╝╚════██╗╚════██╗████╗  ██║                      ██
██                     ██║    █████╔╝ █████╔╝██╔██╗ ██║                      ██
██                     ██║    ╚═══██╗ ╚═══██╗██║╚██╗██║                      ██
██                     ██║   ██████╔╝██████╔╝██║ ╚████║                      ██
██                     ╚═╝   ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝                      ██
██                                                                           ██
███████████████████████████████████████████████████████████████████████████████
███████████████████████████████████████████████████████████████████████████████
*/

import dotenv from 'dotenv'
// Load .env 
dotenv.config()
// Load .env.test and override .env
dotenv.config({ path: '.env.test', override: true })

// ==== VITEST ====
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    // esbuild: { target: 'ES2022' },
    plugins: [tsconfigPaths(), react()],
    test: {
        environment: 'node',
        setupFiles: 'test/setup-tests-beforeEach.ts',
        globalSetup: 'test/setup-tests.ts',
        // typecheck: {
        //     include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)']
        // },
        coverage: {
            // Include only specific directories for coverage
            include: ['app/api/', 'src/', 'utils/', 'test/utils/'],
            // Optional: Exclude certain files or directories
            //exclude: ['src/legacy/', 'utils/helpers.ts'],
            // Optional: Specify coverage reporters (e.g., text, json, html)
            reporter: ['text', 'json', 'html']
        }
    }
})