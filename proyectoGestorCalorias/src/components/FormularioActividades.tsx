import { useState, type ChangeEvent, type FormEvent } from "react"
import { toast } from 'react-hot-toast'
import { Search, Info } from 'lucide-react'
import type { Activity } from "../types"
import { categories } from "../data/categories"
import { products } from "../data/products"
import BuscadorAlimentos from './BuscadorAlimentos'
import LectorCodigoBarras from './LectorCodigoBarras'
import { getFoodByBarcode, type SuggestedFood } from '../services/nutritionApi'

type FormularioActividadesProps = {
    saveActivity: (activity: Activity) => void
    activeId: Activity['id']
    activities: Activity[]
}

const MacroBar = ({ label, value, max, color, unit }: { label: string, value: number, max: number, color: string, unit: string }) => {
    const percentage = Math.min((value / max) * 100, 100)
    return (
        <div className="space-y-1">
            <div className="flex justify-between items-end">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</span>
                <span className={`text-[10px] font-bold ${color.replace('bg-', 'text-')}`}>{value}{unit}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                    className={`h-full ${color} transition-all duration-500 ease-out rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
}

// Estado inicial del formulario vacío
const initialState : Activity = {
    id: '',
    category: 1,
    name: '',
    calories: 0,
    fat: 0,
    sugar: 0,
    protein: 0,
    carbs: 0,
    fiber: 0,
    sodium: 0,
    quantity: 1,
    unit: 'unid'
}

export default function FormularioActividades({saveActivity, activeId, activities} : FormularioActividadesProps) {

    // Inicializa el estado 'activity'
    const [activity, setActivity] = useState<Activity>(() => {
        if (activeId) {
            return activities.find(stateActivity => stateActivity.id === activeId)!
        }
        const params = new URLSearchParams(window.location.search)
        const categoryParam = params.get('category')
        if (categoryParam && (categoryParam === '1' || categoryParam === '2')) {
            return { ...initialState, category: +categoryParam }
        }
        return initialState
    })

    const [isScannerOpen, setIsScannerOpen] = useState(false)

    const [baseNutrients, setBaseNutrients] = useState({
        calories: activity.calories / (activity.quantity || 1),
        fat: activity.fat / (activity.quantity || 1),
        sugar: activity.sugar / (activity.quantity || 1),
        protein: activity.protein / (activity.quantity || 1),
        carbs: activity.carbs / (activity.quantity || 1),
        fiber: activity.fiber / (activity.quantity || 1),
        sodium: activity.sodium / (activity.quantity || 1),
    })

    // Maneja los cambios en los inputs del formulario
    const handleChange = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
        const id = e.target.id
        const value = e.target.value
        const isNumberField = ['category', 'calories', 'fat', 'sugar', 'quantity', 'protein', 'carbs', 'fiber', 'sodium'].includes(id)

        if (id === 'quantity' && activity.category === 1) {
            const newQuantity = +value
            if (newQuantity <= 0) {
                setActivity({ ...activity, quantity: newQuantity })
                return
            }
            setActivity({
                ...activity,
                quantity: newQuantity,
                calories: Number((baseNutrients.calories * newQuantity).toFixed(2)),
                fat: Number((baseNutrients.fat * newQuantity).toFixed(2)),
                sugar: Number((baseNutrients.sugar * newQuantity).toFixed(2)),
                protein: Number((baseNutrients.protein * newQuantity).toFixed(2)),
                carbs: Number((baseNutrients.carbs * newQuantity).toFixed(2)),
                fiber: Number((baseNutrients.fiber * newQuantity).toFixed(2)),
                sodium: Number((baseNutrients.sodium * newQuantity).toFixed(2)),
            })
            return
        }

        const newValue = isNumberField ? +value : value

        if (['calories', 'fat', 'sugar', 'protein', 'carbs', 'fiber', 'sodium'].includes(id) && activity.category === 1) {
            const qty = activity.quantity || 1
            setBaseNutrients({ ...baseNutrients, [id]: +value / qty })
        }

        setActivity({ ...activity, [id]: newValue })
    }

    const handleProductSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        if(e.target.value === 'manual') {
            const resetActivity = { ...initialState, category: activity.category, id: activity.id }
            setActivity(resetActivity)
            setBaseNutrients({ calories: 0, fat: 0, sugar: 0, protein: 0, carbs: 0, fiber: 0, sodium: 0 })
            return
        }
        const selectedProd = products.find(p => p.name === e.target.value)
        if(selectedProd) {
            setActivity({
                ...activity,
                name: selectedProd.name,
                calories: selectedProd.calories,
                fat: selectedProd.fat,
                sugar: selectedProd.sugar,
                protein: selectedProd.protein,
                carbs: selectedProd.carbs,
                fiber: selectedProd.fiber,
                sodium: selectedProd.sodium,
                quantity: selectedProd.quantity,
                unit: selectedProd.unit
            })
            setBaseNutrients({
                calories: selectedProd.calories / (selectedProd.quantity || 1),
                fat: selectedProd.fat / (selectedProd.quantity || 1),
                sugar: selectedProd.sugar / (selectedProd.quantity || 1),
                protein: selectedProd.protein / (selectedProd.quantity || 1),
                carbs: selectedProd.carbs / (selectedProd.quantity || 1),
                fiber: selectedProd.fiber / (selectedProd.quantity || 1),
                sodium: selectedProd.sodium / (selectedProd.quantity || 1)
            })
        }
    }

    const handleSelectFood = (food: SuggestedFood) => {
        setActivity({
            ...activity,
            name: food.name,
            calories: Math.round(food.calories),
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            sugar: food.sugar,
            sodium: food.sodium,
            fiber: food.fiber
        })
        setBaseNutrients({
            calories: food.calories / 1,
            protein: food.protein / 1,
            carbs: food.carbs / 1,
            fat: food.fat / 1,
            sugar: food.sugar / 1,
            sodium: food.sodium / 1,
            fiber: food.fiber / 1
        })
        toast.success(`Alimento cargado: ${food.name}`, {
            icon: '🍏',
            style: { borderRadius: '1rem', background: '#0f172a', color: '#fff' }
        })
    }

    const handleScanSuccess = async (barcode: string) => {
        setIsScannerOpen(false)
        const toastId = toast.loading('Buscando producto...', { 
            style: { borderRadius: '1rem', background: '#0f172a', color: '#fff' } 
        })
        const food = await getFoodByBarcode(barcode)
        if (food) {
            handleSelectFood(food)
            toast.success('¡Producto encontrado!', { id: toastId })
        } else {
            toast.error('Producto no encontrado en la base de datos', { id: toastId })
        }
    }

    const isValidActivity = () => {
        const { name, calories } = activity
        return name.trim() !== '' && calories > 0
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        saveActivity(activity)
        setActivity({ ...initialState, category: activity.category })
        setBaseNutrients({ calories: 0, fat: 0, sugar: 0, protein: 0, carbs: 0, fiber: 0, sodium: 0 })
    }

    return (
        <>
            {isScannerOpen && (
                <LectorCodigoBarras 
                    onScanSuccess={handleScanSuccess} 
                    onClose={() => setIsScannerOpen(false)} 
                />
            )}

            <form className="card-glass space-y-8" onSubmit={handleSubmit}>
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white uppercase italic">
                        Registrar <span className="text-lime-500 not-italic">Actividad</span>
                    </h2>
                    <p className="text-slate-400 text-sm mt-2">Dinos qué has comido o cuánto has entrenado hoy.</p>
                </div>

                {activity.category === 1 && (
                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <label className="label-uppercase flex items-center gap-2">
                                <Search size={12} className="text-lime-500" />
                                Búsqueda Inteligente
                            </label>
                            <span className="text-[9px] bg-lime-100 dark:bg-lime-500/20 text-lime-600 dark:text-lime-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Nuevo</span>
                        </div>
                        <BuscadorAlimentos 
                            onSelectFood={handleSelectFood} 
                            onOpenScanner={() => setIsScannerOpen(true)} 
                        />
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                            <Info size={12} className="text-slate-400" />
                            <p className="text-[10px] text-slate-400 font-medium">Busca por nombre o marca para autocompletar el formulario.</p>
                        </div>

                        {/* Visualizador de Macros Dinámico */}
                        <div className="grid grid-cols-3 gap-4 pt-4 animate-in fade-in duration-500">
                            <MacroBar label="Proteína" value={activity.protein} max={50} color="bg-lime-500" unit="g" />
                            <MacroBar label="Carbos" value={activity.carbs} max={100} color="bg-amber-400" unit="g" />
                            <MacroBar label="Grasas" value={activity.fat} max={40} color="bg-rose-400" unit="g" />
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                    <label htmlFor="category" className="label-uppercase">Categoría</label>
                    <div className="flex p-1 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
                        {categories.map(category => (
                            <button
                                type="button"
                                key={category.id}
                                onClick={() => setActivity({...activity, category: category.id})}
                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                                    activity.category === category.id 
                                    ? 'bg-white dark:bg-lime-500 text-slate-900 dark:text-white shadow-sm' 
                                    : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 bg-transparent'
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div key={activity.category} className="space-y-8 animate-switch">
                    <div className="grid grid-cols-1 gap-4">
                        <label htmlFor="product-hint" className="label-uppercase">
                            {activity.category === 1 ? 'Seleccionar Alimento' : 'Seleccionar Ejercicio'}
                        </label>
                        <div className="relative group">
                            <select 
                                id="product-hint"
                                className="input-field appearance-none cursor-pointer"
                                onChange={handleProductSelect}
                                value=""
                            >
                                <option value="" disabled>-- Selecciona del catálogo --</option>
                                {products
                                    .filter(p => p.category === activity.category)
                                    .map(p => (
                                        <option key={p.name} value={p.name}>{p.name}</option>
                                    ))
                                }
                                <option disabled>──────────</option>
                                <option value="manual">+ Otros / Entrada Manual</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                                <Search size={20} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <label htmlFor="name" className="label-uppercase">
                            {activity.category === 1 ? 'Alimento (o Marca)' : 'Actividad'}
                        </label>
                        <input id="name" type="text" className="input-field" placeholder={activity.category === 1 ? 'Ej. Manzana, Tostadas...' : 'Ej. Correr, Natación...'} value={activity.name} onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {activity.category === 1 && (
                            <div className="grid grid-cols-1 gap-4">
                                <label htmlFor="quantity" className="label-uppercase">Cantidad</label>
                                <div className="relative group/qty">
                                    <input 
                                        id="quantity" 
                                        type="number" 
                                        className="input-field text-slate-800 dark:text-white font-bold pr-20" 
                                        value={activity.quantity} 
                                        onChange={handleChange} 
                                        min="1" 
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700">
                                        {['g', 'ml'].map((u) => (
                                            <button
                                                key={u}
                                                type="button"
                                                onClick={() => setActivity({ ...activity, unit: u })}
                                                className={`px-2 py-1 text-[9px] font-black uppercase tracking-tighter rounded-lg transition-all ${
                                                    activity.unit === u 
                                                    ? 'bg-white dark:bg-slate-700 text-lime-600 dark:text-lime-400 shadow-sm' 
                                                    : 'text-slate-400 hover:text-slate-600'
                                                }`}
                                            >
                                                {u}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-1 gap-4">
                            <label htmlFor="calories" className="label-uppercase">{activity.category === 1 ? 'Calorías Totales' : 'Calorías Quemadas'}</label>
                            <input id="calories" type="number" className="input-field font-bold" value={activity.calories} onChange={handleChange} />
                        </div>
                    </div>

                    {activity.category === 1 && (
                        <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Desglose Nutricional (por porción)</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {[
                                    {id: 'fat', label: 'Grasas', unit: 'g'},
                                    {id: 'sugar', label: 'Azúcares', unit: 'g'},
                                    {id: 'protein', label: 'Proteínas', unit: 'g'},
                                    {id: 'carbs', label: 'Carbos', unit: 'g'},
                                    {id: 'fiber', label: 'Fibra', unit: 'g'},
                                    {id: 'sodium', label: 'Sodio', unit: 'mg'}
                                ].map(nutrient => (
                                    <div key={nutrient.id} className="grid grid-cols-1 gap-2">
                                        <label htmlFor={nutrient.id} className="label-uppercase !ml-1 !text-[10px]">{nutrient.label}</label>
                                        <div className="relative">
                                            <input id={nutrient.id} type="number" className="input-field !p-3 pr-8 !text-sm" value={activity[nutrient.id as keyof Activity]} onChange={handleChange} />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300 uppercase">{nutrient.unit}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <button type="submit" className="btn-primary w-full uppercase tracking-[0.2em] text-xs font-black py-5" disabled={!isValidActivity()}>
                    {activity.category === 1 ? 'Guardar Alimento' : 'Guardar Actividad'}
                </button>
            </form>
        </>
    )
}
