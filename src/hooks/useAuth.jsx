import { useState, useEffect, createContext, useContext } from 'react'
import { supabase, DEMO_USER } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

// Check if Supabase is properly configured
const supabaseConfigured = !!supabase

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isDemoMode, setIsDemoMode] = useState(!supabaseConfigured)

    useEffect(() => {
        // Check for existing session
        const checkSession = async () => {
            // First check if we have demo auth saved
            const demoAuth = localStorage.getItem('planner_demo_auth')
            if (demoAuth === 'true') {
                setUser(DEMO_USER)
                setIsDemoMode(true)
                setLoading(false)
                return
            }

            // If Supabase is not configured, just finish loading
            if (!supabaseConfigured) {
                setLoading(false)
                return
            }

            // Try to get Supabase session
            try {
                const { data: { session } } = await supabase.auth.getSession()
                setUser(session?.user ?? null)
            } catch (err) {
                console.warn('Supabase auth check failed:', err)
                // Allow demo mode fallback
            } finally {
                setLoading(false)
            }
        }

        checkSession()

        // Listen for auth changes (Supabase mode only)
        if (supabaseConfigured) {
            try {
                const { data: { subscription } } = supabase.auth.onAuthStateChange(
                    (_event, session) => {
                        setUser(session?.user ?? null)
                    }
                )
                return () => subscription?.unsubscribe()
            } catch (err) {
                console.warn('Failed to set up auth listener:', err)
            }
        }
    }, [])

    const signIn = async (email, password) => {
        setError(null)

        // Demo password check - works with or without Supabase
        if (password === 'planner2024') {
            localStorage.setItem('planner_demo_auth', 'true')
            setUser(DEMO_USER)
            setIsDemoMode(true)
            return { success: true }
        }

        // If Supabase is configured, try to authenticate
        if (supabaseConfigured) {
            try {
                const { data, error: authError } = await supabase.auth.signInWithPassword({
                    email,
                    password
                })

                if (authError) {
                    // If Supabase fails, show appropriate error
                    if (authError.message.includes('fetch') || authError.message.includes('network')) {
                        setError('კავშირის შეცდომა. სცადეთ დემო პაროლით: planner2024')
                    } else {
                        setError(authError.message)
                    }
                    return { success: false, error: authError.message }
                }

                setIsDemoMode(false)
                return { success: true, data }
            } catch (err) {
                // Network error - suggest demo mode
                setError('კავშირის შეცდომა. სცადეთ დემო პაროლით: planner2024')
                return { success: false, error: err.message }
            }
        }

        // No valid auth
        setError('არასწორი პაროლი. სცადეთ: planner2024')
        return { success: false, error: 'არასწორი პაროლი' }
    }

    const signOut = async () => {
        localStorage.removeItem('planner_demo_auth')

        if (supabaseConfigured && !isDemoMode) {
            try {
                await supabase.auth.signOut()
            } catch (err) {
                console.warn('Sign out error:', err)
            }
        }

        setUser(null)
        setIsDemoMode(true)
    }

    const value = {
        user,
        loading,
        error,
        signIn,
        signOut,
        isAuthenticated: !!user,
        isDemoMode
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
