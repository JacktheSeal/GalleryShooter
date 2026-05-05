import { GameState } from "./gameState.js";
import { LEVELS } from "./enemyArrays.js";

export function initGame(scene) {
    GameState.reset();

    let my = scene.my;

    scene.enemies.clear(true, true);
    scene.my.sprite.bullet.clear(true, true);
    scene.my.sprite.enemyBullet.clear(true, true);

    scene.enemies = scene.add.group();
    scene.my.sprite.bullet = scene.add.group();
    scene.my.sprite.enemyBullet = scene.add.group();

    scene.updateHealthUI();

    LEVELS.level1.forEach((enemy) => {
        const sprite = scene.add.sprite(enemy.x, enemy.y, "enemy")
            .setScale(4.0);

        sprite.scorePoints = 25;
        scene.enemies.add(sprite);
    });

    if (my.sprite.player) {
        my.sprite.player.x = scene.game.config.width / 2;
        my.sprite.player.y = scene.game.config.height - 40;
    }
}