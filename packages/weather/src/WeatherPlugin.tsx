import React, { useEffect, useState } from 'react';
import { PluginBase, Message, Card, CardHeader, CardTitle, CardContent } from '@dimelords/shared';
import '@dimelords/shared/styles.css';
import { WeatherData, WeatherConfig } from './types';
import { Cloud, Sun, CloudRain, CloudLightning } from 'lucide-react';
import { sharedMessageBus } from '@dimelords/shared';

const WEATHER_UPDATE = 'WEATHER_UPDATE';
const COUNTER_UPDATE = 'COUNTER_UPDATE';

export class WeatherPlugin extends PluginBase<WeatherData, WeatherConfig> {
  constructor(id: string, initialData?: Partial<WeatherData>, config?: WeatherConfig) {
    super(
      id,
      '1.0.0',
      {
        temperature: initialData?.temperature ?? 20,
        condition: initialData?.condition ?? 'sunny',
        lastUpdate: new Date().toISOString(),
      },
      {
        location: 'Default Location',
        tempThresholds: {
          cold: 10,
          mild: 20,
          hot: 30,
          ...config?.tempThresholds
        },
        ...config
      }
    );
  }

  onUpdate(data: Partial<WeatherData>): void {
    console.log('WeatherPlugin.onUpdate', data);
    this.data = { 
      ...this.data, 
      ...data,
      lastUpdate: new Date().toISOString() 
    };

    sharedMessageBus.publish<WeatherData>({
      type: WEATHER_UPDATE,
      source: this.id,
      payload: this.data,
      timestamp: Date.now(),
    });
  }

  render(): React.ReactNode {
    return <WeatherComponent plugin={this} />;
  }
}

interface WeatherComponentProps {
  plugin: WeatherPlugin;
}

function WeatherComponent({ plugin }: WeatherComponentProps) {
    const [data, setData] = useState(plugin.data); // Use state for plugin data
    const [counterValue, setCounterValue] = useState<number>(0);
  
    useEffect(() => {
        // Subscribe to counter updates
        const unsubscribe = sharedMessageBus.subscribe<{ value: number }>(
          COUNTER_UPDATE,
          (message: Message<{ value: number }>) => {
            setCounterValue(message.payload.value);
    
            // Update temperature and condition
            const newTemp = 20 + message.payload.value / 2;
            const updatedData = {
              temperature: newTemp,
              condition: getConditionForTemperature(newTemp, plugin.config?.tempThresholds),
            };
            plugin.onUpdate(updatedData);
            setData({ ...plugin.data }); // Update local state
          }
        );
    
        return () => unsubscribe();
      }, [plugin]);

  const WeatherIcon = getWeatherIcon(data.condition);

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{plugin.config?.location}</span>
          <WeatherIcon className="h-6 w-6" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold">{data.temperature.toFixed(1)}°C</span>
            <span className="text-muted-foreground capitalize">{data.condition}</span>
          </div>
          <div className="text-sm text-muted-foreground">Counter value: {counterValue}</div>
          <div className="text-sm text-muted-foreground">Last updated: {new Date(data.lastUpdate).toLocaleTimeString()}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function getWeatherIcon(condition: WeatherData['condition']) {
  switch (condition) {
    case 'cloudy':
      return Cloud;
    case 'rainy':
      return CloudRain;
    case 'stormy':
      return CloudLightning;
    case 'sunny':
    default:
      return Sun;
  }
}

function getConditionForTemperature(
  temp: number,
  thresholds: WeatherConfig['tempThresholds'] = { cold: 10, mild: 20, hot: 30 }
): WeatherData['condition'] {
  if (temp < thresholds.cold) return 'cloudy';
  if (temp < thresholds.mild) return 'sunny';
  if (temp < thresholds.hot) return 'sunny';
  return 'stormy';
}