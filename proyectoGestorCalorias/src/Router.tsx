import { Routes, Route } from 'react-router-dom'
import Landing from './Landing'
import App from './App'
import Camara from './Camara'
import ComoFunciona from './ComoFunciona'
import AnalisisDashboard from './AnalisisDashboard'
import AssistantChat from './AssistantChat'
import HydrationTracker from './HydrationTracker'
import NavigationBar from './components/NavigationBar'
import { Outlet } from 'react-router-dom'

const NavigationLayout = () => (
    <>
        <Outlet />
        <NavigationBar />
    </>
)

const AppRouter = () => {
    return (
        <Routes>
            <Route index element={<Landing />} />
            <Route element={<NavigationLayout />}>
                <Route path="calculadora" element={<App />} />
                <Route path="camara" element={<Camara />} />
                <Route path="como-funciona" element={<ComoFunciona />} />
                <Route path="analisis" element={<AnalisisDashboard />} />
                <Route path="asistente" element={<AssistantChat />} />
                <Route path="hidratacion" element={<HydrationTracker />} />
            </Route>
        </Routes>
    )
}

export default AppRouter
