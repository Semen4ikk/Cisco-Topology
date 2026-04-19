export interface TopologyNodeData {
    id: string;
    label: string;
    type: 'server' | 'computer' | 'router' | string;
    status: 'online' | 'offline' | 'warning' | string;
    [key: string]: unknown;
}

export const NODE_TYPE_ICONS: Record<string, string> = {
    server: '🖥️',
    computer: '💻',
    router: '📡',
    switch: '🔀',
    default: '🔌',
    printer: '🖨️'
};

export const STATUS_COLORS: Record<string, string> = {
    online: '#22c55e',
    offline: '#ef4444',
    warning: '#ffb42f',
    default: '#dcebfb'
};