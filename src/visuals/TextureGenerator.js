// src/visuals/TextureGenerator.js
import * as THREE from 'three';

export class TextureGenerator {
    static createNumberTexture(number, baseColorHex) {
        if (number === 0) return null; // cue ball has no number
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Background (ball color)
        ctx.fillStyle = `#${baseColorHex.toString(16).padStart(6, '0')}`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // White circle
        ctx.beginPath();
        ctx.arc(canvas.width/2, canvas.height/2, canvas.width*0.35, 0, 2*Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 12;
        ctx.stroke();

        // Number
        ctx.font = `Bold ${canvas.width * 0.4}px "Arial"`;
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(number.toString(), canvas.width/2, canvas.height/2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }
}