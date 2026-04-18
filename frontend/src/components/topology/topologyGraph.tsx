'use client';

import { useEffect, useRef } from 'react';
import cytoscape, { Core } from 'cytoscape';
import { mockHybridNetwork } from '@/shared/data/topology.data';
import styles from "./topologyGraph.module.css"
import {runLayoutWithOffset} from "@/features/runLayoutWithOffset";

export default function TopologyGraph() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cyRef = useRef<Core | null>(null);

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
                        'background-image': 'url(icons/server.svg)',
                        'background-fit': 'cover',
                        'label': 'data(label)',
                        'background-color': '#f8fafc',
                        'width': 40,
                        'height': 40
                    },
                },
                {
                    selector: 'node[type="computer"]',
                    style: {
                        'shape': 'rectangle',
                        'background-image': 'url(icons/computer.svg)',
                        'background-fit': 'cover',
                        'label': 'data(label)',
                        'background-color': '#f8fafc',
                        'width': 40,
                        'height': 40
                    },
                },
                {
                    selector: 'node[type="router"]',
                    style: {
                        'shape': 'rectangle',
                        'background-image': 'url(icons/router.svg)',
                        'background-fit': 'cover',
                        'label': 'data(label)',
                        'background-color': '#f8fafc',
                        'width': 40,
                        'height': 40
                    },
                },
            ]
        });

        cyRef.current.ready(() => {
            let cursor = { x: 50, y: 250 };

            cursor = runLayoutWithOffset(
                cyRef.current!,
                '.star',
                {
                    name: 'circle',
                    radius: 120,
                    animate: false
                },
                cursor.x,
                cursor.y,
                'right'
            );

            runLayoutWithOffset(
                cyRef.current!,
                '.ring',
                {
                    name: 'circle',
                    radius: 100,
                    animate: false
                },
                cursor.x + 50,
                50,
                'down'
            );

            runLayoutWithOffset(
                cyRef.current!,
                '.tree',
                {
                    name: 'breadthfirst',
                    // name: 'circle',
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
                cyRef.current?.fit(undefined,110);
            }, 100);
        });

        return () => {
            cyRef.current?.destroy();
            cyRef.current = null;
        }

    }, []);

    return (
        <div
            ref={containerRef}
            className={styles.topologyGraphContainer}
        />
    );
}