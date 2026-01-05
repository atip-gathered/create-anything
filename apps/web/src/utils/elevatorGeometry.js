import * as THREE from "three";

export function createElevatorGeometry(
  interiorWidth,
  interiorHeight,
  interiorDepth,
  doorWidth,
  doorHeight,
) {
  const elevatorGroup = new THREE.Group();

  // Floor
  const floorGeometry = new THREE.BoxGeometry(interiorWidth, 2, interiorDepth);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = 1;
  floor.receiveShadow = true;
  elevatorGroup.add(floor);

  // Back wall
  const backWallGeometry = new THREE.BoxGeometry(
    interiorWidth,
    interiorHeight,
    2,
  );
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0xdddddd,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
  });
  const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
  backWall.position.set(0, interiorHeight / 2, -interiorDepth / 2);
  backWall.receiveShadow = true;
  elevatorGroup.add(backWall);

  // Left wall
  const sideWallGeometry = new THREE.BoxGeometry(
    2,
    interiorHeight,
    interiorDepth,
  );
  const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
  leftWall.position.set(-interiorWidth / 2, interiorHeight / 2, 0);
  leftWall.receiveShadow = true;
  elevatorGroup.add(leftWall);

  // Right wall
  const rightWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
  rightWall.position.set(interiorWidth / 2, interiorHeight / 2, 0);
  rightWall.receiveShadow = true;
  elevatorGroup.add(rightWall);

  // Ceiling
  const ceilingGeometry = new THREE.BoxGeometry(
    interiorWidth,
    2,
    interiorDepth,
  );
  const ceiling = new THREE.Mesh(ceilingGeometry, wallMaterial);
  ceiling.position.y = interiorHeight;
  ceiling.receiveShadow = true;
  elevatorGroup.add(ceiling);

  // Door frame
  const doorFrameHeight = doorHeight;
  const doorFrameWidth = doorWidth;

  // Top of door frame
  const doorTopGeometry = new THREE.BoxGeometry(
    interiorWidth,
    interiorHeight - doorFrameHeight,
    2,
  );
  const doorFrameMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    transparent: true,
    opacity: 0.5,
  });
  const doorTop = new THREE.Mesh(doorTopGeometry, doorFrameMaterial);
  doorTop.position.set(
    0,
    doorFrameHeight + (interiorHeight - doorFrameHeight) / 2,
    interiorDepth / 2,
  );
  elevatorGroup.add(doorTop);

  // Left door frame
  const leftFrameWidth = (interiorWidth - doorFrameWidth) / 2;
  const leftFrameGeometry = new THREE.BoxGeometry(
    leftFrameWidth,
    doorFrameHeight,
    2,
  );
  const leftFrame = new THREE.Mesh(leftFrameGeometry, doorFrameMaterial);
  leftFrame.position.set(
    -doorFrameWidth / 2 - leftFrameWidth / 2,
    doorFrameHeight / 2,
    interiorDepth / 2,
  );
  elevatorGroup.add(leftFrame);

  // Right door frame
  const rightFrame = new THREE.Mesh(leftFrameGeometry, doorFrameMaterial);
  rightFrame.position.set(
    doorFrameWidth / 2 + leftFrameWidth / 2,
    doorFrameHeight / 2,
    interiorDepth / 2,
  );
  elevatorGroup.add(rightFrame);

  // Door (initially open - positioned to the side)
  const doorGeometry = new THREE.BoxGeometry(
    doorFrameWidth,
    doorFrameHeight,
    1,
  );
  const doorMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a5568,
    metalness: 0.5,
    roughness: 0.5,
    transparent: true,
    opacity: 0.7,
  });
  const door = new THREE.Mesh(doorGeometry, doorMaterial);
  door.position.set(
    doorFrameWidth,
    doorFrameHeight / 2,
    interiorDepth / 2 + 2,
  );
  door.castShadow = true;
  elevatorGroup.add(door);

  return { elevatorGroup, door };
}
