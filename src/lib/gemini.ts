
/**
 * SWITCHED TO GOOGLE CLOUD VISION API
 * This is the more stable "Vision" service that usually comes with Google Maps keys.
 */

// Local Database for matching Vision labels to Nutrition
const NUTRITION_DB: Record<string, { calories: number, protein: number, carbs: number, fats: number }> = {
    "egg": { calories: 78, protein: 6, carbs: 0.6, fats: 5 },
    "rice": { calories: 206, protein: 4.3, carbs: 45, fats: 0.4 },
    "chicken": { calories: 165, protein: 31, carbs: 0, fats: 3.6 },
    "banana": { calories: 105, protein: 1.3, carbs: 27, fats: 0.3 },
    "bread": { calories: 79, protein: 3, carbs: 15, fats: 1 },
    "salmon": { calories: 208, protein: 20, carbs: 0, fats: 13 },
    "beef": { calories: 250, protein: 26, carbs: 0, fats: 15 },
    "apple": { calories: 95, protein: 0.5, carbs: 25, fats: 0.3 },
    "coffee": { calories: 2, protein: 0.3, carbs: 0, fats: 0 },
    "milk": { calories: 146, protein: 8, carbs: 12, fats: 8 },
    "nasi": { calories: 206, protein: 4.3, carbs: 45, fats: 0.4 },
    "telur": { calories: 78, protein: 6, carbs: 0.6, fats: 5 },
    "ayam": { calories: 165, protein: 31, carbs: 0, fats: 3.6 },
    "salad": { calories: 150, protein: 5, carbs: 10, fats: 8 },
    "pizza": { calories: 266, protein: 11, carbs: 33, fats: 10 },
    "burger": { calories: 295, protein: 17, carbs: 30, fats: 14 },
    "avocado": { calories: 160, protein: 2, carbs: 9, fats: 15 },
    "oatmeal": { calories: 158, protein: 6, carbs: 27, fats: 3 },
    "yogurt": { calories: 130, protein: 12, carbs: 9, fats: 0 },
};

export async function analyzeFoodImage(imageBase64: string, apiKey: string) {
    if (!apiKey) throw new Error("API Key is missing");

    const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

    // Using Cloud Vision Endpoint (Much more stable for standard keys)
    const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    const payload = {
        requests: [{
            image: { content: base64Data },
            features: [
                { type: "LABEL_DETECTION", maxResults: 5 },
                { type: "OBJECT_LOCALIZATION", maxResults: 5 }
            ]
        }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || "Vision API Error");

        const labels = data.responses[0]?.labelAnnotations || [];
        if (labels.length === 0) return { error: "Could not identify food" };

        // Find the first label that matches our nutrition DB
        for (const label of labels) {
            const desc = label.description.toLowerCase();
            for (const key in NUTRITION_DB) {
                if (desc.includes(key)) {
                    return {
                        name: label.description,
                        ...NUTRITION_DB[key],
                        confidence: label.score
                    };
                }
            }
        }

        // Fallback if no match found in DB, just return the name and default info
        return {
            name: labels[0].description,
            calories: 150,
            protein: 5,
            carbs: 20,
            fats: 5,
            confidence: labels[0].score
        };
    } catch (error: any) {
        console.error("Vision API Error:", error);
        throw error;
    }
}

/**
 * Text shortcut now uses local search to avoid API errors
 */
export async function analyzeFoodText(textInput: string, _apiKey: string) {
    const input = textInput.toLowerCase();

    // Look for keywords in our DB
    for (const key in NUTRITION_DB) {
        if (input.includes(key)) {
            return {
                name: textInput,
                ...NUTRITION_DB[key]
            };
        }
    }

    // Default if no match found locally
    return {
        name: textInput,
        calories: 100,
        protein: 4,
        carbs: 15,
        fats: 3
    };
}
