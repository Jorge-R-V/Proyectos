import { useMemo } from 'react'
import { Sparkles, BrainCircuit, Apple, Zap, Droplets, Info } from 'lucide-react'
import { motion } from 'framer-motion'

type ConsejosIAProps = {
    totalProtein: number
    totalFiber: number
    totalSugar: number
    netCalories: number
    caloriesBurned: number
    waterConsumed: number
}

import { Link } from 'react-router-dom'

export default function ConsejosIA({ totalProtein, totalFiber, totalSugar, netCalories, caloriesBurned, waterConsumed }: ConsejosIAProps) {
    
    const advice = useMemo(() => {
        const suggestions = []

        if(totalProtein > 0 && totalProtein < 40) {
            suggestions.push({
                id: 'protein',
                text: "Tu cuerpo necesita reparación. Hoy vas bajo de proteína. ¿Qué tal un poco de pollo, huevos o tofu para compensar?",
                icon: <Zap className="w-5 h-5 text-lime-500" />
            })
        }

        if(totalFiber > 0 && totalFiber < 15) {
            suggestions.push({
                id: 'fiber',
                text: "Mejora tu digestión hoy. Prueba con una pieza de fruta con piel o una ensalada de legumbres.",
                icon: <Apple className="w-5 h-5 text-emerald-500" />
            })
        }

        if(totalSugar > 40) {
            const isDehydrated = waterConsumed < 1500
            suggestions.push({
                id: 'sugar',
                text: isDehydrated 
                    ? "Ojo con el azúcar. Hoy has tomado bastante y apenas has bebido agua. ¡Es urgente que te hidrates para compensar!" 
                    : "Ojo con el azúcar. Hoy has tomado bastante. Prioriza beber solo agua las próximas horas.",
                icon: <Droplets className="w-5 h-5 text-blue-500" />
            })
        }

        if(caloriesBurned > 600 && netCalories < 1000) {
            suggestions.push({
                id: 'burn',
                text: "Has tenido un entrenamiento potente hoy. Asegúrate de comer algo denso en nutrientes para recuperar energías.",
                icon: <BrainCircuit className="w-5 h-5 text-purple-500" />
            })
        }

        if(suggestions.length === 0 && netCalories > 0) {
            suggestions.push({
                id: 'ready',
                text: "¡Vas genial! Estás manteniendo un balance nutricional sólido. Sigue así y no olvides beber agua.",
                icon: <Sparkles className="w-5 h-5 text-yellow-500" />
            })
        }

        return suggestions
    }, [totalProtein, totalFiber, totalSugar, netCalories, caloriesBurned, waterConsumed])

    if (advice.length === 0) return null

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-glass relative overflow-hidden group bg-gradient-to-br from-slate-900 to-lime-950 border-lime-500/10 shadow-2xl shadow-lime-900/10"
        >
            <div className="absolute top-0 right-0 p-8 -mr-8 -mt-8 bg-lime-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>

            <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-lime-500 rounded-2xl text-white shadow-lg shadow-lime-500/20">
                            <Sparkles size={24} className="animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">IA NutriTrack</h3>
                            <p className="text-[10px] font-bold text-lime-400 uppercase tracking-widest mt-0.5">Asistente Proactivo</p>
                        </div>
                    </div>
                    <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center">
                            <Info size={12} className="text-slate-400" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {advice.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="shrink-0 p-3 bg-white/5 rounded-2xl border border-white/5 h-fit shadow-inner">
                                {item.icon}
                            </div>
                            <p className="text-sm font-medium text-slate-200 leading-relaxed pt-1">
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Analizando registros en tiempo real</p>
                    <Link 
                        to="/asistente" 
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-lime-500 hover:text-lime-400 transition-colors group/btn"
                    >
                        <span>Consultar con Nutri-Coach</span>
                        <BrainCircuit size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}
