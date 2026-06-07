export type Category = {
    id: number,
    name: string
}

export type Activity = {
    id: string,
    category: number,
    name: string,
    calories: number,
    fat: number,
    sugar: number,
    protein: number,
    carbs: number,
    fiber: number,
    sodium: number,
    quantity: number,
    unit: string,
    timestamp?: number
}
