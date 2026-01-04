import { useState } from 'react'
import Icons from './Icons'
import { useData } from '../hooks/useData'
import { ACTIVITY_DETAILS } from '../data/exercises'
import ActivityDetailModal from './ActivityDetailModal'

const ActivityLibrary = () => {
    const { activities, completedToday, toggleComplete } = useData()
    const [selectedActivity, setSelectedActivity] = useState(null)
    const [filter, setFilter] = useState('all')

    // Get icon for activity type
    const getIcon = (type) => {
        const IconComponent = Icons[type]
        return IconComponent ? <IconComponent size={20} /> : <Icons.Zap size={20} />
    }

    // Group activities by phase
    const phases = ['დილა', 'დღე', 'სამუშაო', 'საღამო', 'ღამე']

    // Filter activities
    const filteredActivities = filter === 'all'
        ? activities
        : activities.filter(a => a.phase === filter)

    // Get activities with details
    const activitiesWithDetails = filteredActivities.map(activity => ({
        ...activity,
        hasDetails: !!ACTIVITY_DETAILS[activity.id]
    }))

    const handleActivityClick = (activity) => {
        setSelectedActivity(activity)
    }

    const handleToggleComplete = (id) => {
        toggleComplete(id)
    }

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header */}
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-white">აქტივობები</h1>
                    <p className="text-zinc-500 text-sm">{activities.length} აქტივობა დღეს</p>
                </div>
                <div className="glass px-4 py-2 rounded-2xl">
                    <span className="text-lg font-bold text-cyan-400">
                        {Object.keys(completedToday).filter(k => completedToday[k]).length}/{activities.length}
                    </span>
                </div>
            </header>

            {/* Phase Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
                <button
                    onClick={() => setFilter('all')}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === 'all'
                            ? 'bg-cyan-500 text-white'
                            : 'bg-white/5 text-zinc-400'
                        }`}
                >
                    ყველა
                </button>
                {phases.map(phase => {
                    const count = activities.filter(a => a.phase === phase).length
                    if (count === 0) return null
                    return (
                        <button
                            key={phase}
                            onClick={() => setFilter(phase)}
                            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === phase
                                    ? 'bg-cyan-500 text-white'
                                    : 'bg-white/5 text-zinc-400'
                                }`}
                        >
                            {phase} ({count})
                        </button>
                    )
                })}
            </div>

            {/* Activities List */}
            <div className="space-y-3">
                {activitiesWithDetails.map(activity => {
                    const isCompleted = completedToday[activity.id]

                    return (
                        <div
                            key={activity.id}
                            onClick={() => handleActivityClick(activity)}
                            className={`glass p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all active:scale-[0.98] ${isCompleted ? 'opacity-50' : 'hover:bg-white/[0.06]'
                                }`}
                        >
                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isCompleted
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-white/5 text-zinc-400'
                                }`}>
                                {isCompleted ? <Icons.Check /> : getIcon(activity.type)}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className={`font-bold ${isCompleted ? 'line-through text-zinc-500' : 'text-white'}`}>
                                        {activity.task}
                                    </h3>
                                    <span className="text-xs font-bold text-zinc-600 ml-2">{activity.time}</span>
                                </div>
                                <p className="text-xs text-zinc-500 truncate">{activity.detail}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="phase-indicator text-[10px]">{activity.phase}</span>
                                    {activity.hasDetails && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                                            დეტალები
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Arrow */}
                            <Icons.ChevronRight size={16} className="text-zinc-700 flex-shrink-0" />
                        </div>
                    )
                })}
            </div>

            {/* Empty State */}
            {filteredActivities.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                        <Icons.Calendar size={32} className="text-zinc-600" />
                    </div>
                    <p className="text-zinc-500">არ არის აქტივობა ამ ფაზაში</p>
                </div>
            )}

            {/* Activity Detail Modal */}
            <ActivityDetailModal
                activity={selectedActivity}
                isOpen={!!selectedActivity}
                onClose={() => setSelectedActivity(null)}
                onComplete={handleToggleComplete}
                isCompleted={selectedActivity ? completedToday[selectedActivity.id] : false}
            />
        </div>
    )
}

export default ActivityLibrary
