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

// ==== COMPONENTS ====
import { title, subtitle } from '@/components/primitives'

// ==== REACT ====
import { useEffect, useState } from 'react'

export default function Home() {
    const [currentName, setcurrentName] = useState<string | null>(null)
 
    useEffect(() => {
        const currentName = localStorage.getItem('currentName')
        setcurrentName(currentName)
    }, [])

    return (
        <>
            <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10">
                <div className="inline-block max-w-lg text-center justify-center">
			    <h1 className={title()}>Next.js </h1>
                    <h1 className={title({ color: 'violet' })}>{currentName} </h1>
                    <h1 className={title()}>Base</h1>
                    <h2 className={subtitle({ class: 'mt-4' })}>
					Any example description..
                    </h2>
                </div>
            </section>
        </>
    )
}
