import { useCallback } from "react";
import { checkCollision } from "@/utils/collisionDetection";

export function useObjectControls(
  objectMeshRef,
  objectPosition,
  objectRotation,
  objectHeight,
  interiorWidth,
  interiorHeight,
  interiorDepth,
  setObjectPosition,
  setObjectRotation,
  lastValidPositionRef,
  lastValidRotationRef,
  collisionMode,
  isDoorOpen = false,
  doorWidth = 0,
  doorHeight = 0
) {
  const handleRotate = useCallback(
    (axis, delta) => {
      const newRotation = {
        ...objectRotation,
        [axis]: objectRotation[axis] + delta,
      };

      if (collisionMode === "physical") {
        // Temporarily apply rotation to check collision
        const originalRotation = objectMeshRef.current.rotation.clone();
        objectMeshRef.current.rotation[axis] += delta;

        const collision = checkCollision(
          objectMeshRef.current,
          interiorWidth,
          interiorHeight,
          interiorDepth,
          isDoorOpen,
          doorWidth,
          doorHeight
        );

        // Revert to original (state update will apply it if valid)
        objectMeshRef.current.rotation.copy(originalRotation);

        if (collision) {
          return; // Block update
        }
      }

      setObjectRotation(newRotation);
    },
    [
      objectMeshRef,
      objectRotation,
      interiorWidth,
      interiorHeight,
      interiorDepth,
      setObjectRotation,
      lastValidRotationRef,
      collisionMode,
      isDoorOpen,
      doorWidth,
      doorHeight
    ],
  );

  const handleRotateAbsolute = useCallback(
    (axis, value) => {
      const newRotation = {
        ...objectRotation,
        [axis]: value,
      };

      if (collisionMode === "physical") {
        const originalRotation = objectMeshRef.current.rotation.clone();

        // Apply direct value
        if (axis === 'x') objectMeshRef.current.rotation.x = value;
        if (axis === 'y') objectMeshRef.current.rotation.y = value;
        if (axis === 'z') objectMeshRef.current.rotation.z = value;

        const collision = checkCollision(
          objectMeshRef.current,
          interiorWidth,
          interiorHeight,
          interiorDepth,
          isDoorOpen,
          doorWidth,
          doorHeight
        );

        objectMeshRef.current.rotation.copy(originalRotation);

        if (collision) {
          return; // Block update
        }
      }

      setObjectRotation(newRotation);
    },
    [
      objectMeshRef,
      objectRotation,
      interiorWidth,
      interiorHeight,
      interiorDepth,
      setObjectRotation,
      lastValidRotationRef,
      collisionMode,
      isDoorOpen,
      doorWidth,
      doorHeight
    ],
  );

  const handleMove = useCallback(
    (axis, delta) => {
      const newPosition = {
        ...objectPosition,
        [axis]: objectPosition[axis] + delta,
      };

      if (collisionMode === "physical") {
        const originalPosition = objectMeshRef.current.position.clone();
        objectMeshRef.current.position[axis] += delta;

        const collision = checkCollision(
          objectMeshRef.current,
          interiorWidth,
          interiorHeight,
          interiorDepth,
          isDoorOpen,
          doorWidth,
          doorHeight
        );

        objectMeshRef.current.position.copy(originalPosition);

        if (collision) {
          return; // Block update
        }
      }

      setObjectPosition(newPosition);
    },
    [
      objectMeshRef,
      objectPosition,
      objectHeight,
      interiorWidth,
      interiorHeight,
      interiorDepth,
      setObjectPosition,
      lastValidPositionRef,
      collisionMode,
      isDoorOpen,
      doorWidth,
      doorHeight
    ],
  );

  return { handleRotate, handleRotateAbsolute, handleMove };
}
