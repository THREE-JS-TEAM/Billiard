import * as THREE from "three"
import { Constants } from "../utils/Constants";

export class TableManager {
  constructor(scene, modelLoader, modelUrl) {
    this.scene = scene;
    this.modelLoader = modelLoader;
    this.modelUrl = modelUrl;
    this.model = null;
  }

  async loadAndAdd() {
    const gltf = await this.modelLoader.loadModel(this.modelUrl);
    this.model = gltf.scene;

    const box = new THREE.Box3().setFromObject(this.model);
    const currentWidth = box.getSize(new THREE.Vector3()).x;
    const scaleFactor = Constants   .TABLE_WIDTH / currentWidth;
    this.model.scale.set(scaleFactor, scaleFactor, scaleFactor);
    this.model.position.set(0, 0, 0);

    // Adjust scale/position if needed
    this.model.scale.set(1, 1, 1);
    this.model.position.set(0, 0, 0);

    // Enable shadows on all children
    this.model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    this.scene.add(this.model);

    // // const box = new THREE.Box3().setFromObject(this.model);
    // const minY = box.min.y;
    // const maxY = box.max.y;
    // const tableTopY = maxY; 

    // // Store this value for BallManager to use
    // window.TABLE_TOP_Y = tableTopY;
    // console.log('Table top Y position:', tableTopY);
    
    return this.model;
  }
}
