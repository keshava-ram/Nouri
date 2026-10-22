export interface WeatherInfo {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  condition: string;
  isRainy: boolean;
  climateCategory: 'cooling' | 'warming' | 'neutral';
  climateLabel: string;
  hydrationBonusMl: number;
  advice: string;
}

export async function geocodeCity(cityName: string): Promise<{ latitude: number; longitude: number; name: string } | null> {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const top = data.results[0];
      return {
        latitude: top.latitude,
        longitude: top.longitude,
        name: top.name,
      };
    }
    return null;
  } catch (err) {
    console.error('Geocoding error:', err);
    return null;
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
    const res = await fetch(url);
    if (!res.ok) return 'Local Area';
    const data = await res.json();
    return data.city || data.locality || data.principalSubdivision || 'Local Area';
  } catch (err) {
    console.error('Reverse geocode error:', err);
    return 'Local Area';
  }
}

export async function getLocalWeather(lat: number = 17.385, lng: number = 78.4867): Promise<WeatherInfo> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,apparent_temperature`;
    const res = await fetch(url, { next: { revalidate: 1800 } }); // Cache for 30 minutes
    if (!res.ok) {
      throw new Error(`Weather fetch failed: ${res.statusText}`);
    }

    const data = await res.json();
    const temp = Math.round(data.current?.temperature_2m ?? 28);
    const apparentTemp = Math.round(data.current?.apparent_temperature ?? temp);
    const humidity = Math.round(data.current?.relative_humidity_2m ?? 50);
    const code = data.current?.weather_code ?? 0;

    const isRainy = (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || (code >= 95 && code <= 99);

    let climateCategory: 'cooling' | 'warming' | 'neutral' = 'neutral';
    let climateLabel = 'Pleasant & Moderate';
    let hydrationBonusMl = 0;
    let advice = 'Standard balanced nutrition and steady hydration recommended.';

    if (temp >= 32 || apparentTemp >= 34) {
      climateCategory = 'cooling';
      climateLabel = `Hot & Sunny (${temp}°C)`;
      hydrationBonusMl = 600;
      advice = 'High thermal load! Prioritize cooling foods like curd, buttermilk, cucumbers, and boost water intake.';
    } else if (temp >= 28) {
      climateCategory = 'cooling';
      climateLabel = `Warm (${temp}°C)`;
      hydrationBonusMl = 300;
      advice = 'Warm climate today. Keep hydrating and include fresh fruits or light salads.';
    } else if (isRainy) {
      climateCategory = 'warming';
      climateLabel = `Rainy & Humid (${temp}°C)`;
      hydrationBonusMl = 0;
      advice = 'Wet weather can dampen digestion. Favor cooked, warming meals with ginger, cumin, and light soups.';
    } else if (temp <= 18) {
      climateCategory = 'warming';
      climateLabel = `Cold / Chilly (${temp}°C)`;
      hydrationBonusMl = 0;
      advice = 'Cool climate boosts metabolic appetite. Nourish with warming grains (millets), lentils, and hot broths.';
    }

    let condition = 'Clear Skies';
    if (code === 1 || code === 2 || code === 3) condition = 'Partly Cloudy';
    else if (code >= 45 && code <= 48) condition = 'Foggy';
    else if (code >= 51 && code <= 67) condition = 'Rain / Drizzle';
    else if (code >= 80 && code <= 82) condition = 'Rain Showers';
    else if (code >= 95) condition = 'Thunderstorm';

    return {
      temperature: temp,
      apparentTemperature: apparentTemp,
      humidity,
      condition,
      isRainy,
      climateCategory,
      climateLabel,
      hydrationBonusMl,
      advice,
    };
  } catch (error) {
    console.error('Failed to fetch Open-Meteo weather:', error);
    // Graceful fallback
    return {
      temperature: 28,
      apparentTemperature: 29,
      humidity: 55,
      condition: 'Sunny',
      isRainy: false,
      climateCategory: 'neutral',
      climateLabel: 'Moderate (28°C)',
      hydrationBonusMl: 250,
      advice: 'Stay hydrated through the afternoon and maintain balanced portions.',
    };
  }
}
