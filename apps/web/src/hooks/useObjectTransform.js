import { useState, useRef } from "react";

export function useObjectTransform() {
  const [objectPosition, setObjectPosition] = useState({ x: 0, y: 0, z: -100 });
  const [objectRotation, setObjectRotation] = useState({ x: 0, y: 0, z: 0 });
  const lastValidPositionRef = useRef({ x: 0, y: 0, z: -100 });
  const lastValidRotationRef = useRef({ x: 0, y: 0, z: 0 });

  const resetTransform = () => {
    setObjectPosition({ x: 0, y: 0, z: -100 });
    setObjectRotation({ x: 0, y: 0, z: 0 });
    lastValidPositionRef.current = { x: 0, y: 0, z: -100 };
    lastValidRotationRef.current = { x: 0, y: 0, z: 0 };
  };

  return {
    objectPosition,
    setObjectPosition,
    objectRotation,
    setObjectRotation,
    lastValidPositionRef,
    lastValidRotationRef,
    resetTransform,
  };
}
