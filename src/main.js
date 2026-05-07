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

import Level1 from "./Scenes/Level1.js";
import Failure from "./Scenes/Failure.js";
import Level2 from "./Scenes/Level2.js";
import End from "./Scenes/End.js";

let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 960,
    height: 640,
    physics: {
        default: "arcade",
        arcade: {
            debug: true   // turn ON for now so you can see hitboxes
        }
    },
    scene: [Level1, Level2, Failure, End]
}


const game = new Phaser.Game(config);