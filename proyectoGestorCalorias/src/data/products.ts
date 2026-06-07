import type { Activity } from "../types"

export const products : Omit<Activity, 'id'>[] = [

    { category: 1, name: 'Manzana', calories: 52, fat: 0.2, sugar: 10, protein: 0.3, carbs: 14, fiber: 2.4, sodium: 1, quantity: 100, unit: 'g' },
    { category: 1, name: 'Plátano', calories: 89, fat: 0.3, sugar: 12, protein: 1.1, carbs: 23, fiber: 2.6, sodium: 1, quantity: 100, unit: 'g' },
    { category: 1, name: 'Huevo', calories: 155, fat: 11, sugar: 1.1, protein: 13, carbs: 1.1, fiber: 0, sodium: 124, quantity: 100, unit: 'g' },
    { category: 1, name: 'Pechuga de Pollo', calories: 165, fat: 3.6, sugar: 0, protein: 31, carbs: 0, fiber: 0, sodium: 74, quantity: 100, unit: 'g' },
    { category: 1, name: 'Arroz Blanco', calories: 130, fat: 0.3, sugar: 0.1, protein: 2.7, carbs: 28, fiber: 0.4, sodium: 1, quantity: 100, unit: 'g' },
    { category: 1, name: 'Leche Entera', calories: 61, fat: 3.3, sugar: 4.8, protein: 3.2, carbs: 4.8, fiber: 0, sodium: 44, quantity: 100, unit: 'ml' },
    { category: 1, name: 'Refresco', calories: 42, fat: 0, sugar: 10.6, protein: 0, carbs: 10.6, fiber: 0, sodium: 10, quantity: 100, unit: 'ml' },
    { category: 1, name: 'Zumo de Naranja', calories: 45, fat: 0.2, sugar: 9, protein: 0.7, carbs: 10, fiber: 0.2, sodium: 1, quantity: 100, unit: 'ml' },
    { category: 1, name: 'Aguacate', calories: 160, fat: 15, sugar: 0.7, protein: 2, carbs: 9, fiber: 7, sodium: 7, quantity: 100, unit: 'g' },
    { category: 1, name: 'Chocolate Negro', calories: 546, fat: 31, sugar: 48, protein: 4.9, carbs: 61, fiber: 7, sodium: 20, quantity: 100, unit: 'g' },
    { category: 1, name: 'Yogurt Griego', calories: 115, fat: 6, sugar: 4.5, protein: 10, carbs: 5, fiber: 0, sodium: 45, quantity: 100, unit: 'g' },
    { category: 1, name: 'Galleta de Avena', calories: 450, fat: 18, sugar: 25, protein: 6, carbs: 65, fiber: 5, sodium: 400, quantity: 100, unit: 'g' },
    { category: 1, name: 'Avena', calories: 389, fat: 6.9, sugar: 0, protein: 16.9, carbs: 66, fiber: 10.6, sodium: 2, quantity: 100, unit: 'g' },
    { category: 1, name: 'Almendras', calories: 579, fat: 50, sugar: 4.4, protein: 21, carbs: 22, fiber: 13, sodium: 1, quantity: 100, unit: 'g' },
    { category: 1, name: 'Salmón', calories: 208, fat: 13, sugar: 0, protein: 20, carbs: 0, fiber: 0, sodium: 59, quantity: 100, unit: 'g' },
    { category: 1, name: 'Brócoli', calories: 34, fat: 0.4, sugar: 1.7, protein: 2.8, carbs: 6.6, fiber: 2.6, sodium: 33, quantity: 100, unit: 'g' },
    { category: 1, name: 'Pan Integral', calories: 247, fat: 3.4, sugar: 4, protein: 13, carbs: 41, fiber: 7, sodium: 400, quantity: 100, unit: 'g' },
    { category: 1, name: 'Pasta', calories: 131, fat: 1.1, sugar: 0.5, protein: 5, carbs: 25, fiber: 1.1, sodium: 1, quantity: 100, unit: 'g' },
    { category: 1, name: 'Pescado Blanco', calories: 105, fat: 2, sugar: 0, protein: 20, carbs: 0, fiber: 0, sodium: 70, quantity: 100, unit: 'g' },


    { category: 2, name: 'Correr', calories: 300, fat: 0, sugar: 0, protein: 0, carbs: 0, fiber: 0, sodium: 0, quantity: 1, unit: 'unid' },
    { category: 2, name: 'Caminar', calories: 150, fat: 0, sugar: 0, protein: 0, carbs: 0, fiber: 0, sodium: 0, quantity: 1, unit: 'unid' },
    { category: 2, name: 'Bicicleta', calories: 250, fat: 0, sugar: 0, protein: 0, carbs: 0, fiber: 0, sodium: 0, quantity: 1, unit: 'unid' },
    { category: 2, name: 'Pesas', calories: 200, fat: 0, sugar: 0, protein: 0, carbs: 0, fiber: 0, sodium: 0, quantity: 1, unit: 'unid' },
    { category: 2, name: 'Natación', calories: 350, fat: 0, sugar: 0, protein: 0, carbs: 0, fiber: 0, sodium: 0, quantity: 1, unit: 'unid' },
    { category: 2, name: 'Yoga', calories: 120, fat: 0, sugar: 0, protein: 0, carbs: 0, fiber: 0, sodium: 0, quantity: 1, unit: 'unid' },
    { category: 2, name: 'Fútbol', calories: 400, fat: 0, sugar: 0, protein: 0, carbs: 0, fiber: 0, sodium: 0, quantity: 1, unit: 'unid' },
    { category: 2, name: 'Boxeo', calories: 450, fat: 0, sugar: 0, protein: 0, carbs: 0, fiber: 0, sodium: 0, quantity: 1, unit: 'unid' },
    { category: 2, name: 'HIIT', calories: 400, fat: 0, sugar: 0, protein: 0, carbs: 0, fiber: 0, sodium: 0, quantity: 1, unit: 'unid' },
    { category: 2, name: 'Pilates', calories: 180, fat: 0, sugar: 0, protein: 0, carbs: 0, fiber: 0, sodium: 0, quantity: 1, unit: 'unid' },
    { category: 2, name: 'Crossfit', calories: 500, fat: 0, sugar: 0, protein: 0, carbs: 0, fiber: 0, sodium: 0, quantity: 1, unit: 'unid' },
    { category: 2, name: 'Tenis', calories: 300, fat: 0, sugar: 0, protein: 0, carbs: 0, fiber: 0, sodium: 0, quantity: 1, unit: 'unid' },
    { category: 2, name: 'Senderismo', calories: 250, fat: 0, sugar: 0, protein: 0, carbs: 0, fiber: 0, sodium: 0, quantity: 1, unit: 'unid' }
]
