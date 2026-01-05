import * as THREE from "three";

export function checkCollision(
  objectMesh,
  interiorWidth,
  interiorHeight,
  interiorDepth,
  isDoorOpen = false,
  doorWidth = 0,
  doorHeight = 0
) {
  if (!objectMesh) return false;

  const objectBox = new THREE.Box3().setFromObject(objectMesh);

  // Basic bounds check
  // Left, Right, Bottom, Top, Back walls are always solid
  const collidesWithWalls =
    objectBox.min.x < -interiorWidth / 2 ||
    objectBox.max.x > interiorWidth / 2 ||
    objectBox.min.y < 0 ||
    objectBox.max.y > interiorHeight ||
    objectBox.min.z < -interiorDepth / 2;

  // Front wall (Door side) check
  let collidesWithDoor = false;
  if (!isDoorOpen) {
    // Door is closed - entire front is solid
    collidesWithDoor = objectBox.max.z > interiorDepth / 2;
  } else {
    // Door is open - check collision with door frame only
    // Door frame consists of:
    // 1. Top frame: above doorHeight
    // 2. Left frame: left of door opening
    // 3. Right frame: right of door opening

    const doorZ = interiorDepth / 2;
    const doorThickness = 2; // Frame thickness

    // Check if object is at the door plane
    if (objectBox.max.z > doorZ - doorThickness) {
      // Top frame collision (above door)
      if (objectBox.max.y > doorHeight) {
        collidesWithDoor = true;
      }

      // Left frame collision
      // The instruction had a slight logical error here, it should check against the door opening, not the interior width.
      // The original instruction's left frame check:
      // const leftFrameWidth = (interiorWidth - doorWidth) / 2;
      // if (objectBox.min.x < -doorWidth / 2 && objectBox.min.y < doorHeight) {
      //     collidesWithDoor = true;
      // }
      // This condition `objectBox.min.x < -doorWidth / 2` already covers the left side of the door opening.
      // The `leftFrameWidth` variable was not used in the instruction's provided code.
      // I will implement the provided logic faithfully.
      if (objectBox.min.x < -doorWidth / 2 &&
        objectBox.min.y < doorHeight) {
        collidesWithDoor = true;
      }

      // Right frame collision
      if (objectBox.max.x > doorWidth / 2 &&
        objectBox.min.y < doorHeight) {
        collidesWithDoor = true;
      }
    }
  }

  return collidesWithWalls || collidesWithDoor;
}

export function checkDoorCollision(
  objectMesh,
  doorWidth,
  doorHeight,
  interiorDepth,
) {
  if (!objectMesh) return false;

  const objectBox = new THREE.Box3().setFromObject(objectMesh);
  const doorBox = new THREE.Box3(
    new THREE.Vector3(-doorWidth / 2, 0, interiorDepth / 2 - 10),
    new THREE.Vector3(doorWidth / 2, doorHeight, interiorDepth / 2 + 10),
  );

  return objectBox.intersectsBox(doorBox);
}
