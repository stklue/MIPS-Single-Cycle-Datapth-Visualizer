import {  useState } from "react";
import DraggableSVGElement from "./DraggableSvgElement";
import { buses, components, instruction_choices } from "../data/data";
import { BusRenderer } from "./BusRenderer";

export default function MipsCPUDatapath() {
  const [instructionChoice, setChoice] = useState("add");
  // const filterBuses = buses.filter(bus => bus.id === "MUXOUT-PCADDRESSIN")

  return (
    <>
      <section className=" h-full flex-3 p-4 space-y-2">
        <select
          value={instructionChoice}
          onChange={(val) => setChoice(val.target.value)}
          className="bg-background/90 text-header"
          // defaultValue={"add"}
        >
          {instruction_choices.map((instruction) => (
            <option key={instruction.value} value={instruction.value}>{instruction.format}</option>
          ))}
        </select>
        <div>
          <svg
            viewBox="-100 -100 500 500"
            height={500}
            className="w-full bg-background/50"
          >
            {/* <path d={path} /> */}
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
                        // Adder shape (triangle)
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
          </svg>
        </div>
      </section>
    </>
  );
}

{
  /* <path
                    d={`M ${comp.x},${comp.y} L ${comp.endX},${comp.endY}`}
                    stroke="#333333"
                    stroke-width="5"
                  />
                  <path
                    d={`M ${comp.x},${comp.y} L ${comp.endX},${comp.endY}`}
                    stroke-width="5"
                    pathLength="1"
                    className="line-running stroke-orange-400  hover:stroke-blue-500 hover:cursor-pointer animate-line-running"
                  />  */
}
