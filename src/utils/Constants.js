export const Constants = {
    TABLE_WIDTH: 2.74,
    TABLE_HEIGHT: 1.37,
    BALL_RADIUS: 0.028575,
    BALL_MASS: 0.17,
    
    // For visual scaling if your models have different units
    MODEL_SCALE: 1.0,
    
    // Starting positions (physics uses XY plane)
    CUE_BALL_START: { x: 0.548, y: 0 },       // x = TABLE_WIDTH * 0.2
    BALLS_START_X: 1.9728,                    // TABLE_WIDTH * 0.72
    BALLS_START_Z: 0,
    TRIANGLE_SPACING: 0.0557,                 // BALL_RADIUS * 1.95
    
    // Physics constants (will be used by physics team)
    G: 9.81,
    MU_S: 0.2,
    MU_R: 0.01,
    EPSILON: 0.01
};