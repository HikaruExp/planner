import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

const LoginScreen = () => {
    const { signIn, error } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        await signIn(email, password)

        setLoading(false)
    }

    return (
        <div className="min-h-[100dvh] flex flex-col items-center justify-center p-8 relative overflow-hidden">
            {/* Background gradients */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="animate-pulse-slow absolute top-[-10%] left-[-20%] w-[100%] h-[50%] bg-cyan-900/20 blur-[120px] rounded-full" />
                <div className="animate-pulse-slow absolute bottom-[-10%] right-[-20%] w-[100%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full" />
            </div>

            {/* Logo / Title */}
            <div className="mb-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30">
                    <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-white mb-2">პლანერი</h1>
                <p className="text-zinc-500 text-sm font-medium">პირადი რუტინის მართვა</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
                <div className="glass rounded-3xl p-8 neo-shadow">
                    {/* Email Input */}
                    <div className="mb-4">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3">
                            ელ-ფოსტა
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@example.com"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-lg font-medium"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3">
                            პაროლი
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="შეიყვანე პაროლი"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-lg font-medium"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                            <p className="text-red-400 text-sm font-medium text-center">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !password || !email}
                        className="w-full touch-target bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:scale-100 active:scale-95 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                იტვირთება...
                            </span>
                        ) : (
                            'შესვლა'
                        )}
                    </button>
                </div>

                <p className="text-center text-zinc-600 text-xs mt-6">
                    Supabase ანგარიში საჭიროა შესასვლელად
                </p>
            </form>
        </div>
    )
}

export default LoginScreen
