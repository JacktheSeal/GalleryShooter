// enemyTypes.js

export const ENEMY_TYPES = {
    basic: {
        texture: "enemy_basic",
        health: 1,
        score: 25,
        shootCooldown: 240,
        bulletSpeed: 250,
        moveSpeed: 40,
        movement: "straight"
    },

    rapid: {
        texture: "enemy_rapid",
        health: 1,
        score: 40,
        shootCooldown: 90,
        bulletSpeed: 200,
        moveSpeed: 60,
        movement: "zigzag"
    },

    sniper: {
        texture: "enemy_sniper",
        health: 1,
        score: 75,
        shootCooldown: 480,
        bulletSpeed: 500,
        moveSpeed: 20,
        movement: "still"
    }
};