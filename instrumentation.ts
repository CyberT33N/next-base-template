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

/**
 * @fileoverview Next.js Instrumentation Module
 * Handles runtime-specific initialization and bootstrapping
 * 
 * @author t33n Software
 * @copyright 2025 t33n Software
 * @license MIT
 */

/**
 * Registers and initializes application components based on runtime environment
 * This function is automatically called by Next.js during the instrumentation phase
 * 
 * @async
 * @function register
 * @returns {Promise<void>} Resolves when initialization is complete
 * 
 * @description
 * - Checks the Next.js runtime environment
 * - Bootstraps application components when running in Node.js environment
 * - Provides runtime-specific initialization logic
 * 
 * @example
 * ```typescript
 * // This is automatically called by Next.js
 * await register();
 * ```
 */
export async function register() {
    // 🔍 Log current runtime environment
    console.log('[INSTRUMENATION] - process.env.NEXT_RUNTIME: ', process.env.NEXT_RUNTIME)

    // ⚡ Only bootstrap in Node.js environment
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        // 🔄 Dynamically import and execute bootstrap
        const { bootstrap } = await import('@/src/bootstrap')
        await bootstrap()
    }
}