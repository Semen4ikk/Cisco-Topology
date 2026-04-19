'use client';

import { useEffect, useRef, useState } from 'react';

import cytoscape, { Core, NodeSingular, EventObject } from 'cytoscape';
import { mockHybridNetwork } from '@/shared/data/topology.data';
import styles from "./topologyGraph.module.css";
import { runLayoutWithOffset } from "@/features/runLayoutWithOffset";
import { TopologyNodeData } from "@/features/nodePopover/types/types";
import { NodePopover } from "@/features/nodePopover/ui/NodePopover";

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
            }, 100);
        });

        return () => {
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