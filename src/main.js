import { SceneManager } from './core/SceneManager.js';
import { ModelLoader } from './core/ModelLoader.js';
import { TableManager } from './visuals/TableManager.js';
import { BallManager } from './visuals/BallManager.js';
import { CueManager } from './visuals/CueManager.js';
import { PhysicsBridge } from './physics/PhysicsBridge.js';

// Paths to your models (adjust according to your assets)
const MODEL_PATHS = {
    table: '../public/assets/models/table.glb',
    ball: '../public/assets/models/ball.glb',        // a generic ball model
    cue: '../public/assets/models/cue_stick.glb'
};

async function init() {
    // 1. Core Three.js
    const sceneManager = new SceneManager();
    sceneManager.init();
    const scene = sceneManager.getScene();
    
    // 2. Model loader
    const modelLoader = new ModelLoader();
    
    // 3. Load and add table
    const tableManager = new TableManager(scene, modelLoader, MODEL_PATHS.table);
    await tableManager.loadAndAdd();
    console.log('Table loaded');
    
    // 4. Load balls (requires ball model)
    const ballManager = new BallManager(scene, modelLoader, MODEL_PATHS.ball);
    await ballManager.init();
    console.log('Balls loaded');
    
    // 5. Load cue stick
    const cueManager = new CueManager(scene, modelLoader, MODEL_PATHS.cue);
    await cueManager.load();
    console.log('Cue loaded');
    
    // 6. Physics bridge (placeholder)
    const physics = new PhysicsBridge(ballManager);
    physics.init();
    
    // Expose cue aiming for Member 3 (example)
    window.cueManager = cueManager;
    window.physics = physics;
    
    // 7. Animation loop
    let lastTime = performance.now();
    function animate() {
        const now = performance.now();
        let delta = Math.min(1 / 30, (now - lastTime) / 1000);
        lastTime = now;
        
        physics.update(delta);
        sceneManager.update();
        sceneManager.render();
        
        requestAnimationFrame(animate);
    }
    animate();
}

init().catch(console.error);