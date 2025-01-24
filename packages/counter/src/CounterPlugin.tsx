// CounterPlugin.tsx
import React from 'react';
import { PluginBase, BasicMessageBus, Card, CardHeader, CardTitle, CardContent, Button } from '@dimelords/shared';
import '@dimelords/shared/styles.css';
import { CounterData, CounterConfig } from './types';
import { Plus, Minus } from 'lucide-react';

const messageBus = new BasicMessageBus();
const COUNTER_UPDATE = 'COUNTER_UPDATE';

export class CounterPlugin extends PluginBase<CounterData, CounterConfig> {
  constructor(id: string, initialData?: Partial<CounterData>, config?: CounterConfig) {
    super(
      id,
      '1.0.0',
      {
        value: initialData?.value ?? config?.initialValue ?? 0,
        increment: initialData?.increment ?? config?.defaultIncrement ?? 1,
        lastUpdate: new Date().toISOString(),
      },
      {
        initialValue: 0,
        defaultIncrement: 1,
        ...config
      }
    );
  }

  onUpdate(data: Partial<CounterData>): void {
    this.data = {
      ...this.data,
      ...data,
      lastUpdate: new Date().toISOString()
    };

    messageBus.publish({
      type: COUNTER_UPDATE,
      source: this.id,
      payload: { value: this.data.value },
      timestamp: Date.now(),
    });
  }

  render(): React.ReactNode {
    return <CounterComponent plugin={this} />;
  }
}

interface CounterComponentProps {
  plugin: CounterPlugin;
}

function CounterComponent({ plugin }: CounterComponentProps) {
  const { data } = plugin;

  const handleIncrement = () => {
    plugin.onUpdate({ value: data.value + data.increment });
  };

  const handleDecrement = () => {
    plugin.onUpdate({ value: data.value - data.increment });
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Counter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold">{data.value}</span>
            <div className="space-x-2">
              <Button variant="outline" size="icon" onClick={handleDecrement}>
                <Minus className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleIncrement}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date(data.lastUpdate).toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CounterPlugin;