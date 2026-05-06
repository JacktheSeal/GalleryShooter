import Level1 from "./Level1.js";
import { GameState } from "./gameState.js";
export default class Failure extends Phaser.Scene {
    constructor() {
        super("Failure");

        console.log("i made it to failure");
    }

    preload() {

    }

    create() {
        this.add.text(this.game.config.width / 2 - 100, this.game.config.height / 2, "You Lose! Press Space to Restart", {
            fontFamily: 'Times, serif',
            fontSize: 24,
            wordWrap: {
                width: 200
            }
        });

        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            GameState.reset();
            this.scene.start("Level1");
        }
    }
}