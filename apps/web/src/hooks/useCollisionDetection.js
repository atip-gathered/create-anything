import { useEffect } from "react";
import { checkCollision } from "@/utils/collisionDetection";

export function useCollisionDetection(
  objectMeshRef,
  objectPosition,
  objectRotation,
  objectHeight,
  objectWidth,
  objectDepth,
  interiorHeight,
  interiorWidth,
  interiorDepth,
  setIsColliding,
  isDoorOpen = false,
  doorWidth = 0,
  doorHeight = 0
) {
  useEffect(() => {
    if (!objectMeshRef.current) return;

    const collision = checkCollision(
      objectMeshRef.current,
      interiorWidth,
      interiorHeight,
      interiorDepth,
      isDoorOpen,
      doorWidth,
      doorHeight
    );

    setIsColliding(collision);
  }, [
    objectMeshRef,
    objectPosition,
    objectRotation,
    objectHeight,
    objectWidth,
    objectDepth,
    interiorHeight,
    interiorWidth,
    interiorDepth,
    setIsColliding,
    isDoorOpen,
    doorWidth,
    doorHeight
  ]);
}
