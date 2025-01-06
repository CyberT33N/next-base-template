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
 * @fileoverview 🔄 Loading Context Provider
 * @description Global loading state management for the application
 * @module LoadingContext
 * @requires react
 * 
 * @copyright t33n Software 2025
 * ══════════════════════════════════════════════════════════════════════════════
 */

'use client'

import React, { createContext, useContext } from 'react';

/**
 * 📋 Loading Context Type Definition
 * @interface LoadingContextType
 * @description Defines the shape of the loading context state and its setter
 * 
 * @property {boolean} loading - Current loading state
 * @property {function} setLoading - Function to update the loading state
 */
interface LoadingContextType {
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

/**
 * 🌍 Loading Context
 * @description React context for managing global loading state
 * @type {React.Context<LoadingContextType | undefined>}
 */
export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

/**
 * 🎣 useLoading Hook
 * @description Custom hook to access the loading context
 * 
 * @example
 * const { loading, setLoading } = useLoading();
 * // Use loading state
 * console.log(loading);
 * // Update loading state
 * setLoading(true);
 * 
 * @throws {Error} If used outside of LoadingProvider
 * @returns {LoadingContextType} Loading context value and setter
 */
export function useLoading() {
    const context = useContext(LoadingContext);
    if (context === undefined) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
}

/**
 * 🔄 Loading Provider Component
 * 
 * @component
 * @description Provider component that manages the global loading state
 * 
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components that will have access to loading context
 * 
 * @example
 * <LoadingProvider>
 *   <App />
 * </LoadingProvider>
 * 
 * @returns {JSX.Element} Provider component with loading state management
 */
export function LoadingProvider({ children }: { children: React.ReactNode }) {
    // 🔄 Initialize loading state
    const [loading, setLoading] = React.useState(false);

    // 📦 Create context value object
    const value = React.useMemo(
        () => ({
            loading,
            setLoading,
        }),
        [loading]
    );

    return (
        // 🌍 Provide loading context to children
        <LoadingContext.Provider value={value}>
            {children}
        </LoadingContext.Provider>
    );
}
