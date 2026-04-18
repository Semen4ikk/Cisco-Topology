import cytoscape, { Core } from 'cytoscape';

export const runLayoutWithOffset = (
    cy: Core,
    selector: string,
    layoutOpts: cytoscape.LayoutOptions,
    startX: number,
    startY: number,
    direction: 'right' | 'down' | 'left' | 'up' = 'right'
) => {
    const nodes = cy.elements(selector).nodes();
    if (!nodes || nodes.length === 0) return { x: startX, y: startY };

    const layoutConfig = { ...layoutOpts, animate: false } as cytoscape.LayoutOptions;
    nodes.layout(layoutConfig).run();

    const bb = nodes.boundingBox();

    nodes.positions((node) => ({
        x: node.position('x') + (startX - bb.x1),
        y: node.position('y') + (startY - bb.y1)
    }));

    let nextX = startX;
    let nextY = startY;

    if (direction === 'right') nextX = startX + bb.w + 100;
    if (direction === 'left') nextX = startX - bb.w - 100;
    if (direction === 'down') nextY = startY + bb.h + 100;
    if (direction === 'up') nextY = startY - bb.h - 100;

    return { x: nextX, y: nextY };
};