import * as THREE from "three";
import { Constants } from "../utils/Constants.js";

export class BallManager {
  constructor(scene, modelLoader, ballModelUrl) {
    this.scene = scene;
    this.modelLoader = modelLoader;
    this.ballModelUrl = ballModelUrl;
    this.balls = []; // array of THREE.Object3D (the meshes)
    this.ballRoots = []; // root objects for each ball (to position)
    this.baseModel = null;
  }

  async init() {
    const gltf = await this.modelLoader.loadModel(this.ballModelUrl);
    this.baseModel = gltf.scene;
    // Force correct size: desired radius 0.028575
    // Measure current radius of the model (bounding sphere)
    const box = new THREE.Box3().setFromObject(this.baseModel);
    const currentSize = box.getSize(new THREE.Vector3());
    const currentRadius =
      Math.max(currentSize.x, currentSize.y, currentSize.z) / 2;
    const scaleFactor = Constants.BALL_RADIUS / currentRadius;
    this.baseModel.scale.set(scaleFactor, scaleFactor, scaleFactor);
    this.createInitialBalls();
  }

  createInitialBalls() {
    // Remove existing
    this.balls.forEach((ball) => this.scene.remove(ball));
    this.balls = [];

    // Helper to add a ball at position (x, z) with a given color/material override
    const addBall = (x, z, colorHex, isCue = false, number = null) => {
      // Clone the base model
      const ballCopy = this.baseModel.clone();
      ballCopy.position.set(x, Constants.BALL_RADIUS, z);
      ballCopy.castShadow = true;
      ballCopy.receiveShadow = true;

      // If your model supports material changes, you can modify its material here
      // For example, if the ball has a material named "BallMaterial":
      ballCopy.traverse((child) => {
        if (child.isMesh) {
          if (number !== null && number > 0) {
            // You would need to apply a texture with number
            // For now, just change color
            child.material = child.material.clone();
            child.material.color.setHex(colorHex);
          } else if (isCue) {
            child.material = child.material.clone();
            child.material.color.setHex(0xffffff);
          }
        }
      });

      ballCopy.userData = {
        id: `ball_${this.balls.length}`,
        isCue,
        number,
        radius: Constants.BALL_RADIUS,
        mass: Constants.BALL_MASS,
      };
      this.scene.add(ballCopy);
      this.balls.push(ballCopy);
      return ballCopy;
    };

    // Cue ball
    addBall(
      Constants.CUE_BALL_START.x,
      Constants.CUE_BALL_START.y,
      0xffffff,
      true,
      0,
    );

    // Triangle formation for numbered balls (colors optional)
    const startX = Constants.BALLS_START_X;
    const startZ = Constants.BALLS_START_Z;
    const spacing = Constants.TRIANGLE_SPACING;
    // You can define colors for each ball number (1..15) from Constants if needed
    const ballColors = [
      0xffdd44, 0x2244ff, 0xff4444, 0x8844ff, 0xff8844, 0x44ff44, 0xaa6644,
      0x222222, 0xffaa44, 0x2266ff, 0xff6666, 0xaa66ff, 0xffaa66, 0x66ff66,
      0xcc8866,
    ];

    let ballIndex = 1;
    for (let row = 0; row < 5; row++) {
      const ballsInRow = row + 1;
      for (let i = 0; i < ballsInRow; i++) {
        if (ballIndex > 15) break;
        const xPos = startX + row * spacing;
        const zPos = startZ + (i - (ballsInRow - 1) / 2) * spacing;
        addBall(xPos, zPos, ballColors[ballIndex - 1], false, ballIndex);
        ballIndex++;
      }
    }
  }

  /**
   * Public API for physics team: update ball positions.
   * physicsBalls: array of { pos: {x, y}, vel, omega, phase }
   */
  updateFromPhysics(physicsBalls) {
    if (!physicsBalls || physicsBalls.length !== this.balls.length) return;
    for (let i = 0; i < this.balls.length; i++) {
      const ballMesh = this.balls[i];
      const phys = physicsBalls[i];
      if (phys && phys.pos) {
        ballMesh.position.x = phys.pos.x;
        ballMesh.position.z = phys.pos.y;
        ballMesh.position.y = Constants.BALL_RADIUS;
        // Optionally apply visual rotation based on omega
        if (phys.omega) {
          ballMesh.rotateX(phys.omega.x * 0.05);
          ballMesh.rotateZ(phys.omega.z * 0.05);
        }
      }
    }
  }

  reset() {
    this.createInitialBalls();
  }

  getBallMeshes() {
    return this.balls;
  }
}
