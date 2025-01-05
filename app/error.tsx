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
 * @fileoverview 🚨 Global Error Boundary Component
 * @description Handles runtime errors in the application, providing a fallback UI and recovery options
 * @module ErrorBoundary
 * @requires react
 * 
 * @copyright t33n Software 2025
 * ═══════════════════════════════════════════
 */

'use client'

import { useEffect } from 'react'

/**
 * @typedef {Object} ErrorProps
 * @property {Error} error - The error object that was thrown
 * @property {() => void} reset - Function to reset the error boundary and retry rendering
 */

/**
 * Global Error Boundary Component
 * 
 * @component
 * @description Provides a fallback UI when an error occurs in the application.
 * Implements error logging and recovery mechanisms.
 * 
 * @param {ErrorProps} props - Component properties
 * @param {Error} props.error - The error that was caught
 * @param {() => void} props.reset - Function to attempt recovery
 * 
 * @example
 * // The component is automatically used by Next.js when an error occurs:
 * throw new Error('Something went wrong');
 * // This will trigger the Error component to render
 * 
 * @returns {JSX.Element} Error UI with recovery option
 */
export default function Error({
    error,
    reset
}: {
  error: Error
  reset: () => void
}) {
    // Log error to monitoring service
    useEffect(() => {
        // TODO: Implement proper error reporting service
        // Current implementation only logs to console
        console.error(error)
    }, [error])
 
    return (
        // Error Recovery UI
        <div>
            <h2>Something went wrong!</h2>
            <button
                onClick={
                    // Attempt recovery by re-rendering
                    () => reset()
                }
            >
                Try again
            </button>
        </div>
    )
}