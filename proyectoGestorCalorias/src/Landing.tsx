import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Sun, Moon } from "lucide-react"
import Icon from "./components/Icon"

export default function Landing() {
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

      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-15%] left-[-10%] w-[40vw] h-[40vw] bg-lime-100 dark:bg-lime-900/10 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob"></div>
        <div className="absolute top-[10%] right-[-10%] w-[35vw] h-[35vw] bg-emerald-100 dark:bg-emerald-900/10 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob [animation-delay:4s]"></div>
      </div>

      <header className="w-full backdrop-blur-md bg-white/10 border-b border-white/10 sticky top-0 z-50">
        <nav className="max-w-5xl mx-auto px-6 py-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-lime-500 rounded-xl flex items-center justify-center shadow-lg shadow-lime-500/20 rotate-3 transform transition-transform hover:rotate-0">
              <Icon name="fire" className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight">
              Nutri<span className="text-lime-500">Track</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <button 
              onClick={toggleDarkMode}
              className="p-2.5 bg-white/10 dark:bg-slate-800/50 rounded-xl hover:bg-white/20 transition-all border border-white/10"
            >
              {isDark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
            <Link to="/como-funciona" className="hidden sm:block text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-lime-600 transition-colors">
              Cómo funciona
            </Link>
          </div>
        </nav>
      </header>

      <main className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <section className="text-center mb-32">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-8 tracking-tighter animate-fade-in-up">
              Come <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-emerald-500">mejor</span>,<br/>
              vive <span className="italic font-serif font-light text-slate-400">bien</span>.
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up [animation-delay:200ms]">
                Tu compañero diario para comer de forma equilibrada. Registra tus comidas y actividades de la manera más sencilla.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up [animation-delay:400ms]">
                <Link 
                    to="/calculadora"
                    className="btn-primary"
                >
                    Empezar ahora
                </Link>
                <a href="#caracteristicas" className="text-slate-400 font-medium hover:text-slate-900 transition-colors">
                    Ver características ↓
                </a>
            </div>
          </section>

          <section id="caracteristicas" className="grid md:grid-cols-2 gap-8 mb-8 animate-fade-in-up [animation-delay:600ms]">
            <Link to="/calculadora?category=1" className="relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 min-h-[220px] shadow-xl shadow-slate-200/50 dark:shadow-none border border-white dark:border-slate-800 group hover:scale-[1.02] transition-all flex flex-col justify-end">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2 dark:text-white">Nutrición Inteligente</h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm max-w-[80%]">Algoritmos diseñados para darte el desglose exacto de macronutrientes en cada comida.</p>
                </div>
                <Icon 
                    name="sparkles" 
                    className="absolute -right-4 -bottom-4 size-40 text-slate-50/50 dark:text-slate-800/20 group-hover:text-lime-500/10 -rotate-12 group-hover:-rotate-6 group-hover:scale-110 transition-all duration-500" 
                />
            </Link>
            <Link to="/calculadora?category=2" className="relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 min-h-[220px] shadow-xl shadow-slate-200/50 dark:shadow-none border border-white dark:border-slate-800 group hover:scale-[1.02] transition-all flex flex-col justify-end">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2 dark:text-white">Energía en Movimiento</h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm max-w-[80%]">Registra tus sesiones de entrenamiento y visualiza el impacto en tu balance diario.</p>
                </div>
                <Icon 
                    name="bolt" 
                    className="absolute -right-4 -bottom-4 size-40 text-slate-50/50 dark:text-slate-800/20 group-hover:text-emerald-500/10 -rotate-12 group-hover:-rotate-6 group-hover:scale-110 transition-all duration-500" 
                />
            </Link>
          </section>

          <section className="max-w-xl mx-auto mb-20 animate-fade-in-up [animation-delay:800ms]">
            <Link to="/camara" className="relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 min-h-[220px] shadow-xl shadow-slate-200/50 dark:shadow-none border border-white dark:border-slate-800 group hover:scale-[1.02] transition-all flex flex-col justify-end text-center items-center">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2 dark:text-white">Cámara Inteligente</h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">Escanea tus platos y te calculamos todo automáticamente usando IA avanzada.</p>
                </div>
                <Icon 
                    name="camera" 
                    className="absolute -right-4 -bottom-4 size-44 text-slate-50/50 dark:text-slate-800/20 group-hover:text-purple-500/10 -rotate-12 group-hover:-rotate-6 group-hover:scale-110 transition-all duration-500" 
                />
            </Link>
          </section>

          <section className="bg-slate-900 dark:bg-lime-500 rounded-[3rem] p-12 md:p-16 text-white text-center mb-20 animate-fade-in-up [animation-delay:1000ms]">
            <h2 className="text-3xl font-black mb-6 tracking-tight">¿Nuevo en NutriTrack?</h2>
            <p className="text-slate-400 dark:text-slate-900 mb-10 max-w-md mx-auto font-medium">Descubre cómo nuestra tecnología te ayuda a llevar un control total de tu salud sin complicaciones.</p>
            <Link 
              to="/como-funciona"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 dark:bg-black/20 hover:bg-white/20 text-white font-bold rounded-full transition-all backdrop-blur-sm border border-white/10"
            >
              Ver guía de uso
              <Icon name="sparkles" className="w-4 h-4 text-lime-400 dark:text-lime-900" />
            </Link>
          </section>
        </div>
      </main>

      <footer className="py-20 border-t border-slate-100 dark:border-slate-900 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-300 dark:text-slate-700 mb-4 animate-fade-in-up">NutriTrack Digital</p>
        <p className="text-slate-400 dark:text-slate-500 text-sm italic">&copy; Jorge-R-V</p>
      </footer>
    </div>
  )
}
