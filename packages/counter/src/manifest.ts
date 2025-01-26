import { PluginManifest } from '@dimelords/shared';

export const COUNTER_UPDATE = 'COUNTER_UPDATE';

export const manifest: PluginManifest = {
    id: 'counter',
    name: 'Counter Plugin',
    description: 'Simple counter with increment/decrement',
    version: '1.0.0',
    author: 'Fredrik Gustafsson',
    emits: [{
        type: COUNTER_UPDATE,
        schema: {
            type: 'object',
            properties: {
                value: { type: 'number' }
            }
        },
        description: 'Emitted when counter value changes'
    }]
};