import { useState, useEffect, useMemo } from "react"
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-hot-toast'
import type { Activity } from "../types"

export const useActivity = () => {

    // Recupera las actividades guardadas en LocalStorage o retorna un array vacío si no hay nada
    const initialActivities = () : Activity[] => {
        try {
            const localStorageActivities = localStorage.getItem('activities')
            return localStorageActivities ? JSON.parse(localStorageActivities) : []
        } catch (error) {
            console.error("Error al cargar actividades de localStorage:", error)
            return []
        }
    }

    const initialWater = () : number => {
        const storedWater = localStorage.getItem('waterConsumed')
        return storedWater ? Number(storedWater) : 0
    }

    const [activities, setActivities] = useState<Activity[]>(initialActivities)
    const [waterConsumed, setWaterConsumed] = useState<number>(initialWater)
    const [activeId, setActiveId] = useState<Activity['id']>('')

    useEffect(() => {
        localStorage.setItem('activities', JSON.stringify(activities))
    }, [activities])

    useEffect(() => {
        localStorage.setItem('waterConsumed', waterConsumed.toString())
    }, [waterConsumed])

    // Función para manejar el guardado de actividades (Nueva o Actualización)
    const saveActivity = (activity : Activity) => {
        const activityWithTimestamp = {
            ...activity,
            timestamp: activity.timestamp || Date.now()
        }

        if(activeId) {
            setActivities(activities.map( item => item.id === activeId ? activityWithTimestamp : item ))
            setActiveId('')
            toast.success('Actividad actualizada correctamente')
        } else {
            setActivities([...activities, {...activityWithTimestamp, id: uuidv4()}])
            toast.success('Actividad guardada correctamente')
        }
    }

    const deleteActivity = (id: Activity['id']) => {
        setActivities(activities.filter(activity => activity.id !== id))
        toast.success('Actividad eliminada')
    }

    const addWater = (amount: number) => {
        setWaterConsumed(prev => prev + amount)
        toast.success(`+${amount}ml de agua`)
    }

    const resetWater = () => {
        setWaterConsumed(0)
        toast.success('Contador de agua reiniciado')
    }

    const restartApp = () => {
        setActivities([])
        toast.success('Todo se ha reiniciado')
    }

    // Balance neto de calorías (Consumidas - Quemadas)
    const netCalories = useMemo(() => {
        const total = activities.reduce((total, activity) => 
            activity.category === 1 ? total + activity.calories : total - activity.calories, 0
        )
        return Number(total.toFixed(2))
    }, [activities])

    const caloriesConsumed = useMemo(() => {
        const total = activities.reduce((total, activity) => 
            activity.category === 1 ? total + activity.calories : total, 0
        )
        return Number(total.toFixed(2))
    }, [activities])

    const caloriesBurned = useMemo(() => {
        const total = activities.reduce((total, activity) => 
            activity.category === 2 ? total + activity.calories : total, 0
        )
        return Number(total.toFixed(2))
    }, [activities])

    const totalFat = useMemo(() => {
        const total = activities.reduce((total, activity) => 
            activity.category === 1 ? total + (activity.fat || 0) : total, 0
        )
        return Number(total.toFixed(2))
    }, [activities])

    const totalSugar = useMemo(() => {
        const total = activities.reduce((total, activity) => 
            activity.category === 1 ? total + (activity.sugar || 0) : total, 0
        )
        return Number(total.toFixed(2))
    }, [activities])

    const totalProtein = useMemo(() => {
        const total = activities.reduce((total, activity) => 
            activity.category === 1 ? total + (activity.protein || 0) : total, 0
        )
        return Number(total.toFixed(2))
    }, [activities])

    const totalCarbs = useMemo(() => {
        const total = activities.reduce((total, activity) => 
            activity.category === 1 ? total + (activity.carbs || 0) : total, 0
        )
        return Number(total.toFixed(2))
    }, [activities])

    const totalFiber = useMemo(() => {
        const total = activities.reduce((total, activity) => 
            activity.category === 1 ? total + (activity.fiber || 0) : total, 0
        )
        return Number(total.toFixed(2))
    }, [activities])

    const totalSodium = useMemo(() => {
        const total = activities.reduce((total, activity) => 
            activity.category === 1 ? total + (activity.sodium || 0) : total, 0
        )
        return Number(total.toFixed(2))
    }, [activities])

    const isEmptyActivities = useMemo(() => activities.length === 0, [activities])

    return {
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
        waterConsumed,
        addWater,
        resetWater
    }
}
