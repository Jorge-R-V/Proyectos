import { useState, useRef, useCallback, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Webcam from "react-webcam"
import { motion, AnimatePresence } from "framer-motion"
import { RefreshCcw, Sparkles, ArrowLeft, CheckCircle2, BrainCircuit, ScanBarcode, Camera as CameraIcon, Upload, FlipHorizontal } from "lucide-react"
import { useActivity } from "./hooks/useActivity"
import LectorCodigoBarras from "./components/LectorCodigoBarras"
import { getFoodByBarcode } from "./services/nutritionApi"
import { toast } from "react-hot-toast"

const DEMO_FOODS = [
    { name: "Pasta a la Carbonara Tradicional", calories: 750, protein: 25, carbs: 65, fat: 42, fiber: 3, sugar: 4, sodium: 1100, image: "demo-carbonara.png", tip: "¡Fuente excelente de energía! Perfecta para recargar tras un entrenamiento intenso." },
    { name: "Ensalada César con Pollo", calories: 450, protein: 32, carbs: 12, fat: 28, fiber: 4, sugar: 3, sodium: 850, image: "demo-ensalada.png", tip: "Alta en proteínas magras y fibra. Ayuda a la saciedad y control de peso." },
    { name: "Pizza Margarita Artesanal", calories: 280, protein: 12, carbs: 36, fat: 10, fiber: 2, sugar: 4, sodium: 600, image: "demo-pizza.png", tip: "Opción equilibrada si controlas las porciones. El orégano es un potente antioxidante." },
    { name: "Salmón a la Plancha con Espárragos", calories: 380, protein: 40, carbs: 5, fat: 22, fiber: 3, sugar: 1, sodium: 320, image: "demo-salmon.png", tip: "Rico en Omega-3. Ideal para la salud cardiovascular y cerebral." },
    { name: "Bowl de Acaí y Frutas", calories: 320, protein: 8, carbs: 55, fat: 6, fiber: 9, sugar: 30, sodium: 25, image: "demo-acai.png", tip: "Bomba de antioxidantes y fibra. El acaí mejora el sistema inmune." },
    { name: "Tomate Natural (Raff)", calories: 22, protein: 1, carbs: 4.8, fat: 0.2, fiber: 1.5, sugar: 3.2, sodium: 5, image: "demo-tomate.png", tip: "Contiene Licopeno, un antioxidante esencial para la piel." },
    { name: "Huevo Cocido Grande", calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, fiber: 0, sugar: 0, sodium: 62, image: "demo-huevo.png", tip: "La proteína perfecta. Contiene todos los aminoácidos esenciales." },
    { name: "Pechuga de Pollo Asada", calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74, image: "demo-pollo.png", tip: "Muy baja en grasas saturadas. Clave para la salud muscular." }
] as const

type FoodResult = {
    name: string
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber?: number
    sugar?: number
    sodium?: number
    image?: string
    tip?: string
    confidence?: number // Nuevo: Confianza de la IA
}

const DAILY_GOALS = { calories: 2000, protein: 120 }

// Mapeo de etiquetas de la IA (MobileNet) a nuestra base de datos / nutrientes
const AI_FOOD_MAP: Record<string, Partial<FoodResult>> = {
    "bell pepper": { name: "Pimiento Rojo Fresno", calories: 31, protein: 1, carbs: 6, fat: 0.3, tip: "Rico en Vitamina C y antioxidantes." },
    "pizza": { name: "Pizza Italiana Artesanal", calories: 266, protein: 11, carbs: 33, fat: 10, tip: "Fuente equilibrada de energía si controlas la porción." },
    "hotdog": { name: "Hot Dog Clásico", calories: 290, protein: 10, carbs: 24, fat: 18, tip: "Contiene grasas saturadas, consúmelo con moderación." },
    "cheeseburger": { name: "Hamburguesa con Queso", calories: 300, protein: 15, carbs: 30, fat: 14, tip: "Alta en proteínas, ideal tras un esfuerzo físico." },
    "broccoli": { name: "Brócoli al Vapor", calories: 35, protein: 2.8, carbs: 7, fat: 0.4, tip: "Superalimento rico en fibra y hierro." },
    "banana": { name: "Plátano Maduro", calories: 89, protein: 1.1, carbs: 23, fat: 0.3, tip: "Potasio puro para evitar calambres musculares." },
    "green apple": { name: "Manzana Granny Smith", calories: 52, protein: 0.3, carbs: 14, fat: 0.2, tip: "Fibra pectina para tu salud digestiva." },
    "strawberry": { name: "Fresas Silvestres", calories: 33, protein: 0.7, carbs: 8, fat: 0.3, tip: "Baja en azúcares y alta en antioxidantes." },
    "boiled egg": { name: "Huevo Cocido", calories: 78, protein: 6, carbs: 0.6, fat: 5.3, tip: "La proteína animal más completa." },
    "carbonara": { name: "Pasta Carbonara", calories: 750, protein: 25, carbs: 65, fat: 42, tip: "Carga de carbohidratos pura para energía sostenida." },
    "tomato": { name: "Tomate Natural", calories: 22, protein: 1, carbs: 4.8, fat: 0.2, tip: "Lycopene protector para tu corazón." }
}

const NON_FOOD_KEYWORDS = ["person", "laptop", "monitor", "mouse", "desk", "chair", "wall", "pencil", "mobile phone", "clothing", "face", "eye", "hand", "dog", "cat", "car"]
const FOOD_ROOT_KEYWORDS = ["food", "dish", "meal", "vegetable", "fruit", "meat", "fish", "bread", "dessert", "nut", "seafood", "snack", "drink", "soup", "stew", "sauce", "pizza", "burger", "carbonara", "egg", "pasta", "salad"]

export default function CamaraInteligente() {
    const navigate = useNavigate()
    const { saveActivity, caloriesConsumed } = useActivity()
    const webcamRef = useRef<Webcam>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Programmatic beep for audio feedback
    const playBeep = (freq = 800, duration = 0.1) => {
        try {
            const context = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
            const osc = context.createOscillator()
            const gain = context.createGain()
            osc.frequency.setValueAtTime(freq, context.currentTime)
            osc.type = "sine"
            gain.gain.setValueAtTime(0.1, context.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration)
            osc.connect(gain)
            gain.connect(context.destination)
            osc.start()
            osc.stop(context.currentTime + duration)
        } catch (e) { console.log(e) }
    }
    
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [statusMsg, setStatusMsg] = useState("")
    const [detectedFood, setDetectedFood] = useState<FoodResult | null>(null)
    const [isNoFoodError, setIsNoFoodError] = useState(false)
    const [capturedImg, setCapturedImg] = useState<string | null>(null)
    const [isDemoMode, setIsDemoMode] = useState(false)
    const [scanMode, setScanMode] = useState<'vision' | 'barcode'>('vision')
    const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
    const [classifier, setClassifier] = useState<any>(null)
    const [isModelLoading, setIsModelLoading] = useState(true)

    // Cargar modelo ml5.js al inicio
    useEffect(() => {
        const loadModel = async () => {
            try {
                // @ts-expect-error - ml5 is loaded from CDN
                const ml5Model = await ml5.imageClassifier('MobileNet')
                setClassifier(ml5Model)
                setIsModelLoading(false)
                toast.success("Cerebro IA: Conectado")
            } catch (err) {
                console.error("Error al cargar ml5:", err)
                setIsModelLoading(false)
            }
        }
        loadModel()
    }, [])

    const videoConstraints = {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: facingMode
    }

    const simulateScan = useCallback(async (forcedImg?: string) => {
        let imageSrc = forcedImg || webcamRef.current?.getScreenshot()
        let preSelectedFood = null
        
        // En modo demo, elegimos el alimento AL PRINCIPIO para mostrar la foto que toca
        if (isDemoMode && !forcedImg) {
            preSelectedFood = DEMO_FOODS[Math.floor(Math.random() * DEMO_FOODS.length)]
            imageSrc = `${import.meta.env.BASE_URL}${preSelectedFood.image}`
        }

        if (!imageSrc) {
            toast.error("No se pudo capturar la imagen. Verifica el permiso de cámara.")
            return
        }

        setCapturedImg(imageSrc)
        setIsAnalyzing(true)
        setDetectedFood(null)

        const steps = [
            "Extrayendo vectores de textura...",
            "Analizando red neuronal...",
            "Identificando estructuras...",
            "Consultando base IA Vision...",
            "Finalizando análisis corporal..."
        ]

        for (const step of steps) {
            setStatusMsg(step)
            playBeep(600 + (steps.indexOf(step) * 100), 0.05)
            await new Promise(r => setTimeout(r, 600))
        }

        // --- REAL AI DETECTION ---
        let finalFood: FoodResult | null = preSelectedFood

        if (!preSelectedFood && classifier) {
            try {
                // Creamos un elemento imagen invisible para ml5
                const img = document.createElement('img')
                img.src = imageSrc
                await new Promise(r => img.onload = r)
                
                setIsNoFoodError(false)
                const results = await classifier.classify(img)
                const topResult = results[0]
                const label = topResult.label.toLowerCase()
                
                // --- FILTRO DE SEGURIDAD REFORZADO ---
                const isLikelyNotFood = NON_FOOD_KEYWORDS.some(k => label.includes(k))
                const hasFoodRoot = FOOD_ROOT_KEYWORDS.some(k => label.includes(k))
                const matchedDataInMap = Object.keys(AI_FOOD_MAP).some(k => label.includes(k))
                
                const confidence = topResult.confidence

                // Si no hay rastro de comida o la confianza es muy baja (<60%)
                if (isLikelyNotFood || (!hasFoodRoot && !matchedDataInMap) || confidence < 0.6) {
                    setIsNoFoodError(true)
                    setIsAnalyzing(false)
                    toast.error("Análisis inconcluyente: No parece comida")
                    return
                }
                
                // Intentamos mapear la etiqueta de la IA a nuestros datos
                let matchedData = null
                for (const key in AI_FOOD_MAP) {
                    if (label.includes(key)) {
                        matchedData = AI_FOOD_MAP[key]
                        break
                    }
                }

                if (matchedData) {
                    finalFood = {
                        ...matchedData,
                        confidence: Math.round(confidence * 100)
                    } as FoodResult
                } else {
                    // Fallback: Si no lo conocemos, mostramos lo que cree la IA con datos estimados
                    finalFood = {
                        name: label.charAt(0).toUpperCase() + label.slice(1).split(',')[0],
                        calories: 120, // Estimación segura por defecto
                        protein: 5,
                        carbs: 15,
                        fat: 4,
                        confidence: Math.round(confidence * 100),
                        tip: "Alimento identificado externamente. Valor calórico estimado."
                    }
                }
            } catch (err) {
                console.error("Error en clasificación:", err)
            }
        }

        // Ya no usamos fallbacks aleatorios. Si no hay food, no hay resultado.
        if (finalFood) {
            setDetectedFood(finalFood)
            playBeep(1200, 0.3) // Éxito
        }
        
        setIsAnalyzing(false)
    }, [isDemoMode, classifier])

    const handleSave = () => {
        if (!detectedFood) return
        saveActivity({
            calories: detectedFood.calories,
            protein: detectedFood.protein,
            carbs: detectedFood.carbs,
            fat: detectedFood.fat,
            fiber: detectedFood.fiber || 0,
            sugar: detectedFood.sugar || 0,
            sodium: detectedFood.sodium || 0,
            name: detectedFood.name,
            category: 1,
            id: "",
            quantity: 1,
            unit: 'unidad'
        })
        resetScan()
        navigate('/calculadora')
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            const result = event.target?.result as string
            setCapturedImg(result)
            simulateScan(result)
        }
        reader.readAsDataURL(file)
    }

    const resetScan = () => {
        setCapturedImg(null)
        setDetectedFood(null)
        setIsNoFoodError(false)
        setIsAnalyzing(false)
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans overflow-hidden relative">
            {/* Cabecera */}
            <header className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-gradient-to-bottom from-black/50 to-transparent">
                <Link 
                    to="/calculadora" 
                    className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl hover:bg-white/20 transition-all border border-white/10 shadow-xl"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsDemoMode(!isDemoMode)}
                        className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${
                            isDemoMode 
                                ? "bg-amber-500 border-amber-400 text-white shadow-lg shadow-amber-500/20" 
                                : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                        }`}
                    >
                        <Sparkles size={14} className={isDemoMode ? "animate-spin" : ""} />
                        {isDemoMode ? "Modo Demo: ON" : "Modo Demo: OFF"}
                    </button>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all ${isModelLoading ? 'bg-amber-500/20 border border-amber-500/50' : 'bg-lime-500 shadow-lime-500/20'}`}>
                        <BrainCircuit size={14} className={isModelLoading ? "animate-pulse text-amber-500" : "text-white"} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">
                            {isModelLoading ? 'Cargando IA...' : 'AI Vision v3.0'}
                        </span>
                    </div>
                </div>
            </header>

            {/* Area de Camara */}
            <div className="relative h-screen w-full flex items-center justify-center p-4">
                <div className="relative w-full max-w-4xl aspect-[9/16] md:aspect-video bg-slate-900 rounded-[3rem] overflow-hidden border-4 border-white/10 shadow-2xl">
                    
                    {scanMode === 'vision' ? (
                        <>
                            {capturedImg ? (
                                <img src={capturedImg} className="w-full h-full object-cover grayscale-[0.3]" alt="Captured" />
                            ) : (
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={videoConstraints}
                                    className="w-full h-full object-cover"
                                />
                            )}

                            {/* Overlay de Escaneo Vision */}
                            {!detectedFood && (
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute top-10 left-10 w-20 h-20 border-t-4 border-l-4 border-lime-500 rounded-tl-3xl opacity-60"></div>
                                    <div className="absolute top-10 right-10 w-20 h-20 border-t-4 border-r-4 border-lime-500 rounded-tr-3xl opacity-60"></div>
                                    <div className="absolute bottom-10 left-10 w-20 h-20 border-b-4 border-l-4 border-lime-500 rounded-bl-3xl opacity-60"></div>
                                    <div className="absolute bottom-10 right-10 w-20 h-20 border-b-4 border-r-4 border-lime-500 rounded-br-3xl opacity-60"></div>
                                    
                                    {isAnalyzing && (
                                        <div className="absolute top-0 left-0 w-full h-1 bg-lime-500 shadow-[0_0_30px_rgba(132,204,22,0.8)] animate-scan"></div>
                                    )}
                                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,rgba(132,204,22,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col bg-slate-950">
                            <LectorCodigoBarras 
                                isEmbedded={true}
                                onScanSuccess={async (barcode) => {
                                    setIsAnalyzing(true);
                                    setStatusMsg("Buscando código: " + barcode);
                                    const food = await getFoodByBarcode(barcode);
                                    if (food) {
                                        setDetectedFood(food);
                                        toast.success("¡Producto encontrado!");
                                    } else {
                                        toast.error("Producto no encontrado");
                                    }
                                    setIsAnalyzing(false);
                                }} 
                                onClose={() => setScanMode('vision')} 
                            />
                        </div>
                    )}

                    {/* Estado de Análisis */}
                    {isAnalyzing && (
                        <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-black/90 to-transparent text-center space-y-4">
                            <div className="flex justify-center gap-2">
                                <span className="w-2 h-2 bg-lime-500 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-lime-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-2 h-2 bg-lime-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                            <p className="text-sm font-black uppercase tracking-[0.3em] text-lime-400">{statusMsg}</p>
                        </div>
                    )}

                    {/* Resultado Premium */}
                    <AnimatePresence>
                        {(detectedFood || isNoFoodError) && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="absolute inset-0 z-50 flex flex-col p-6 md:p-10 pointer-events-auto cursor-pointer"
                                onClick={resetScan}
                            >
                                <div className="flex-1 pointer-events-none" />
                                
                                <div onClick={(e) => e.stopPropagation()} className="pointer-events-auto">
                                    {isNoFoodError ? (
                                    <div className="bg-slate-900 border border-red-500/30 rounded-[2.5rem] p-6 text-center max-w-sm mx-auto pointer-events-auto shadow-2xl">
                                        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                                            <BrainCircuit size={24} />
                                        </div>
                                        <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">Detección fallida</h3>
                                        <p className="text-white/50 text-xs leading-relaxed mb-6 italic">
                                            &quot;La IA no reconoce este objeto como alimento con suficiente confianza.&quot;
                                        </p>
                                        <button 
                                            onClick={resetScan}
                                            className="w-full h-12 bg-white/5 hover:bg-white/10 text-white font-black rounded-xl transition-all uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 border border-white/10"
                                        >
                                            <RefreshCcw size={14} /> Reintentar
                                        </button>
                                    </div>
                                ) : detectedFood && (
                                    <div className="bg-slate-950/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 md:p-8 pointer-events-auto shadow-2xl relative overflow-hidden">
                                        <div className="relative z-10">
                                            {/* Header Centrado Simplificado */}
                                            <div className="text-center mb-8">
                                                <div className="flex justify-center gap-2 mb-4">
                                                    <span className="bg-lime-500 text-slate-950 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-lime-500/20 text-xs">¡COMIDA DETECTADA!</span>
                                                </div>
                                                <h3 className="text-3xl font-black text-white leading-tight uppercase tracking-tight mb-2">{detectedFood.name}</h3>
                                                <div className="flex items-center justify-center gap-4 mt-4">
                                                    <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                                                        <span className="text-2xl font-black text-white">{detectedFood.calories}</span>
                                                        <span className="text-[10px] font-bold text-white/40 uppercase ml-2">Kcal</span>
                                                    </div>
                                                    <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/10 text-blue-400">
                                                        <span className="text-lg font-black text-white">{detectedFood.protein}g</span>
                                                        <span className="text-[10px] font-bold uppercase ml-2">Prot</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Impacto Diario Minimalista */}
                                            <div className="space-y-6 mb-8">
                                                <div className="group">
                                                    <div className="flex justify-between text-[10px] font-black text-white/60 mb-2 uppercase tracking-widest">
                                                        <span>Progreso Calorías</span>
                                                        <span className="text-lime-400">{Math.round(((caloriesConsumed + detectedFood.calories) / DAILY_GOALS.calories) * 100)}%</span>
                                                    </div>
                                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${Math.min(100, ((caloriesConsumed + detectedFood.calories) / DAILY_GOALS.calories) * 100)}%` }}
                                                            className="h-full bg-lime-500 shadow-[0_0_15px_rgba(132,204,22,0.4)]"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-4">
                                                <button 
                                                    onClick={resetScan}
                                                    className="w-16 h-16 rounded-2xl bg-white/5 text-white/60 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all border border-white/10"
                                                >
                                                    <RefreshCcw size={20} />
                                                </button>
                                                <button 
                                                    onClick={handleSave}
                                                    className="flex-1 h-16 rounded-2xl bg-lime-500 text-slate-950 font-black uppercase text-[11px] tracking-[0.2em] hover:bg-lime-400 transition-all shadow-xl shadow-lime-500/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                                                >
                                                    <CheckCircle2 size={20} />
                                                    <span>COGER ALIMENTO</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Controles Flotantes - Selector de modo */}
            {!isAnalyzing && !detectedFood && (
                <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-6">
                    {/* Selector de Modo */}
                    <div className="flex p-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl mb-2">
                        <button 
                            onClick={() => setScanMode('vision')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                scanMode === 'vision' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <CameraIcon size={14} />
                            IA Vision
                        </button>
                        <button 
                            onClick={() => setScanMode('barcode')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                scanMode === 'barcode' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <ScanBarcode size={14} />
                            Código Barras
                        </button>
                    </div>

                    {scanMode === 'vision' && (
                        <div className="flex items-center gap-4">
                            {/* Input de archivo oculto */}
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileUpload} 
                                className="hidden" 
                                accept="image/*"
                            />
                            
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90"
                                title="Subir Foto"
                            >
                                <Upload size={20} />
                            </button>

                            <button 
                                onClick={() => simulateScan()}
                                className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-white/20 active:scale-95 transition-transform"
                            >
                                <div className="w-16 h-16 border-4 border-slate-950 rounded-full flex items-center justify-center">
                                    <div className="w-12 h-12 bg-slate-950 rounded-full flex items-center justify-center">
                                        <BrainCircuit size={24} className="text-lime-500 animate-pulse" />
                                    </div>
                                </div>
                            </button>

                            <button 
                                onClick={() => setFacingMode(prev => prev === "user" ? "environment" : "user")}
                                className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90"
                                title="Girar Cámara"
                            >
                                <FlipHorizontal size={20} />
                            </button>
                        </div>
                    )}
                    {scanMode === 'vision' && (
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Pulsa para Escanear u Sube tu Foto</p>
                    )}
                </div>
            )}
        </div>
    )
}
