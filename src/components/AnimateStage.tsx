import { datapaths } from "../data/data";
import { AnimateDatapath } from "./AnimateDatapath";

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
