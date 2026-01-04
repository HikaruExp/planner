import { useState, useMemo, useEffect } from 'react'
import Icons from './Icons'
import { useData } from '../hooks/useData'
import ActivityDetailModal from './ActivityDetailModal'
import WorkoutDetailModal from './WorkoutDetailModal'
import { useNotifications } from '../lib/notifications'

const TodayView = () => {
    const { activities, completedToday, toggleCompleted, workouts, settings, getStats } = useData()
    const { scheduleNotifications, isEnabled: notificationsEnabled } = useNotifications()

    const [selectedActivity, setSelectedActivity] = useState(null)
    const [showWorkoutModal, setShowWorkoutModal] = useState(false)

    const days = ['კვირა', 'ორშაბათი', 'სამშაბათი', 'ოთხშაბათი', 'ხუთშაბათი', 'პარასკევი', 'შაბათი']
    const months = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი']

    const now = new Date()
    const currentDayName = days[now.getDay()]
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    const stats = getStats()

    // Schedule notifications when activities change
    useEffect(() => {
        if (notificationsEnabled && activities.length > 0) {
            scheduleNotifications(activities)
        }
    }, [activities, notificationsEnabled, scheduleNotifications])

    // Find next activity
    const nextTask = useMemo(() => {
        const nowMinutes = currentHour * 60 + currentMinute
        return activities.find(a => {
            const [h, m] = a.time.split(':').map(Number)
            return (h * 60 + m) > nowMinutes
        }) || activities[0]
    }, [activities, currentHour, currentMinute])

    // Group activities by phase (includes all phases from all schedules)
    const phases = ['დილა', 'დღე', 'სამუშაო', 'საღამო', 'ღამე']

    const getIcon = (type) => {
        const IconComponent = Icons[type] || Icons.Zap
        return <IconComponent />
    }

    const todayWorkout = workouts[currentDayName]

    const handleActivityClick = (activity) => {
        setSelectedActivity(activity)
    }

    const handleToggleComplete = (activityId) => {
        toggleCompleted(activityId)
    }

    return (
        <div className="animate-fade-in space-y-8">
            {/* Holiday Mode Banner */}
            {settings.holidayMode && (
                <div className="holiday-gradient p-4 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                        <Icons.Palm size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">შვებულების რეჟიმი</h3>
                        <p className="text-white/70 text-sm">თრექინგი შეჩერებულია</p>
                    </div>
                </div>
            )}

            {/* Header with Date */}
            <header className="flex justify-between items-start">
                <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-1">
                        {now.getDate()} {months[now.getMonth()]}
                    </p>
                    <h1 className="text-3xl font-black tracking-tighter text-white">{currentDayName}</h1>
                </div>
                <div className="glass px-4 py-2 rounded-2xl flex flex-col items-center shadow-2xl">
                    <span className="text-xl font-black text-cyan-400">
                        {currentHour.toString().padStart(2, '0')}:{currentMinute.toString().padStart(2, '0')}
                    </span>
                </div>
            </header>

            {/* Streak Widget */}
            {stats.streak > 0 && (
                <div className="glass p-4 rounded-2xl flex items-center gap-4 border-orange-500/20">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white streak-flame">
                        <Icons.Flame size={24} />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-white">{stats.streak} დღე</p>
                        <p className="text-xs text-orange-400 font-bold">სტრიქი 🔥</p>
                    </div>
                </div>
            )}

            {/* Next Activity Widget - Tappable */}
            {nextTask && !settings.holidayMode && (
                <div
                    className="glass p-6 rounded-[2.5rem] relative overflow-hidden neo-shadow border-cyan-500/20 cursor-pointer active:scale-98 transition-all"
                    onClick={() => handleActivityClick(nextTask)}
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Icons.Clock size={40} />
                    </div>
                    <span className="phase-indicator bg-cyan-500/20 text-cyan-400 mb-4 inline-block">შემდეგი აქტივობა • დააჭირე დეტალებისთვის</span>
                    <h2 className="text-2xl font-black mb-1">{nextTask.task}</h2>
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                        <span className="font-bold text-cyan-500">{nextTask.time}</span>
                        <span>•</span>
                        <span className="truncate">{nextTask.detail}</span>
                    </div>
                </div>
            )}

            {/* Today's Progress */}
            <div className="glass p-5 rounded-3xl">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-zinc-400">დღის პროგრესი</span>
                    <span className="text-lg font-black text-cyan-400">{stats.todayProgress}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${stats.todayProgress}%` }}
                    />
                </div>
                <p className="text-xs text-zinc-500 mt-2">{stats.todayCompleted} / {stats.todayTotal} შესრულებული</p>
            </div>

            {/* Today's Workout Card - Tappable */}
            {todayWorkout && !settings.holidayMode && (
                <div
                    className="glass p-6 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-500/20 cursor-pointer active:scale-98 transition-all"
                    onClick={() => setShowWorkoutModal(true)}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/40">
                            {todayWorkout.isSwimming ? <Icons.Swim /> : <Icons.Dumbbell />}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-black">{todayWorkout.title}</h3>
                            <p className="text-[10px] font-bold text-cyan-500/60 uppercase tracking-widest">დააჭირე ვიდეო ტუტორიალისთვის</p>
                        </div>
                        <Icons.ChevronRight size={20} className="text-zinc-600" />
                    </div>
                    <div className="space-y-2">
                        {todayWorkout.ex.slice(0, 3).map((ex, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-black/40 rounded-xl border border-white/5">
                                <span className="text-xs font-black text-zinc-700">0{i + 1}</span>
                                <p className="text-sm font-medium text-zinc-300 truncate">{ex}</p>
                            </div>
                        ))}
                        {todayWorkout.ex.length > 3 && (
                            <p className="text-xs text-center text-cyan-400">+{todayWorkout.ex.length - 3} მეტი • დააჭირე ყველას სანახავად</p>
                        )}
                    </div>
                </div>
            )}

            {/* Schedule by Phase */}
            {!settings.holidayMode && phases.map(phase => {
                const items = activities.filter(a => a.phase === phase)
                if (items.length === 0) return null

                return (
                    <section key={phase}>
                        <div className="flex items-center gap-4 mb-4">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-600">{phase}</h3>
                            <div className="h-[1px] flex-1 bg-white/5" />
                        </div>
                        <div className="space-y-3">
                            {items.map(item => {
                                const isCompleted = completedToday[item.id]

                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => handleActivityClick(item)}
                                        className={`glass p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 cursor-pointer touch-target ${isCompleted
                                            ? 'opacity-40 scale-[0.98] border-transparent'
                                            : 'active:scale-95 hover:bg-white/[0.06]'
                                            }`}
                                    >
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${isCompleted ? 'bg-emerald-500 text-white' : 'bg-white/5 text-zinc-400'
                                            }`}>
                                            {isCompleted ? <Icons.Check /> : getIcon(item.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h4 className={`font-bold transition-all ${isCompleted ? 'line-through text-zinc-500' : 'text-white'}`}>
                                                    {item.task}
                                                </h4>
                                                <span className="text-[10px] font-black text-zinc-600 tracking-tighter ml-2">{item.time}</span>
                                            </div>
                                            <p className="text-[11px] text-zinc-500 leading-tight truncate">{item.detail}</p>
                                        </div>
                                        <Icons.ChevronRight size={16} className="text-zinc-700 flex-shrink-0" />
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                )
            })}

            {/* Activity Detail Modal */}
            <ActivityDetailModal
                activity={selectedActivity}
                isOpen={!!selectedActivity}
                onClose={() => setSelectedActivity(null)}
                onComplete={handleToggleComplete}
                isCompleted={selectedActivity ? completedToday[selectedActivity.id] : false}
            />

            {/* Workout Detail Modal */}
            <WorkoutDetailModal
                isOpen={showWorkoutModal}
                onClose={() => setShowWorkoutModal(false)}
                dayName={currentDayName}
            />
        </div>
    )
}

export default TodayView
