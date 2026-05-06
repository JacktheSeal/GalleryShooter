// enemyWaves.js

export const LEVELS = {
    level1: [
        {
            delay: 0,

            enemies: [
                { type: "basic", x: 100, y: 100 },
                { type: "basic", x: 200, y: 100 },
                { type: "basic", x: 300, y: 100 },
            ]
        },

        {
            delay: 3000,

            enemies: [
                { type: "rapid", x: 150, y: 80 },
                { type: "rapid", x: 250, y: 80 },
            ]
        },

        {
            delay: 6000,

            enemies: [
                { type: "sniper", x: 200, y: 50 }
            ]
        }
    ]
};