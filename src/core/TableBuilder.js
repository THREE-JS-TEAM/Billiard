// src/core/TableBuilder.js
import * as THREE from 'three';
import { Constants } from '../utils/Constants.js';

export class TableBuilder {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
    }

    build() {
        this._addBase();
        this._addFelt();
        this._addRails();
        this._addPockets();
        this.scene.add(this.group);
    }

    _addBase() {
        const geometry = new THREE.BoxGeometry(Constants.TABLE_WIDTH, Constants.TABLE_THICKNESS, Constants.TABLE_HEIGHT);
        const material = new THREE.MeshStandardMaterial({ color: Constants.WOOD_COLOR, roughness: 0.6, metalness: 0.1 });
        const base = new THREE.Mesh(geometry, material);
        base.position.set(0, -Constants.TABLE_THICKNESS / 2, 0);
        base.receiveShadow = true;
        base.castShadow = true;
        this.group.add(base);
    }

    _addFelt() {
        const geometry = new THREE.PlaneGeometry(Constants.TABLE_WIDTH, Constants.TABLE_HEIGHT);
        const material = new THREE.MeshStandardMaterial({ color: Constants.FELT_COLOR, roughness: 0.85, metalness: 0.05 });
        const felt = new THREE.Mesh(geometry, material);
        felt.rotation.x = -Math.PI / 2;
        felt.position.y = 0.005;
        felt.receiveShadow = true;
        this.group.add(felt);
    }

    _addRails() {
        const railMat = new THREE.MeshStandardMaterial({ color: Constants.RAIL_COLOR, roughness: 0.4, metalness: 0.2 });
        const cushionMat = new THREE.MeshStandardMaterial({ color: Constants.CUSHION_COLOR, roughness: 0.9 });

        const addRail = (x, z, width, depth, rotY) => {
            const rail = new THREE.Mesh(new THREE.BoxGeometry(width, Constants.RAIL_HEIGHT, depth), railMat);
            rail.position.set(x, Constants.RAIL_HEIGHT / 2 + 0.01, z);
            rail.rotation.y = rotY;
            rail.castShadow = true;
            this.group.add(rail);

            const cushion = new THREE.Mesh(new THREE.BoxGeometry(width * 0.7, 0.03, depth * 0.4), cushionMat);
            cushion.position.set(x, 0.03, z);
            cushion.rotation.y = rotY;
            cushion.castShadow = true;
            this.group.add(cushion);
        };

        // Top and bottom
        addRail(0, Constants.TABLE_HEIGHT / 2 + Constants.RAIL_WIDTH / 2, Constants.TABLE_WIDTH + Constants.RAIL_WIDTH, Constants.RAIL_WIDTH, 0);
        addRail(0, -Constants.TABLE_HEIGHT / 2 - Constants.RAIL_WIDTH / 2, Constants.TABLE_WIDTH + Constants.RAIL_WIDTH, Constants.RAIL_WIDTH, 0);
        // Left and right
        addRail(-Constants.TABLE_WIDTH / 2 - Constants.RAIL_WIDTH / 2, 0, Constants.RAIL_WIDTH, Constants.TABLE_HEIGHT + Constants.RAIL_WIDTH, Math.PI / 2);
        addRail(Constants.TABLE_WIDTH / 2 + Constants.RAIL_WIDTH / 2, 0, Constants.RAIL_WIDTH, Constants.TABLE_HEIGHT + Constants.RAIL_WIDTH, Math.PI / 2);
    }

    _addPockets() {
        const pocketMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.7, roughness: 0.3 });
        const addPocket = (x, z) => {
            const ring = new THREE.Mesh(
                new THREE.CylinderGeometry(Constants.POCKET_RADIUS + 0.01, Constants.POCKET_RADIUS + 0.01, 0.02, 24),
                pocketMat
            );
            ring.position.set(x, 0.02, z);
            ring.castShadow = true;
            this.group.add(ring);

            const hole = new THREE.Mesh(
                new THREE.CylinderGeometry(Constants.POCKET_RADIUS, Constants.POCKET_RADIUS, 0.03, 24),
                new THREE.MeshStandardMaterial({ color: 0x000000 })
            );
            hole.position.set(x, 0.01, z);
            this.group.add(hole);
        };

        // Corners
        addPocket(-Constants.TABLE_WIDTH / 2 - 0.02,  Constants.TABLE_HEIGHT / 2 + 0.02);
        addPocket( Constants.TABLE_WIDTH / 2 + 0.02,  Constants.TABLE_HEIGHT / 2 + 0.02);
        addPocket(-Constants.TABLE_WIDTH / 2 - 0.02, -Constants.TABLE_HEIGHT / 2 - 0.02);
        addPocket( Constants.TABLE_WIDTH / 2 + 0.02, -Constants.TABLE_HEIGHT / 2 - 0.02);
        // Middle pockets
        addPocket(0,  Constants.TABLE_HEIGHT / 2 + 0.05);
        addPocket(0, -Constants.TABLE_HEIGHT / 2 - 0.05);
    }
}