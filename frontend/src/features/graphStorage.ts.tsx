import cytoscape from 'cytoscape';

const STORAGE_KEY = 'topology-graph-state';

export interface GraphState {
    positions: Record<string, { x: number; y: number }>;
    zoom: number;
    pan: { x: number; y: number };
    timestamp: number;
}

export const graphStorage = {
    save: (cy: cytoscape.Core) => {

            const nodes = cy.nodes();
            const positions: Record<string, { x: number; y: number }> = {};

            nodes.forEach((node) => {
                positions[node.id()] = node.position();
            });

            const state: GraphState = {
                positions,
                zoom: cy.zoom(),
                pan: cy.pan(),
                timestamp: Date.now(),
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },

    load: (): GraphState | null => {

            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) return null;

            const state = JSON.parse(data) as GraphState;
            return state;
    },

    clear: () => {
        localStorage.removeItem(STORAGE_KEY);
    },
};