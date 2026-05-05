// Jim Whitehead
// Created: 4/25/2024
// Phaser: 3.70.0
//
// Bullet Time
//
// Multiple examples of how to implement bullet firing logic using Phaser
// 
// Art assets from Kenny Assets:
// https://kenney.nl/assets/

// debug with extreme prejudice
"use strict"

// game config

import ArrayBoom from "./Scenes/ArrayBoom.js";
import Failure from "./Scenes/Failure.js";

let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 960,
    height: 640,
    scene: [ArrayBoom, Failure]
}


const game = new Phaser.Game(config);