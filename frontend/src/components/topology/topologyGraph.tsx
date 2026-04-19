'use client';

import { useEffect, useRef, useState } from 'react';
import cytoscape, { Core, NodeSingular, EventObject } from 'cytoscape';
import { mockHybridNetwork } from '@/shared/data/topology.data';
import styles from "./topologyGraph.module.css";
import { runLayoutWithOffset } from "@/features/runLayoutWithOffset";
import { TopologyNodeData } from "@/features/nodePopover/types/types";
import { NodePopover } from "@/features/nodePopover/ui/NodePopover";

const STORAGE_KEY = 'topology-graph-state';

export default function TopologyGraph() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cyRef = useRef<Core | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [selectedNodeData, setSelectedNodeData] = useState<TopologyNodeData | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        if (cyRef.current) return;

        cyRef.current = cytoscape({
            container: containerRef.current,
            elements: mockHybridNetwork,
            layout: { name: 'grid', padding: 20 },
            style: [
                {
                    selector: 'node[type="server"]',
                    style: {
                        'shape': 'rectangle',
                        'background-image': `url(icons/server.svg)`,
                        'background-fit': 'cover',
                        'label': 'data(label)',
                        'background-color': '#f8fafc',
                        'width': 40,
                        'height': 40,
                        'text-valign': 'bottom',
                        'text-halign': 'center',
                        'font-size': '10px',
                        'text-wrap': 'wrap',
                        'text-max-width': '80px'
                    },
                },
                {
                    selector: 'node[type="computer"]',
                    style: {
                        'shape': 'rectangle',
                        'background-image': `url(icons/computer.svg)`,
                        'background-fit': 'cover',
                        'label': 'data(label)',
                        'background-color': '#f8fafc',
                        'width': 40,
                        'height': 40,
                        'text-valign': 'bottom',
                        'text-halign': 'center',
                        'font-size': '10px',
                        'text-wrap': 'wrap',
                        'text-max-width': '80px'
                    },
                },
                {
                    selector: 'node[type="router"]',
                    style: {
                        'shape': 'rectangle',
                        'background-image': `url(icons/router.svg)`,
                        'background-fit': 'cover',
                        'label': 'data(label)',
                        'background-color': '#f8fafc',
                        'width': 40,
                        'height': 40,
                        'text-valign': 'bottom',
                        'text-halign': 'center',
                        'font-size': '10px',
                        'text-wrap': 'wrap',
                        'text-max-width': '80px'
                    },
                },
            ]
        });

        const cy = cyRef.current;

        const saveState = () => {
                const state = {
                    positions: cy.nodes().map(n => ({ id: n.id(), x: n.position('x'), y: n.position('y') })),
                    zoom: cy.zoom(),
                    pan: cy.pan()
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        };

        const loadState = (): boolean => {

                const raw = localStorage.getItem(STORAGE_KEY);
                if (!raw) return false;

                const state = JSON.parse(raw);
                if (state.positions) {
                    state.positions.forEach((p: { id: string; x: number; y: number }) => {
                        const node = cy.getElementById(p.id);
                        if (node.length) node.position({ x: p.x, y: p.y });
                    });
                }
                if (state.zoom) cy.zoom(state.zoom);
                if (state.pan) cy.pan(state.pan);
                return true;
        };

        let saveTimeout: ReturnType<typeof setTimeout> | null = null;

        const handleStateChange = () => {
            if (saveTimeout) clearTimeout(saveTimeout);
            saveTimeout = setTimeout(saveState, 300);
        };
        const hasSavedState = loadState();

        if (!hasSavedState) {
            cy.ready(() => {
                let cursor = { x: 50, y: 250 };

                cursor = runLayoutWithOffset(
                    cy,
                    '.star',
                    { name: 'circle', radius: 120, animate: false },
                    cursor.x,
                    cursor.y,
                    'right'
                );

                runLayoutWithOffset(
                    cy,
                    '.ring',
                    { name: 'circle', radius: 100, animate: false },
                    cursor.x + 50,
                    50,
                    'down'
                );

                runLayoutWithOffset(
                    cy,
                    '.tree',
                    {
                        name: 'breadthfirst',
                        directed: true,
                        roots: ['router-1', 'router-3'],
                        animate: false,
                        padding: 20,
                        spacingFactor: 1.5,
                        orientation: 'BT'
                    } as any,
                    cursor.x,
                    cursor.y,
                    'down'
                );

                setTimeout(() => {
                    cy.fit(undefined, 110);
                    saveState();
                }, 100);
            });
        }
        cy.on('dragfree position', 'node', handleStateChange);
        cy.on('zoom pan', handleStateChange);

        const handleNodeClick = (e: EventObject) => {
            const node = e.target as NodeSingular;
            const data = node.data() as TopologyNodeData;
            setSelectedNodeId(node.id());
            setSelectedNodeData(data);
        };

        const handleBgClick = (e: EventObject) => {
            if (!e.target || e.target === cy) {
                setSelectedNodeId(null);
                setSelectedNodeData(null);
            }
        };

        cy.on('tap', 'node', handleNodeClick);
        cy.on('tap', handleBgClick);

        return () => {
            if (saveTimeout) clearTimeout(saveTimeout);

            cy.off('dragfree position', 'node', handleStateChange);
            cy.off('zoom pan', handleStateChange);

            saveState();

            cy.off('tap', 'node', handleNodeClick);
            cy.off('tap', handleBgClick);
            cy.destroy();
            cyRef.current = null;
        };
    }, []);

    return (
        <>
            <div ref={containerRef} className={styles.topologyGraphContainer} />
            <NodePopover
                cy={cyRef.current}
                nodeId={selectedNodeId}
                open={!!selectedNodeId}
                onClose={() => {
                    setSelectedNodeId(null);
                    setSelectedNodeData(null);
                }}
                nodeData={selectedNodeData}
            />
        </>
    );
}