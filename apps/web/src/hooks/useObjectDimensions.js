import { useState } from "react";

export function useObjectDimensions() {
  const [objectHeight, setObjectHeight] = useState(180);
  const [objectWidth, setObjectWidth] = useState(80);
  const [objectDepth, setObjectDepth] = useState(60);

  return {
    objectHeight,
    setObjectHeight,
    objectWidth,
    setObjectWidth,
    objectDepth,
    setObjectDepth,
  };
}
