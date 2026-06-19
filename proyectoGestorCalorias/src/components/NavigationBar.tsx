import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { LayoutDashboard, Camera, TrendingUp, BrainCircuit, Droplets } from "lucide-react"

const NAV_ITEMS = [
    { path: '/calculadora', icon: LayoutDashboard, label: 'Hoy' },
    { path: '/camara', icon: Camera, label: 'IA Scan' },
    { path: '/analisis', icon: TrendingUp, label: 'Análisis' },
    { path: '/asistente', icon: BrainCircuit, label: 'Coach' },
    { path: '/hidratacion', icon: Droplets, label: 'Agua' }
]

export default function NavigationBar() {
    const location = useLocation()

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pointer-events-none">
            <div className="max-w-md mx-auto bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-2 flex justify-between items-center shadow-2xl pointer-events-auto">
                {NAV_ITEMS.map((item) => {
                    const isActive = location.pathname === item.path
                    const Icon = item.icon

                    return (
                        <Link 
                            key={item.path}
                            to={item.path}
                            className="relative flex-1 flex flex-col items-center py-3 group"
                        >
                            {isActive && (
                                <motion.div 
                                    layoutId="nav-active"
                                    className="absolute inset-0 bg-lime-500/10 rounded-2xl mx-1"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <Icon 
                                size={20} 
                                className={`transition-all duration-300 ${
                                    isActive ? 'text-lime-500 scale-110' : 'text-white/40 group-hover:text-white/60'
                                }`}
                            />
                            <span className={`text-[9px] font-black uppercase tracking-tighter mt-1 transition-all ${
                                isActive ? 'text-lime-400 opacity-100' : 'text-white/20 opacity-0 group-hover:opacity-40'
                            }`}>
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
