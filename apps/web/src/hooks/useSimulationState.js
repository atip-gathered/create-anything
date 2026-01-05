import { useState } from "react";

export function useSimulationState() {
  const [canFit, setCanFit] = useState(null);
  const [isColliding, setIsColliding] = useState(false);
  const [doorClosed, setDoorClosed] = useState(false);
  const [controlMode, setControlMode] = useState("translate");
  const [isDragging, setIsDragging] = useState(false);
  const [isObjectSelected, setIsObjectSelected] = useState(true); // Start selected for easier use
  const [showHuman, setShowHuman] = useState(false);
  const [carryingStyle, setCarryingStyle] = useState("front"); // front, back, side
  const [showSecondHuman, setShowSecondHuman] = useState(false);
  const [secondCarryingStyle, setSecondCarryingStyle] = useState("back");
  const [collisionMode, setCollisionMode] = useState("visual"); // visual, physical

  const toggleDoor = () => {
    setDoorClosed(!doorClosed);
  };

  const reset = () => {
    setDoorClosed(false);
    setCanFit(null);
    setIsColliding(false);
    setIsDragging(false);
    setIsObjectSelected(true); // Reset to selected
    setShowHuman(false);
    setCarryingStyle("front");
    setShowSecondHuman(false);
    setSecondCarryingStyle("back");
    setCollisionMode("visual");
  };

  return {
    canFit,
    setCanFit,
    isColliding,
    setIsColliding,
    doorClosed,
    setDoorClosed,
    controlMode,
    setControlMode,
    isDragging,
    setIsDragging,
    isObjectSelected,
    setIsObjectSelected,
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
    toggleDoor,
    reset,
  };
}
