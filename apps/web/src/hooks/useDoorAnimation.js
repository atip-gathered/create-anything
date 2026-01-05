import { useEffect } from "react";
import { checkDoorCollision } from "@/utils/collisionDetection";

export function useDoorAnimation(
  doorRef,
  doorClosed,
  doorWidth,
  doorHeight,
  interiorDepth,
  objectMeshRef,
  isColliding,
  setCanFit,
) {
  useEffect(() => {
    if (!doorRef.current) return;

    if (doorClosed) {
      // Move door to closed position
      doorRef.current.position.x = 0;
      doorRef.current.position.z = interiorDepth / 2 + 0.5;

      // Check if object passes through door opening
      if (objectMeshRef.current) {
        const doorCollision = checkDoorCollision(
          objectMeshRef.current,
          doorWidth,
          doorHeight,
          interiorDepth,
        );

        const insideElevator = !isColliding && !doorCollision;
        setCanFit(insideElevator);
      }
    } else {
      // Move door to open position
      doorRef.current.position.x = doorWidth;
      doorRef.current.position.z = interiorDepth / 2 + 2;
      setCanFit(null);
    }
  }, [
    doorRef,
    doorClosed,
    doorWidth,
    doorHeight,
    interiorDepth,
    objectMeshRef,
    isColliding,
    setCanFit,
  ]);
}
