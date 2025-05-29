import React, { useRef, useEffect } from 'react';

interface Point {
  x: number;
  y: number;
}

export interface DragEventDetail {
  x: number;
  y: number;
}

interface DraggableSVGElementProps {
  children: React.ReactNode;
  onDragStart?: (detail: DragEventDetail) => void;
  onDrag?: (detail: DragEventDetail) => void;
  onDragEnd?: (detail: DragEventDetail) => void;
}

const DraggableSVGElement = ({ 
  children, 
  onDragStart, 
  onDrag, 
  onDragEnd 
}: DraggableSVGElementProps) => {
  const elRef = useRef<SVGGElement | null>(null);
  const xlateRef = useRef<SVGTransform | null>(null);
  const txStartRef = useRef<Point>({ x: 0, y: 0 });
  const mouseStartRef = useRef<Point>({ x: 0, y: 0 });

  const findParentSVG = (element: Element | null): SVGSVGElement | null => {
    while (element && element.tagName !== 'svg') {
      element = element.parentNode as Element;
    }
    return element as SVGSVGElement;
  };

  const inElementSpace = (evt: MouseEvent, svg: SVGSVGElement): Point => {
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    const parentNode = elRef.current?.parentNode as SVGGElement;
    return pt.matrixTransform(parentNode.getScreenCTM()?.inverse());
  };

  const fireEvent = (eventName: string, xlate: SVGTransform) => {
    const detail = { x: xlate.matrix.e, y: xlate.matrix.f };
    
    switch (eventName) {
      case 'dragstart':
        onDragStart?.(detail);
        break;
      case 'drag':
        onDrag?.(detail);
        break;
      case 'dragend':
        onDragEnd?.(detail);
        break;
    }
  };

  const startMove = (evt: MouseEvent) => {
    const el = elRef.current;
    if (!el) return;

    // Stop propagation to prevent interfering with other draggable elements
    evt.stopPropagation();
    
    const svg = findParentSVG(el);
    if (!svg) {
      console.error('Element must be inside an SVG wrapper');
      return;
    }

    const root = svg.ownerDocument?.documentElement || svg;
    root.addEventListener('mousemove', handleMove);
    root.addEventListener('mouseup', finishMove);

    const xforms = el.transform.baseVal;
    let xlate = xforms.numberOfItems > 0 ? xforms.getItem(0) : null;
    
    if (!xlate || xlate.type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
      xlate = svg.createSVGTransform();
      xforms.insertItemBefore(xlate, 0);
    }

    xlateRef.current = xlate;
    txStartRef.current = {
      x: xlate.matrix.e,
      y: xlate.matrix.f
    };
    mouseStartRef.current = inElementSpace(evt, svg);

    fireEvent('dragstart', xlate);
  };

  const handleMove = (evt: MouseEvent) => {
    evt.preventDefault();
    const xlate = xlateRef.current;
    const el = elRef.current;
    if (!xlate || !el) return;

    const svg = findParentSVG(el);
    if (!svg) return;

    const point = inElementSpace(evt, svg);
    xlate.setTranslate(
      txStartRef.current.x + point.x - mouseStartRef.current.x,
      txStartRef.current.y + point.y - mouseStartRef.current.y
    );

    fireEvent('drag', xlate);
  };

  const finishMove = () => {
    const el = elRef.current;
    if (!el) return;

    const svg = findParentSVG(el);
    if (!svg) return;

    const root = svg.ownerDocument?.documentElement || svg;
    root.removeEventListener('mousemove', handleMove);
    root.removeEventListener('mouseup', finishMove);

    if (xlateRef.current) {
      fireEvent('dragend', xlateRef.current);
    }
  };

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    el.addEventListener('mousedown', startMove);

    return () => {
      el.removeEventListener('mousedown', startMove);
      // Clean up any potential lingering event listeners
      const svg = findParentSVG(el);
      if (svg) {
        const root = svg.ownerDocument?.documentElement || svg;
        root.removeEventListener('mousemove', handleMove);
        root.removeEventListener('mouseup', finishMove);
      }
    };
  });

  return (
    <g ref={elRef}>
      {children}
    </g>
  );
};

export default DraggableSVGElement;