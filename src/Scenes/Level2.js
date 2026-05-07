import { LEVELS } from "./enemyWaves.js";
import { GameState } from "./gameState.js";
import { ENEMY_TYPES } from "./enemyTypes.js";

export default class Level2 extends Phaser.Scene {
    constructor() {
        super("Level2");

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

        this.load.audio("hitSound", 'Sounds/explosion-a.ogg');
        this.load.audio("hurtSound", 'Sounds/hurt-a.ogg');
        this.load.audio("enemyShootSound", 'Sounds/shoot-a.ogg');
        this.load.audio("playerShootSound", 'Sounds/shoot-d.ogg');

        this.load.audio("bgMusic", 'backgroundmusic.mp3');
    
        this.load.image("level_tiles", "/PNG/Tiles/Tilemap/tilemap_packed.png");    // tile sheet   
        this.load.tilemapTiledJSON("map", "/Levels/Level2.json");                  // Load JSON of tilemap
    }

    create() {

        this.physics.world.setBoundsCollision(true, true, true, true);

        //create background for score
        this.topBar = this.add.rectangle(
            0,
            0,
            this.game.config.width,
            50,
            0x000000
        ).setOrigin(0, 0);
        this.topBar.setDepth(100);


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
        this.obstacleLayer = this.map.createLayer("Back_Textures", this.tileset, 0, 0);
        this.obstacleLayer.setScale(4.0);
        this.obstacleLayer = this.map.createLayer("Obstacle_Sprites", this.tileset, 0, 0);
        this.obstacleLayer.setScale(4.0);

        //obstacle creation
        this.obstacles = this.physics.add.staticGroup();

        const obstacleObjects = this.map.getObjectLayer("Obstacles").objects;

        obstacleObjects.forEach(obj => {
            const block = this.add.rectangle(
                obj.x * 4 + (obj.width * 4) / 2,
                obj.y * 4 + (obj.height * 4) / 2,
                obj.width * 4,
                obj.height * 4,
                0x000000,
                0 // invisible (or set alpha)
            );

            this.physics.add.existing(block, true); // static body
            block.body.setOffset(0, 0); // important alignment fix
            this.obstacles.add(block);
        });

        //health creation
        this.healthTiles = this.add.group();
        this.updateHealthUI();

        //Player Creation
        my.sprite.player = this.physics.add.sprite(
            this.game.config.width / 2,
            this.game.config.height - 40,
            "player"
        ).setScale(4);
        

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

        this.hurtSound = this.sound.add("hurtSound", {
            volume: 0.5
        });

        this.bgMusic = this.sound.add("bgMusic", {
            volume: 0.3,
            loop: true
        });

        this.shootSound = this.sound.add("enemyShootSound", {
            volume: 0.05
        });

        this.playerShootSound = this.sound.add("playerShootSound", {
            volume: 0.2
        });
        
        this.bgMusic.play();


        // Create key objects
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 300;
        this.bulletSpeed = 300;

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Almost Bone Dry.js</h2><br>A: left // D: right // Space: fire/emit';

        // Put score on screen
        
        my.text.score = this.add.text(this.game.config.width - 160, 10, "WAVE 1", {
            fontFamily: "GameFont",
            fontSize: "32px",
            color: "#ffffff"
        });
        this.updateScore();
        my.text.score.setDepth(101);

        this.add.text(20, 10, "Level Two", {
            fontFamily: "GameFont",
            fontSize: "32px",
            color: "#ffffff"
        }).setDepth(101);

        // TODO: create background music object
        // TODO: start playing background music



        //Physics collisions

        //Bullet -> Enemy
        this.physics.add.overlap(
            this.my.sprite.bullet,
            this.enemies,
            (bullet, enemy) => {

                bullet.destroy();
                enemy.destroy();

                GameState.score += enemy.scorePoints;
                this.updateScore();

                this.hitSound.play();
            }
        );

        //Enemy Bullet -> Player
        this.physics.add.overlap(
            this.my.sprite.enemyBullet,
            my.sprite.player,
            (bullet, player) => {

                bullet.destroy();

                if (GameState.health > 0) {
                    GameState.health--;
                    this.hurtSound.play();
                    this.updateHealthUI();
                }

                if (GameState.health <= 0) {
                    GameState.highScore = Math.max(GameState.highScore, GameState.score);
                    this.bgMusic.stop();
                    this.scene.start("Failure");
                }
            }
        );

        this.physics.add.collider(this.my.sprite.bullet, this.obstacles, (bullet) => {
            bullet.destroy();
        });

        this.physics.add.collider(this.my.sprite.enemyBullet, this.obstacles, (bullet) => {
            bullet.destroy();
        });


    }

    update(time, delta) {
        let my = this.my;
        const speed = 2;  // pixels per second
        let dt = speed * (delta / 1000);  // convert delta from ms to seconds, and multiply by speed to get pixels/tick

        //Check for completion
        if (
            !this.levelComplete &&
            this.currentWave >= LEVELS.level2.length &&
            this.enemies.getLength() === 0
        ) {
            this.levelComplete = true;

            this.showLevelCompleteMessage();
        }

        //Wave Spawning
        this.waveTimer+= delta;

        if (this.waveActive && this.enemies.getLength() === 0) {
            this.waveActive = false;
        }

        const levelData = LEVELS.level2;

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
                this.shootSound.play();
                this.spawnEnemyBullet(enemy);
            }
        }

        // Player Bullet
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            // Are we under our bullet quota?
            this.playerShootSound.play();

            if (this.my.sprite.bullet.getLength() >= this.maxBullets) {
                return; // don't spawn a new bullet
            }
            const bullet = this.physics.add.sprite(
                my.sprite.player.x,
                my.sprite.player.y - my.sprite.player.displayHeight / 2,
                "player_bullet"
            ).setScale(4);

            bullet.body.setSize(
                bullet.width * 0.25,
                bullet.height * 0.25
            );

            bullet.body.setOffset(
                bullet.width * 0.375,
                bullet.height * 0.375
            );

            bullet.body.setCollideWorldBounds(true);
            bullet.body.onWorldBounds = true;

            bullet.body.setVelocityY(-300);
            this.my.sprite.bullet.add(bullet);
        }


        this.physics.world.on("worldbounds", (body) => {
            body.gameObject.destroy();
        });




        //COLLISION CHECKS
    }

    spawnWave(wave) {

        wave.enemies.forEach((enemyData) => {

            const typeData = ENEMY_TYPES[enemyData.type];

            const enemy = this.physics.add.sprite(
                enemyData.x,
                enemyData.y,
                typeData.texture
            ).setScale(4);

            if (typeData.texture === "enemy_basic") {
                this.tweens.add({
                    targets: enemy,
                    x: enemy.x + 100,
                    duration: 750,
                    yoyo: true,
                    repeat: -1,
                    hold: 1000,
                    repeatDelay: 1000,
                    ease: 'Power1'
                });

            } else if (typeData.texture === "enemy_rapid") {
                this.tweens.add({
                    targets: enemy,
                    x: enemy.x + 800,
                    duration: 2400,
                    yoyo: true,
                    repeat: -1,
                    hold: 500,
                    repeatDelay: 500,
                    ease: 'Power0'
                });

            } else if (typeData.texture === "enemy_sniper") {
                this.tweens.add({
                    targets: enemy,
                    x: enemy.x + 300,
                    duration: 2500,
                    yoyo: true,
                    repeat: -1,
                    hold: 3000,
                    repeatDelay: 3000,
                    ease: 'Sine.easeInOut'
                });
            }

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
        this.my.text.score.setText("Score : " + GameState.score);
    }

    spawnEnemyBullet(enemy) {

        const bullet = this.physics.add.sprite(
            enemy.x,
            enemy.y,
            "player_bullet"
        )
        .setScale(4)
        .setTint(0xff0000);
        bullet.body.setSize(
            bullet.width * 0.25,
            bullet.height * 0.25
        );

        bullet.body.setOffset(
            bullet.width * 0.375,
            bullet.height * 0.375
        );
        
        bullet.body.setCollideWorldBounds(true);
        bullet.body.onWorldBounds = true;

        bullet.body.setVelocityY(200);
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

    showLevelCompleteMessage() {

        const text = this.add.text(
            this.game.config.width / 2,
            this.game.config.height / 2,
            "LEVEL COMPLETE",
            {
                fontSize: "64px",
                color: "#ffff00",
                stroke: "#000",
                strokeThickness: 8
            }
        ).setOrigin(0.5);

        text.setScale(0.2);

        this.tweens.add({
            targets: text,
            scale: 1.2,
            duration: 600,
            ease: "Back.Out"
        });

        this.time.delayedCall(2500, () => {
            GameState.highScore = Math.max(GameState.highScore, GameState.score);
            this.bgMusic.stop();
            this.scene.start("End"); 
        });
    }
}