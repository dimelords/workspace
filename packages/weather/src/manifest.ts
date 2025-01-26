import { PluginManifest } from '@dimelords/shared';

export const WEATHER_UPDATE = 'WEATHER_UPDATE';
export const COUNTER_UPDATE = 'COUNTER_UPDATE';

export const manifest: PluginManifest = {
    id: 'weather',
    name: 'Weather Plugin',
    description: 'Weather display that reacts to counter changes',
    version: '1.0.0',
    author: 'Fredrik Gustafsson',
    emits: [{
        type: WEATHER_UPDATE,
        schema: {
            type: 'object',
            properties: {
                temperature: { type: 'number' },
                condition: { type: 'string' },
                lastUpdate: { type: 'string' }
            }
        },
        description: 'Emitted when weather conditions change'
    }],
    accepts: [{
        type: COUNTER_UPDATE,
        schema: {
            type: 'object',
            properties: {
                value: { type: 'number' }
            }
        },
        description: 'Accepts counter updates to modify weather'
    }]
};