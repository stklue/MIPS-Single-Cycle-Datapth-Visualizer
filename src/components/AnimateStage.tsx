import { datapaths } from "../data/data";
import { AnimateDatapath } from "./AnimateDatapath";
import type { Bus } from "../types/types";

export const AnimateStage = ({
  currentInstruction,
  activeStage,
  isAnimating,
}: {
  currentInstruction: string;
  activeStage: number;
  isAnimating: boolean;
}) => {
  const animatePaths = datapaths[currentInstruction].filter((path) =>
    path.stages.includes(activeStage)
  );

  return (
    <>
      {isAnimating ? (
        animatePaths.map((path) => (
          <AnimateDatapath key={path.bus.id} bus={path.bus} />
        ))
      ) : (
        <></>
      )}
    </>
  );
};

export const FinishedPaths = ({
  finishedPaths,
  currentInstruction,
}: {
  currentInstruction: string;
  finishedPaths: number[];
}) => {
  function getPaths() {
    const drawPaths = [];

    for (const stage of finishedPaths) {
      const stagePaths = datapaths[currentInstruction].filter((path) =>
        path.stages.includes(stage)
      );
      drawPaths.push(...stagePaths); // Accumulate paths
    }

    return drawPaths;
  }

  // console.log("These are the paths: ", finishedPaths.length ,getPaths());

  function getPath(bus: Bus): string {
    const start = bus.source;
    const end = bus.destination;
    const offset = 20; // distance from the source to place the elbow
    const threshold = 10; // Distance to switch between simple and go-around
    const ythreshold = 30;
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    let path = "";

    const goingLeft = dx < 0;
    const goingUp = dy > ythreshold;

    if (Math.abs(dx) < threshold || Math.abs(dy) < threshold) {
      // Short elbow
      const midX = start.x + (goingLeft ? -offset : offset);
      path = `
      M ${start.x} ${start.y}
      L ${midX} ${start.y}
      L ${midX} ${end.y}
      L ${end.x} ${end.y}
    `;
      return path;
    } else {
      // Go around elbow
      if (goingLeft) {
        if (goingUp) {
          // Bend outwards: right → up → left → down (on outside)
          const step1 = { x: start.x + offset, y: start.y };
          const step2 = {
            x: step1.x,
            y: start.y - bus.fromComponentHeight - ythreshold,
          };
          const step3 = { x: end.x - offset, y: step2.y };
          const step4 = { x: step3.x, y: end.y };

          path = `
        M ${start.x} ${start.y}
        L ${step1.x} ${step1.y}
        L ${step2.x} ${step2.y}
        L ${step3.x} ${step3.y}
        L ${step4.x} ${step4.y}
        L ${end.x} ${end.y}
      `;
          return path;
        } else {
          // Bend outwards: right → down → left → down (on outside)
          const step1 = { x: start.x + offset, y: start.y };
          const step2 = {
            x: step1.x,
            y: end.y + bus.fromComponentHeight * 0.5,
          };
          const step3 = { x: end.x - offset, y: step2.y };
          const step4 = { x: step3.x, y: end.y };

          path = `
        M ${start.x} ${start.y}
        L ${step1.x} ${step1.y}
        L ${step2.x} ${step2.y}
        L ${step3.x} ${step3.y}
        L ${step4.x} ${step4.y}
        L ${end.x} ${end.y}
      `;
          return path;
        }
      } else {
        // Forward elbow: right → down → right → up
        const step1 = { x: start.x + offset, y: start.y };
        const step2 = { x: step1.x, y: end.y };
        const step3 = { x: end.x, y: end.y };
        path = `
        M ${start.x} ${start.y}
        L ${step1.x} ${step1.y}
        L ${step2.x} ${step2.y}
        L ${step3.x} ${step3.y}
      `;
        return path;
      }
    }
  }
  return (
    <>
      {getPaths().map((path, index) => (
        <g key={`${index}:` + path.bus.id}>
          <defs>
            <marker
              id="arrow-anim-2"
              markerWidth="4"
              markerHeight="4"
              refX="4"
              refY="2"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path
                d="M 0 0 L 4 2 L 0 4 z"
                className="fill-purple-700 stroke-purple-700"
              />
            </marker>
          </defs>
          <path
            d={getPath(path.bus)}
            strokeWidth={path.bus.width || 2}
            fill="none"
            markerEnd="url(#arrow-anim-2)"
            className="stroke-purple-700"
          />
        </g>
      ))}
    </>
  );
};
