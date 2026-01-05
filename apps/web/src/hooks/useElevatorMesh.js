import { useEffect, useRef } from "react";
import { createElevatorGeometry } from "@/utils/elevatorGeometry";

export function useElevatorMesh(
  sceneRef,
  doorHeight,
  doorWidth,
  interiorHeight,
  interiorWidth,
  interiorDepth,
) {
  const elevatorGroupRef = useRef(null);
  const doorRef = useRef(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    // Remove old elevator
    if (elevatorGroupRef.current) {
      sceneRef.current.remove(elevatorGroupRef.current);
    }

    const { elevatorGroup, door } = createElevatorGeometry(
      interiorWidth,
      interiorHeight,
      interiorDepth,
      doorWidth,
      doorHeight,
    );

    sceneRef.current.add(elevatorGroup);
    elevatorGroupRef.current = elevatorGroup;
    doorRef.current = door;
  }, [
    sceneRef,
    doorHeight,
    doorWidth,
    interiorHeight,
    interiorWidth,
    interiorDepth,
  ]);

  return { elevatorGroupRef, doorRef };
}
