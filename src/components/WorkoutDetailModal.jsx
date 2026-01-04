import { useState } from 'react'
import Icons from './Icons'
import { EXERCISES, WORKOUT_PLANS, WORKOUT_SCHEDULE } from '../data/exercises'

const ExerciseCard = ({ exerciseId, onSelect }) => {
    const exercise = EXERCISES[exerciseId]
    if (!exercise) return null

    return (
        <button
            onClick={() => onSelect(exercise)}
            className="w-full p-4 bg-white/5 rounded-2xl text-left active:scale-98 transition-all hover:bg-white/10"
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <h4 className="font-bold text-white">{exercise.name}</h4>
                    <p className="text-xs text-zinc-500 mt-1">{exercise.purpose}</p>
                </div>
                <div className="flex items-center gap-3 text-right">
                    <div>
                        <p className="text-sm font-bold text-cyan-400">{exercise.sets}×{exercise.reps}</p>
                        <p className="text-xs text-zinc-600">სეტი×გამეორება</p>
                    </div>
                    <Icons.ChevronRight size={16} className="text-zinc-600" />
                </div>
            </div>
        </button>
    )
}

const ExerciseDetailView = ({ exercise, onBack }) => {
    const [showVideo, setShowVideo] = useState(false)

    return (
        <div className="space-y-5 animate-fade-in">
            {/* Back button */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-cyan-400 text-sm font-medium"
            >
                <Icons.ChevronLeft size={18} />
                უკან
            </button>

            {/* Exercise header */}
            <div className="text-center">
                <h3 className="text-xl font-black text-white">{exercise.name}</h3>
                <p className="text-sm text-zinc-500 mt-1">{exercise.nameEn}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                <div className="p-4 bg-cyan-500/10 rounded-2xl text-center">
                    <p className="text-2xl font-black text-cyan-400">{exercise.sets}</p>
                    <p className="text-xs text-zinc-500">სეტი</p>
                </div>
                <div className="p-4 bg-purple-500/10 rounded-2xl text-center">
                    <p className="text-xl font-black text-purple-400">{exercise.reps}</p>
                    <p className="text-xs text-zinc-500">გამეორება</p>
                </div>
                <div className="p-4 bg-orange-500/10 rounded-2xl text-center">
                    <p className="text-lg font-bold text-orange-400">🎯</p>
                    <p className="text-xs text-zinc-500">{exercise.purpose}</p>
                </div>
            </div>

            {/* YouTube Video */}
            {exercise.videoId && (
                <div className="space-y-2">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Icons.Play size={14} />
                        ვიდეო ტუტორიალი
                    </h4>

                    {!showVideo ? (
                        <button
                            onClick={() => setShowVideo(true)}
                            className="w-full aspect-video bg-gradient-to-br from-red-600/20 to-red-900/20 rounded-2xl flex items-center justify-center group hover:from-red-600/30 hover:to-red-900/30 transition-all border border-red-500/20"
                        >
                            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-red-600/30">
                                <Icons.Play size={28} className="text-white ml-1" />
                            </div>
                        </button>
                    ) : (
                        <div className="aspect-video rounded-2xl overflow-hidden">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${exercise.videoId}?autoplay=1`}
                                title={exercise.name}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="rounded-2xl"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Instruction */}
            <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Icons.Info size={14} />
                    შესრულების ინსტრუქცია
                </h4>
                <div className="p-4 bg-white/5 rounded-2xl">
                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                        {exercise.instruction}
                    </p>
                </div>
            </div>

            {/* Tips */}
            {exercise.tips && exercise.tips.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Icons.Lightbulb size={14} />
                        რჩევები
                    </h4>
                    <ul className="space-y-2">
                        {exercise.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-zinc-400 p-3 bg-yellow-500/5 rounded-xl">
                                <span className="text-yellow-400 mt-0.5">💡</span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Muscle Groups */}
            {exercise.muscleGroups && (
                <div className="flex flex-wrap gap-2">
                    {exercise.muscleGroups.map((muscle, i) => (
                        <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-xs text-zinc-400">
                            {muscle}
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}

const WorkoutDetailModal = ({ isOpen, onClose, dayName }) => {
    const [selectedExercise, setSelectedExercise] = useState(null)

    if (!isOpen) return null

    // Get workout type for this day
    const workoutType = WORKOUT_SCHEDULE[dayName]
    const workoutPlan = workoutType ? WORKOUT_PLANS[workoutType] : null

    // Special cases: swimming, rest, walking
    const isSwimming = workoutType === 'swimming'
    const isRest = workoutType === 'rest'
    const isWalking = workoutType === 'walking'

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 animate-fade-in">
            <div
                className="glass w-full max-w-md max-h-[90vh] rounded-t-[2rem] animate-slide-up overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/10">
                    <div>
                        <h2 className="text-lg font-bold text-white">
                            {isRest ? 'სრული დასვენება' :
                                isSwimming ? 'ცურვა' :
                                    isWalking ? 'ოჯახური სეირნობა' :
                                        workoutPlan?.title || 'დღის ვარჯიში'}
                        </h2>
                        <p className="text-sm text-zinc-500">{dayName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="touch-target w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-zinc-400"
                    >
                        <Icons.X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5">
                    {selectedExercise ? (
                        <ExerciseDetailView
                            exercise={selectedExercise}
                            onBack={() => setSelectedExercise(null)}
                        />
                    ) : (
                        <div className="space-y-4">
                            {/* Rest Day */}
                            {isRest && (
                                <div className="text-center py-10">
                                    <div className="text-6xl mb-4">😴</div>
                                    <h3 className="text-xl font-bold text-white mb-2">სრული აღდგენა</h3>
                                    <p className="text-zinc-400">
                                        დღეს არ ვარჯიშობ! კუნთებს აღდგენა სჭირდება.
                                    </p>
                                    <ul className="mt-6 space-y-2 text-left max-w-xs mx-auto">
                                        <li className="flex items-center gap-2 text-sm text-zinc-400">
                                            <span className="text-green-400">✓</span> მშვიდი ძილი
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-zinc-400">
                                            <span className="text-green-400">✓</span> მომზადება ახალი კვირისთვის
                                        </li>
                                    </ul>
                                </div>
                            )}

                            {/* Swimming Day */}
                            {isSwimming && (
                                <div className="space-y-4">
                                    <div className="text-center py-6">
                                        <div className="text-5xl mb-3">🏊‍♂️</div>
                                        <h3 className="text-xl font-bold text-white">FitPass ცურვა</h3>
                                    </div>

                                    <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                                        <h4 className="font-bold text-cyan-400 mb-2">ინტენსიური კროლი</h4>
                                        <p className="text-sm text-zinc-400">45 წუთი ინტენსიური ცურვა</p>
                                    </div>

                                    <div className="p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
                                        <div className="flex items-center gap-2 text-yellow-400 font-bold mb-1">
                                            🥽 სათვალე აუცილებელია!
                                        </div>
                                        <p className="text-sm text-zinc-400">თვალების დაცვისთვის</p>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-xs font-bold text-zinc-500 uppercase">რჩევები</h4>
                                        <ul className="space-y-2">
                                            <li className="text-sm text-zinc-400 flex items-start gap-2">
                                                <span className="text-cyan-400">•</span>
                                                გათბობა 5 წუთი ნელი ცურვით
                                            </li>
                                            <li className="text-sm text-zinc-400 flex items-start gap-2">
                                                <span className="text-cyan-400">•</span>
                                                სწორი სუნთქვა: ყოველ 3 მოხვევაზე
                                            </li>
                                            <li className="text-sm text-zinc-400 flex items-start gap-2">
                                                <span className="text-cyan-400">•</span>
                                                ტემპი შეინარჩუნე თანაბარი
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Walking Day */}
                            {isWalking && (
                                <div className="text-center py-10">
                                    <div className="text-6xl mb-4">🚶‍♂️</div>
                                    <h3 className="text-xl font-bold text-white mb-2">ოჯახური სეირნობა</h3>
                                    <p className="text-zinc-400 mb-4">მინიმუმ 5000 ნაბიჯი ოჯახთან ერთად</p>

                                    <div className="p-4 bg-green-500/10 rounded-2xl inline-block">
                                        <p className="text-3xl font-black text-green-400">5000+</p>
                                        <p className="text-xs text-zinc-500">ნაბიჯი</p>
                                    </div>
                                </div>
                            )}

                            {/* Regular Workout */}
                            {workoutPlan && workoutPlan.exercises && (
                                <>
                                    <p className="text-sm text-zinc-500">
                                        დააკლიკე ვარჯიშს დეტალური ინსტრუქციის და ვიდეოსთვის
                                    </p>

                                    <div className="space-y-3">
                                        {workoutPlan.exercises.map((exerciseId, index) => (
                                            <div key={exerciseId} className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <ExerciseCard
                                                        exerciseId={exerciseId}
                                                        onSelect={setSelectedExercise}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!selectedExercise && (
                    <div className="p-5 border-t border-white/10">
                        <button
                            onClick={onClose}
                            className="w-full touch-target py-4 rounded-2xl font-bold bg-white/10 text-white transition-all active:scale-95"
                        >
                            დახურვა
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default WorkoutDetailModal
