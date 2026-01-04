import { useState } from 'react'
import { AuthProvider, useAuth } from './hooks/useAuth'
import LoginScreen from './components/LoginScreen'
import Navigation from './components/Navigation'
import TodayView from './components/TodayView'
import CalendarView from './components/CalendarView'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import SettingsPanel from './components/SettingsPanel'
import ActivityLibrary from './components/ActivityLibrary'

const AppContent = () => {
    const { isAuthenticated, loading } = useAuth()
    const [activeTab, setActiveTab] = useState('today')

    if (loading) {
        return (
            <div className="min-h-[100dvh] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return <LoginScreen />
    }

    return (
        <div className="max-w-md mx-auto min-h-[100dvh] pb-28 px-5 pt-[env(safe-area-inset-top)]">
            {/* Background Gradients */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="animate-pulse-slow absolute top-[-10%] left-[-20%] w-[100%] h-[50%] bg-cyan-900/20 blur-[120px] rounded-full" />
                <div className="animate-pulse-slow absolute bottom-[-10%] right-[-20%] w-[100%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full" />
            </div>

            {/* Main Content */}
            <main className="py-6">
                {activeTab === 'today' && <TodayView />}
                {activeTab === 'library' && <ActivityLibrary />}
                {activeTab === 'calendar' && <CalendarView />}
                {activeTab === 'analytics' && <AnalyticsDashboard />}
                {activeTab === 'settings' && <SettingsPanel />}
            </main>

            {/* Navigation */}
            <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    )
}

const App = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    )
}

export default App
