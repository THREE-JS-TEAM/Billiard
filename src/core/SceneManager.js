// src/core/SceneManager.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class SceneManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
    }

    init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x411122);
        this.scene.fog = new THREE.FogExp2(0x111122, 0.008);

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(4, 3, 5);
        this.camera.lookAt(1.37, 0, 1.37);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.8;
        this.controls.target.set(1.37, 0, 1.37);

        this._setupLights();
        window.addEventListener('resize', () => this.onResize());
    }

    _setupLights() {
        const ambient = new THREE.AmbientLight(0x404060);
        this.scene.add(ambient);

        const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
        mainLight.position.set(2, 5, 3);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 1024;
        mainLight.shadow.mapSize.height = 1024;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 8;
        mainLight.shadow.camera.left = -3;
        mainLight.shadow.camera.right = 3;
        mainLight.shadow.camera.top = 3;
        mainLight.shadow.camera.bottom = -3;
        this.scene.add(mainLight);

        const fillLight = new THREE.PointLight(0x88aa88, 0.3);
        fillLight.position.set(1.37, -0.5, 1.37);
        this.scene.add(fillLight);

        const rimLight = new THREE.PointLight(0xffaa66, 0.4);
        rimLight.position.set(0, 1.5, 3);
        this.scene.add(rimLight);
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    update() {
        this.controls.update(); 
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    getScene() {
        return this.scene;
    }
}