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
export interface ProvidersProps {
	children: React.ReactNode;
	themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const contentRef = useRef<HTMLDivElement>(null)

    const initializeVanta = async(theme: string) => {
        const settings = generateVantaGlobeSettings({ theme })
        window.vantaSession = await window.VANTA.GLOBE(settings)
    }

    useEffect(() => {
        const loadThree = async() => {
            await import('@/lib/three')
            await import('@/lib/vanta/vanta.globe.js')

            localStorage.setItem('currentName', 'Template')

            const theme = localStorage.getItem('theme') || 'dark'
            await initializeVanta(theme)

            setLoading(false)
        }
        
        loadThree()
    }, [])

    useEffect(() => {
        if (!loading && contentRef.current) {
            const observer = new MutationObserver(() => {
                if (contentRef.current && contentRef.current.childElementCount > 0) {
                    setLoading(false)
                }
            })

            observer.observe(contentRef.current, { childList: true, subtree: true })

            return () => {
                observer.disconnect()
            }
        }
    }, [loading])

    return (
        <NextUIProvider navigate={router.push}>
            <NextThemesProvider {...themeProps}>
                <div className="relative flex flex-col h-screen" id="rootLayout">
                    {loading && <Loading />}

                    <div ref={contentRef} className={loading ? 'hidden' : ''}>
                        {children}
                    </div>
                </div>
            </NextThemesProvider>
        </NextUIProvider>
    )
}