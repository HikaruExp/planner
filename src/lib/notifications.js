// Push notification system for activity reminders
// შეტყობინებების სისტემა აქტივობის შეხსენებისთვის

class NotificationService {
    constructor() {
        this.permission = 'default'
        this.scheduledNotifications = []
        this.reminderMinutes = 5 // 5 წუთით ადრე
    }

    // Request notification permission
    async requestPermission() {
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications')
            return false
        }

        if (Notification.permission === 'granted') {
            this.permission = 'granted'
            return true
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission()
            this.permission = permission
            return permission === 'granted'
        }

        return false
    }

    // Check if notifications are enabled
    isEnabled() {
        return this.permission === 'granted'
    }

    // Send a notification
    send(title, options = {}) {
        if (!this.isEnabled()) return null

        const notification = new Notification(title, {
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            vibrate: [200, 100, 200],
            ...options
        })

        notification.onclick = () => {
            window.focus()
            notification.close()
        }

        return notification
    }

    // Schedule notifications for activities
    scheduleForActivities(activities, settings) {
        // Clear any existing scheduled notifications
        this.clearAll()

        if (!this.isEnabled() || !settings.notificationsEnabled) return

        const now = new Date()
        const today = now.toDateString()

        activities.forEach(activity => {
            const [hours, minutes] = activity.time.split(':').map(Number)

            // Create date for this activity
            const activityTime = new Date(today)
            activityTime.setHours(hours, minutes, 0, 0)

            // Calculate reminder time (X minutes before)
            const reminderTime = new Date(activityTime)
            reminderTime.setMinutes(reminderTime.getMinutes() - (settings.reminderMinutes || 5))

            // Only schedule if reminder time is in the future
            if (reminderTime > now) {
                const timeUntilReminder = reminderTime.getTime() - now.getTime()

                const timeoutId = setTimeout(() => {
                    this.send(`🔔 ${activity.task}`, {
                        body: `${settings.reminderMinutes || 5} წუთში!`,
                        tag: activity.id,
                        renotify: true
                    })
                }, timeUntilReminder)

                this.scheduledNotifications.push({
                    id: activity.id,
                    timeoutId,
                    scheduledFor: reminderTime
                })
            }
        })

        console.log(`Scheduled ${this.scheduledNotifications.length} notifications`)
    }

    // Clear all scheduled notifications
    clearAll() {
        this.scheduledNotifications.forEach(notif => {
            clearTimeout(notif.timeoutId)
        })
        this.scheduledNotifications = []
    }

    // Update reminder time setting
    setReminderMinutes(minutes) {
        this.reminderMinutes = minutes
    }
}

// Singleton instance
export const notificationService = new NotificationService()

// React hook for notifications
import { useState, useEffect, useCallback } from 'react'

export const useNotifications = () => {
    const [isEnabled, setIsEnabled] = useState(false)
    const [reminderMinutes, setReminderMinutes] = useState(5)

    useEffect(() => {
        // Check current permission on mount
        if ('Notification' in window) {
            setIsEnabled(Notification.permission === 'granted')
        }

        // Load saved settings
        const savedSettings = localStorage.getItem('planner_notification_settings')
        if (savedSettings) {
            const { enabled, minutes } = JSON.parse(savedSettings)
            setReminderMinutes(minutes || 5)
            if (enabled) {
                notificationService.requestPermission().then(granted => {
                    setIsEnabled(granted)
                })
            }
        }
    }, [])

    const enableNotifications = useCallback(async () => {
        const granted = await notificationService.requestPermission()
        setIsEnabled(granted)

        localStorage.setItem('planner_notification_settings', JSON.stringify({
            enabled: granted,
            minutes: reminderMinutes
        }))

        return granted
    }, [reminderMinutes])

    const disableNotifications = useCallback(() => {
        notificationService.clearAll()
        setIsEnabled(false)

        localStorage.setItem('planner_notification_settings', JSON.stringify({
            enabled: false,
            minutes: reminderMinutes
        }))
    }, [reminderMinutes])

    const updateReminderMinutes = useCallback((minutes) => {
        setReminderMinutes(minutes)
        notificationService.setReminderMinutes(minutes)

        localStorage.setItem('planner_notification_settings', JSON.stringify({
            enabled: isEnabled,
            minutes
        }))
    }, [isEnabled])

    const scheduleNotifications = useCallback((activities) => {
        notificationService.scheduleForActivities(activities, {
            notificationsEnabled: isEnabled,
            reminderMinutes
        })
    }, [isEnabled, reminderMinutes])

    return {
        isEnabled,
        reminderMinutes,
        enableNotifications,
        disableNotifications,
        updateReminderMinutes,
        scheduleNotifications
    }
}
