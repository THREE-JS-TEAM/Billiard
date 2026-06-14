export class CueManager {
    constructor(scene, modelLoader, cueModelUrl) {
        this.scene = scene;
        this.modelLoader = modelLoader;
        this.cueModelUrl = cueModelUrl;
        this.cueModel = null;
        this.visible = false;
        this.aimDirection = { x: 1, y: 0 };
        this.power = 0.5;
    }
    
    async load() {
        const gltf = await this.modelLoader.loadModel(this.cueModelUrl);
        this.cueModel = gltf.scene;
        this.cueModel.visible = false;
        this.scene.add(this.cueModel);
    }
    
    // Call this when aiming (Member 3 will provide start point, direction)
    aim(fromPos, direction) {
        if (!this.cueModel) return;
        this.aimDirection = direction;
        this.cueModel.visible = true;
        // Position cue behind the cue ball (fromPos is cue ball position)
        const offset = 0.15; // distance behind ball
        const posX = fromPos.x - direction.x * offset;
        const posZ = fromPos.y - direction.y * offset;
        this.cueModel.position.set(posX, Constants.BALL_RADIUS + 0.02, posZ);
        // Rotate to face direction
        const angle = Math.atan2(direction.y, direction.x);
        this.cueModel.rotation.y = angle;
        // Optionally add tilt for top/back spin (Member 3 can adjust)
    }
    
    hide() {
        if (this.cueModel) this.cueModel.visible = false;
    }
    
    setPower(power) {
        this.power = Math.min(1, Math.max(0, power));
        // Visual feedback: scale cue length or change color
    }
    
    // Called when strike is executed
    strike() {
        // The physics engine will receive the strike data
        this.hide();
        // Return strike info for physics
        return {
            power: this.power,
            direction: this.aimDirection,
            offset: { x: 0, y: 0, z: 0 } // Member 3 will set offset for spin
        };
    }
}