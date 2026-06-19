import { useMemo } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Droplets, Plus, RefreshCcw, Waves } from "lucide-react"
import { useActivity } from "./hooks/useActivity"

const WATER_GOAL = 2000 // ml
const CUP_SIZE = 250 // ml

export default function HydrationTracker() {
    const { waterConsumed, addWater, resetWater } = useActivity()

    const percentage = useMemo(() => {
        return Math.min(100, (waterConsumed / WATER_GOAL) * 100)
    }, [waterConsumed])

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col p-6 overflow-hidden">
            <header className="flex justify-between items-center mb-8">
                <Link to="/calculadora" className="p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                    <ArrowLeft size={18} />
                </Link>
                <div className="flex items-center gap-2">
                    <Droplets className="text-blue-400" size={20} />
                    <h1 className="text-sm font-black uppercase tracking-[0.3em] text-white/50">Hidratación</h1>
                </div>
                <button 
                    onClick={resetWater}
                    className="p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-red-500/20 active:scale-90 transition-all text-white/40"
                >
                    <RefreshCcw size={18} />
                </button>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center relative">
                {/* Círculo de Agua Animado */}
                <div className="relative w-80 h-80 rounded-full border-4 border-white/10 bg-slate-900/50 shadow-[0_0_80px_-20px_rgba(37,99,235,0.4)] overflow-hidden">
                    {/* Ola de agua */}
                    <motion.div 
                        initial={{ top: '100%' }}
                        animate={{ top: `${100 - percentage}%` }}
                        transition={{ type: 'spring', stiffness: 20, damping: 10 }}
                        className="absolute left-[-50%] right-[-50%] bottom-0 bg-gradient-to-t from-blue-700 to-cyan-400 rounded-[40%] animate-spin-slow opacity-80"
                        style={{ height: '200%', width: '200%' }}
                    />
                    
                    {/* Segunda ola para el efecto */}
                    <motion.div 
                        initial={{ top: '100%' }}
                        animate={{ top: `${95 - percentage}%` }}
                        transition={{ type: 'spring', stiffness: 15, damping: 12, delay: 0.1 }}
                        className="absolute left-[-40%] right-[-40%] bottom-0 bg-blue-400/40 rounded-[38%] animate-spin-very-slow"
                        style={{ height: '200%', width: '180%' }}
                    />

                    <div className="relative z-10 flex flex-col items-center justify-center h-full">
                        <span className="text-5xl font-black text-white tracking-tighter shadow-sm">{waterConsumed}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">mililitros</span>
                        <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                            Meta: {WATER_GOAL}ml
                        </div>
                    </div>
                </div>

                {/* Porcentaje flotante */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[180px] font-black text-white/5 pointer-events-none select-none">
                    {Math.round(percentage)}%
                </div>
            </div>

            <footer className="p-6 pb-12 flex flex-col items-center gap-8">
                <div className="text-center">
                    <p className="text-sm font-black text-white/40 uppercase tracking-widest mb-1 italic">
                        {percentage >= 100 ? "¡Objetivo cumplido! 🏅" : "¡Sigue bebiendo! 💪"}
                    </p>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                        Has tomado {Math.round(waterConsumed / CUP_SIZE)} vasos hoy
                    </p>
                </div>

                <div className="flex gap-6">
                    <button 
                        onClick={() => addWater(CUP_SIZE)}
                        className="group flex flex-col items-center gap-3 active:scale-95 transition-all"
                    >
                        <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-600/30 group-hover:bg-blue-500">
                             <Plus size={32} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Vaso (+{CUP_SIZE}ml)</span>
                    </button>

                    <button 
                        onClick={() => addWater(500)}
                        className="group flex flex-col items-center gap-3 active:scale-95 transition-all"
                    >
                        <div className="w-20 h-20 bg-cyan-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-cyan-600/30 group-hover:bg-cyan-500">
                             <Waves size={32} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Botella (+500ml)</span>
                    </button>
                </div>
            </footer>

            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes spin-very-slow {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 10s linear infinite;
                }
                .animate-spin-very-slow {
                    animation: spin-very-slow 15s linear infinite;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    )
}
