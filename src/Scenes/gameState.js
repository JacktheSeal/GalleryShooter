export const GameState = {
    score: 0,
    health: 3,
    highScore: 0,

    reset() {
        this.score = 0;
        this.health = 3;
    }
};