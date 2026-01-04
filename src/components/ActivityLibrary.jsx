import { useState, useMemo } from 'react'
import Icons from './Icons'
import { useData, BASE_SCHEDULE, SUNDAY_SCHEDULE, SATURDAY_SCHEDULE } from '../hooks/useData'
import { ACTIVITY_DETAILS, WORKOUT_PLANS } from '../data/exercises'
import ActivityDetailModal from './ActivityDetailModal'
import WorkoutDetailModal from './WorkoutDetailModal'

const ActivityLibrary = () => {
    const { activities: todayActivities, completedToday, toggleComplete } = useData()
    const [selectedActivity, setSelectedActivity] = useState(null)
    const [selectedWorkoutId, setSelectedWorkoutId] = useState(null)
    const [filter, setFilter] = useState('all')
    const [viewMode, setViewMode] = useState('today') // 'today' or 'library'

    // Get icon for activity type
    const getIcon = (type) => {
        const IconComponent = Icons[type]
        return IconComponent ? <IconComponent size={20} /> : <Icons.Zap size={20} />
    }

    // Group activities by phase
    const phases = ['დილა', 'დღე', 'სამუშაო', 'საღამო', 'ღამე']

    // Memoize all activities for Library mode
    const allActivities = useMemo(() => {
        return [...BASE_SCHEDULE, ...SATURDAY_SCHEDULE, ...SUNDAY_SCHEDULE]
    }, [])

    // Determine which list to show
    const currentList = viewMode === 'today' ? todayActivities : allActivities

    // Filter activities
    const filteredActivities = filter === 'all'
        ? currentList
        : currentList.filter(a => a.phase === filter)

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

    // Workout Plans List (for 'workouts' filter)
    const workoutPlansList = Object.entries(WORKOUT_PLANS).map(([id, plan]) => ({
        id,
        ...plan
    })).filter(w => w && w.title) // Filter out nulls (rest days)

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header */}
            <header className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black text-white">აქტივობები</h1>
                        <p className="text-zinc-500 text-sm">
                            {viewMode === 'today' ? 'დღევანდელი გეგმა' : 'სრული ბაზა'}
                        </p>
                    </div>
                    {viewMode === 'today' && (
                        <div className="glass px-4 py-2 rounded-2xl">
                            <span className="text-lg font-bold text-cyan-400">
                                {Object.keys(completedToday).filter(k => completedToday[k]).length}/{todayActivities.length}
                            </span>
                        </div>
                    )}
                </div>

                {/* View Toggles */}
                <div className="bg-white/5 p-1 rounded-2xl flex gap-1">
                    <button
                        onClick={() => { setViewMode('today'); setFilter('all'); }}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${viewMode === 'today'
                                ? 'bg-zinc-800 text-white shadow-lg'
                                : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        დღეს
                    </button>
                    <button
                        onClick={() => { setViewMode('library'); setFilter('all'); }}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${viewMode === 'library'
                                ? 'bg-zinc-800 text-white shadow-lg'
                                : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        ყველა
                    </button>
                    <button
                        onClick={() => { setViewMode('library'); setFilter('workouts'); }}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${filter === 'workouts'
                                ? 'bg-cyan-600 text-white shadow-lg'
                                : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        ვარჯიშები
                    </button>
                </div>
            </header>

            {/* Phase Filter (Only show if NOT in workouts mode) */}
            {filter !== 'workouts' && (
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
                        const count = currentList.filter(a => a.phase === phase).length
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
            )}

            {/* Content List */}
            <div className="space-y-3">
                {filter === 'workouts' ? (
                    // Workouts List
                    workoutPlansList.map(plan => (
                        <div
                            key={plan.id}
                            onClick={() => setSelectedWorkoutId(plan.id)}
                            className="glass p-5 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-white/[0.06] active:scale-[0.98] transition-all border-cyan-500/20"
                        >
                            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                                {plan.id === 'swimming' ? <Icons.Swim /> : <Icons.Dumbbell />}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-white text-lg">{plan.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-bold bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-md">
                                        {plan.exercises ? plan.exercises.length + ' ვარჯიში' : 'კარდიო'}
                                    </span>
                                    <span className="text-[10px] text-zinc-500">დააჭირე დეტალებისთვის</span>
                                </div>
                            </div>
                            <Icons.ChevronRight size={20} className="text-zinc-600" />
                        </div>
                    ))
                ) : (
                    // Regular Activities List
                    activitiesWithDetails.map(activity => {
                        const isCompleted = completedToday[activity.id]

                        return (
                            <div
                                key={activity.id}
                                onClick={() => handleActivityClick(activity)}
                                className={`glass p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all active:scale-[0.98] ${isCompleted && viewMode === 'today' ? 'opacity-50' : 'hover:bg-white/[0.06]'
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
                                        <h3 className={`font-bold ${isCompleted && viewMode === 'today' ? 'line-through text-zinc-500' : 'text-white'}`}>
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
                    })
                )}

                {/* Empty State */}
                {filter !== 'workouts' && filteredActivities.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                            <Icons.Calendar size={32} className="text-zinc-600" />
                        </div>
                        <p className="text-zinc-500">არ არის აქტივობა</p>
                    </div>
                )}
            </div>

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
                isOpen={!!selectedWorkoutId}
                onClose={() => setSelectedWorkoutId(null)}
                workoutId={selectedWorkoutId}
            />
        </div>
    )
}

export default ActivityLibrary
