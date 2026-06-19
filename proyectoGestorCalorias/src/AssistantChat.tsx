import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Send, BrainCircuit } from "lucide-react"
import { useActivity } from "./hooks/useActivity"

type Message = {
    id: string
    text: string
    sender: 'ai' | 'user'
}

const DAILY_GOALS = { calories: 2000, protein: 120 }

export default function AssistantChat() {
    const { caloriesConsumed, totalProtein, waterConsumed, totalSodium } = useActivity()
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: "¡Hola! Soy tu Nutri-Coach IA. Analizando tus registros de hoy... ¿En qué puedo ayudarte?", sender: 'ai' }
    ])
    const [suggestions, setSuggestions] = useState(["¿Cómo voy hoy?", "¿Meta proteica?", "¿Qué ceno?"])
    const [input, setInput] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const analyzeContext = (userText: string) => {
        const text = userText.toLowerCase()
        const remainingCal = DAILY_GOALS.calories - caloriesConsumed
        const proteinLeft = DAILY_GOALS.protein - totalProtein
        
        const isExpert = text.includes("gluc") || text.includes("macronut") || text.includes("balance") || 
                         text.includes("sodio") || text.includes("metabolismo") || text.includes("fibra")
        
        let response = ""
        let nextSuggestions = ["¿Cómo voy hoy?", "¿Qué ceno?"]

        // 🔬 Caso: Sodio y Salud
        if (text.includes("sodio") || text.includes("sal")) {
            response = isExpert 
                ? `Tu ingesta de sodio actual es de ${totalSodium}mg. Recuerda que la OMS recomienda < 2300mg para evitar el estrés osmótico y la hipertensión.` 
                : `Llevas mucha sal (${totalSodium}mg). Intenta no comer nada salado en la cena para no despertarte hinchado. ¡Agua a tope!`
            nextSuggestions = ["¿Cómo bajar el sodio?", "Ver mi agua", "Otras dudas"]
        }
        // 🍗 Caso: Proteína
        else if (text.includes("proteína") || text.includes("proteica") || text.includes("músculo")) {
            if (proteinLeft <= 0) {
                response = isExpert ? "Síntesis proteica optimizada. Has cubierto tu requerimiento diario." : "¡Objetivo proteico cumplido! 🍖 Tus músculos ya tienen lo que necesitan."
                nextSuggestions = ["Ver mi quema calórica", "¿Qué cenar hoy?"]
            } else {
                response = isExpert 
                    ? `Déficit de aminoácidos detectado: te faltan ${proteinLeft}g de proteína. Te sugiero una fuente de alto valor biológico.` 
                    : `Te faltan unos ${proteinLeft}g de proteína. ¿Qué tal un poco de pollo o un batido rápido?`
                nextSuggestions = ["Alimentos con proteína", "Ver mis metas", "Consejo de cena"]
            }
        }
        // 💧 Caso: Agua
        else if (text.includes("agua") || text.includes("hidratación") || text.includes("beber")) {
            if (waterConsumed >= 2000) {
                response = isExpert ? "Homeostasis hídrica alcanzada. Filtración renal eficiente." : "¡Hidratación perfecta! 💧 Estás a tope."
            } else {
                response = `Llevas ${waterConsumed}ml de agua. ${isExpert ? "Es vital para el transporte de nutrientes celular." : "¡Bebe un vaso ahora!"}`
            }
            nextSuggestions = ["Importancia del agua", "Ver mis calorías", "¿Cómo voy?"]
        }
        // 📊 Caso: General / Cómo voy
        else if (text.includes("cómo voy") || text.includes("hoy") || text.includes("objetivos")) {
            response = isExpert 
                ? `Dashboard Diario: Ingesta del ${Math.round((caloriesConsumed/DAILY_GOALS.calories)*100)}% de TMB. Balance proteico: ${totalProtein}/${DAILY_GOALS.protein}g.`
                : `Resumen 📊: Llevas ${caloriesConsumed} Kcal y ${totalProtein}g de proteína. ` + (waterConsumed > 0 ? `Y ${waterConsumed}ml de agua.` : "¡Falta hidratación!")
            nextSuggestions = ["¿Qué meriendo?", "Ver mi sodio", "Consejo experto"]
        }
        // 🍽️ Recomendaciones
        else if (text.includes("recomienda") || text.includes("comer") || text.includes("cenar")) {
            if (remainingCal > 500) {
                response = isExpert ? "Disponibilidad energética alta. Recomiendo carbohidratos complejos y proteína magra." : "Puedes darte un capricho saludable, ¡todavía te sobran Kcal!"
            } else {
                response = isExpert ? "Restricción energética recomendada. Prioriza verduras de baja densidad calórica." : "Mejor algo ligero. Una tortilla francesa o pavo sería ideal."
            }
            nextSuggestions = ["Ejemplos de cena", "¿Y para desayunar?", "Ver mi azúcar"]
        }
        // Fallback
        else {
            response = isExpert 
                ? "Interesante consulta metabólica. ¿Quieres profundizar en tus proteínas, sodio o hidratación?" 
                : "No estoy seguro de qué prefieres pedirme. ¿Quieres saber cómo vas de calorías, proteínas o agua hoy? 😊"
            nextSuggestions = ["Calorías de hoy", "Mis proteínas", "Ver mi agua"]
        }

        return { response, nextSuggestions }
    }

    const handleSend = (text?: string) => {
        const messageText = text || input
        if (!messageText.trim()) return

        const currentLength = messages.length
        const newUserMsg: Message = { id: `u-${currentLength}`, text: messageText, sender: 'user' }
        setMessages(prev => [...prev, newUserMsg])
        setInput("")

        // Lógica de IA con Sugerencias Dinámicas
        setTimeout(() => {
            const { response, nextSuggestions } = analyzeContext(messageText)
            const aiMsg: Message = { id: `a-${currentLength + 1}`, text: response, sender: 'ai' }
            setMessages(prev => [...prev, aiMsg])
            setSuggestions(nextSuggestions)
        }, 800)
    }

    return (
        <div className="flex flex-col h-screen bg-slate-950 text-white overflow-hidden">
            <header className="p-6 bg-slate-900/50 backdrop-blur-xl border-b border-white/10 flex items-center justify-between">
                <Link to="/calculadora" className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/10">
                    <ArrowLeft size={18} />
                </Link>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-lime-500 rounded-full flex items-center justify-center text-slate-900 shadow-lg shadow-lime-500/20">
                        <BrainCircuit size={20} />
                    </div>
                    <div>
                        <h1 className="text-sm font-black uppercase tracking-widest text-white">Nutri-Coach IA</h1>
                        <span className="text-[10px] text-lime-400 font-bold block leading-none">Online y Analizando</span>
                    </div>
                </div>
                <div className="w-10" />
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                <AnimatePresence>
                    {messages.map((m) => (
                        <motion.div 
                            key={m.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed shadow-xl ${
                                m.sender === 'user' 
                                ? 'bg-lime-500 text-slate-950 rounded-tr-none font-bold' 
                                : 'bg-slate-900 border border-white/10 rounded-tl-none text-white/90'
                            }`}>
                                {m.text}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <footer className="p-6 bg-slate-900/50 backdrop-blur-xl border-t border-white/5 space-y-4">
                {/* Sugerencias Dinámicas */}
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {suggestions.map(btn => (
                        <button 
                            key={btn}
                            onClick={() => handleSend(btn)}
                            className="whitespace-nowrap px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[11px] font-bold text-white/60 hover:bg-white/10 hover:text-white transition-all"
                        >
                            {btn}
                        </button>
                    ))}
                </div>

                <div className="flex gap-4">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Escribe a la IA..."
                        className="flex-1 h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm focus:outline-none focus:border-lime-500/50 transition-all"
                    />
                    <button 
                        onClick={() => handleSend()}
                        className="w-14 h-14 bg-lime-500 rounded-2xl flex items-center justify-center text-slate-900 shadow-xl shadow-lime-500/20 active:scale-90 transition-all"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </footer>
        </div>
    )
}
