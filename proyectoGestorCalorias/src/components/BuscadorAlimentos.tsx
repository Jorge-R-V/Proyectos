import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Camera, Loader2, Info, Clock, Trash2, BrainCircuit } from 'lucide-react'
import { searchFoods, type SuggestedFood } from '../services/nutritionApi'

type BuscadorAlimentosProps = {
    onSelectFood: (food: SuggestedFood) => void;
    onOpenScanner: () => void;
}

export default function BuscadorAlimentos({ onSelectFood, onOpenScanner }: BuscadorAlimentosProps) {
    const navigate = useNavigate()
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SuggestedFood[]>([])
    const [loading, setLoading] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [recentFoods, setRecentFoods] = useState<SuggestedFood[]>(() => {
        const stored = localStorage.getItem('nutritrack-recent-foods')
        return stored ? JSON.parse(stored) : []
    })

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (query.trim().length >= 3) {
                setLoading(true)
                const foods = await searchFoods(query)
                setResults(foods)
                setLoading(false)
                setShowSuggestions(true)
            } else {
                setResults([])
                // Si la query es vacía, mostramos los recientes si existen
                if (query.trim().length === 0) {
                    setShowSuggestions(true)
                } else {
                    setShowSuggestions(false)
                }
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [query])

    const addToHistory = (food: SuggestedFood) => {
        const filtered = recentFoods.filter(f => f.id !== food.id)
        const updated = [food, ...filtered].slice(0, 5)
        setRecentFoods(updated)
        localStorage.setItem('nutritrack-recent-foods', JSON.stringify(updated))
    }

    const clearHistory = (e: React.MouseEvent) => {
        e.stopPropagation()
        setRecentFoods([])
        localStorage.removeItem('nutritrack-recent-foods')
    }

    return (
        <div className="relative w-full">
            <div className="relative group">
                <input 
                    type="text"
                    placeholder="Busca un alimento o marca... (ej: Pollo, Oreo)"
                    className="input-field pl-12 pr-24 border-2 border-slate-100 dark:border-slate-800 focus:border-lime-500/50 transition-all font-bold"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lime-500 transition-colors" size={20} />
                
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {loading && <Loader2 className="animate-spin text-lime-600 mr-2" size={16} />}
                    
                    <button 
                        type="button"
                        onClick={() => navigate('/camara')}
                        className="p-2.5 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-white/5"
                    >
                        <BrainCircuit size={14} className="text-lime-400" />
                        <span className="hidden lg:inline">Cámara IA</span>
                    </button>

                    <button 
                        type="button"
                        onClick={onOpenScanner}
                        className="p-2.5 bg-lime-500 hover:bg-lime-600 text-white rounded-xl shadow-lg shadow-lime-500/20 transition-all active:scale-95 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                    >
                        <Camera size={14} />
                        <span className="hidden md:inline">Escanear</span>
                    </button>
                </div>
            </div>

            {showSuggestions && (query.trim().length >= 3 ? results.length > 0 : recentFoods.length > 0) && (
                <div className="absolute top-16 left-0 right-0 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                            {query.trim().length === 0 ? <Clock size={12} className="text-lime-500" /> : <Search size={12} className="text-lime-500" />}
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                {query.trim().length === 0 ? 'Búsquedas Recientes' : `Sugerencias Inteligentes (${results.length})`}
                            </span>
                        </div>
                        {query.trim().length === 0 && recentFoods.length > 0 && (
                            <button onClick={clearHistory} className="text-[9px] font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1">
                                <Trash2 size={10} /> Limpiar
                            </button>
                        )}
                        <Info size={12} className="text-slate-300" />
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                        {(query.trim().length >= 3 ? results : recentFoods).map((food) => (
                            <button
                                key={food.id}
                                type="button"
                                onClick={() => {
                                    onSelectFood(food)
                                    addToHistory(food)
                                    setShowSuggestions(false)
                                    setQuery('')
                                }}
                                className="w-full p-4 flex items-center gap-4 hover:bg-lime-50 dark:hover:bg-lime-500/5 transition-all text-left border-b border-slate-50 dark:border-slate-700 last:border-0 group"
                            >
                                {food.image ? (
                                    <img src={food.image} alt={food.name} className="w-10 h-10 object-cover rounded-lg shadow-sm" />
                                ) : (
                                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-lime-100 dark:group-hover:bg-lime-500/20 transition-all">
                                        <Search size={14} />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h4 className="text-sm font-black text-slate-800 dark:text-white capitalize line-clamp-1">{food.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[9px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 uppercase font-bold">{food.source}</span>
                                        <p className="text-[10px] text-slate-400 truncate">{food.brand}</p>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <span className="text-xs font-black text-lime-600 dark:text-lime-400">{Math.round(food.calories)} kcal</span>
                                    <span className="text-[8px] text-slate-400 uppercase font-bold">Por 100g</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            {loading && query.length >= 3 && (
                <div className="absolute top-16 left-0 right-0 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl text-center z-50 animate-in fade-in duration-300">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-lime-600" size={32} />
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Buscando en bases de datos...</p>
                    </div>
                </div>
            )}

            {showSuggestions && results.length === 0 && query.length >= 3 && !loading && (
                <div className="absolute top-16 left-0 right-0 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl text-center z-50 animate-in fade-in duration-300">
                    <p className="text-slate-400 text-sm italic font-medium">No hemos encontrado nada para "{query}". Prueba con otra cosa o regístralo manualmente abajo.</p>
                </div>
            )}
        </div>
    )
}
