import { useRef } from "react";
import { useElevatorDimensions } from "@/hooks/useElevatorDimensions";
import { useObjectDimensions } from "@/hooks/useObjectDimensions";
import { useObjectTransform } from "@/hooks/useObjectTransform";
import { useSimulationState } from "@/hooks/useSimulationState";
import { useThreeScene } from "@/hooks/useThreeScene";
import { useElevatorMesh } from "@/hooks/useElevatorMesh";
import { useObjectMesh } from "@/hooks/useObjectMesh";
import { useCollisionDetection } from "@/hooks/useCollisionDetection";
import { useDoorAnimation } from "@/hooks/useDoorAnimation";
import { useObjectControls } from "@/hooks/useObjectControls";
import { ControlSidebar } from "@/components/ElevatorSimulation/ControlSidebar";
import { ViewportHeader } from "@/components/ElevatorSimulation/ViewportHeader";

export default function ElevatorSimulationPage() {
  const mountRef = useRef(null);

  // State management
  const elevatorDimensions = useElevatorDimensions();
  const objectDimensions = useObjectDimensions();
  const objectTransform = useObjectTransform();
  const simulationState = useSimulationState();

  const {
    doorHeight,
    doorWidth,
    interiorHeight,
    interiorWidth,
    interiorDepth,
  } = elevatorDimensions;

  const { objectHeight, objectWidth, objectDepth } = objectDimensions;

  const {
    objectPosition,
    setObjectPosition,
    objectRotation,
    setObjectRotation,
    lastValidPositionRef,
    lastValidRotationRef,
    resetTransform,
  } = objectTransform;

  const {
    canFit,
    setCanFit,
    isColliding,
    setIsColliding,
    doorClosed,
    controlMode,
    setControlMode,
    isDragging,
    setIsDragging,
    isObjectSelected,
    setIsObjectSelected,
    toggleDoor,
    reset,
    showHuman,
    setShowHuman,
    carryingStyle,
    setCarryingStyle,
    showSecondHuman,
    setShowSecondHuman,
    secondCarryingStyle,
    setSecondCarryingStyle,
    collisionMode,
    setCollisionMode,
  } = simulationState;

  // Three.js scene setup
  const { sceneRef, cameraRef, rendererRef, controlsRef } =
    useThreeScene(mountRef);

  // Elevator mesh
  const { doorRef } = useElevatorMesh(
    sceneRef,
    doorHeight,
    doorWidth,
    interiorHeight,
    interiorWidth,
    interiorDepth,
  );

  // Object mesh
  const { objectMeshRef } = useObjectMesh(
    sceneRef,
    cameraRef,
    rendererRef,
    controlsRef,
    objectHeight,
    objectWidth,
    objectDepth,
    objectPosition,
    objectRotation,
    interiorHeight,
    interiorWidth,
    interiorDepth,
    controlMode,
    setObjectPosition,
    setObjectRotation,
    setIsDragging,
    lastValidPositionRef,
    lastValidRotationRef,
    isObjectSelected,
    setIsObjectSelected,
    showHuman,
    carryingStyle,
    showSecondHuman,
    secondCarryingStyle,
    collisionMode,
    !doorClosed,
    doorWidth,
    doorHeight
  );

  // Collision detection
  // Pass !doorClosed as isDoorOpen
  useCollisionDetection(
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
    !doorClosed,
    doorWidth,
    doorHeight
  );

  // Door animation
  useDoorAnimation(
    doorRef,
    doorClosed,
    doorWidth,
    doorHeight,
    interiorDepth,
    objectMeshRef,
    isColliding,
    setCanFit,
  );

  // Object controls
  const { handleRotate, handleRotateAbsolute, handleMove } = useObjectControls(
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
    !doorClosed,
    doorWidth,
    doorHeight
  );

  const handleReset = () => {
    resetTransform();
    reset();
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-[#121212] dark:to-[#0a0a1a]">
      <ControlSidebar
        elevatorDimensions={elevatorDimensions}
        objectDimensions={objectDimensions}
        controlMode={controlMode}
        onControlModeChange={setControlMode}
        onRotateAbsolute={handleRotateAbsolute}
        onMove={handleMove}
        onToggleDoor={toggleDoor}
        onReset={handleReset}
        doorClosed={doorClosed}
        canFit={canFit}
        isColliding={isColliding}
        objectRotation={objectRotation}
        showHuman={showHuman}
        onShowHumanChange={setShowHuman}
        carryingStyle={carryingStyle}
        onCarryingStyleChange={setCarryingStyle}
        showSecondHuman={showSecondHuman}
        onShowSecondHumanChange={setShowSecondHuman}
        secondCarryingStyle={secondCarryingStyle}
        onSecondCarryingStyleChange={setSecondCarryingStyle}
        collisionMode={collisionMode}
        onCollisionModeChange={setCollisionMode}
      />

      <div className="flex-1 flex flex-col min-h-0">
        <ViewportHeader controlMode={controlMode} isDragging={isDragging} />
        <div className="flex-1 relative" ref={mountRef}></div>
      </div>
    </div>
  );
}
