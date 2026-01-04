import Icons from './Icons'

const Navigation = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'today', label: 'დღეს', icon: Icons.Zap, color: 'bg-white/10' },
        { id: 'library', label: 'აქტივობები', icon: Icons.List, color: 'bg-cyan-500' },
        { id: 'calendar', label: 'კალენდარი', icon: Icons.Calendar, color: 'bg-purple-500' },
        { id: 'analytics', label: 'სტატისტიკა', icon: Icons.Chart, color: 'bg-emerald-500' },
        { id: 'settings', label: 'პარამეტრები', icon: Icons.Settings, color: 'bg-zinc-500' }
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[100] pb-[env(safe-area-inset-bottom)]">
            <div className="max-w-md mx-auto px-4 pb-4">
                <div className="glass p-2 rounded-[2rem] flex justify-between shadow-2xl shadow-black/60 ring-1 ring-white/10 bg-black/60">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.id

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex flex-col items-center justify-center py-3 rounded-[1.5rem] transition-all duration-500 touch-target ${isActive ? `${tab.color} text-white shadow-xl scale-105` : 'text-zinc-600'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className={`text-[8px] font-black uppercase mt-1 tracking-widest transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'
                                    }`}>
                                    {tab.label}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}

export default Navigation
