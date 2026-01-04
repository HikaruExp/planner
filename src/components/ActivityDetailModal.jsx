import { useState } from 'react'
import Icons from './Icons'
import { ACTIVITY_DETAILS } from '../data/exercises'

// Helper function to render icons dynamically
const renderIcon = (type, size = 24) => {
    const IconComponent = Icons[type]
    return IconComponent ? <IconComponent size={size} /> : null
}

const ActivityDetailModal = ({ activity, isOpen, onClose, onComplete, isCompleted }) => {
    const [showVideo, setShowVideo] = useState(false)

    if (!isOpen || !activity) return null

    const details = ACTIVITY_DETAILS[activity.id] || {}

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 animate-fade-in pb-safe"
            onClick={onClose}
        >
            <div
                className="glass w-full max-w-md max-h-[80vh] rounded-t-[2rem] animate-slide-up overflow-hidden flex flex-col mb-0"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-cyan-500/20 text-cyan-400'
                            }`}>
                            {renderIcon(activity.type)}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">{activity.task}</h2>
                            <p className="text-sm text-zinc-500">{activity.time}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="touch-target w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-zinc-400"
                    >
                        <Icons.X size={20} />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                    {/* Detail from schedule */}
                    <div className="p-4 bg-white/5 rounded-2xl">
                        <p className="text-sm text-zinc-300">{activity.detail}</p>
                    </div>

                    {/* Detailed Instruction */}
                    {details.instruction && (
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Icons.Info size={14} />
                                ინსტრუქცია
                            </h3>
                            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                                {details.instruction}
                            </p>
                        </div>
                    )}

                    {/* Nutrition info for meals */}
                    {details.nutrition && (
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                                კვებითი ღირებულება
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {details.nutrition.calories && (
                                    <div className="p-3 bg-orange-500/10 rounded-xl text-center">
                                        <p className="text-lg font-bold text-orange-400">{details.nutrition.calories}</p>
                                        <p className="text-xs text-zinc-500">კალორია</p>
                                    </div>
                                )}
                                {details.nutrition.protein && (
                                    <div className="p-3 bg-cyan-500/10 rounded-xl text-center">
                                        <p className="text-lg font-bold text-cyan-400">{details.nutrition.protein}გ</p>
                                        <p className="text-xs text-zinc-500">ცილა</p>
                                    </div>
                                )}
                                {details.nutrition.carbs && (
                                    <div className="p-3 bg-purple-500/10 rounded-xl text-center">
                                        <p className="text-lg font-bold text-purple-400">{details.nutrition.carbs}გ</p>
                                        <p className="text-xs text-zinc-500">ნახშირწყალი</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tips */}
                    {details.tips && details.tips.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Icons.Lightbulb size={14} />
                                რჩევები
                            </h3>
                            <ul className="space-y-2">
                                {details.tips.map((tip, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                                        <span className="text-cyan-400 mt-0.5">•</span>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Footer - Complete Button */}
                <div className="p-5 border-t border-white/10">
                    <button
                        onClick={() => {
                            onComplete(activity.id)
                            onClose()
                        }}
                        className={`w-full touch-target py-4 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${isCompleted
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                            }`}
                    >
                        {isCompleted ? (
                            <>
                                <Icons.CheckCircle size={20} />
                                შესრულებულია ✓
                            </>
                        ) : (
                            <>
                                <Icons.Check size={20} />
                                შესრულდა
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ActivityDetailModal
