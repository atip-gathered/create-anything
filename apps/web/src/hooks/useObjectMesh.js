import { useEffect, useRef } from "react";
import * as THREE from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { checkCollision } from "@/utils/collisionDetection";

import { createHumanGeometry } from "@/utils/humanGeometry";

export function useObjectMesh(
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
  isDoorOpen,
  doorWidth,
  doorHeight
) {
  const objectMeshRef = useRef(null);
  const transformControlsRef = useRef(null);
  const initialPositionRef = useRef(null);
  const initialRotationRef = useRef(null);
  const humanRef = useRef(null); // Keep track of human mesh
  const secondHumanRef = useRef(null); // Keep track of second human mesh

  // Create object mesh ONLY when dimensions change
  useEffect(() => {
    if (!sceneRef.current) return;

    // Store current position/rotation before recreation
    const currentPosition = initialPositionRef.current || objectPosition;
    const currentRotation = initialRotationRef.current || objectRotation;

    // Save for next recreation
    initialPositionRef.current = currentPosition;
    initialRotationRef.current = currentRotation;

    // Remove old object
    if (objectMeshRef.current) {
      sceneRef.current.remove(objectMeshRef.current);
    }
    // Remove old human
    if (humanRef.current) {
      if (objectMeshRef.current) {
        objectMeshRef.current.remove(humanRef.current);
      } else {
        // If objectMeshRef was already removed, try removing from scene directly
        sceneRef.current.remove(humanRef.current);
      }
      humanRef.current = null;
    }
    // Remove old second human
    if (secondHumanRef.current) {
      if (objectMeshRef.current) {
        objectMeshRef.current.remove(secondHumanRef.current);
      } else {
        sceneRef.current.remove(secondHumanRef.current);
      }
      secondHumanRef.current = null;
    }


    // Create new object
    const geometry = new THREE.BoxGeometry(
      objectWidth,
      objectHeight,
      objectDepth,
    );
    const material = new THREE.MeshStandardMaterial({
      color: 0x0065ff,
      transparent: true,
      opacity: 0.8,
    });

    const setupShader = (shader) => {
      shader.uniforms.uInteriorWidth = { value: interiorWidth };
      shader.uniforms.uInteriorHeight = { value: interiorHeight };
      shader.uniforms.uInteriorDepth = { value: interiorDepth };

      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        `
          #include <common>
          varying vec3 vWorldPosition;
          `
      );
      shader.vertexShader = shader.vertexShader.replace(
        "#include <worldpos_vertex>",
        `
          #include <worldpos_vertex>
          vWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;
          `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <common>",
        `
          #include <common>
          uniform float uInteriorWidth;
          uniform float uInteriorHeight;
          uniform float uInteriorDepth;
          varying vec3 vWorldPosition;
          `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <dithering_fragment>",
        `
          #include <dithering_fragment>
          
          // Check collision with walls (simple box bounds)
          // Adjust epsilon slightly to avoid z-fighting artifacts at exact boundaries
          float epsilon = 0.5;
          bool isOutside = 
            vWorldPosition.x < -uInteriorWidth / 2.0 + epsilon ||
            vWorldPosition.x > uInteriorWidth / 2.0 - epsilon ||
            vWorldPosition.y < 0.0 + epsilon ||
            vWorldPosition.y > uInteriorHeight - epsilon ||
            vWorldPosition.z < -uInteriorDepth / 2.0 + epsilon ||
            vWorldPosition.z > uInteriorDepth / 2.0 - epsilon;

          if (isOutside) {
            gl_FragColor = vec4(1.0, 0.26, 0.26, gl_FragColor.a);
          }
          `
      );
      material.userData.shader = shader;
    };

    material.onBeforeCompile = setupShader;

    const mesh = new THREE.Mesh(geometry, material);

    // Use stored position and rotation
    mesh.position.set(currentPosition.x, objectHeight / 2, currentPosition.z);
    mesh.rotation.set(currentRotation.x, currentRotation.y, currentRotation.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // IMPORTANT: When in 'physical' mode, we don't want the visual cues of red/transparency "inside" the wall
    // because it shouldn't be inside the wall. But transparency might still be good.
    // However, if we want to visually distinguish, maybe we disable the shader effects or tweak them?
    // User request: "contact triggers color change" vs "cannot penetrate".
    // So 'physical' mode implies we should NOT penetrate. If we do (slightly), maybe stick to normal color?
    // Or keep the shader to show WHY it stopped?
    // Let's keep smooth logic: update local position, check collision.

    sceneRef.current.add(mesh);
    objectMeshRef.current = mesh;

    // Handle First Human
    if (showHuman) {
      const humanGroup = createHumanGeometry(carryingStyle);
      // We want the human to be colliding too, so we traverse and apply the shader material?
      // Or simply add it to the mesh so it moves with it.
      // Applying shader to human parts might be complex as they have their own materials.
      // For now, let's keep human with its own materials.
      // To offset the human relative to object:
      // Position is relative to object center (0,0,0)

      // Adjust human position based on object size and carrying style
      // For front/back, we need to move human along Z axis relative to object
      // Offset = objectDepth/2 + body thickness/2 (approx 15)

      let zOffset = 0;
      let xOffset = 0;

      // Offset so human holds the object
      // Human center (0,0,0) in humanGroup is at feet.
      // But createHumanGeometry positions body parts.
      // We probably want to center the human group at the "standing point"

      // Let's inspect createHumanGeometry:
      // Torso y = legHeight + torsoHeight / 2 = 90 + 30 = 120
      // Arms are attached.

      // In "front" carry: Human is BEHIND object (-Z from object perspective?)
      // If object is "front", then human is behind it.
      // So "Front Carry" means Object is in front of human.
      // So Human is at -Z.

      if (carryingStyle === "front") {
        zOffset = -(objectDepth / 2 + 25); // 25cm gap/body diff
        humanGroup.rotation.y = 0; // Human faces +Z (towards object)
      } else if (carryingStyle === "back") {
        // Object is on back. Human is IN FRONT of object (+Z)
        zOffset = (objectDepth / 2 + 25);
        humanGroup.rotation.y = 0; // Human faces +Z (away from object behind)
      } else if (carryingStyle === "right") {
        // Object is on right side of human.
        // Human is on LEFT of object (-X)
        xOffset = -(objectWidth / 2 + 25);
        humanGroup.rotation.y = 0;
      } else if (carryingStyle === "left") {
        // Object is on left side of human.
        // Human is on RIGHT of object (+X)
        xOffset = (objectWidth / 2 + 25);
        humanGroup.rotation.y = 0;
      }

      // However, we are adding human TO the object mesh.
      // So Human coordinates are local to object.
      humanGroup.position.set(xOffset, -objectHeight / 2, zOffset);
      // -objectHeight/2 because object origin is center, but human origin is feet (y=0) if we want human on floor.
      // Wait, object is positioned at y = objectHeight/2 world coords.
      // So object local (0, -objectHeight/2, 0) is the floor level.

      mesh.add(humanGroup);
      humanRef.current = humanGroup;
    }

    // Handle Second Human
    if (showSecondHuman) {
      const secondHumanGroup = createHumanGeometry(secondCarryingStyle);

      let zOffset = 0;
      let xOffset = 0;

      if (secondCarryingStyle === "front") {
        zOffset = -(objectDepth / 2 + 25);
        secondHumanGroup.rotation.y = 0;
      } else if (secondCarryingStyle === "back") {
        zOffset = (objectDepth / 2 + 25);
        secondHumanGroup.rotation.y = 0;
      } else if (secondCarryingStyle === "right") {
        xOffset = -(objectWidth / 2 + 25);
        secondHumanGroup.rotation.y = 0;
      } else if (secondCarryingStyle === "left") {
        xOffset = (objectWidth / 2 + 25);
        secondHumanGroup.rotation.y = 0;
      }

      secondHumanGroup.position.set(xOffset, -objectHeight / 2, zOffset);
      mesh.add(secondHumanGroup);
      secondHumanRef.current = secondHumanGroup;
    }

    // Update last valid transform to current values
    lastValidPositionRef.current = { ...currentPosition };
    lastValidRotationRef.current = { ...currentRotation };

    // Pass collisionMode to dependencies to re-create mesh (shader uniform might need it if we change opacity etc)
    // Actually shader handles visual only. Control logic handles 'physical'.
  }, [sceneRef, objectHeight, objectWidth, objectDepth, interiorWidth, interiorHeight, interiorDepth, showHuman, carryingStyle, showSecondHuman, secondCarryingStyle, collisionMode, isDoorOpen, doorWidth, doorHeight]);

  // Handle double-click to select/deselect
  useEffect(() => {
    if (!rendererRef.current || !objectMeshRef.current || !cameraRef.current)
      return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleDoubleClick = (event) => {
      const rect = rendererRef.current.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObject(objectMeshRef.current, true);

      if (intersects.length > 0) {
        setIsObjectSelected(true);
      } else {
        setIsObjectSelected(false);
      }
    };

    const canvas = rendererRef.current.domElement;
    canvas.addEventListener("dblclick", handleDoubleClick);

    return () => {
      canvas.removeEventListener("dblclick", handleDoubleClick);
    };
  }, [
    rendererRef,
    cameraRef,
    setIsObjectSelected,
    objectHeight,
    objectWidth,
    objectDepth,
    showHuman,
    showSecondHuman,
  ]);

  // Handle click to select/deselect
  useEffect(() => {
    if (!rendererRef.current || !objectMeshRef.current || !cameraRef.current)
      return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event) => {
      // Ignore if we are dragging (TransformControls active)
      if (transformControlsRef.current && transformControlsRef.current.dragging) return;

      const rect = rendererRef.current.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObject(objectMeshRef.current, true);

      if (intersects.length > 0) {
        setIsObjectSelected(true);
      } else {
        setIsObjectSelected(false);
      }
    };

    const canvas = rendererRef.current.domElement;
    canvas.addEventListener("click", handleClick);

    return () => {
      canvas.removeEventListener("click", handleClick);
    };
  }, [
    rendererRef,
    cameraRef,
    setIsObjectSelected,
    showHuman,
    showSecondHuman,
  ]);

  // Add/remove TransformControls based on selection
  useEffect(() => {
    if (
      !sceneRef.current ||
      !cameraRef.current ||
      !rendererRef.current ||
      !objectMeshRef.current
    )
      return;

    // Function to cleanup existing controls
    const cleanupControls = () => {
      if (transformControlsRef.current) {
        transformControlsRef.current.detach();
        if (sceneRef.current) {
          sceneRef.current.remove(transformControlsRef.current);
        }
        transformControlsRef.current.dispose();
        transformControlsRef.current = null;
      }
    };

    // Remove existing transform controls first
    cleanupControls();

    // Add new transform controls only if object is selected
    if (isObjectSelected) {
      const transformControls = new TransformControls(
        cameraRef.current,
        rendererRef.current.domElement,
      );
      transformControls.attach(objectMeshRef.current);
      transformControls.setMode("translate"); // Always use translate mode
      transformControls.setSize(1.2);
      sceneRef.current.add(transformControls);
      transformControlsRef.current = transformControls;

      // Disable orbit controls when using transform controls
      const draggingChangedHandler = (event) => {
        if (controlsRef.current) {
          controlsRef.current.enabled = !event.value;
        }
        setIsDragging(event.value);

        // When drag ends, update last valid transform
        if (!event.value && objectMeshRef.current) {
          // Drag ended
          // If collisionMode is physical, we might have already reverted during objectChange,
          // but let's ensure we save the LAST VALID position definitively.

          const currentPos = {
            x: objectMeshRef.current.position.x,
            y: 0,
            z: objectMeshRef.current.position.z,
          };
          const currentRot = {
            x: objectMeshRef.current.rotation.x,
            y: objectMeshRef.current.rotation.y,
            z: objectMeshRef.current.rotation.z,
          };

          if (collisionMode === "physical") {
            const collision = checkCollision(
              objectMeshRef.current,
              interiorWidth,
              interiorHeight,
              interiorDepth,
              isDoorOpen,
              doorWidth,
              doorHeight
            );
            if (collision) {
              // Should not happen if we reverted during drag, but double check
              // Revert to last valid
              objectMeshRef.current.position.x = lastValidPositionRef.current.x;
              objectMeshRef.current.position.z = lastValidPositionRef.current.z;
              objectMeshRef.current.rotation.x = lastValidRotationRef.current.x;
              objectMeshRef.current.rotation.y = lastValidRotationRef.current.y;
              objectMeshRef.current.rotation.z = lastValidRotationRef.current.z;
            } else {
              lastValidPositionRef.current = currentPos;
              lastValidRotationRef.current = currentRot;
            }
          } else {
            // Visual mode: always save current as last valid (conceptually 'valid' means 'where it is')
            // or do we still track valid as 'non-colliding'? 
            // Ideally in visual mode we just accept where it is.
            lastValidPositionRef.current = currentPos;
            lastValidRotationRef.current = currentRot;
          }

          initialPositionRef.current = lastValidPositionRef.current;
          initialRotationRef.current = lastValidRotationRef.current;

          setObjectPosition(lastValidPositionRef.current);
          setObjectRotation(lastValidRotationRef.current);
        }
      };

      // Update state when object is transformed
      const objectChangeHandler = () => {
        if (objectMeshRef.current) {
          if (collisionMode === "physical") {
            const collision = checkCollision(
              objectMeshRef.current,
              interiorWidth,
              interiorHeight,
              interiorDepth,
              isDoorOpen,
              doorWidth,
              doorHeight
            );

            if (collision) {
              // Revert to last known valid position
              objectMeshRef.current.position.x = lastValidPositionRef.current.x;
              objectMeshRef.current.position.z = lastValidPositionRef.current.z;
              objectMeshRef.current.rotation.x = lastValidRotationRef.current.x;
              objectMeshRef.current.rotation.y = lastValidRotationRef.current.y;
              objectMeshRef.current.rotation.z = lastValidRotationRef.current.z;
            } else {
              // Update last valid if no collision
              lastValidPositionRef.current = {
                x: objectMeshRef.current.position.x,
                y: 0,
                z: objectMeshRef.current.position.z,
              };
              lastValidRotationRef.current = {
                x: objectMeshRef.current.rotation.x,
                y: objectMeshRef.current.rotation.y,
                z: objectMeshRef.current.rotation.z,
              };
            }
          }

          // In all modes, update state (but if physical revert happened, state updates to reverted pos)
          // Update React state with the current (potentially reverted) mesh position/rotation
          setObjectPosition({
            x: objectMeshRef.current.position.x,
            y: 0,
            z: objectMeshRef.current.position.z,
          });
          setObjectRotation({
            x: objectMeshRef.current.rotation.x,
            y: objectMeshRef.current.rotation.y,
            z: objectMeshRef.current.rotation.z,
          });
        }
      };

      transformControls.addEventListener("dragging-changed", draggingChangedHandler);
      transformControls.addEventListener("objectChange", objectChangeHandler);

      return () => {
        transformControls.removeEventListener("dragging-changed", draggingChangedHandler);
        transformControls.removeEventListener("objectChange", objectChangeHandler);
        cleanupControls();
      };
    }
  }, [
    sceneRef,
    cameraRef,
    rendererRef,
    controlsRef,
    interiorHeight,
    interiorWidth,
    interiorDepth,
    controlMode,
    isObjectSelected,
    setObjectPosition,
    setObjectRotation,
    setIsDragging,
    lastValidPositionRef,
    lastValidRotationRef,
    collisionMode,
    isDoorOpen,
    doorWidth,
    doorHeight,
    objectHeight,
    objectWidth,
    objectDepth,
  ]);


  // Update object transform when position/rotation state changes (from button clicks or sliders)
  useEffect(() => {
    if (objectMeshRef.current) {
      objectMeshRef.current.position.set(
        objectPosition.x,
        objectHeight / 2,
        objectPosition.z,
      );
      objectMeshRef.current.rotation.set(
        objectRotation.x,
        objectRotation.y,
        objectRotation.z,
      );

      // Update stored position/rotation for dimension changes
      initialPositionRef.current = objectPosition;
      initialRotationRef.current = objectRotation;
    }
  }, [objectPosition, objectRotation, objectHeight]);

  return { objectMeshRef, transformControlsRef };
}
