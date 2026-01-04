import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

// Base schedule - ყოველდღიური (ყველა დღე)
export const BASE_SCHEDULE = [
    { id: 'm1', time: '08:30', task: 'გაღვიძება', phase: 'დილა', detail: '1 ჭიქა წყალი', type: 'Water', enabled: true, days: 'all' },
    { id: 'm2', time: '08:45', task: 'საუზმე', phase: 'დილა', detail: 'Serious Mass (1 კოვზი + 500 მლ რძე)', type: 'Utensils', enabled: true, days: 'all' },
    { id: 'm3', time: '09:00', task: 'დანამატები', phase: 'დილა', detail: 'ომეგა-3 (1 კაფსულა) + კოლაგენი', type: 'Zap', enabled: true, days: 'all' },
    { id: 'w1', time: '10:00', task: 'სამუშაო', phase: 'სამუშაო', detail: '2-2.5 ლიტრი წყალი დღის მანძილზე', type: 'Water', enabled: true, days: 'weekday' },
    { id: 'w2', time: '13:00', task: 'თვალის მოვლა #1', phase: 'სამუშაო', detail: 'რეგენოპია (3-4-ჯერ დღეში)', type: 'Eye', enabled: true, days: 'weekday' },
    { id: 'w3', time: '16:00', task: 'თვალის მოვლა #2', phase: 'სამუშაო', detail: 'რეგენოპია (1 წვეთი)', type: 'Eye', enabled: true, days: 'weekday' },
    { id: 'e1', time: '18:30', task: 'ოჯახის დრო', phase: 'საღამო', detail: 'ვახშამი №1 (ხორცი + ნახშირწყლები)', type: 'Utensils', enabled: true, days: 'all' },
    { id: 'e2', time: '20:00', task: 'მომზადება', phase: 'საღამო', detail: 'რეგენოპია (1 წვეთი)', type: 'Eye', enabled: true, days: 'workout' },
    { id: 'e3', time: '20:15', task: 'ვარჯიში / აუზი', phase: 'საღამო', detail: 'ვარჯიშისას სვი წყალი • სათვალე აუზზე!', type: 'Dumbbell', enabled: true, isSwimming: true, days: 'workout' },
    { id: 'n1', time: '21:30', task: 'აღდგენა', phase: 'ღამე', detail: 'პატარა წახემსება (ხილი ან ბატონი) + რეგენოპია', type: 'Utensils', enabled: true, days: 'all' },
    { id: 'n2', time: '22:30', task: 'ძილის წინ', phase: 'ღამე', detail: 'ხაჭო ან ნახევარი პორცია გეინერი + მაგნიუმის ციტრატი', type: 'Zap', enabled: true, days: 'all' },
    { id: 'n3', time: '23:00', task: 'ძილი', phase: 'ღამე', detail: 'აიგელი (მხოლოდ 10 დღე)', type: 'Eye', enabled: true, days: 'all' }
]

// Sunday specific schedule - მხოლოდ აუცილებელი
export const SUNDAY_SCHEDULE = [
    { id: 'sun1', time: '09:30', task: 'გვიან გაღვიძება', phase: 'დილა', detail: 'დასვენების დღე - დაიძინე მეტი!', type: 'Water', enabled: true },
    { id: 'sun2', time: '10:00', task: 'საუზმე', phase: 'დილა', detail: 'მშვიდი საუზმე ოჯახთან', type: 'Utensils', enabled: true },
    { id: 'sun3', time: '10:30', task: 'დანამატები', phase: 'დილა', detail: 'ომეგა-3 + კოლაგენი', type: 'Zap', enabled: true },
    { id: 'sun4', time: '13:00', task: 'თვალის მოვლა', phase: 'დღე', detail: 'რეგენოპია (1 წვეთი)', type: 'Eye', enabled: true },
    { id: 'sun5', time: '14:00', task: 'ოჯახის დრო', phase: 'დღე', detail: 'სადილი ოჯახთან ერთად', type: 'Utensils', enabled: true },
    { id: 'sun6', time: '18:00', task: 'მომზადება კვირისთვის', phase: 'საღამო', detail: 'საკვებისა და ტანსაცმლის მომზადება', type: 'Zap', enabled: true },
    { id: 'sun7', time: '20:00', task: 'ვახშამი', phase: 'საღამო', detail: 'მსუბუქი ვახშამი', type: 'Utensils', enabled: true },
    { id: 'sun8', time: '22:00', task: 'ძილის წინ', phase: 'ღამე', detail: 'ხაჭო + მაგნიუმის ციტრატი', type: 'Zap', enabled: true },
    { id: 'sun9', time: '22:30', task: 'ადრეული ძილი', phase: 'ღამე', detail: 'ხვალ ორშაბათია - დაიძინე ადრე!', type: 'Eye', enabled: true }
]

// Saturday specific schedule - ოჯახური
export const SATURDAY_SCHEDULE = [
    { id: 'sat1', time: '09:00', task: 'გაღვიძება', phase: 'დილა', detail: '1 ჭიქა წყალი', type: 'Water', enabled: true },
    { id: 'sat2', time: '09:30', task: 'საუზმე', phase: 'დილა', detail: 'Serious Mass + ომეგა-3', type: 'Utensils', enabled: true },
    { id: 'sat3', time: '11:00', task: 'ოჯახური სეირნობა', phase: 'დღე', detail: 'მინიმუმ 5000 ნაბიჯი 🚶‍♂️', type: 'Dumbbell', enabled: true },
    { id: 'sat4', time: '13:00', task: 'თვალის მოვლა', phase: 'დღე', detail: 'რეგენოპია (1 წვეთი)', type: 'Eye', enabled: true },
    { id: 'sat5', time: '14:00', task: 'სადილი', phase: 'დღე', detail: 'ოჯახური სადილი', type: 'Utensils', enabled: true },
    { id: 'sat6', time: '18:00', task: 'საღამო', phase: 'საღამო', detail: 'თავისუფალი დრო', type: 'Zap', enabled: true },
    { id: 'sat7', time: '20:00', task: 'ვახშამი', phase: 'საღამო', detail: 'ხორცი + სალათი', type: 'Utensils', enabled: true },
    { id: 'sat8', time: '22:30', task: 'ძილის წინ', phase: 'ღამე', detail: 'ხაჭო + მაგნიუმი', type: 'Zap', enabled: true },
    { id: 'sat9', time: '23:30', task: 'ძილი', phase: 'ღამე', detail: 'შაბათის ღამე', type: 'Eye', enabled: true }
]

// Get day-specific schedule
const getScheduleForDay = (dayIndex) => {
    // dayIndex: 0 = Sunday, 6 = Saturday
    if (dayIndex === 0) return SUNDAY_SCHEDULE // კვირა
    if (dayIndex === 6) return SATURDAY_SCHEDULE // შაბათი

    // Weekdays - filter based on workout days
    const workoutDays = [1, 3, 5] // Mon, Wed, Fri = workout
    const swimDays = [2, 4] // Tue, Thu = swimming
    const isWorkoutDay = workoutDays.includes(dayIndex) || swimDays.includes(dayIndex)

    return BASE_SCHEDULE.filter(activity => {
        if (activity.days === 'all') return true
        if (activity.days === 'weekday') return dayIndex >= 1 && dayIndex <= 5
        if (activity.days === 'workout') return isWorkoutDay
        return true
    })
}

const DEFAULT_SETTINGS = {
    swimmingEnabled: true,
    holidayMode: false,
    holidayStart: null,
    holidayEnd: null
}

// Detailed workouts from Excel files
const DEFAULT_WORKOUTS = {
    'ორშაბათი': {
        title: 'ზედა ტანი (V-ფორმისთვის)',
        ex: [
            'ტურნიკი (ფართო მოჭიდება) - 4×მაქს • ზურგის გაფართოება',
            'გირის მიზიდვა (15 კგ) - 4×12 • ბეჭების ამოვსება',
            'აზიდვები იატაკიდან - 4×15-20 • მკერდის ფორმირება',
            'მხრებზე აზიდვა (15 კგ) - 4×12 • მხრების დამრგვალება'
        ],
        detailedExercises: [
            { name: 'ტურნიკი (ფართო მოჭიდება)', sets: 4, reps: 'მაქსიმუმი', purpose: 'ზურგის გაფართოება' },
            { name: 'გირის მიზიდვა (ცალი ხელით)', sets: 4, reps: '12 (15 კგ)', purpose: 'ბეჭების ამოვსება კუნთით' },
            { name: 'აზიდვები იატაკიდან', sets: 4, reps: '15-20', purpose: 'მკერდის კუნთების ფორმირება' },
            { name: 'მხრებზე აზიდვა (ჰანტელებით)', sets: 4, reps: '12 (15 კგ)', purpose: 'მხრების დამრგვალება' }
        ]
    },
    'სამშაბათი': {
        title: 'ცურვა (ინტენსიური)',
        ex: [
            'FitPass: 45 წთ ინტენსიური კროლი',
            '🥽 სათვალე აუცილებელია!'
        ],
        isSwimming: true
    },
    'ოთხშაბათი': {
        title: 'ქვედა ტანი (ტესტოსტერონის ბუსტი)',
        ex: [
            'გობლეტ სკვატი (30 კგ) - 4×15 • ჰორმონებისთვის',
            'ბულგარული სკვატი (15 კგ) - 3×12 • დუნდულების ძალა',
            'რუმინული წევა (30 კგ) - 4×15 • უკანა კუნთების გამოკვეთა',
            'თეძოების ხიდი (30 კგ) - 4×20 • დუნდულის ფორმა'
        ],
        detailedExercises: [
            { name: 'გობლეტ სკვატი (30 კგ გირა)', sets: 4, reps: 15, purpose: 'მთავარი ვარჯიში ჰორმონებისთვის' },
            { name: 'ბულგარული სკვატი (15 კგ)', sets: 3, reps: '12 (თითო ფეხზე)', purpose: 'დუნდულების სიმრგვალე და ძალა' },
            { name: 'რუმინული წევა (30 კგ გირა)', sets: 4, reps: 15, purpose: 'ფეხის უკანა კუნთების გამოკვეთა' },
            { name: 'თეძოების ხიდი (30 კგ წონით)', sets: 4, reps: 20, purpose: 'დუნდულის ფორმა და ქვედა წელი' }
        ]
    },
    'ხუთშაბათი': {
        title: 'ცურვა (აღდგენა)',
        ex: [
            'FitPass: მშვიდი ცურვა სისხლძარღვებისთვის',
            'სუნთქვის კონტროლი'
        ],
        isSwimming: true
    },
    'პარასკევი': {
        title: 'Full Body (ძალა და რელიეფი)',
        ex: [
            'ტურნიკი (ვიწრო მოჭიდება) - 3×მაქს • ბიცეფსი+ზურგი',
            'ჩაჯდომა + მხრებზე აწევა (15 კგ) - 4×12 • კომბო',
            'მუხლების ატანა ტურნიკზე - 4×15 • პრესის გამოკვეთა',
            'გირის დაჭერა Walking (15 კგ) - 3×1წთ • წონასწორობა'
        ],
        detailedExercises: [
            { name: 'ტურნიკი (ვიწრო მოჭიდება)', sets: 3, reps: 'მაქსიმუმი', purpose: 'ბიცეფსი და ზურგი' },
            { name: 'ჩაჯდომა + მხრებზე აწევა', sets: 4, reps: '12 (15 კგ)', purpose: 'კომბინირებული მოძრაობა' },
            { name: 'მუხლების ატანა ტურნიკზე', sets: 4, reps: 15, purpose: 'პრესის გამоკვეთა' },
            { name: 'გირის დაჭერა (Walking)', sets: 3, reps: '1 წუთი', purpose: '15-15 კგ-ით სიარული (წონასწორობა)' }
        ]
    },
    'შაბათი': {
        title: 'ოჯახური სეირნობა',
        ex: ['მინიმუმ 5000 ნაბიჯი ოჯახთან ერთად']
    },
    'კვირა': {
        title: 'სრული დასვენება (აღდგენა)',
        ex: ['მშვიდი ძილი', 'მომზადება ახალი კვირისთვის']
    }
}

export const useData = () => {
    const { user, isDemoMode } = useAuth()

    // Get today's day index (0 = Sunday, 1 = Monday, etc.)
    const todayDayIndex = new Date().getDay()

    // Initialize activities based on CURRENT day - called directly
    const [activities, setActivities] = useState(() => getScheduleForDay(todayDayIndex))
    const [completedToday, setCompletedToday] = useState({})
    const [history, setHistory] = useState([])
    const [settings, setSettings] = useState(DEFAULT_SETTINGS)
    const [workouts] = useState(DEFAULT_WORKOUTS)
    const [loading, setLoading] = useState(true)

    const today = new Date().toISOString().split('T')[0]

    // Update activities when component mounts (to ensure correct day)
    useEffect(() => {
        const currentDay = new Date().getDay()
        const daySchedule = getScheduleForDay(currentDay)
        console.log('Setting schedule for day:', currentDay, 'Activities:', daySchedule.length) // Debug
        setActivities(daySchedule)
    }, []) // Run once on mount

    // Load data on mount
    useEffect(() => {
        if (!user) {
            setLoading(false)
            return
        }
        loadData()
    }, [user, isDemoMode])

    // Save to localStorage in demo mode, or sync with Supabase
    const loadData = async () => {
        setLoading(true)
        console.log('Loading data, isDemoMode:', isDemoMode) // Debug

        if (isDemoMode) {
            // Demo mode: Activities are determined by day, not saved
            // Only load completions, history, and settings from localStorage
            const savedCompleted = localStorage.getItem('planner_completed')
            const savedHistory = localStorage.getItem('planner_history')
            const savedSettings = localStorage.getItem('planner_settings')

            if (savedCompleted) {
                const parsed = JSON.parse(savedCompleted)
                // Only use today's completions
                if (parsed.date === today) {
                    setCompletedToday(parsed.items || {})
                }
            }
            if (savedHistory) setHistory(JSON.parse(savedHistory))
            if (savedSettings) setSettings(JSON.parse(savedSettings))
        } else {
            // Load from Supabase
            try {
                const { data: activitiesData } = await supabase
                    .from('activities')
                    .select('*')
                    .eq('user_id', user.id)

                if (activitiesData?.length) {
                    setActivities(activitiesData)
                }

                const { data: historyData } = await supabase
                    .from('history')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('completed_at', { ascending: false })

                if (historyData) setHistory(historyData)

                const { data: settingsData } = await supabase
                    .from('settings')
                    .select('*')
                    .eq('user_id', user.id)
                    .single()

                if (settingsData) setSettings(settingsData)

                // Load today's completions from history
                const todayHistory = historyData?.filter(h => h.completed_at === today)
                const todayCompleted = {}
                todayHistory?.forEach(h => {
                    todayCompleted[h.activity_id] = true
                })
                setCompletedToday(todayCompleted)
            } catch (error) {
                console.error('Error loading data:', error)
            }
        }

        setLoading(false)
    }

    // Save completed status
    const toggleCompleted = useCallback(async (activityId) => {
        const newCompleted = { ...completedToday, [activityId]: !completedToday[activityId] }
        setCompletedToday(newCompleted)

        if (isDemoMode) {
            localStorage.setItem('planner_completed', JSON.stringify({ date: today, items: newCompleted }))

            // Update history
            const newHistory = [...history]
            if (newCompleted[activityId]) {
                newHistory.unshift({ activity_id: activityId, completed_at: today, status: 'completed' })
            } else {
                const idx = newHistory.findIndex(h => h.activity_id === activityId && h.completed_at === today)
                if (idx > -1) newHistory.splice(idx, 1)
            }
            setHistory(newHistory)
            localStorage.setItem('planner_history', JSON.stringify(newHistory))
        } else {
            // Sync with Supabase
            if (newCompleted[activityId]) {
                await supabase.from('history').insert({
                    user_id: user.id,
                    activity_id: activityId,
                    completed_at: today,
                    status: 'completed'
                })
            } else {
                await supabase.from('history')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('activity_id', activityId)
                    .eq('completed_at', today)
            }
        }
    }, [completedToday, history, user, today])

    // Update settings
    const updateSettings = useCallback(async (newSettings) => {
        const updated = { ...settings, ...newSettings }
        setSettings(updated)

        if (isDemoMode) {
            localStorage.setItem('planner_settings', JSON.stringify(updated))
        } else {
            await supabase.from('settings').upsert({
                user_id: user.id,
                ...updated
            })
        }
    }, [settings, user])

    // Add new activity
    const addActivity = useCallback(async (activity) => {
        const newActivity = {
            ...activity,
            id: `custom_${Date.now()}`,
            enabled: true
        }
        const updated = [...activities, newActivity]
        setActivities(updated)

        if (isDemoMode) {
            localStorage.setItem('planner_activities', JSON.stringify(updated))
        } else {
            await supabase.from('activities').insert({
                user_id: user.id,
                ...newActivity
            })
        }
    }, [activities, user])

    // Delete activity
    const deleteActivity = useCallback(async (activityId) => {
        const updated = activities.filter(a => a.id !== activityId)
        setActivities(updated)

        if (isDemoMode) {
            localStorage.setItem('planner_activities', JSON.stringify(updated))
        } else {
            await supabase.from('activities')
                .delete()
                .eq('id', activityId)
                .eq('user_id', user.id)
        }
    }, [activities, user])

    // Get filtered activities based on settings
    const getFilteredActivities = useCallback(() => {
        let filtered = activities.filter(a => a.enabled !== false)

        // Hide swimming activities if swimming is disabled
        if (!settings.swimmingEnabled) {
            filtered = filtered.filter(a => !a.isSwimming)
        }

        return filtered
    }, [activities, settings.swimmingEnabled])

    // Get filtered workouts
    const getFilteredWorkouts = useCallback(() => {
        if (!settings.swimmingEnabled) {
            const filtered = {}
            Object.entries(workouts).forEach(([day, workout]) => {
                if (workout.isSwimming) {
                    filtered[day] = { title: 'სახლის ვარჯიში', ex: ['სტრეჩინგი', 'იოგა', 'მსუბუქი კარდიო'] }
                } else {
                    filtered[day] = workout
                }
            })
            return filtered
        }
        return workouts
    }, [workouts, settings.swimmingEnabled])

    // Calculate streaks and stats
    const getStats = useCallback(() => {
        const sortedHistory = [...history].sort((a, b) =>
            new Date(b.completed_at) - new Date(a.completed_at)
        )

        // Calculate current streak
        let streak = 0
        let checkDate = new Date()
        const uniqueDays = new Set(sortedHistory.map(h => h.completed_at))

        while (uniqueDays.has(checkDate.toISOString().split('T')[0])) {
            streak++
            checkDate.setDate(checkDate.getDate() - 1)
        }

        // Today's progress
        const todayTotal = getFilteredActivities().length
        const todayCompleted = Object.values(completedToday).filter(Boolean).length
        const todayProgress = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0

        // Weekly stats
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        const weekHistory = sortedHistory.filter(h => new Date(h.completed_at) > weekAgo)

        // Activity completion counts
        const activityCounts = {}
        sortedHistory.forEach(h => {
            activityCounts[h.activity_id] = (activityCounts[h.activity_id] || 0) + 1
        })

        return {
            streak,
            todayProgress,
            todayCompleted,
            todayTotal,
            weeklyCompleted: weekHistory.length,
            totalCompleted: history.length,
            activityCounts,
            isHolidayMode: settings.holidayMode
        }
    }, [history, completedToday, settings, getFilteredActivities])

    return {
        activities: getFilteredActivities(),
        allActivities: activities,
        completedToday,
        history,
        settings,
        workouts: getFilteredWorkouts(),
        loading,
        toggleCompleted,
        updateSettings,
        addActivity,
        deleteActivity,
        getStats,
        refresh: loadData
    }
}
