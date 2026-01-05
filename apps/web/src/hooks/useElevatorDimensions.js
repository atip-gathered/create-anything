import { useState } from "react";

export function useElevatorDimensions() {
  const [doorHeight, setDoorHeight] = useState(200);
  const [doorWidth, setDoorWidth] = useState(90);
  const [interiorHeight, setInteriorHeight] = useState(220);
  const [interiorWidth, setInteriorWidth] = useState(120);
  const [interiorDepth, setInteriorDepth] = useState(140);

  return {
    doorHeight,
    setDoorHeight,
    doorWidth,
    setDoorWidth,
    interiorHeight,
    setInteriorHeight,
    interiorWidth,
    setInteriorWidth,
    interiorDepth,
    setInteriorDepth,
  };
}
