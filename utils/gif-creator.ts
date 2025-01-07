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
 * 🎥 GIF Creator Module
 * @module gif-creator
 * @description Creates high-quality GIF recordings of web applications with real-time capture
 * and smooth playback. Utilizes Puppeteer for screenshots and FFmpeg for GIF conversion.
 * 
 * @author t33n Software
 * @version 1.0.0
 * @license MIT
 */

import puppeteer, { Browser, Page } from 'puppeteer'
import { exec, ChildProcess, ExecException } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

// Get current script directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * 📁 Directory Configuration
 * Defines paths for temporary storage and final output
 */
const tmpDir: string = join(__dirname, 'tmp')
const outputPath: string = process.cwd() + '/public/screenshot.gif'

/**
 * ⚙️ Recording Configuration
 * Defines capture and output settings
 */
const TOTAL_FRAMES: number = 75              // Total number of frames to capture
const FRAME_DELAY: number = 100               // Delay between frames in ms (lower = faster capture)
const OUTPUT_SCALE: number = 720              // Output GIF width in pixels
const FRAMERATE: number = 10                  // Output GIF framerate

/**
 * 🧹 Ensures temporary directory exists and is empty
 * @function setupTmpDir
 * @description Creates a fresh temporary directory for storing screenshot frames
 */
const setupTmpDir = (): void => {
    if (fs.existsSync(tmpDir)) {
        fs.rmSync(tmpDir, { recursive: true, force: true })
    }
    fs.mkdirSync(tmpDir)
}

/**
 * 🔄 Cleanup function for resources
 * @function cleanup
 * @description Safely closes browser instance and removes temporary files
 * @param {Browser | null} [browser=null] - Puppeteer browser instance to close
 */
const cleanup = (browser: Browser | null = null): void => {
    if (browser) {
        browser.close()
    }
    if (fs.existsSync(tmpDir)) {
        fs.rmSync(tmpDir, { recursive: true, force: true })
    }
}

/**
 * 🚫 Kill process on port 3000
 * @async
 * @function killPort
 * @description Kills any process running on port 3000
 * @param {number} port - Port number to kill process on
 * @returns {Promise<void>}
 */
const killPort = async(port: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        const checkCommand: string = process.platform === 'win32'
            ? `netstat -ano | findstr :${port}`
            : `fuser ${port}/tcp 2>/dev/null`

        exec(checkCommand, (error: ExecException | null, stdout: string, stderr: string) => {
            if (error) {
                console.log(`No process running on port ${port}`)
                resolve()
                return
            }

            const pid: string | undefined = process.platform === 'win32'
                ? stdout.trim().split(/\s+/).pop()
                : stdout.trim().split(/\s+/)[0]

            if (!pid) {
                console.log(`No process running on port ${port}`)
                resolve()
                return
            }

            console.log(`Found process ${pid} on port ${port}`)
            const killCommand: string = process.platform === 'win32'
                ? `taskkill /F /PID ${pid}`
                : `kill -9 ${pid}`

            exec(killCommand, (error: ExecException | null) => {
                if (error) {
                    console.error(`Error killing process on port ${port}:`, error)
                    reject(error)
                    return
                }
                console.log(`Killed process on port ${port}`)
                resolve()
            })
        })
    })
}

/**
 * 🎬 Start Next.js
 * @async
 * @function startNextJs
 * @description Starts the Next.js development server
 * @returns {Promise<ChildProcess>} Next.js process instance
 */
const startNextJs = async(): Promise<ChildProcess> => {
    console.log('Starting Next.js server...')

    try {
        await killPort(3000)
        
        return new Promise((resolve, reject) => {
            const nextProcess: ChildProcess = exec('npm run dev', { cwd: process.cwd() })

            nextProcess.stdout?.on('data', (data: string) => {
                if (data.includes('Ready in')) {
                    resolve(nextProcess)
                }
            })

            nextProcess.stderr?.on('data', (err: string) => reject(new Error(err)))
        })
    } catch (error) {
        console.error('Error starting Next.js server:', error)
        throw error
    }
}

/**
 * 🎬 Main GIF capture function
 * @async
 * @function captureGif
 * @description Captures a series of screenshots and converts them into a smooth GIF
 * @throws {Error} If browser launch or page navigation fails
 * @returns {Promise<void>}
 */
const captureGif = async(): Promise<void> => {
    let browser: Browser | null = null
    
    try {
        // 🚀 Initialize browser and page
        setupTmpDir() // Ensure tmp directory exists before capturing screenshots
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
        
        const page: Page = await browser.newPage()

        // Navigate to URL
        await page.goto('http://localhost:3000')
        await page.setViewport({ width: 1280, height: 720 })

        // 📸 Screenshot capture loop with progress tracking
        const progressBarWidth = 30
        for (let i = 0; i < TOTAL_FRAMES; i++) {
            const percent = Math.floor((i / TOTAL_FRAMES) * 100)
            const filled = Math.floor((i / TOTAL_FRAMES) * progressBarWidth)
            const empty = progressBarWidth - filled
            const progressBar = '█'.repeat(filled) + '▒'.repeat(empty)
            process.stdout.write(`\r📸 Creating Screenshots: ${progressBar} ${percent}% (${i}/${TOTAL_FRAMES}) `)
            
            await page.screenshot({ path: join(tmpDir, `screenshot-${i}.png`) })
            await new Promise<void>(resolve => setTimeout(resolve, FRAME_DELAY)) // Real-time capture
        }
        console.log('\n✨ Screenshots captured! Converting to GIF...')

        await browser.close()
        browser = null

        // 🎨 Convert screenshots to optimized GIF
        exec(
            // eslint-disable-next-line max-len
            `ffmpeg -f image2 -framerate ${FRAMERATE} -i "${join(tmpDir, 'screenshot-%d.png')}" -vf "scale=${OUTPUT_SCALE}:-1,split[s0][s1];[s0]palettegen=max_colors=256[p];[s1][p]paletteuse=dither=floyd_steinberg" -y "${outputPath}"`,
            (err: ExecException | null) => {
                if (err) {
                    console.error('Error creating GIF:', err)
                    cleanup()
                    process.exit(1)
                } else {
                    console.log('GIF created:', outputPath)
                    cleanup()
                    process.exit(0)
                }
            }
        )
    } catch (error) {
        console.error('Error during GIF creation:', error)
        cleanup(browser)
        process.exit(1)
    }
}

/**
 * 🎯 Main execution function
 * @async
 * @function main
 * @description Entry point for the GIF creation process
 * @returns {Promise<void>}
 */
const main = async(): Promise<void> => {
    let nextProcess: ChildProcess | null = null
    try {
        nextProcess = await startNextJs()
        await captureGif()
        if (nextProcess) {
            nextProcess.kill()
        }
    } catch (error) {
        if (nextProcess) {
            nextProcess.kill()
        }
        throw error
    }
}

// 🚦 Start the GIF creation process
main().catch(error => {
    console.error('Error in main process:', error)
    process.exit(1)
})

// Handle cleanup on process exit
process.on('SIGINT', () => {
    console.log('\nGracefully shutting down...')
    cleanup()
    process.exit(0)
})
process.on('SIGTERM', () => {
    console.log('\nGracefully shutting down...')
    cleanup()
    process.exit(0)
})
