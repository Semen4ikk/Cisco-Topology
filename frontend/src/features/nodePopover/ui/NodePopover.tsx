'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { Core } from 'cytoscape';
import { NodePopoverContent } from './NodePopoverContent';
import type { TopologyNodeData } from '../types/types';
import styles from './NodePopover.module.css';

export interface NodePopoverProps {
    cy: Core | null;
    nodeId: string | null;
    open: boolean;
    onClose: () => void;
    nodeData: TopologyNodeData | null;
    children?: ReactNode;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    className?: string;
}

export function NodePopover({
                                cy,
                                nodeId,
                                open,
                                onClose,
                                nodeData,
                                children,
                                placement = 'top',
                                className = ''
                            }: NodePopoverProps) {
    const popoverElRef = useRef<HTMLDivElement>(null);
    const mountedRef = useRef(false);
    const animationFrameRef = useRef<number | null>(null);
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    const updatePopoverPosition = () => {
        if (!cy || !nodeId || !popoverElRef.current) return;

        const node = cy.getElementById(nodeId);
        if (!node.length) return;

        const renderedPos = node.renderedPosition();
        const el = popoverElRef.current;

        const offset = 16;
        let left = renderedPos.x;
        let top = renderedPos.y;

        switch (placement) {
            case 'top':
                top -= offset;
                break;
            case 'bottom':
                top += offset;
                break;
            case 'left':
                left -= offset;
                break;
            case 'right':
                left += offset;
                break;
        }

        const popoverRect = el.getBoundingClientRect();
        left -= popoverRect.width / 2;
        top -= popoverRect.height / 2;

        el.style.display = 'block';
        el.style.left = `${left}px`;
        el.style.top = `${top}px`;
        el.style.position = 'fixed';
        el.style.transform = 'none';
        el.style.zIndex = '9999';
    };

    // Эффект для обновления позиции
    useEffect(() => {
        if (!open || !nodeId || !cy) return;

        const update = () => {
            if (mountedRef.current) {
                updatePopoverPosition();
            }
        };

        const events = ['pan', 'zoom', 'resize', 'dragfree'];
        events.forEach((evt) => {
            cy.on(evt, update);
        });

        const onWindowResize = () => update();
        window.addEventListener('resize', onWindowResize);

        const timer = setTimeout(update, 16);

        return () => {
            events.forEach((evt) => cy.off(evt, update));
            window.removeEventListener('resize', onWindowResize);
            clearTimeout(timer);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (popoverElRef.current) {
                popoverElRef.current.style.display = 'none';
            }
        };
    }, [open, nodeId, cy, placement]);

    useEffect(() => {
        if (!open) return;
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [open, onClose]);
    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Element;
            const isInPopover = popoverElRef.current?.contains(target);
            const isInCanvas = target?.tagName === 'CANVAS' ||
                target?.closest('.cytoscape-canvas') ||
                target?.closest('[id^="cy"]');

            if (!isInPopover && !isInCanvas) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, onClose, cy]);
    if (!open || !nodeId || !mountedRef.current) return null;
    const content: ReactNode = children !== undefined
        ? children
        : nodeData
            ? <NodePopoverContent data={nodeData} />
            : null;

    return createPortal(
        <div
            ref={popoverElRef}
            className={`${styles.popover} ${className}`}
            style={{ display: 'none' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`popover-title-${nodeId}`}
        >
            <button
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="Закрыть"
                type="button"
            >
                x
            </button>
            <div className={styles.content}>
                {content}
            </div>
        </div>,
        document.body
    );
}