import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, Camera, Droplets, ArrowLeft, Sun, Moon } from "lucide-react"
import Icon from "./components/Icon"

export default function ComoFunciona() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('nutritrack-theme')
    if (stored) return stored === 'dark'
    return true
  })

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('nutritrack-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('nutritrack-theme', 'light')
    }
  }, [isDark])

  const toggleDarkMode = () => {
    setIsDark(!isDark)
  }

  return (
    <div className={`relative min-h-screen font-sans selection:bg-lime-200 transition-colors duration-500 ${isDark ? 'bg-slate-950 text-slate-50' : 'bg-slate-50 text-slate-900'}`}>

      {/* Fondo Ambientado */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-15%] left-[-10%] w-[40vw] h-[40vw] bg-lime-100 dark:bg-lime-900/10 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob"></div>
        <div className="absolute top-[10%] right-[-10%] w-[35vw] h-[35vw] bg-emerald-100 dark:bg-emerald-900/10 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob [animation-delay:4s]"></div>
      </div>

      <header className="w-full sticky top-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/10">
        <nav className="max-w-5xl mx-auto px-6 py-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-lime-500 rounded-xl flex items-center justify-center shadow-lg shadow-lime-500/20 rotate-3 transform transition-transform hover:rotate-0">
              <Icon name="fire" className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight">
              Nutri<span className="text-lime-500">Track</span>
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2.5 bg-white/10 dark:bg-slate-800/50 rounded-xl hover:bg-white/20 transition-all border border-white/10"
            >
              {isDark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
            <Link to="/calculadora" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-lime-600 transition-colors">
              <ArrowLeft size={14} /> Volver
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <section className="text-center mb-24 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight">
            Tecnología para tu <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-emerald-500">Bienestar</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            NutriTrack no es solo un contador de calorías. Es tu asistente personal que entiende qué comes y cómo te hidratas.
          </p>
        </section>

        <div className="grid gap-8 animate-fade-in-up [animation-delay:200ms]">
          {[
            {
              title: "Búsqueda Inteligente AI",
              desc: "No pierdas tiempo escribiendo. Busca por marca o nombre y nosotros rellenamos todos los valores nutricionales por ti consultando bases de datos globales.",
              icon: <Search className="text-lime-500" size={32} />,
              benefit: "Acceso a +500,000 alimentos"
            },
            {
              title: "Escáner de Barcode Pro",
              desc: "¿Tienes el producto en la mano? Escanea el código de barras con tu cámara y mira cómo la magia de NutriTrack reconoce el producto al instante.",
              icon: <Camera className="text-emerald-500" size={32} />,
              benefit: "Escaneo EAN/UPC en tiempo real"
            },
            {
              title: "Control de Macronutrientes",
              desc: "Visualiza de forma dinámica el equilibrio de Proteínas, Carbos y Grasas de cada plato antes de guardarlo. Equilibrio perfecto para tus metas.",
              icon: <Icon name="chart" className="text-amber-500 w-8 h-8" />,
              benefit: "Gráficas dinámicas por alimento"
            },
            {
              title: "Hidratación Glassmorphic",
              desc: "Registra tu consumo de agua diario con un widget elegante. Mantenerse hidratado es la base de un metabolismo saludable.",
              icon: <Droplets className="text-blue-500" size={32} />,
              benefit: "Objetivo diario de 8 vasos"
            }
          ].map((step, i) => (
            <div key={i} className="relative overflow-hidden bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-slate-800 group hover:border-lime-500/30 transition-all flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] group-hover:scale-110 transition-transform duration-500 shadow-inner">
                {step.icon}
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{step.title}</h3>
                    <span className="hidden md:inline px-3 py-1 bg-lime-50 dark:bg-lime-500/10 text-[9px] font-black text-lime-600 dark:text-lime-400 uppercase tracking-widest rounded-full">{step.benefit}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-32 text-center bg-slate-900 dark:bg-lime-500 text-white p-12 md:p-20 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-20 bg-white/5 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000"></div>
          <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight relative z-10 italic">¿Empezamos tu cambio?</h2>
          <Link 
            to="/calculadora"
            className="relative z-10 inline-block px-14 py-6 bg-white text-slate-900 font-black uppercase tracking-widest text-xs rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all"
          >
            Ir a la Calculadora Inteligente
          </Link>
        </section>
      </main>

      <footer className="py-20 text-center border-t border-slate-100 dark:border-slate-900">
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-slate-300 dark:text-slate-700 mb-4">NutriTrack Digital</p>
        <p className="text-slate-400 dark:text-slate-500 text-sm italic">&copy; Jorge-R-V</p>
      </footer>
    </div>
  )
}
