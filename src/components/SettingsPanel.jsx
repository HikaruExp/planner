import { useState } from 'react'
import Icons from './Icons'
import { useData } from '../hooks/useData'
import { useAuth } from '../hooks/useAuth'
import { useNotifications } from '../lib/notifications'

const SettingsPanel = () => {
    const { settings, updateSettings, addActivity, deleteActivity, allActivities } = useData()
    const { signOut } = useAuth()
    const { isEnabled: notificationsEnabled, enableNotifications, disableNotifications, reminderMinutes, updateReminderMinutes } = useNotifications()

    const [showAddActivity, setShowAddActivity] = useState(false)
    const [newActivity, setNewActivity] = useState({
        task: '',
        time: '12:00',
        phase: 'სამუშაო',
        detail: '',
        type: 'Zap'
    })

    const phases = ['დილა', 'სამუშაო', 'საღამო', 'ღამე']
    const reminderOptions = [5, 10, 15, 30]

    const handleToggleSwimming = () => {
        updateSettings({ swimmingEnabled: !settings.swimmingEnabled })
    }

    const handleToggleHoliday = () => {
        updateSettings({ holidayMode: !settings.holidayMode })
    }

    const handleToggleNotifications = async () => {
        if (notificationsEnabled) {
            disableNotifications()
        } else {
            const granted = await enableNotifications()
            if (!granted) {
                alert('შეტყობინებების ნებართვა უარყოფილია. გთხოვთ ჩართოთ Settings-ში.')
            }
        }
    }

    const handleAddActivity = () => {
        if (!newActivity.task.trim()) return

        addActivity(newActivity)
        setNewActivity({
            task: '',
            time: '12:00',
            phase: 'სამუშაო',
            detail: '',
            type: 'Zap'
        })
        setShowAddActivity(false)
    }

    const handleDeleteActivity = (id) => {
        if (confirm('წაშალოთ ეს აქტივობა?')) {
            deleteActivity(id)
        }
    }

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header */}
            <h1 className="text-2xl font-black text-white">პარამეტრები</h1>

            {/* Notifications Section */}
            <div className="glass p-5 rounded-3xl space-y-4">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">შეტყობინებები</h3>

                {/* Notifications Toggle */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${notificationsEnabled
                            ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                            : 'bg-zinc-800 text-zinc-500'
                            }`}>
                            {notificationsEnabled ? <Icons.Bell /> : <Icons.BellOff />}
                        </div>
                        <div>
                            <h4 className="font-bold text-white">რემაინდერები</h4>
                            <p className="text-xs text-zinc-500">შეხსენება აქტივობამდე</p>
                        </div>
                    </div>
                    <button
                        onClick={handleToggleNotifications}
                        className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${notificationsEnabled ? 'bg-purple-500' : 'bg-zinc-700'
                            }`}
                    >
                        <div className={`w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300 ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
                            }`} />
                    </button>
                </div>

                {/* Reminder Time Selector */}
                {notificationsEnabled && (
                    <div className="p-4 bg-white/5 rounded-2xl space-y-3">
                        <p className="text-sm text-zinc-400">რამდენი წუთით ადრე?</p>
                        <div className="flex gap-2">
                            {reminderOptions.map(minutes => (
                                <button
                                    key={minutes}
                                    onClick={() => updateReminderMinutes(minutes)}
                                    className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${reminderMinutes === minutes
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-white/5 text-zinc-400'
                                        }`}
                                >
                                    {minutes} წთ
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Mode Toggles Section */}
            <div className="glass p-5 rounded-3xl space-y-4">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">რეჟიმები</h3>

                {/* Swimming Toggle */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${settings.swimmingEnabled
                            ? 'swimming-gradient text-white'
                            : 'bg-zinc-800 text-zinc-500'
                            }`}>
                            <Icons.Swim />
                        </div>
                        <div>
                            <h4 className="font-bold text-white">ცურვის რეჟიმი</h4>
                            <p className="text-xs text-zinc-500">ცურვის აქტივობები და ვარჯიშები</p>
                        </div>
                    </div>
                    <button
                        onClick={handleToggleSwimming}
                        className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${settings.swimmingEnabled ? 'bg-cyan-500' : 'bg-zinc-700'
                            }`}
                    >
                        <div className={`w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300 ${settings.swimmingEnabled ? 'translate-x-6' : 'translate-x-0'
                            }`} />
                    </button>
                </div>

                {/* Holiday Toggle */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${settings.holidayMode
                            ? 'holiday-gradient text-white'
                            : 'bg-zinc-800 text-zinc-500'
                            }`}>
                            <Icons.Palm />
                        </div>
                        <div>
                            <h4 className="font-bold text-white">შვებულების რეჟიმი</h4>
                            <p className="text-xs text-zinc-500">თრექინგის პაუზა</p>
                        </div>
                    </div>
                    <button
                        onClick={handleToggleHoliday}
                        className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${settings.holidayMode ? 'bg-orange-500' : 'bg-zinc-700'
                            }`}
                    >
                        <div className={`w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300 ${settings.holidayMode ? 'translate-x-6' : 'translate-x-0'
                            }`} />
                    </button>
                </div>
            </div>

            {/* Custom Activities */}
            <div className="glass p-5 rounded-3xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">ჩემი აქტივობები</h3>
                    <button
                        onClick={() => setShowAddActivity(true)}
                        className="touch-target w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center active:scale-95"
                    >
                        <Icons.Plus />
                    </button>
                </div>

                {/* Activity List */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {allActivities.filter(a => a.id.startsWith('custom_')).map(activity => (
                        <div
                            key={activity.id}
                            className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-zinc-600">{activity.time}</span>
                                <span className="text-sm text-white">{activity.task}</span>
                            </div>
                            <button
                                onClick={() => handleDeleteActivity(activity.id)}
                                className="touch-target w-8 h-8 rounded-lg text-red-400 flex items-center justify-center active:scale-95"
                            >
                                <Icons.Trash size={16} />
                            </button>
                        </div>
                    ))}

                    {allActivities.filter(a => a.id.startsWith('custom_')).length === 0 && (
                        <p className="text-center text-zinc-600 text-sm py-4">
                            არ გაქვს დამატებული აქტივობა
                        </p>
                    )}
                </div>
            </div>

            {/* Add Activity Modal */}
            {showAddActivity && (
                <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/80">
                    <div className="glass w-full max-w-md p-6 rounded-t-3xl animate-slide-up">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white">ახალი აქტივობა</h3>
                            <button
                                onClick={() => setShowAddActivity(false)}
                                className="touch-target w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"
                            >
                                <Icons.X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Task Name */}
                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">სახელი</label>
                                <input
                                    type="text"
                                    value={newActivity.task}
                                    onChange={(e) => setNewActivity({ ...newActivity, task: e.target.value })}
                                    placeholder="აქტივობის სახელი"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50"
                                />
                            </div>

                            {/* Time */}
                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">დრო</label>
                                <input
                                    type="time"
                                    value={newActivity.time}
                                    onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50"
                                />
                            </div>

                            {/* Phase */}
                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">ფაზა</label>
                                <div className="flex gap-2">
                                    {phases.map(phase => (
                                        <button
                                            key={phase}
                                            onClick={() => setNewActivity({ ...newActivity, phase })}
                                            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${newActivity.phase === phase
                                                ? 'bg-cyan-500 text-white'
                                                : 'bg-white/5 text-zinc-400'
                                                }`}
                                        >
                                            {phase}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Detail */}
                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">აღწერა</label>
                                <input
                                    type="text"
                                    value={newActivity.detail}
                                    onChange={(e) => setNewActivity({ ...newActivity, detail: e.target.value })}
                                    placeholder="დეტალები (არასავალდებულო)"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                onClick={handleAddActivity}
                                disabled={!newActivity.task.trim()}
                                className="w-full touch-target bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 rounded-xl active:scale-95 transition-all disabled:opacity-50"
                            >
                                დამატება
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout */}
            <button
                onClick={signOut}
                className="w-full glass p-4 rounded-2xl flex items-center justify-center gap-3 text-red-400 active:scale-95 transition-all"
            >
                <Icons.Logout />
                <span className="font-bold">გასვლა</span>
            </button>

            {/* Version */}
            <p className="text-center text-zinc-700 text-xs">
                პლანერი v2.0.0 • შეტყობინებები + ვიდეოები
            </p>
        </div>
    )
}

export default SettingsPanel
