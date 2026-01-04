import { useState, useMemo } from 'react'
import Icons from './Icons'
import { useData } from '../hooks/useData'

const CalendarView = () => {
    const { history, activities } = useData()
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(null)

    const days = ['კვ', 'ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ']
    const months = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი']

    // Calculate calendar grid
    const calendarDays = useMemo(() => {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()

        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const startDay = firstDay.getDay()
        const daysInMonth = lastDay.getDate()

        const days = []

        // Previous month padding
        for (let i = 0; i < startDay; i++) {
            days.push({ day: null, date: null })
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i).toISOString().split('T')[0]
            days.push({ day: i, date })
        }

        return days
    }, [currentDate])

    // Get completion data for each day
    const dayStats = useMemo(() => {
        const stats = {}
        history.forEach(h => {
            if (!stats[h.completed_at]) {
                stats[h.completed_at] = 0
            }
            stats[h.completed_at]++
        })
        return stats
    }, [history])

    // Get color based on completion percentage
    const getDayColor = (date) => {
        if (!date) return ''
        const completed = dayStats[date] || 0
        const total = activities.length
        const percentage = (completed / total) * 100

        if (percentage === 0) return 'bg-white/5 text-zinc-600'
        if (percentage < 30) return 'bg-red-500/20 text-red-400'
        if (percentage < 60) return 'bg-yellow-500/20 text-yellow-400'
        if (percentage < 90) return 'bg-cyan-500/20 text-cyan-400'
        return 'bg-emerald-500/30 text-emerald-400'
    }

    const isToday = (date) => {
        return date === new Date().toISOString().split('T')[0]
    }

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
    }

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
    }

    // Get selected date details
    const selectedDateDetails = useMemo(() => {
        if (!selectedDate) return null
        const completedIds = history
            .filter(h => h.completed_at === selectedDate)
            .map(h => h.activity_id)

        return {
            date: new Date(selectedDate),
            completed: completedIds,
            activities: activities.map(a => ({
                ...a,
                wasCompleted: completedIds.includes(a.id)
            }))
        }
    }, [selectedDate, history, activities])

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-black text-white">კალენდარი</h1>
            </div>

            {/* Month Navigation */}
            <div className="glass p-4 rounded-3xl">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={prevMonth}
                        className="touch-target w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 active:scale-95"
                    >
                        <Icons.ChevronLeft />
                    </button>
                    <h2 className="text-lg font-black text-white">
                        {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <button
                        onClick={nextMonth}
                        className="touch-target w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 active:scale-95"
                    >
                        <Icons.ChevronRight />
                    </button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                    {days.map(day => (
                        <div key={day} className="text-center text-[10px] font-bold text-zinc-500 uppercase">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => item.date && setSelectedDate(item.date)}
                            disabled={!item.date}
                            className={`calendar-day text-sm transition-all ${item.date
                                    ? `${getDayColor(item.date)} ${isToday(item.date) ? 'ring-2 ring-cyan-500' : ''} ${selectedDate === item.date ? 'ring-2 ring-white scale-110' : ''}`
                                    : ''
                                }`}
                        >
                            {item.day}
                        </button>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="glass p-4 rounded-2xl">
                <p className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest">ლეგენდა</p>
                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-white/5" />
                        <span className="text-xs text-zinc-500">0%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-red-500/20" />
                        <span className="text-xs text-zinc-500">&lt;30%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-yellow-500/20" />
                        <span className="text-xs text-zinc-500">30-60%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-cyan-500/20" />
                        <span className="text-xs text-zinc-500">60-90%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-emerald-500/30" />
                        <span className="text-xs text-zinc-500">90%+</span>
                    </div>
                </div>
            </div>

            {/* Selected Date Details */}
            {selectedDateDetails && (
                <div className="glass p-5 rounded-3xl animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">
                            {selectedDateDetails.date.getDate()} {months[selectedDateDetails.date.getMonth()]}
                        </h3>
                        <span className="text-sm font-bold text-cyan-400">
                            {selectedDateDetails.completed.length} / {activities.length}
                        </span>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {selectedDateDetails.activities.map(activity => (
                            <div
                                key={activity.id}
                                className={`p-3 rounded-xl flex items-center gap-3 ${activity.wasCompleted ? 'bg-emerald-500/10' : 'bg-white/5'
                                    }`}
                            >
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${activity.wasCompleted ? 'bg-emerald-500 text-white' : 'bg-white/10 text-zinc-500'
                                    }`}>
                                    {activity.wasCompleted && <Icons.Check size={14} />}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-medium ${activity.wasCompleted ? 'text-white' : 'text-zinc-500'}`}>
                                        {activity.task}
                                    </p>
                                    <p className="text-[10px] text-zinc-600">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default CalendarView
