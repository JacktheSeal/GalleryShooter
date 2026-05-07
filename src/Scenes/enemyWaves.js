// enemyWaves.js

export const LEVELS = {
    level1: [
        {
            delay: 0,

            enemies: [
                { type: "basic", x: 40, y: 400 },
                { type: "basic", x: 800, y: 350 },
                { type: "sniper", x: 550, y: 80 },
                { type: "rapid", x: 440, y: 400}
            ]
        },

        {
            delay: 3000,

            enemies: [
                { type: "rapid", x: 400, y: 80 },
                { type: "rapid", x: 540, y: 80 },
                { type: "sniper", x: 170, y: 275 },
                { type: "basic", x: 800, y: 350 },
                { type: "basic", x: 580, y: 350 },
            ]
        },

        {
            delay: 6000,

            enemies: [
                { type: "sniper", x: 170, y: 275 },
                { type: "sniper", x: 550, y: 80 },
                { type: "sniper", x: 420, y: 80 },
                { type: "sniper", x: 400, y: 270 },
                { type: "rapid", x: 170, y: 400 },
                { type: "rapid", x: 590, y: 350 }
            ]
        }
    ],
    level2: [
        {
            delay: 0,

            enemies: [
                { type: "basic", x: 40, y: 400 },
                { type: "basic", x: 80, y: 250 },
                { type: "basic", x: 800, y: 350 },
                { type: "basic", x: 400, y: 350 },
                { type: "sniper", x: 390, y: 80 },
                { type: "rapid", x: 20, y: 270}
            ]
        },
        {
            delay: 3000,

            enemies: [
                { type: "basic", x: 350, y: 100 },
                { type: "basic", x: 40, y: 300 },
                { type: "basic", x: 320, y: 275 },
                { type: "sniper", x: 600, y: 450 },
                { type: "sniper", x: 550, y: 350 },
            ]
        },
        {
            delay: 6000,

            enemies: [
                { type: "sniper", x: 170, y: 275 },
                { type: "sniper", x: 550, y: 80 },
                { type: "sniper", x: 420, y: 80 },
                { type: "sniper", x: 400, y: 270 },
                { type: "sniper", x: 170, y: 400 },
                { type: "sniper", x: 590, y: 350 }
            ]
        }
    ]
};