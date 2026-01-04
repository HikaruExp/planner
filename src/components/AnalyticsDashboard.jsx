import { useMemo } from 'react'
import Icons from './Icons'
import { useData } from '../hooks/useData'

const AnalyticsDashboard = () => {
    const { history, activities, getStats } = useData()
    const stats = getStats()

    // Weekly completion data (last 7 days)
    const weeklyData = useMemo(() => {
        const days = []
        const dayNames = ['კვ', 'ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ']

        for (let i = 6; i >= 0; i--) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            const dateStr = date.toISOString().split('T')[0]

            const completed = history.filter(h => h.completed_at === dateStr).length
            const percentage = activities.length > 0 ? Math.round((completed / activities.length) * 100) : 0

            days.push({
                day: dayNames[date.getDay()],
                percentage,
                completed,
                isToday: i === 0
            })
        }

        return days
    }, [history, activities])

    // Top activities (most completed)
    const topActivities = useMemo(() => {
        const counts = {}
        history.forEach(h => {
            counts[h.activity_id] = (counts[h.activity_id] || 0) + 1
        })

        return Object.entries(counts)
            .map(([id, count]) => ({
                activity: activities.find(a => a.id === id),
                count
            }))
            .filter(x => x.activity)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
    }, [history, activities])

    // Monthly stats
    const monthlyStats = useMemo(() => {
        const now = new Date()
        const thisMonth = now.toISOString().slice(0, 7)
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1).toISOString().slice(0, 7)

        const thisMonthCount = history.filter(h => h.completed_at.startsWith(thisMonth)).length
        const lastMonthCount = history.filter(h => h.completed_at.startsWith(lastMonth)).length

        const change = lastMonthCount > 0
            ? Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100)
            : 100

        return { thisMonth: thisMonthCount, lastMonth: lastMonthCount, change }
    }, [history])

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header */}
            <h1 className="text-2xl font-black text-white">ანალიტიკა</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* Streak Card */}
                <div className="glass p-5 rounded-3xl bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white streak-flame">
                            <Icons.Flame size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-white">{stats.streak}</p>
                    <p className="text-xs text-orange-400 font-bold">დღის სტრიქი</p>
                </div>

                {/* Today's Progress */}
                <div className="glass p-5 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-500/20">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-white">
                            <Icons.Check size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-white">{stats.todayProgress}%</p>
                    <p className="text-xs text-cyan-400 font-bold">დღის პროგრესი</p>
                </div>

                {/* Total Completed */}
                <div className="glass p-5 rounded-3xl">
                    <p className="text-3xl font-black text-white">{stats.totalCompleted}</p>
                    <p className="text-xs text-zinc-400 font-bold">სულ შესრულებული</p>
                </div>

                {/* Monthly Change */}
                <div className="glass p-5 rounded-3xl">
                    <p className={`text-3xl font-black ${monthlyStats.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {monthlyStats.change >= 0 ? '+' : ''}{monthlyStats.change}%
                    </p>
                    <p className="text-xs text-zinc-400 font-bold">თვიური ზრდა</p>
                </div>
            </div>

            {/* Weekly Chart */}
            <div className="glass p-6 rounded-3xl">
                <h3 className="text-sm font-bold text-zinc-400 mb-6 uppercase tracking-widest">კვირის აქტივობა</h3>
                <div className="flex items-end justify-between gap-2 h-32">
                    {weeklyData.map((day, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-white/5 rounded-lg relative" style={{ height: '100px' }}>
                                <div
                                    className={`absolute bottom-0 left-0 right-0 rounded-lg transition-all duration-500 ${day.isToday
                                            ? 'bg-gradient-to-t from-cyan-500 to-cyan-400'
                                            : 'bg-gradient-to-t from-zinc-600 to-zinc-500'
                                        }`}
                                    style={{ height: `${day.percentage}%` }}
                                />
                            </div>
                            <span className={`text-[10px] font-bold ${day.isToday ? 'text-cyan-400' : 'text-zinc-500'}`}>
                                {day.day}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Circular Progress */}
            <div className="glass p-6 rounded-3xl flex items-center gap-6">
                <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 -rotate-90">
                        <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="8"
                            fill="none"
                        />
                        <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${stats.todayProgress * 2.51} 251`}
                            className="transition-all duration-1000"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#22d3ee" />
                                <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-black text-white">{stats.todayProgress}%</span>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white mb-1">დღის მიზანი</h3>
                    <p className="text-sm text-zinc-400">
                        {stats.todayCompleted} / {stats.todayTotal} აქტივობა
                    </p>
                </div>
            </div>

            {/* Top Activities */}
            {topActivities.length > 0 && (
                <div className="glass p-6 rounded-3xl">
                    <h3 className="text-sm font-bold text-zinc-400 mb-4 uppercase tracking-widest">ტოპ აქტივობები</h3>
                    <div className="space-y-3">
                        {topActivities.map((item, idx) => {
                            const maxCount = topActivities[0].count
                            const width = (item.count / maxCount) * 100

                            return (
                                <div key={item.activity.id} className="relative">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-white flex items-center gap-2">
                                            <span className="text-zinc-600">#{idx + 1}</span>
                                            {item.activity.task}
                                        </span>
                                        <span className="text-xs font-bold text-cyan-400">{item.count}x</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                                            style={{ width: `${width}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Fun Stats */}
            <div className="glass p-6 rounded-3xl bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
                <h3 className="text-sm font-bold text-purple-400 mb-4 uppercase tracking-widest">🎉 მხიარული ფაქტები</h3>
                <div className="space-y-3">
                    <p className="text-sm text-zinc-300">
                        • შენ უკვე <span className="text-purple-400 font-bold">{stats.totalCompleted}</span> აქტივობა შეასრულე!
                    </p>
                    {stats.streak >= 7 && (
                        <p className="text-sm text-zinc-300">
                            • 🔥 ერთი კვირაზე მეტია სტრიქზე ხარ!
                        </p>
                    )}
                    {stats.todayProgress === 100 && (
                        <p className="text-sm text-zinc-300">
                            • ⭐ დღეს ყველაფერი შეასრულე!
                        </p>
                    )}
                    {monthlyStats.change > 0 && (
                        <p className="text-sm text-zinc-300">
                            • 📈 ამ თვეში <span className="text-emerald-400 font-bold">{monthlyStats.change}%</span>-ით მეტი გააკეთე!
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AnalyticsDashboard
