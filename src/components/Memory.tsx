import React from "react";

export default function Memory() {
  const memoryCells = 32;
  const dataMemory = new Array(memoryCells).fill(0);
  return (
    <>
      <section className="bg-background/50 h-full flex-1 flex flex-col p-4 gap-y-2">
        <h2 className="bg-background/60">MEMORY</h2>
        <div className="flex-1 overflow-y-auto">
          <div
            className={`grid grid-cols-2 divide-y-2 divide-background/90`}
          >
            {dataMemory.map((mem, index) => (
              <React.Fragment key={index}>
                <div className="hover:cursor-pointer hover:bg-background/70">{`0x${100 + index}`}</div>
                <div className="hover:cursor-pointer hover:bg-background/70">{mem}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
