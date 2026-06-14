import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class ModelLoader {
    constructor() {
        this.loader = new GLTFLoader();
        this.cache = new Map();
    }

    loadModel(url) {
        if (this.cache.has(url)) {
            return Promise.resolve(this.cache.get(url));
        }
        return new Promise((resolve, reject) => {
            this.loader.load(url, 
                (gltf) => {
                    this.cache.set(url, gltf);
                    resolve(gltf);
                },
                (progress) => {
                    console.log(`Loading ${url}: ${Math.round(progress.loaded / progress.total * 100)}%`);
                },
                (error) => {
                    console.error(`Failed to load ${url}:`, error);
                    // If the error is a parsing error, fetch the URL manually to see what's returned
                    fetch(url).then(res => res.text()).then(text => {
                        console.error(`Server returned: ${text.substring(0, 200)}`);
                    });
                    reject(error);
                }
            );
        });
    }
}