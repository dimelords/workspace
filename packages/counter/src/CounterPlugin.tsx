import React from 'react';
import {
  PluginBase,
  Message,
  MessageHandler,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  sharedMessageBus,
} from '@dimelords/shared';
import '@dimelords/shared/styles.css';
import { CounterData, CounterConfig } from './types';
import { Plus, Minus } from 'lucide-react';
import { COUNTER_UPDATE, manifest } from './manifest';

interface CounterUpdateMessage extends Message<{ value: number }> {
  type: typeof COUNTER_UPDATE;
}

export default class CounterPlugin extends PluginBase<CounterData, CounterConfig> {
  private messageHandler: MessageHandler = (message: Message) => {
    if (message.type === COUNTER_UPDATE && message.source !== this.id) {
      const counterMessage = message as CounterUpdateMessage;
      this.onUpdate({ value: counterMessage.payload.value });
    }
  };

  constructor(id: string, initialData?: Partial<CounterData>, config?: CounterConfig) {
    super(
      id,
      manifest,
      {
        value: initialData?.value ?? config?.initialValue ?? 0,
        increment: initialData?.increment ?? config?.defaultIncrement ?? 1,
        lastUpdate: new Date().toISOString(),
      },
      config,
    );

    sharedMessageBus.subscribe(COUNTER_UPDATE, this.messageHandler);
  }

  onUpdate(data: Partial<CounterData>): void {
    this.data = {
      ...this.data,
      ...data,
      lastUpdate: new Date().toISOString(),
    };

    sharedMessageBus.publish({
      type: COUNTER_UPDATE,
      source: this.id,
      payload: { value: this.data.value },
      timestamp: Date.now(),
      messageId: crypto.randomUUID(),
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
  const [data, setData] = React.useState(plugin.data);

  const handleUpdate = (newData: Partial<CounterData>) => {
    plugin.onUpdate(newData);
    setData({ ...plugin.data });
  };

  const handleIncrement = () => {
    handleUpdate({ value: data.value + data.increment });
  };

  const handleDecrement = () => {
    handleUpdate({ value: data.value - data.increment });
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
