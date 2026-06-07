import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, MessageSquare } from "lucide-react"
import Icon from "./components/Icon"
import FormularioActividades from "./components/FormularioActividades"
import ListadoActividades from "./components/ListadoActividades"
import RegistroCalorias from "./components/RegistroCalorias"
import ContadorAgua from "./components/ContadorAgua"
import BadgeSystem from "./components/BadgeSystem"
import ConsejosIA from "./components/ConsejosIA"
import { useActivity } from "./hooks/useActivity"

function App() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('nutritrack-theme')
    if (stored) return stored === 'dark'
    return true // Modo oscuro por defecto
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

  const {
    activities,
    activeId,
    setActiveId,
    saveActivity,
    deleteActivity,
    restartApp,
    netCalories,
    caloriesConsumed, 
    caloriesBurned, 
    totalFat, 
    totalSugar,
    totalProtein,
    totalCarbs,
    totalFiber,
    totalSodium,
    isEmptyActivities,
    waterConsumed
  } = useActivity()

  useEffect(() => {
    if(activeId) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }, [activeId])

  return (
    <div className={`relative min-h-screen font-sans selection:bg-lime-200 transition-colors duration-500 ${isDark ? 'bg-slate-950 text-slate-50' : 'bg-slate-50 text-slate-900'}`}>

      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-15%] left-[-10%] w-[40vw] h-[40vw] bg-lime-100 dark:bg-lime-900/10 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob"></div>
        <div className="absolute top-[10%] right-[-10%] w-[35vw] h-[35vw] bg-emerald-100 dark:bg-emerald-900/10 rounded-full mix-blend-multiply filter blur-[120px] opacity-15 animate-blob [animation-delay:4s]"></div>
      </div>

      <header className="w-full sticky top-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-lime-500 rounded-xl flex items-center justify-center shadow-lg shadow-lime-500/20 rotate-3 transform transition-transform hover:rotate-0">
              <Icon name="fire" className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              Nutri<span className="text-lime-500">Track</span>
            </h1>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/asistente" className="p-3 bg-white/10 dark:bg-slate-800/50 rounded-2xl hover:bg-white/20 transition-all border border-white/10">
              <MessageSquare className="w-5 h-5 text-lime-500" />
            </Link>
            <button 
              onClick={toggleDarkMode}
              className="p-3 bg-white/10 dark:bg-slate-800/50 rounded-2xl hover:bg-white/20 transition-all border border-white/10"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-blue">
          
          <motion.section 
            className="lg:col-span-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <FormularioActividades 
              saveActivity={saveActivity}
              activeId={activeId}
              activities={activities}
              key={activeId}
            />
          </motion.section>

          <motion.section 
            className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <ContadorAgua />
            {!isEmptyActivities ? (
              <BadgeSystem 
                totalProtein={totalProtein}
                totalSugar={totalSugar}
                caloriesBurned={caloriesBurned}
              />
            ) : (
              <div className="flex flex-col justify-center items-center card-glass gap-4 bg-slate-50 dark:bg-slate-900 shadow-none border-dashed">
                <p className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] text-center">Registra tu primera actividad para desbloquear medallas</p>
                <button className="btn-secondary w-full" onClick={restartApp}>Reiniciar Aplicación</button>
              </div>
            )}
          </motion.section>
        </div>

        <AnimatePresence mode="wait">
          {!isEmptyActivities && (
            <motion.section 
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-12">
                    <ConsejosIA 
                       totalProtein={totalProtein}
                       totalFiber={totalFiber}
                       totalSugar={totalSugar}
                       netCalories={netCalories}
                       caloriesBurned={caloriesBurned}
                       waterConsumed={waterConsumed}
                    />
                </div>
                <div className="lg:col-span-12">
                  <RegistroCalorias 
                    caloriesConsumed={caloriesConsumed}
                    caloriesBurned={caloriesBurned}
                    netCalories={netCalories}
                    totalFat={totalFat}
                    totalSugar={totalSugar}
                    totalProtein={totalProtein}
                    totalCarbs={totalCarbs}
                    totalFiber={totalFiber}
                    totalSodium={totalSodium}
                  />
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <ListadoActividades 
            activities={activities}
            setActiveId={setActiveId}
            deleteActivity={deleteActivity}
          />
        </motion.section>
      </main>

      <footer className="py-20 border-t border-slate-200 dark:border-slate-800 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-300 dark:text-slate-600 mb-4">NutriTrack Digital</p>
        <p className="text-slate-400 dark:text-slate-500 text-sm italic">&copy; Jorge-R-V</p>
      </footer>
    </div>
  )
}

export default App
