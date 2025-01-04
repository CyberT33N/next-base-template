import { defineConfig } from 'vitest/config'
import vitestConfig from './vitest.config'
import { config as loadEnv } from 'dotenv'

loadEnv({ path: '.env.test.production', override: true })

const config = {
    ...vitestConfig,
    test: vitestConfig.test || {}
}

config.test.include = [
    'test/unit/**/*.test.ts'
]

config.test.watch = false

export default defineConfig(config)
