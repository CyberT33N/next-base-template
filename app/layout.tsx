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
 * @fileoverview 🏗️ Root Layout Component
 * @description Main layout component that wraps all pages in the application
 * @module RootLayout
 * @requires next
 * @requires @nextui-org/link
 * @requires @/styles/globals.css
 * @requires @/config/site
 * @requires @/config/fonts
 * 
 * @copyright t33n Software © 2025
 * ═══════════════════════════════════════════
 */

import '@/styles/globals.css'
import { Metadata, Viewport } from 'next'
import { siteConfig } from '@/config/site'
import { fontSans } from '@/config/fonts'
import { Providers } from './providers'
import { Navbar } from '@/components/navbar'
import { Link } from '@nextui-org/link'
import clsx from 'clsx'

/**
 * 📝 Metadata Configuration
 * @type {Metadata}
 * @description Defines the metadata for the application including title, description, and icons
 */
export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`
    },
    description: siteConfig.description,
    icons: {
        icon: '/favicon.ico'
    }
}

/**
 * 🎨 Viewport Configuration
 * @type {Viewport}
 * @description Defines the viewport settings including theme color for light/dark modes
 */
export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: 'black' }
    ]
}

/**
 * 🌟 Root Layout Component
 * 
 * @component
 * @description The main layout component that wraps all pages in the application.
 * Provides theme support, navigation, and consistent styling across the app.
 * 
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components to be rendered within the layout
 * 
 * @example
 * // This component is automatically used by Next.js to wrap all pages
 * <RootLayout>
 *   <HomePage />
 * </RootLayout>
 * 
 * @returns {JSX.Element} The complete layout structure with navigation and content area
 */
export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        // 🌐 HTML root with language and hydration settings
        <html lang="en" suppressHydrationWarning>
            <head>
            </head>
            {/* 📱 Body with base styling and font configuration */}
            <body
                className={clsx(
                    'min-h-screen bg-background font-sans antialiased',
                    fontSans.variable
                )}
            >
                {/* 🎨 Theme provider wrapper */}
                <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
                    {/* 📐 Main layout structure */}
                    <div className="relative flex flex-col h-screen">
                        {/* 🧭 Navigation component */}
                        <Navbar />

                        {/* 📄 Main content area */}
                        <main className="container mx-auto max-w-7xl pt-2 px-6 flex-grow">
                            {children}
                        </main>

                        <footer className="w-full flex items-center justify-center py-3">
                            <Link
                                isExternal
                                className="flex items-center gap-1 text-current"
                                href="https://github.com/CyberT33N"
                                title="CyberT33N homepage"
                            >
                                <span className="text-default-600">Powered by</span>
                                <p className="text-primary">CyberT33N</p>
                            </Link>
                        </footer>
                    </div>
                </Providers>
            </body>
        </html>
    )
}
