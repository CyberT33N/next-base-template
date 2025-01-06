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
 * @fileoverview 🎭 Application Providers Component
 * @description Root provider component that wraps the application with necessary context providers
 * @module Providers
 * @requires next-themes
 * @requires @nextui-org/system
 * @requires react
 * 
 * @copyright t33n Software 2025
 * ═══════════════════════════════════════════
 */

'use client'

// ==== CONFIG ====
import { generateVantaGlobeSettings } from '@/config/vanta'

// ==== NEXT UI ====
import { NextUIProvider } from '@nextui-org/system'
import { useRouter } from 'next/navigation'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'

// ==== REACT ====
import { useEffect, useState, useRef } from 'react'
import * as React from 'react'

// ==== COMPONENTS ====
import Loading from '@/components/Loader'
import { LoadingContext } from './loadingContext'

/**
 * 📋 Provider Component Props
 * @interface ProvidersProps
 * @description Props for the Providers component
 * 
 * @property {React.ReactNode} children - Child components to be wrapped by providers
 * @property {ThemeProviderProps} [themeProps] - Configuration for NextThemesProvider
 */
export interface ProvidersProps {
    children: React.ReactNode;
    themeProps?: ThemeProviderProps;
}

/**
 * 🎭 Providers Component
 * 
 * @component
 * @description Root provider component that manages application-wide state and context
 * Handles theme initialization, Vanta.js background, and loading states
 * 
 * @param {ProvidersProps} props - Component properties
 * @param {React.ReactNode} props.children - Child components to wrap with providers
 * @param {ThemeProviderProps} [props.themeProps] - Theme provider configuration
 * 
 * @example
 * <Providers themeProps={{ defaultTheme: 'dark' }}>
 *   <App />
 * </Providers>
 * 
 * @returns {JSX.Element} Provider-wrapped application
 */
export function Providers({ children, themeProps }: ProvidersProps) {
    // 🧭 Routing
    const router = useRouter()
    
    // 🔄 State management
    const [loading, setLoading] = useState(true)
    const contentRef = useRef<HTMLDivElement>(null)

    /**
     * 🌐 Initialize Vanta.js Globe
     * @async
     * @param {string} theme - Current theme ('light' or 'dark')
     * @returns {Promise<void>}
     */
    const initializeVanta = async(theme: string) => {
        const settings = generateVantaGlobeSettings({ theme })
        window.vantaSession = await window.VANTA.GLOBE(settings)
    }

    /**
     * 🎨 Theme and Background Initialization Effect
     * @description Loads Three.js and Vanta.js dependencies, initializes background
     */
    useEffect(() => {
        const loadThree = async() => {
            // 📚 Load required libraries
            await import('@/lib/three')
            await import('@/lib/vanta/vanta.globe.js')

            // 💾 Initialize local storage
            localStorage.setItem('currentName', 'Template')

            // 🎨 Setup theme and background
            const theme = localStorage.getItem('theme') || 'dark'
            await initializeVanta(theme)

            // ✅ Complete loading
            setLoading(false)
            document.body.classList.add('app-loaded')
        }
        
        loadThree()
    }, [])

    /**
     * 👀 Content Loading Observer Effect
     * @description Monitors content loading state using MutationObserver
     */
    useEffect(() => {
        if (!loading && contentRef.current) {
            // 🔍 Create observer for content changes
            const observer = new MutationObserver(() => {
                if (contentRef.current && contentRef.current.childElementCount > 0) {
                    setLoading(false)
                }
            })

            // 🎯 Start observing content
            observer.observe(contentRef.current, { childList: true, subtree: true })

            return () => {
                observer.disconnect()
            }
        }
    }, [loading])

    return (
        // 🎨 UI Provider
        <NextUIProvider navigate={router.push}>
            {/* 🌓 Theme Provider */}
            <NextThemesProvider {...themeProps}>
                {/* 🔄 Loading Context */}
                <LoadingContext.Provider value={{ loading, setLoading }}>
                    {/* 📱 Root Layout */}
                    <div className="relative flex flex-col h-screen" id="rootLayout">
                        {/* ⌛ Loading Indicator */}
                        {loading && <Loading />}
                        {/* 📄 Content Container */}
                        <div ref={contentRef} className={loading ? 'hidden' : ''}>
                            {children}
                        </div>
                    </div>
                </LoadingContext.Provider>
            </NextThemesProvider>
        </NextUIProvider>
    )
}