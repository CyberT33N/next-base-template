export const siteConfig = {
    name: 'next-base-template',
    description: 'Example..',
    general: {
        wallet: {
            label: 'Wallet',
            href: '/wallet'
        }
    },
    navItems: [
        {
            label: 'Home',
            href: '/'
        },
        {
            label: 'Scan',
            href: '/scan'
        },
        {
            label: 'Automate',
            href: '/automate'
        },
        {
            label: 'Discover',
            href: '/discover'
        }
    ],
    navMenuItems: [
        {
            label: 'Profile',
            href: '/profile'
        },
        {
            label: 'Dashboard',
            href: '/dashboard'
        },
        {
            label: 'Projects',
            href: '/projects'
        },
        {
            label: 'Team',
            href: '/team'
        },
        {
            label: 'Calendar',
            href: '/calendar'
        },
        {
            label: 'Settings',
            href: '/settings'
        },
        {
            label: 'Help & Feedback',
            href: '/help-feedback'
        },
        {
            label: 'Logout',
            href: '/logout'
        }
    ]
}

export type SiteConfig = typeof siteConfig;