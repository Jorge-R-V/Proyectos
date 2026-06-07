import { 
    Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts';

type RegistroCaloriasProps = {
    caloriesConsumed: number
    caloriesBurned: number
    netCalories: number
    totalFat: number
    totalSugar: number
    totalProtein: number
    totalCarbs: number
    totalFiber: number
    totalSodium: number
}

export default function RegistroCalorias({
    caloriesConsumed, 
    caloriesBurned, 
    netCalories, 
    totalFat, 
    totalSugar,
    totalProtein,
    totalCarbs,
    totalFiber,
    totalSodium
} : RegistroCaloriasProps) {

    const macroData = [
        { subject: 'Grasas', A: totalFat, fullMark: 100 },
        { subject: 'Azúcares', A: totalSugar, fullMark: 100 },
        { subject: 'Proteínas', A: totalProtein, fullMark: 100 },
        { subject: 'Carbos', A: totalCarbs, fullMark: 100 },
        { subject: 'Fibra', A: totalFiber, fullMark: 100 },
    ];

    const calorieData = [
        { name: 'Consumo', calorias: caloriesConsumed, fill: '#84cc16' },
        { name: 'Quema', calorias: caloriesBurned, fill: '#f97316' },
        { name: 'Balance', calorias: Math.max(0, netCalories), fill: '#10b981' },
    ];
    
    return (
        <div className="space-y-12">
            <div className="text-center">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                    Visualización <span className="text-lime-600 dark:text-lime-400 not-italic">Premium</span>
                </h2>
                <div className="h-1.5 w-20 bg-lime-500 mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Gráfico de Macronutrientes (Radar) */}
                <div className="card-glass flex flex-col items-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 self-start">Perfil de Macros (g)</p>
                    <div className="w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={macroData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
                                <Radar
                                    name="Macronutrientes"
                                    dataKey="A"
                                    stroke="#65a30d"
                                    fill="#84cc16"
                                    fillOpacity={0.6}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#1e293b', 
                                        borderRadius: '1rem', 
                                        border: 'none', 
                                        color: '#f8fafc',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3)' 
                                    }}
                                    itemStyle={{ color: '#f8fafc', fontSize: '12px' }}
                                    labelStyle={{ display: 'none' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Gráfico de Calorías (Barras) */}
                <div className="card-glass flex flex-col items-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 self-start">Balance Energético (kcal)</p>
                    <div className="w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={calorieData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                <Tooltip 
                                    cursor={{fill: 'rgba(255, 255, 255, 0.05)'}} 
                                    contentStyle={{ 
                                        backgroundColor: '#1e293b', 
                                        borderRadius: '1rem', 
                                        border: 'none', 
                                        color: '#f8fafc',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3)' 
                                    }}
                                    itemStyle={{ color: '#f8fafc' }}
                                    labelStyle={{ color: '#94a3b8', fontWeight: 'bold', marginBottom: '4px' }}
                                />
                                <Bar dataKey="calorias" radius={[10, 10, 0, 0]}>
                                    {calorieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Fichas Resumen Inferiores */}
            <div className="bg-slate-900/95 backdrop-blur-2xl p-10 rounded-[3.5rem] shadow-2xl border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14H11V21L20 10H13Z"/></svg>
                </div>
                
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-10 text-center">Métricas en Tiempo Real</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-white">
                    {[
                        {label: 'Sodio', value: totalSodium, color: 'text-slate-300', unit: 'mg'},
                        {label: 'Balance', value: netCalories, color: 'text-emerald-400 font-black', unit: 'kcal'},
                        {label: 'Quemadas', value: caloriesBurned, color: 'text-orange-400', unit: 'kcal'},
                        {label: 'Consumidas', value: caloriesConsumed, color: 'text-lime-400', unit: 'kcal'},
                        {label: 'Proteínas', value: totalProtein, color: 'text-slate-300', unit: 'g'},
                        {label: 'Carbos', value: totalCarbs, color: 'text-slate-300', unit: 'g'}
                    ].map(nutrient => (
                        <div key={nutrient.label} className="text-center group transition-all hover:translate-y-[-5px]">
                            <span className={`block font-black text-2xl mb-1 ${nutrient.color}`}>
                                {nutrient.value}
                                <span className="text-[9px] ml-0.5 opacity-40 italic">{nutrient.unit}</span>
                            </span>
                            <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">{nutrient.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
