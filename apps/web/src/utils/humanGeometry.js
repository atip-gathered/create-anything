import * as THREE from "three";

export function createHumanGeometry(carryingStyle) {
    const humanGroup = new THREE.Group();

    const humanHeight = 170;
    const headRadius = 12; // 24cm diameter
    const torsoWidth = 40;
    const torsoHeight = 60;
    const torsoDepth = 20;
    const legHeight = 90;
    const legWidth = 15;
    const legDepth = 15;
    const armLength = 70;
    const armWidth = 10;

    const skinColor = 0xffdab9;
    const shirtColor = 0x3b82f6; // Blue shirt
    const pantsColor = 0x1f2937; // Dark pants

    // Materials
    const skinMaterial = new THREE.MeshStandardMaterial({ color: skinColor });
    const shirtMaterial = new THREE.MeshStandardMaterial({ color: shirtColor });
    const pantsMaterial = new THREE.MeshStandardMaterial({ color: pantsColor });

    // Head
    const headGeometry = new THREE.SphereGeometry(headRadius, 32, 32);
    const head = new THREE.Mesh(headGeometry, skinMaterial);
    head.position.y = humanHeight - headRadius;
    head.castShadow = true;
    humanGroup.add(head);

    // Torso
    const torsoGeometry = new THREE.BoxGeometry(
        torsoWidth,
        torsoHeight,
        torsoDepth
    );
    const torso = new THREE.Mesh(torsoGeometry, shirtMaterial);
    // Torso center is at: legHeight + torsoHeight/2
    torso.position.y = legHeight + torsoHeight / 2;
    torso.castShadow = true;
    humanGroup.add(torso);

    // Legs (Left and Right)
    const legGeometry = new THREE.BoxGeometry(legWidth, legHeight, legDepth);

    const leftLeg = new THREE.Mesh(legGeometry, pantsMaterial);
    leftLeg.position.set(-10, legHeight / 2, 0); // Offset from center
    leftLeg.castShadow = true;
    humanGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, pantsMaterial);
    rightLeg.position.set(10, legHeight / 2, 0);
    rightLeg.castShadow = true;
    humanGroup.add(rightLeg);

    // Arms (Depends on carrying style)
    const armGeometry = new THREE.BoxGeometry(armWidth, armLength, armWidth);

    // Basic arm positions for "standing"
    // For carrying, we adjust rotation/position
    const leftArm = new THREE.Mesh(armGeometry, shirtMaterial);
    const rightArm = new THREE.Mesh(armGeometry, shirtMaterial);

    // Shoulder position
    const shoulderY = legHeight + torsoHeight - 10;
    const shoulderOffset = torsoWidth / 2 + armWidth / 2;

    leftArm.position.set(-shoulderOffset, shoulderY - armLength / 2, 0);
    rightArm.position.set(shoulderOffset, shoulderY - armLength / 2, 0);

    // Adjust pose based on carrying style
    // Assuming the object is at (0,0,0) relative to the human?
    // No, the human group will be positioned relative to the object.
    // The human "holds" the object.
    // We need to pose the arms as if holding something.

    if (carryingStyle === "front" || carryingStyle === "back") {
        // Arms forward to hold object
        leftArm.rotation.x = -Math.PI / 2; // Point forward
        leftArm.position.set(-shoulderOffset, shoulderY, 20); // Move forward slightly

        rightArm.rotation.x = -Math.PI / 2;
        rightArm.position.set(shoulderOffset, shoulderY, 20);
    } else if (carryingStyle === "right" || carryingStyle === "left") {
        // Side carry logic (simplified)
        leftArm.rotation.z = Math.PI / 6;
        rightArm.rotation.z = -Math.PI / 6;
    }

    humanGroup.add(leftArm);
    humanGroup.add(rightArm);

    return humanGroup;
}
