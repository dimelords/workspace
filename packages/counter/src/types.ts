// types.ts
export interface CounterData {
    value: number;
    increment: number;
    lastUpdate: string;
  }
  
  export interface CounterConfig {
    initialValue?: number;
    defaultIncrement?: number;
  }