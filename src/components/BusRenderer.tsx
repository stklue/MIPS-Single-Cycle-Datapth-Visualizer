import type { Bus } from "../types/types";

export const BusRenderer = ({ bus }: { bus: Bus }) => {
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
  // mips_cpu.MuxAdd.outputPort.name + "-" + mips_cpu.PC.addressInPort.name
  // if (bus.id === "MUXOUT-PCADDRESSIN") {
  //   console.log("Program Counter");
  // }

  if (Math.abs(dx) < threshold || Math.abs(dy) < threshold) {
    if (bus.id === "MUXOUT-REGWRITEDATA") {
          console.log("Going down down: ", dy);
          // console.log(step1, step2, step3, step4);
        }

    // Short elbow
    const midX = start.x + (goingLeft ? -offset : offset);
    path = `
      M ${start.x} ${start.y}
      L ${midX} ${start.y}
      L ${midX} ${end.y}
      L ${end.x} ${end.y}
    `;
  } else {
    // Go around elbow
    if (goingLeft) {
      if (goingUp) {
        // Bend outwards: right → up → left → down (on outside)
        const step1 = { x: start.x + offset, y: start.y };
        const step2 = { x: step1.x, y: start.y - bus.fromComponentHeight - ythreshold };
        const step3 = { x: end.x - offset, y: step2.y };
        const step4 = { x: step3.x, y: end.y };

        // if (bus.id === "MUXOUT-PCADDRESSIN") {
        //   console.log("Going Up", dy);
        //   console.log(step1, step2, step3, step4);
        // }

        path = `
        M ${start.x} ${start.y}
        L ${step1.x} ${step1.y}
        L ${step2.x} ${step2.y}
        L ${step3.x} ${step3.y}
        L ${step4.x} ${step4.y}
        L ${end.x} ${end.y}
      `;
      } else {
        // Bend outwards: right → down → left → down (on outside)
        const step1 = { x: start.x + offset, y: start.y };
        const step2 = { x: step1.x, y: end.y + bus.fromComponentHeight * 0.5 };
        const step3 = { x: end.x - offset, y: step2.y };
        const step4 = { x: step3.x, y: end.y };
        if (bus.id === "MUXOUT-REGWRITEDATA") {
          console.log("Going down down");
          console.log(step1, step2, step3, step4);
        }
        path = `
        M ${start.x} ${start.y}
        L ${step1.x} ${step1.y}
        L ${step2.x} ${step2.y}
        L ${step3.x} ${step3.y}
        L ${step4.x} ${step4.y}
        L ${end.x} ${end.y}
      `;
      }
    } else {
      if (bus.id === "MUXOUT-REGWRITEDATA") {
        console.log("Going down down");
        // console.log(step1, step2, step3, step4);
      }
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
    }
  }
  return (
    <>
      <defs>
        <marker
          id="arrow"
          markerWidth="4"
          markerHeight="4"
          refX="4"
          refY="2"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M 0 0 L 4 2 L 0 4 z" fill={bus.color || "#4FD1C5"} />
        </marker>
      </defs>
      <path
        d={path}
        stroke={bus.color || "#4FD1C5"}
        strokeWidth={bus.width || 2}
        fill="none"
        markerEnd="url(#arrow)"
      />
    </>
  );
};
