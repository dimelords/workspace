export interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  lastUpdate: string;
}

export interface WeatherConfig {
  location?: string;
  tempThresholds?: {
    cold: number;
    mild: number;
    hot: number;
  };
}
