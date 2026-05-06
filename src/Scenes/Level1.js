import { LEVELS } from "./enemyWaves.js";
import { GameState } from "./gameState.js";
import { ENEMY_TYPES } from "./enemyTypes.js";

export default class Level1 extends Phaser.Scene {
    constructor() {
        super("Level1");

        // Initialize a class variable "my" which is an object.
        // The object has two properties, both of which are objects
        //  - "sprite" holds bindings (pointers) to created sprites
        //  - "text"   holds bindings to created bitmap text objects
        this.my = {sprite: {}, text: {}};

        // defines cooldown for enemy bullets, in update calls
        // this.enemyBulletCooldown = 120;
        // this.enemyBulletTimer = 0;

        // this.enemyMovementCooldown = 480;
        // this.enemyMovementTimer = 0;

        this.currentWave = 0;
        this.waveTimer = 0;

        //game state flags
        this.waveActive = false;
        this.levelComplete = false;

        this.maxBullets = 10;           // Don't create more than this many bullets
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("player", "PNG/Players/Tiles/tile_0000.png");
        this.load.image("player_bullet", "PNG/Weapons/Tiles/tile_0023.png");


        this.load.image("enemy_basic", "PNG/Enemies/Tiles/tile_0013.png");
        this.load.image("enemy_rapid", "PNG/Players/Tiles/tile_0008.png");
        this.load.image("enemy_sniper", "PNG/Players/Tiles/tile_0012.png");

        // For animation
        this.load.image("whitePuff00", "whitePuff00.png");
        this.load.image("whitePuff01", "whitePuff01.png");
        this.load.image("whitePuff02", "whitePuff02.png");
        this.load.image("whitePuff03", "whitePuff03.png");

        this.load.image("healthTile", "PNG/Interface/Tiles/tile_0143.png");

        // Load the Kenny Rocket Square bitmap font
        // This was converted from TrueType format into Phaser bitmap
        // format using the BMFont tool.
        // BMFont: https://www.angelcode.com/products/bmfont/
        // Tutorial: https://dev.to/omar4ur/how-to-create-bitmap-fonts-for-phaser-js-with-bmfont-2ndc
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

        this.load.audio("hitSound", 'Sounds/explosion-a.ogg');
        this.load.audio("bgMusic", 'mondamusic-retro-arcade-game-music-512837.mp3');
    
        this.load.image("level_tiles", "/PNG/Tiles/Tilemap/tilemap_packed.png");    // tile sheet   
        this.load.tilemapTiledJSON("map", "/Levels/Level1.json");                  // Load JSON of tilemap
    }

    create() {


        //reset wave
        this.currentWave = 0;
        this.waveTimer = 0;

        let my = this.my;

        //bullet management groups
        // Create a property inside "sprite" named "bullet".
        // The bullet property has a value which is an array.
        // This array will hold bindings (pointers) to bullet sprites
        this.my.sprite.bullet = this.add.group(); 

        
        //will hold enemy bullets
        this.my.sprite.enemyBullet = this.add.group();


        
        //map creation
        this.map = this.add.tilemap("map", 16, 16, 10, 10);
        this.tileset = this.map.addTilesetImage("tiles_packed", "level_tiles");
        this.groundLayer = this.map.createLayer("Ground", this.tileset, 0, 0);
        this.groundLayer.setScale(4.0);
        this.obstacleLayer = this.map.createLayer("Obstacles", this.tileset, 0, 0);
        this.obstacleLayer.setScale(4.0);

        //health creation
        this.healthTiles = this.add.group();
        this.updateHealthUI();

        //Player Creation
        my.sprite.player = this.add.sprite(this.game.config.width/2, this.game.config.height - 40, "player");
        my.sprite.player.setScale(4.0);
        

        this.enemies = this.add.group();

        // Notice that in this approach, we don't create any bullet sprites in create(),
        // and instead wait until we need them, based on the number of space bar presses

        // Create white puff animation
        this.anims.create({
            key: "puff",
            frames: [
                { key: "whitePuff00" },
                { key: "whitePuff01" },
                { key: "whitePuff02" },
                { key: "whitePuff03" },
            ],
            frameRate: 20,    // Note: case sensitive (thank you Ivy!)
            repeat: 5,
            hideOnComplete: true
        });


        // TODO: create sound object(s) here
        this.hitSound = this.sound.add("hitSound", {
            volume: 0.5
        });

        this.bgMusic = this.sound.add("bgMusic", {
            volume: 0.5,
            loop: true
        });
        //this.bgMusic.play();


        // Create key objects
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 300;
        this.bulletSpeed = 300;

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Array Boom.js</h2><br>A: left // D: right // Space: fire/emit';

        // Put score on screen
        my.text.score = this.add.bitmapText(580, 0, "rocketSquare", "");
        this.updateScore();

        // Put title on screen
        this.add.text(10, 5, "Level Bleh", {
            fontFamily: 'Times, serif',
            fontSize: 24,
            wordWrap: {
                width: 60
            }
        });

        // TODO: create background music object
        // TODO: start playing background music

    }

    update(time, delta) {
        let my = this.my;
        const speed = 2;  // pixels per second
        let dt = speed * (delta / 1000);  // convert delta from ms to seconds, and multiply by speed to get pixels/tick

        //Wave Spawning
        this.waveTimer+= delta;

        if (this.waveActive && this.enemies.getLength() === 0) {
            this.waveActive = false;
        }

        const levelData = LEVELS.level1;

        if (
            !this.waveActive &&
            !this.levelComplete &&
            this.currentWave < levelData.length
        ) {
            this.spawnWave(levelData[this.currentWave]);
            this.waveActive = true;
            this.currentWave++;
        }

        //MOVEMENT

        // Moving left
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (my.sprite.player.x > (my.sprite.player.displayWidth/2)) {
                my.sprite.player.x -= this.playerSpeed * dt;
            }
        }

        // Moving right
        if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (my.sprite.player.x < (this.game.config.width - (my.sprite.player.displayWidth/2))) {
                my.sprite.player.x += this.playerSpeed * dt;
            }
        }

        //Enemy Movement
        for (let enemy of this.enemies.getChildren()) {
            this.updateEnemyMovement(enemy, time, dt);
        }


        //BULLET SPAWNING

        // Enemy Bullet
        // this.enemyBulletTimer++;
        // if (this.enemyBulletTimer >= this.enemyBulletCooldown) {
        //     this.enemyBulletTimer = 0;

        //     const enemiesArray = this.enemies.getChildren();

        //     if (enemiesArray.length > 0) {
        //         const randomEnemy = Phaser.Utils.Array.GetRandom(enemiesArray);
        //         this.spawnEnemyBullet(randomEnemy);
        //     }   
        // }
        for (let enemy of this.enemies.getChildren()) {

            enemy.shootTimer++;

            if (enemy.shootTimer >= enemy.shootCooldown) {

                enemy.shootTimer = 0;

                this.spawnEnemyBullet(enemy);
            }
        }

        // Player Bullet
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            // Are we under our bullet quota?
            if (my.sprite.bullet.getLength() < this.maxBullets) {
                my.sprite.bullet.add(this.add.sprite(
                    my.sprite.player.x, my.sprite.player.y-(my.sprite.player.displayHeight/2), "player_bullet").setScale(4.0)
                );
            }
        }


        //Destroy Player Bullets
        for (let bullet of this.my.sprite.bullet.getChildren()) {
            if (bullet.y < -bullet.displayHeight / 2) {
                bullet.destroy();
            }
        }

        //Destroy Enemy Bullets
        for (let bullet of my.sprite.enemyBullet.getChildren()) {

            if (bullet.y > this.game.config.height + bullet.displayHeight / 2) {
                bullet.destroy();
            }
        }

        //COLLISION CHECKS

        // Check for collision with the enemy
        for (let bullet of my.sprite.bullet.getChildren()) {
            for(let enemy of this.enemies.getChildren()) {
                if (this.collides(enemy, bullet)) {
                    // start animation
                    this.puff = this.add.sprite(enemy.x, enemy.y, "whitePuff03").setScale(0.25).play("puff");
                    // clear out bullet -- put y offscreen, will get reaped next update
                    bullet.y = -100;

                    // Update score
                    GameState.score += enemy.scorePoints;
                    this.updateScore();

                    enemy.destroy();
                    // TODO: Play collision sound
                    this.hitSound.play();
                    // Have new enemy appear after end of animation
                    this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    }, this);

                }
            }
        }

        //Check for collision with player
        for (let bullet of my.sprite.enemyBullet.getChildren()) {
            if (this.collides(bullet, my.sprite.player)) {
                bullet.y = this.game.config.height + 100; // move bullet offscreen to bottom, will get reaped next update
                // Remove one health tile
                if (GameState.health > 0) {
                    GameState.health--;
                    console.log(GameState.health);
                    this.updateHealthUI();
                }
                if (GameState.health <= 0) {
                    this.scene.start("Failure");
                }
            }
        }


        // BULLET MOVEMENT

        // Move player bullets
        for (let bullet of my.sprite.bullet.getChildren()) {
            bullet.y -= this.bulletSpeed * dt;
        }

        // Move enemy bullets
        for (let bullet of my.sprite.enemyBullet.getChildren()) {
            bullet.y += bullet.speed * dt;
        }

    }

    // A center-radius AABB collision check
    collides(a, b) {

        const scale = 0.5; // adjust this to make the collision box smaller than the actual sprite size

        if (Math.abs(a.x - b.x) > (a.displayWidth/2 * scale + b.displayWidth/2 * scale)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 * scale + b.displayHeight/2 * scale)) return false;
        return true;
    }

    updateEnemyMovement(enemy, time, dt) {

        switch(enemy.movement) {

            case "straight":
                enemy.y += enemy.moveSpeed * dt;
                break;

            case "zigzag":
                enemy.y += enemy.moveSpeed * dt;
                enemy.x = enemy.startX + Math.sin(time * 0.005) * 100;
                break;

            case "still":
                // do nothing
                break;
        }
    }

    spawnWave(wave) {

        wave.enemies.forEach((enemyData) => {

            const typeData = ENEMY_TYPES[enemyData.type];

            const enemy = this.add.sprite(
                enemyData.x,
                enemyData.y,
                typeData.texture
            );

            enemy.setScale(4);

            // Attach gameplay data directly to sprite
            enemy.enemyType = enemyData.type;

            enemy.health = typeData.health;
            enemy.scorePoints = typeData.score;

            enemy.shootCooldown = typeData.shootCooldown;
            enemy.shootTimer = 0;

            enemy.moveSpeed = typeData.moveSpeed;
            enemy.movement = typeData.movement;

            enemy.bulletSpeed = typeData.bulletSpeed;

            enemy.startX = enemy.x;
            enemy.startY = enemy.y;

            this.enemies.add(enemy);
        });
    }

    updateScore() {
        this.my.text.score.setText("Score " + GameState.score);
    }

    spawnEnemyBullet(enemy) {

        const bullet = this.add.sprite(
            enemy.x,
            enemy.y,
            "player_bullet"
        )
        .setScale(4.0)
        .setTint(0xff0000);

        bullet.speed = enemy.bulletSpeed;

        this.my.sprite.enemyBullet.add(bullet);
    }

    updateHealthUI() {
        this.healthTiles.clear(true, true);

        for (let i = 0; i < GameState.health; i++) {
            let tile = this.add.sprite(
                40 + (i * 50),
                this.game.config.height - 40,
                "healthTile"
            ).setScale(4.0);

            this.healthTiles.add(tile);
        }
    }
}