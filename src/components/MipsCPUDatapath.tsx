import { useState } from "react";
import DraggableSVGElement from "./DraggableSvgElement";
import { buses, components, instruction_choices } from "../data/data";
import { BusRenderer } from "./BusRenderer";
import { AnimateStage, FinishedPaths } from "./AnimateStage";
export default function MipsCPUDatapath() {
  const [instructionChoice, setChoice] = useState(instruction_choices[0].value);
  // const filterBuses = buses.filter(bus => bus.id === "MUXOUT-PCADDRESSIN")
  // const [selectedInstruction, setSelectedInstruction] = useState<string>(INSTRUCTIONS[0].value)
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [renderedStages, setRenderedStages] = useState<number[]>([]);
  const stages: string[] = [
    "Instruction Fetch",
    "Instruction Decode",
    "Execute",
    "Memory Access",
    "Write Back",
  ];

  const handleRunAnimation = () => {
    setIsAnimating(true);
    setCurrentStage(0);
    setRenderedStages([]);

    // Simulate animation through each stage
    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev >= stages.length - 1) {
          clearInterval(stageInterval);
          setIsAnimating(false);
          setRenderedStages((prevStages) => [...prevStages, prev]);
          return prev;
        }
        setRenderedStages((prevStages) => [...prevStages, prev]);
        return prev + 1;
      });

      // setRenderedStages((prevStages) => [...prevStages, currentStage]);
    }, 3000); // 2 seconds per stage
  };

  return (
    <>
      <section className=" h-full flex-3 p-4 space-y-2 space-x-4">
        <select
          value={instructionChoice}
          onChange={(val) => setChoice(val.target.value)}
          className="bg-background/90 text-header"
        >
          {instruction_choices.map((instruction) => (
            <option key={instruction.value} value={instruction.value}>
              {instruction.format}
            </option>
          ))}
        </select>
        <button
          className="p-2 bg-amber-500 rounded-lg cursor-pointer"
          onClick={handleRunAnimation}
        >
          Run Animation
        </button>
        <span>{stages[currentStage]}</span>
        <div>
          <svg
            viewBox="-100 -100 500 500"
            height={500}
            className="w-full bg-background/50"
          >
            {buses.map((bus) => (
              <BusRenderer key={bus.id} bus={bus} />
            ))}
            {components.map((comp, index) => (
              <DraggableSVGElement key={comp.label + `${index}`}>
                <g>
                  <text
                    x={comp.x}
                    y={comp.y - 10}
                    className="fill-amber-400 text-xs"
                  >
                    {comp.label}
                  </text>

                  {/* Switch component shape based on type */}
                  {(() => {
                    switch (comp.type) {
                      case "adder":
                        return (
                          <path
                            d={`
              M ${comp.x},${comp.y}
              L ${comp.x + comp.width},${comp.y + comp.height * 0.25}
              L ${comp.x + comp.width},${comp.y + comp.height * 0.65}
              L ${comp.x},${comp.y + comp.height}
              L ${comp.x},${comp.y + (comp.height * 2) / 3}
              L ${comp.x + comp.width * 0.25},${comp.y + comp.height * 0.5}
              L ${comp.x},${comp.y + (comp.height * 1) / 3}
              Z
            `}
                            fill="none"
                            className="stroke-4 stroke-amber-500 hover:stroke-green-500 hover:cursor-pointer"
                          />
                        );

                      case "alu":
                        // ALU shape (hexagon)
                        return (
                          <path
                            d={`
            M ${comp.x},${comp.y}
            L ${comp.x + comp.width},${comp.y + comp.height * 0.25}
            L ${comp.x + comp.width},${comp.y + comp.height * 0.65}
            L ${comp.x},${comp.y + comp.height}
            L ${comp.x},${comp.y + (comp.height * 2) / 3}
            L ${comp.x + comp.width * 0.25},${comp.y + comp.height * 0.5}
            L ${comp.x},${comp.y + (comp.height * 1) / 3}
            Z
          `}
                            fill="none"
                            className="stroke-4 stroke-amber-500 hover:stroke-green-500 hover:cursor-pointer"
                          />
                        );

                      case "mux":
                        // Mux shape (trapezoid)
                        return (
                          <g>
                            <path
                              d={`
    M ${comp.x},${comp.y + comp.height * 0.2}
    C ${comp.x},${comp.y} 
      ${comp.x + comp.width},${comp.y} 
      ${comp.x + comp.width},${comp.y + comp.height * 0.2}
    V ${comp.y + comp.height * 0.8}
    C ${comp.x + comp.width},${comp.y + comp.height} 
      ${comp.x},${comp.y + comp.height} 
      ${comp.x},${comp.y + comp.height * 0.8}
    Z
  `}
                              fill="none"
                              className="stroke-4 stroke-amber-500 hover:stroke-green-500 hover:cursor-pointer"
                            />
                          </g>
                        );

                      case "memory":
                        // Memory shape (rectangle with notch)
                        return (
                          <>
                            <rect
                              x={comp.x}
                              y={comp.y}
                              width={comp.width}
                              height={comp.height}
                              fill="none"
                              className="stroke-4 stroke-amber-500 hover:stroke-green-500 hover:cursor-pointer"
                            />
                          </>
                        );

                      case "register":
                        // Register file shape (rectangle with lines)
                        return (
                          <>
                            <rect
                              x={comp.x}
                              y={comp.y}
                              width={comp.width}
                              height={comp.height}
                              fill="none"
                              className="stroke-4 stroke-amber-500 hover:stroke-green-500 hover:cursor-pointer"
                            />
                          </>
                        );
                      case "control":
                        // Symmetrical oval shape (equal top/bottom)

                        return (
                          <path
                            d={`
                               M ${comp.x + comp.width / 2},${comp.y}
              C ${comp.x + comp.width - comp.width * 0.25},${comp.y}
                ${comp.x + comp.width},${comp.y + comp.height * 0.25}
                ${comp.x + comp.width},${comp.y + comp.height / 2}
              C ${comp.x + comp.width},${
                              comp.y + comp.height - comp.height * 0.25
                            }
                ${comp.x + comp.width - comp.width * 0.25},${
                              comp.y + comp.height
                            }
                ${comp.x + comp.width / 2},${comp.y + comp.height}
              C ${comp.x + comp.width * 0.25},${comp.y + comp.height}
                ${comp.x},${comp.y + comp.height - comp.height * 0.25}
                ${comp.x},${comp.y + comp.height / 2}
              C ${comp.x},${comp.y + comp.height * 0.25}
                ${comp.x + comp.width * 0.25},${comp.y}
                ${comp.x + comp.width / 2},${comp.y}
              Z
            `}
                            fill="none"
                            className="stroke-4 stroke-blue-500 hover:stroke-green-500 hover:cursor-pointer"
                          />
                        );

                      default:
                        return (
                          <rect
                            x={comp.x}
                            y={comp.y}
                            width={comp.width}
                            height={comp.height}
                            fill="none"
                            className="stroke-4 stroke-amber-500 hover:stroke-green-500 hover:cursor-pointer"
                          />
                        );
                    }
                  })()}

                  {/* Ports rendering (unchanged) */}
                  {comp.getPorts().map((port, index) => (
                    <g key={`${index}-${port.name}-${port.x}-${port.y}`}>
                      <circle
                        className="fill-red-600"
                        cx={port.x}
                        cy={port.y}
                        r={3}
                      />
                    </g>
                  ))}
                </g>
              </DraggableSVGElement>
            ))}
            <AnimateStage
              isAnimating={isAnimating}
              activeStage={currentStage}
              currentInstruction={instructionChoice}
            />
            <FinishedPaths
              currentInstruction={instructionChoice}
              finishedPaths={renderedStages}
            />
          </svg>
        </div>
      </section>
    </>
  );
}
