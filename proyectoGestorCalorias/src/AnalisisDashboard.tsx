import { useMemo } from "react"
import { Link } from "react-router-dom"
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import { motion } from "framer-motion"
import { ArrowLeft, TrendingUp, Activity as ActivityIcon, PieChart as PieIcon } from "lucide-react"
import { useActivity } from "./hooks/useActivity"

const COLORS = ['#2563eb', '#f59e0b', '#fb7185']
const DAILY_GOALS = { calories: 2000, protein: 120 }

export default function AnalisisDashboard() {
    const { activities } = useActivity()

    // --- PROCESAMIENTO DE DATOS ---
    const last7DaysData = useMemo(() => {
        const data = []
        const now = new Date()
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date()
            date.setDate(now.getDate() - i)
            const dateStr = date.toLocaleDateString('es-ES', { weekday: 'short' })
            const dayStart = new Date(date).setHours(0,0,0,0)
            const dayEnd = new Date(date).setHours(23,59,59,999)

            const dayActivities = activities.filter(a => a.timestamp && a.timestamp >= dayStart && a.timestamp <= dayEnd)
            
            const calories = dayActivities.reduce((acc, a) => a.category === 1 ? acc + a.calories : acc, 0)
            const protein = dayActivities.reduce((acc, a) => a.category === 1 ? acc + (a.protein || 0) : acc, 0)

            data.push({
                name: dateStr,
                calorias: Math.round(calories),
                proteina: Math.round(protein),
                objetivo: DAILY_GOALS.calories
            })
        }
        return data
    }, [activities])

    const macroDistribution = useMemo(() => {
        const today = new Date().setHours(0,0,0,0)
        const todayActivities = activities.filter(a => a.timestamp && a.timestamp >= today)
        
        const protein = todayActivities.reduce((acc, a) => acc + (a.protein || 0), 0)
        const carbs = todayActivities.reduce((acc, a) => acc + (a.carbs || 0), 0)
        const fat = todayActivities.reduce((acc, a) => acc + (a.fat || 0), 0)

        const totalValue = (protein * 4) + (carbs * 4) + (fat * 9)
        if (totalValue === 0) return []

        return [
            { name: 'Proteína', value: protein * 4 },
            { name: 'Carbos', value: carbs * 4 },
            { name: 'Grasas', value: fat * 9 }
        ]
    }, [activities])

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 pb-24">
            <header className="flex justify-between items-center mb-10">
                <Link to="/calculadora" className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/10">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-xl font-black uppercase tracking-widest text-lime-500">Dashboard Nutricional</h1>
                <div className="w-10" />
            </header>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Gráfico 1: Calorías Semanales */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 shadow-2xl"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-orange-500/20 text-orange-400 rounded-xl">
                            <TrendingUp size={18} />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-white/80">Calorías (7 Días)</h2>
                    </div>
                    
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={last7DaysData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '16px', fontSize: '12px' }}
                                    itemStyle={{ color: '#84cc16' }}
                                />
                                <Bar dataKey="calorias" fill="#84cc16" radius={[4, 4, 0, 0]} barSize={25} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Gráfico 2: Evolución Proteína */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 shadow-2xl"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
                            <ActivityIcon size={18} />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-white/80">Proteína (Meta {DAILY_GOALS.protein}g)</h2>
                    </div>
                    
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={last7DaysData}>
                                <defs>
                                    <linearGradient id="colorProtein" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '16px', fontSize: '12px' }}
                                />
                                <Area type="monotone" dataKey="proteina" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorProtein)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Gráfico 3: Distribución de Macros */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 shadow-2xl md:col-span-2"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl">
                            <PieIcon size={18} />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-white/80">Distribución de Energía (Hoy)</h2>
                    </div>
                    
                    {macroDistribution.length > 0 ? (
                        <div className="flex flex-col md:flex-row items-center justify-around">
                            <div className="h-64 w-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={macroDistribution}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {macroDistribution.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4 w-full md:w-auto mt-6 md:mt-0 px-6">
                                {macroDistribution.map((macro, i) => (
                                    <div key={macro.name} className="flex items-center justify-between gap-10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                            <span className="text-xs font-bold text-white/60 uppercase">{macro.name}</span>
                                        </div>
                                        <span className="text-sm font-black text-white">{Math.round(macro.value)} Kcal</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-white/20">
                            <PieIcon size={48} className="mb-4 opacity-10" />
                            <p className="text-sm font-black uppercase tracking-tighter">Sin datos de macros hoy</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
