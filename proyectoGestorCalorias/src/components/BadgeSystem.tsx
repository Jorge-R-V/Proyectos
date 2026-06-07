import { useEffect, useState, useMemo } from 'react'
import { Trophy, Droplets, Zap, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type BadgeSystemProps = {
    totalProtein: number
    totalSugar: number
    caloriesBurned: number
}

type Badge = {
    id: string
    name: string
    desc: string
    isAchieved: boolean
    icon: React.ReactNode
    color: string
}

export default function BadgeSystem({ totalProtein, totalSugar, caloriesBurned }: BadgeSystemProps) {
    const [waterMl, setWaterMl] = useState(0)

    // Leer agua del día (mismo localStorage que ContadorAgua)
    useEffect(() => {
        const checkWater = () => {
            const today = new Date().toISOString().split('T')[0]
            const stored = localStorage.getItem(`nutritrack-water-ml-${today}`)
            setWaterMl(stored ? parseInt(stored) : 0)
        }
        
        checkWater()
        // Escuchar cambios de storage para actualizar en tiempo real
        window.addEventListener('storage', checkWater)
        return () => window.removeEventListener('storage', checkWater)
    }, [])

    const badges = useMemo<Badge[]>(() => [
        {
            id: 'water',
            name: 'Hidratación Top',
            desc: 'Alcanzado 2L de agua hoy',
            isAchieved: waterMl >= 2000,
            icon: <Droplets className="w-5 h-5" />,
            color: 'bg-blue-500'
        },
        {
            id: 'protein',
            name: 'Músculos Pro',
            desc: 'Superado el mínimo de proteína (60g)',
            isAchieved: totalProtein >= 60,
            icon: <ShieldCheck className="w-5 h-5" />,
            color: 'bg-lime-500'
        },
        {
            id: 'active',
            name: 'Motor en Marcha',
            desc: 'Quemado más de 400 kcal',
            isAchieved: caloriesBurned >= 400,
            icon: <Zap className="w-5 h-5" />,
            color: 'bg-amber-400'
        },
        {
            id: 'sugar',
            name: 'Día Limpio',
            desc: 'Manteniendo el azúcar bajo (<25g)',
            isAchieved: totalSugar > 0 && totalSugar < 25,
            icon: <Trophy className="w-5 h-5" />,
            color: 'bg-purple-500'
        }
    ], [waterMl, totalProtein, totalSugar, caloriesBurned])

    const achievedCount = badges.filter(b => b.isAchieved).length

    if (achievedCount === 0) return null

    return (
        <div className="card-glass space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Logros Comunitarios</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Has desbloqueado {achievedCount} medallas hoy</p>
                </div>
                <div className="p-2 bg-yellow-400/10 rounded-full">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <AnimatePresence>
                    {badges.map((badge) => badge.isAchieved && (
                        <motion.div 
                            key={badge.id}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            whileHover={{ y: -5 }}
                            className="flex flex-col items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 transition-all hover:shadow-lg hover:border-lime-500/30"
                        >
                            <div className={`p-3 rounded-2xl ${badge.color} text-white shadow-lg ${badge.color.replace('bg-', 'shadow-')}/20`}>
                                {badge.icon}
                            </div>
                            <div className="text-center">
                                <p className="text-[9px] font-black uppercase tracking-tight text-slate-800 dark:text-white">{badge.name}</p>
                                <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Conseguido</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
}
