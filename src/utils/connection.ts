import type { CPUComponent } from "../data/components";
import type { Port, PortName } from "../types/types";

export interface Point {
  x: number;
  y: number;
}

export interface ConnectionPoints {
  sourcePoint: Point;
  targetPoint: Point;
  path: string;
}

// Calculate the best connection points between two nodes
export function calculateConnectionPoints(
  source: Port,
  target: Port
): ConnectionPoints {
  // Calculate center points of each node
  const sourceCenter = {
    x: source.x + 10,
    y: source.y + 10,
  };

  const targetCenter = {
    x: target.x + 10,
    y: target.y + 10,
  };

  // Determine which sides to connect based on relative positions
  const dx = targetCenter.x - sourceCenter.x;
  const dy = targetCenter.y - sourceCenter.y;

  // Calculate connection points on the edges of the nodes
  let sourcePoint: Point;
  let targetPoint: Point;

  // Horizontal alignment check (for straight lines)
  const horizontalAligned = Math.abs(sourceCenter.y - targetCenter.y) < 10;

  // Vertical alignment check (for straight lines)
  const verticalAligned = Math.abs(sourceCenter.x - targetCenter.x) < 10;

  if (horizontalAligned) {
    // Nodes are roughly horizontally aligned - use left/right sides
    if (dx > 0) {
      // Target is to the right of source
      sourcePoint = {
        x: source.x + source.width,
        y: sourceCenter.y,
      };
      targetPoint = {
        x: target.x,
        y: targetCenter.y,
      };
    } else {
      // Target is to the left of source
      sourcePoint = {
        x: source.x,
        y: sourceCenter.y,
      };
      targetPoint = {
        x: target.x + target.width,
        y: targetCenter.y,
      };
    }
  } else if (verticalAligned) {
    // Nodes are roughly vertically aligned - use top/bottom sides
    if (dy > 0) {
      // Target is below source
      sourcePoint = {
        x: sourceCenter.x,
        y: source.y + source.height,
      };
      targetPoint = {
        x: targetCenter.x,
        y: target.y,
      };
    } else {
      // Target is above source
      sourcePoint = {
        x: sourceCenter.x,
        y: source.y,
      };
      targetPoint = {
        x: targetCenter.x,
        y: target.y + target.height,
      };
    }
  } else {
    // Nodes are not aligned - determine the best connection points
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal distance is greater
      if (dx > 0) {
        // Target is to the right of source
        sourcePoint = {
          x: source.x + source.width,
          y: sourceCenter.y,
        };
        targetPoint = {
          x: target.x,
          y: targetCenter.y,
        };
      } else {
        // Target is to the left of source
        sourcePoint = {
          x: source.x,
          y: sourceCenter.y,
        };
        targetPoint = {
          x: target.x + target.width,
          y: targetCenter.y,
        };
      }
    } else {
      // Vertical distance is greater
      if (dy > 0) {
        // Target is below source
        sourcePoint = {
          x: sourceCenter.x,
          y: source.y + source.height,
        };
        targetPoint = {
          x: targetCenter.x,
          y: target.y,
        };
      } else {
        // Target is above source
        sourcePoint = {
          x: sourceCenter.x,
          y: source.y,
        };
        targetPoint = {
          x: targetCenter.x,
          y: target.y + target.height,
        };
      }
    }
  }

  // Generate the path for the connection
  let path: string;

  if (horizontalAligned) {
    // Straight horizontal line
    path = `M ${sourcePoint.x} ${sourcePoint.y} L ${targetPoint.x} ${targetPoint.y}`;
  } else if (verticalAligned) {
    // Straight vertical line
    path = `M ${sourcePoint.x} ${sourcePoint.y} L ${targetPoint.x} ${targetPoint.y}`;
  } else {
    // Create a path with bends
    const midX = (sourcePoint.x + targetPoint.x) / 2;

    path = `M ${sourcePoint.x} ${sourcePoint.y} 
            L ${midX} ${sourcePoint.y} 
            L ${midX} ${targetPoint.y} 
            L ${targetPoint.x} ${targetPoint.y}`;
  }

  return { sourcePoint, targetPoint, path };
}

export function calculatePortCoords(
  components: CPUComponent[]
): Record<PortName, Point> {
  const coords: Record<PortName, Point> = {};

  components.forEach((comp) => {
    const ports = comp.getPorts();
    ports.forEach((port) => {
      coords[port.id as PortName] = { x: port.x, y: port.y };
    });
  });

  return coords;
}
