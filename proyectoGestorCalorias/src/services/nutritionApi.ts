const USDA_API_KEY = 'DEMO_KEY';
const USDA_URL = '/api-usda/fdc/v1/foods/search';
const OFF_URL = '/api-off/api/v2/search';

export type SuggestedFood = {
    id: string;
    name: string;
    brand?: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    sugar: number;
    sodium: number;
    fiber: number;
    image?: string;
    source: 'USDA' | 'OFF';
}

export const searchFoods = async (query: string): Promise<SuggestedFood[]> => {
    if (!query || query.length < 3) return [];

    try {
        // Consultar ambas APIs en paralelo usando el proxy
        const [usdaRes, offRes] = await Promise.all([
            fetch(`${USDA_URL}?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=5`),
            fetch(`${OFF_URL}?fields=product_name,brands,nutriments,image_front_thumb_url,code&search_terms=${encodeURIComponent(query)}&json=true&page_size=5`, {
                headers: { 'User-Agent': 'NutriTrackApp/1.0 (contact@example.com)' }
            })
        ]);

        const usdaData = await usdaRes.ok ? await usdaRes.json() : { foods: [] };
        const offData = await offRes.ok ? await offRes.json() : { products: [] };

        const usdaSuggestions: SuggestedFood[] = (usdaData.foods || []).map((food: any) => {
            const getNutrient = (id: number) => food.foodNutrients.find((n: any) => n.nutrientId === id)?.value || 0;
            return {
                id: `usda-${food.fdcId}`,
                name: food.description,
                brand: food.brandOwner || 'Genérico',
                calories: getNutrient(1008),
                protein: getNutrient(1003),
                carbs: getNutrient(1005),
                fat: getNutrient(1004),
                sugar: getNutrient(2000),
                sodium: getNutrient(1093),
                fiber: getNutrient(1079),
                source: 'USDA' as const
            };
        });

        const offSuggestions: SuggestedFood[] = (offData.products || []).map((product: any) => ({
            id: `off-${product.code}`,
            name: product.product_name || 'Desconocido',
            brand: product.brands || 'Sin Marca',
            calories: product.nutriments?.['energy-kcal_100g'] || 0,
            protein: product.nutriments?.proteins_100g || 0,
            carbs: product.nutriments?.carbohydrates_100g || 0,
            fat: product.nutriments?.fat_100g || 0,
            sugar: product.nutriments?.sugars_100g || 0,
            sodium: (product.nutriments?.sodium_100g || 0) * 1000,
            fiber: product.nutriments?.fiber_100g || 0,
            image: product.image_front_thumb_url,
            source: 'OFF' as const
        }));

        return [...usdaSuggestions, ...offSuggestions];
    } catch (error) {
        console.error('Error fetching nutrition data:', error);
        return [];
    }
}

export const getFoodByBarcode = async (barcode: string): Promise<SuggestedFood | null> => {
    try {
        const response = await fetch(`/api-off/api/v2/product/${barcode}.json`, {
            headers: { 'User-Agent': 'NutriTrackApp/1.0 (contact@example.com)' }
        });
        const data = await response.json();
        
        if (data.status !== 1) return null;

        const product = data.product;
        return {
            id: `off-${product.code}`,
            name: product.product_name || 'Desconocido',
            brand: product.brands || 'Sin Marca',
            calories: product.nutriments?.['energy-kcal_100g'] || 0,
            protein: product.nutriments?.proteins_100g || 0,
            carbs: product.nutriments?.carbohydrates_100g || 0,
            fat: product.nutriments?.fat_100g || 0,
            sugar: product.nutriments?.sugars_100g || 0,
            sodium: (product.nutriments?.sodium_100g || 0) * 1000,
            fiber: product.nutriments?.fiber_100g || 0,
            image: product.image_front_thumb_url,
            source: 'OFF' as const
        };
    } catch (error) {
        console.error('Error fetching barcode data:', error);
        return null;
    }
}
