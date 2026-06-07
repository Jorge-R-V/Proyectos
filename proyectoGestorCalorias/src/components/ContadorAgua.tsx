import { useState, useEffect } from 'react'
import { Droplets, Plus, Minus, Info, Settings2, Check } from 'lucide-react'

export default function ContadorAgua() {
    // Ahora 'water' representa mililitros (ml) totales
    const [water, setWater] = useState(() => {
        const today = new Date().toISOString().split('T')[0]
        const stored = localStorage.getItem(`nutritrack-water-ml-${today}`)
        return stored ? parseInt(stored) : 0
    })
    const [isCustomMode, setIsCustomMode] = useState(false)
    const [customValue, setCustomValue] = useState('')
    const [inputUnit, setInputUnit] = useState<'vasos' | 'litros'>('vasos')

    const glassSizeMl = 250
    const dailyGoalMl = 2000 // 8 vasos de 250ml = 2000ml (2L)
    const totalLitres = water / 1000
    const totalGlasses = water / glassSizeMl

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0]
        localStorage.setItem(`nutritrack-water-ml-${today}`, water.toString())
    }, [water])

    const percentage = Math.min((water / dailyGoalMl) * 100, 100)

    const handleCustomSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const val = parseFloat(customValue)
        if (!isNaN(val) && val >= 0) {
            if (inputUnit === 'litros') {
                setWater(val * 1000)
            } else {
                setWater(val * glassSizeMl)
            }
            setIsCustomMode(false)
            setCustomValue('')
        }
    }

    return (
        <div className="card-glass relative overflow-hidden group">
            {/* Fondo Animado con Ondas */}
            <div 
                className="absolute bottom-0 left-0 right-0 bg-blue-500/5 dark:bg-blue-500/10 transition-all duration-1000 ease-in-out"
                style={{ height: `${percentage}%` }}
            />

            <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-50 dark:bg-blue-500/20 rounded-2xl text-blue-600 dark:text-blue-400 font-black">
                            <Droplets size={24} className={water > 0 ? 'animate-bounce' : ''} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Hidratación</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{totalGlasses.toFixed(1)} vasos</p>
                                <span className="text-slate-300">•</span>
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{totalLitres.toFixed(2)} Litros</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex items-baseline">
                            <span className="text-3xl font-black text-blue-600 dark:text-blue-400">{totalLitres.toFixed(1)}</span>
                            <span className="text-slate-300 dark:text-slate-600 font-bold text-sm ml-1">L</span>
                        </div>
                        <button 
                            onClick={() => setIsCustomMode(!isCustomMode)}
                            className="p-1 text-slate-300 hover:text-blue-500 transition-colors"
                            title="Editar manualmente"
                        >
                            <Settings2 size={12} />
                        </button>
                    </div>
                </div>

                {/* Barra de Progreso Visual */}
                <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1 shadow-inner">
                    <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                {isCustomMode ? (
                    <form onSubmit={handleCustomSubmit} className="space-y-3 animate-in slide-in-from-bottom-2 duration-300">
                        <div className="flex bg-slate-50 dark:bg-slate-900 rounded-xl p-1 border border-slate-100 dark:border-slate-800">
                            <button 
                                type="button"
                                onClick={() => setInputUnit('vasos')}
                                className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${inputUnit === 'vasos' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400'}`}
                            >
                                Vasos
                            </button>
                            <button 
                                type="button"
                                onClick={() => setInputUnit('litros')}
                                className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${inputUnit === 'litros' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400'}`}
                            >
                                Litros
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <input 
                                type="number"
                                step="0.01"
                                placeholder={inputUnit === 'litros' ? "Cant. Litros..." : "Nº vasos..."}
                                className="input-field !p-3 !text-xs font-bold"
                                value={customValue}
                                onChange={(e) => setCustomValue(e.target.value)}
                                autoFocus
                            />
                            <button type="submit" className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
                                <Check size={18} />
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setWater(Math.max(0, water - glassSizeMl))}
                            className="flex-1 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-red-500 hover:border-red-100 dark:hover:border-red-900 transition-all rounded-2xl flex justify-center active:scale-95"
                        >
                            <Minus size={20} />
                        </button>
                        <button 
                            onClick={() => setWater(water + glassSizeMl)}
                            className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 transition-all rounded-2xl flex items-center justify-center gap-2 active:scale-95 group/btn"
                        >
                            <Plus size={20} className="group-hover/btn:rotate-90 transition-transform" />
                            <span className="text-xs font-black uppercase tracking-widest">Añadir Vaso</span>
                        </button>
                    </div>
                )}

                <div className="pt-2 flex items-center gap-2 opacity-60">
                    <Info size={12} className="text-slate-400" />
                    <p className="text-[9px] text-slate-400 font-medium">Ahora con precisión milimétrica. Objetivo: {(dailyGoalMl/1000).toFixed(1)}L diarios.</p>
                </div>
            </div>
        </div>
    )
}
