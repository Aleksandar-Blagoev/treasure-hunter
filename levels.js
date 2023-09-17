class Level {
    constructor(game) {
        this.game = game;

        // Load assets
        this.game.loader
            .add("./images/treasureHunter.json")
            .add("./images/healthbar.json")
            .load(() => {
                this.switchToLevel(this.game.currentLevel); // You can set `currentLevel` as needed
            });


    }

    level1() {

        this.game.app.ticker.remove(this.game.gameLoop);

        this.game.gameScene = new this.game.Container();
        this.game.app.stage.addChild(this.game.gameScene);

        this.game.id = this.game.loader.resources["./images/treasureHunter.json"].textures;
        this.game.helathId = this.game.loader.resources["./images/healthbar.json"].textures;

        this.game.currentGameScene = this.game.gameScene;

        this.game.dungeon = new this.game.Sprite(this.game.id["dungeon.png"]);
        this.game.gameScene.addChild(this.game.dungeon);

        this.game.door = new this.game.Sprite(this.game.id["door.png"]);
        this.game.door.position.set(32, 0);
        this.game.gameScene.addChild(this.game.door);

        this.game.explorer = new this.game.Sprite(this.game.id["explorer.png"]);
        this.game.explorer.x = 68;
        this.game.explorer.y = this.game.app.renderer.height / 2 - this.game.explorer.height / 2;
        this.game.explorer.vx = 0;
        this.game.explorer.vy = 0;
        this.game.gameScene.addChild(this.game.explorer);

        this.game.treasure = new this.game.Sprite(this.game.id["treasure.png"]);
        this.game.treasure.x = this.game.app.renderer.width - this.game.treasure.width - 48;
        this.game.treasure.y = this.game.app.renderer.height / 2 - this.game.treasure.height / 2;
        this.game.gameScene.addChild(this.game.treasure);

        let numberOfBlobs = 6,
            spacing = 48,
            xOffset = 150,
            speed = 2,
            direction = 1;
        let blobScale = 2;

        this.game.blobs = [];

        for (let i = 0; i < numberOfBlobs; i++) {
            const blob = new this.game.Sprite(this.game.id["blob.png"]);

            const x = spacing * i + xOffset;
            const y = this.randomInt(0, this.game.app.renderer.height - blob.height);

            blob.x = x;
            blob.y = y;

            blob.vx = 0;
            blob.vy = speed * direction;

            direction *= -1;

            blob.scale.set(blobScale);

            this.game.blobs.push(blob);

            this.game.gameScene.addChild(blob);
        }

        for (let i = 1; i <= 6; i++) {
            const texture = this.game.helathId[`healthbar_0${i}.png`];
            this.game.healthBarTextures.push(texture);
        }

        this.game.initialHealthBarTexture = this.game.healthBarTextures[0];
        this.game.healthBarSprite = new this.game.Sprite(this.game.initialHealthBarTexture);
        this.game.healthBarSprite.position.set(this.game.app.renderer.width - 160, -3);

        this.game.healthBarSprite.width = 128;
        this.game.healthBarSprite.height = 20;

        this.game.gameScene.addChild(this.game.healthBarSprite);

        this.game.gameOverScene = this.gameOverSceneChange(this.game.currentGameScene);

        window.addEventListener("keydown", this.game.handleKeysDown);
        window.addEventListener("keyup", this.game.handleKeysUp);

        this.game.state = this.play;

        this.game.gameLoopFunction = (delta) => this.game.gameLoop(delta, this.game.currentGameScene);

        this.game.app.ticker.add(this.game.gameLoopFunction);
    }

    level2() {

        this.game.currentLevel = 2;
        // Make the game scene and add it to the stage
        this.game.gameSceneTwo = new this.game.Container();
        this.game.app.stage.addChild(this.game.gameSceneTwo);
        this.game.currentGameScene = this.game.gameSceneTwo;

        // Make the sprites and add them to the `gameS  cene`
        // Create an alias for the texture atlas frame ids
        this.game.id = this.game.loader.resources["./images/treasureHunter.json"].textures;
        this.game.helathId = this.game.loader.resources["./images/healthbar.json"].textures; // Second JSON file

        // Dungeon
        this.game.dungeon = new this.game.Sprite(this.game.id["dungeon.png"]);
        this.game.gameSceneTwo.addChild(this.game.dungeon);

        // Door
        this.game.door = new this.game.Sprite(this.game.id["door.png"]);
        this.game.door.position.set(32, 0);
        this.game.gameSceneTwo.addChild(this.game.door);

        // Explorer
        this.game.explorer = new this.game.Sprite(this.game.id["explorer.png"]);
        this.game.explorer.x = this.game.app.renderer.width / 2 - this.game.explorer.width / 2;
        this.game.explorer.y = 15;
        this.game.explorer.vx = 0;
        this.game.explorer.vy = 0;
        this.game.gameSceneTwo.addChild(this.game.explorer);

        // Treasure
        this.game.treasure = new this.game.Sprite(this.game.id["treasure.png"]);
        this.game.treasure.x = this.game.app.renderer.width / 2 - this.game.treasure.width / 2;
        this.game.treasure.y = this.game.app.renderer.height - this.game.treasure.height - 48;
        this.game.gameSceneTwo.addChild(this.game.treasure);

        let numberOfBlobs = 7,
            spacing = 50,
            yOffset = 160, // Change this to control the vertical position
            speed = 2,
            direction = 1,
            blobScale = 2; // Set the scale factor for the blobs

        // An array to store all the blob monsters
        this.game.blobs = [];

        // Make as many blobs as there are `numberOfBlobs`
        for (let i = 0; i < numberOfBlobs; i++) {

            // Make a blob
            const blob = new this.game.Sprite(this.game.id["blob.png"]);

            // Space each blob horizontally according to the `spacing` value.
            // `yOffset` determines the point from the top of the screen
            // at which the first blob should be added
            const y = spacing * i + yOffset;

            // Give the blob a random x position
            const x = this.randomInt(0, this.game.app.renderer.width - blob.width);

            // Set the blob's position
            blob.x = x;
            blob.y = y;

            // Set the blob's horizontal velocity. `direction` will be either `1` or
            // `-1`. `1` means the enemy will move to the right and `-1` means the blob will
            // move to the left. Multiplying `direction` by `speed` determines the blob's
            // horizontal direction
            blob.vx = speed * direction;
            blob.vy = 0;

            // Reverse the direction for the next blob
            direction *= -1;

            // Set the blob's scale
            blob.scale.set(blobScale);

            // Push the blob into the `blobs` array
            this.game.blobs.push(blob);

            // Add the blob to the `gameScene`
            this.game.gameSceneTwo.addChild(blob);
        }

        this.game.healthBarTextures = [];

        // Populate the healthBarTextures array using a for loop
        for (let i = 1; i <= 6; i++) {
            const texture = this.game.helathId[`healthbar_0${i}.png`];
            this.game.healthBarTextures.push(texture);
        }

        this.game.initialHealthBarTexture = this.game.healthBarTextures[0];
        this.game.healthBarSprite = new this.game.Sprite(this.game.initialHealthBarTexture);
        this.game.healthBarSprite.position.set(this.game.app.renderer.width - 160, -3);

        // Set the initial width for 'outer'
        this.game.healthBarSprite.width = 128;
        this.game.healthBarSprite.height = 20;

        this.game.gameSceneTwo.addChild(this.game.healthBarSprite);

        this.game.gameOverScene = this.gameOverSceneChange(this.game.currentGameScene);

        this.game.state = this.play;

    }

    level3() {
        this.game.lasers = [];
        this.game.blobLasers = [];

        this.game.currentLevel = 3;
        this.game.gameSceneThree = new this.game.Container();
        this.game.app.stage.addChild(this.game.gameSceneThree);

        this.game.id = this.game.loader.resources["./images/treasureHunter.json"].textures;

        this.game.helathId = this.game.loader.resources["./images/healthbar.json"].textures;

        this.game.dungeon = new this.game.Sprite(this.game.id["dungeon.png"]);
        this.game.dungeon.interactive = true;
        this.game.dungeon.on('pointerdown', this.game.fireBullets.bind(this));
        this.game.dungeon.on('pointerup', this.game.fireLaser.bind(this));

        this.game.gameSceneThree.addChild(this.game.dungeon);

        // Door
        this.game.door = new this.game.Sprite(this.game.id["door.png"]);
        this.game.door.position.set(32, 0);
        this.game.door.visible = false;
        this.game.gameSceneThree.addChild(this.game.door);

        this.game.explorer = new this.game.Sprite(this.game.id["explorer.png"]);
        this.game.explorer.x = this.game.app.renderer.width / 2 - this.game.explorer.width / 2;
        this.game.explorer.y = 15;
        this.game.explorer.vx = 0;
        this.game.explorer.vy = 0;
        this.game.explorer.zIndex = 1;
        this.game.gameSceneThree.addChild(this.game.explorer);

        // Treasure
        this.game.treasure = new this.game.Sprite(this.game.id["treasure.png"]);
        this.game.treasure.x = this.game.app.renderer.width / 2 - this.game.treasure.width / 2;
        this.game.treasure.y = this.game.app.renderer.height - this.game.treasure.height - 48;

        this.game.giantBlob = new this.game.Sprite(this.game.id["blob.png"]);
        this.game.giantBlob.x = this.game.app.renderer.width - 50;
        this.game.giantBlob.y = this.game.app.renderer.height / 2 - this.game.giantBlob.height / 2;
        this.game.giantBlob.vx = 2;
        this.game.giantBlob.vy = 0;
        this.game.giantBlob.scale.set(4);
        this.game.blobs = [this.game.giantBlob];
        this.game.gameSceneThree.addChild(this.game.giantBlob);

        this.game.currentGameScene = this.game.gameSceneThree;

        this.game.healthBarTextures = [];
        this.game.enemyHealthBarTextures = [];

        for (let i = 1; i <= 6; i++) {
            const texture = this.game.helathId[`healthbar_0${i}.png`];
            this.game.healthBarTextures.push(texture);
            this.game.enemyHealthBarTextures.push(texture);
        }

        this.game.initialHealthBarTexture = this.game.healthBarTextures[0];
        this.game.healthBarSprite = new this.game.Sprite(this.game.initialHealthBarTexture);
        this.game.healthBarSprite.position.set(this.game.app.renderer.width - 160, -3);
        this.game.healthBarSprite.width = 128;
        this.game.healthBarSprite.height = 20;
        this.game.gameSceneThree.addChild(this.game.healthBarSprite);

        this.game.enemyHealthBarSprite = new this.game.Sprite(this.game.enemyHealthBarTextures[0]);
        this.game.enemyHealthBarSprite.position.set(10, this.game.app.renderer.height - 20);
        this.game.enemyHealthBarSprite.width = 128;
        this.game.enemyHealthBarSprite.height = 20;
        this.game.gameSceneThree.addChild(this.game.enemyHealthBarSprite);

        this.game.gameOverScene = this.gameOverSceneChange(this.game.currentGameScene);

        this.game.state = this.play;
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    play = () => {
        // Use the explorer's velocity to make it move
        // Use the explorer's velocity to make it move
        this.game.explorer.x += this.game.explorer.vx;
        this.game.explorer.y += this.game.explorer.vy;

        // Contain the explorer inside the area of the dungeon
        this.game.contain(this.game.explorer, { x: 28, y: 10, width: 488, height: 480 });

        // Set `explorerHit` to `false` before checking for a collision
        let explorerHit = false;

        // Loop through all the sprites in the `blobs` array
        this.game.blobs.forEach((blob) => {

            this.game.currentLevel === 1 ? blob.y += blob.vy : blob.x += blob.vx;


            // Check the blob's screen boundaries
            const blobHitsWall = this.game.contain(blob, { x: 28, y: 10, width: 488, height: 480 });

            // If the blob hits the top or bottom of the stage, reverse its direction
            if (blobHitsWall === "top" || blobHitsWall === "bottom") {
                blob.vy *= -1;
            }

            if (blobHitsWall === "right" || blobHitsWall === "left") {
                blob.vx *= -1;
            }

            // Test for a collision. If any of the enemies are touching the explorer, set `explorerHit` to `true`
            if (this.game.hitTestRectangle(this.game.explorer, blob)) {
                explorerHit = true;
            }
        });


        if (explorerHit && !this.game.explorerHitCooldown) {
            // Make the explorer semi-transparent
            this.game.explorer.alpha = 0.5;

            // Change the health bar texture to the next one in the array
            this.game.currentHealthBarIndex++;

            if (this.game.currentHealthBarIndex < this.game.healthBarTextures.length) {
                this.game.healthBarSprite.texture = this.game.healthBarTextures[this.game.currentHealthBarIndex];
            }

            // Set the cooldown timer to prevent immediate damage
            this.game.explorerHitCooldown = true;
            setTimeout(() => {
                this.game.explorerHitCooldown = false;
            }, 1000);
        } else {
            // Make the explorer fully opaque (non-transparent) if it hasn't been hit
            this.game.explorer.alpha = 1;
        }

        // Check for a collision between the explorer and the treasure
        if (this.game.hitTestRectangle(this.game.explorer, this.game.treasure)) {

            // If the treasure is touching the explorer, center it over the explorer
            this.game.treasure.x = this.game.explorer.x + 8;
            this.game.treasure.y = this.game.explorer.y + 8;
        }

        if (this.game.currentLevel === 3) {
            // Check for collisions between lasers and the blob

            this.game.lasers.forEach((laser, i) => {
                laser.position.y += laser.speed;

                if (laser.position.y > this.game.dungeon.height) {
                    laser.dead = true;
                    this.game.app.stage.removeChild(laser);
                } else {
                    // Check for collision with the blob
                    if (this.game.hitTestRectangle(laser, this.game.giantBlob)) {
                        // Reduce blob's health
                        this.game.lasers.splice(i, 1);
                        this.game.app.stage.removeChild(laser);

                        // Change blob's health bar texture to the next one
                        if (this.game.blobHealth < this.game.enemyHealthBarTextures.length) {
                            this.game.enemyHealthBarSprite.texture = this.game.enemyHealthBarTextures[this.game.blobHealth++];
                        }

                        // Remove the laser
                        laser.dead = true;
                    }
                }
            });

            this.game.blobLasers.forEach((laser, i) => {
                laser.position.y += -laser.speed;

                if (laser.position.y < 0) {
                    laser.dead = true;
                } else {
                    // Check for collision with the blob
                    if (this.game.hitTestRectangle(laser, this.game.explorer)) {
                        this.game.explorerHitCooldown = true;
                        this.game.healthBarSprite.texture = this.game.healthBarTextures[this.game.currentHealthBarIndex++];
                        this.game.blobLasers.splice(i, 1);
                        this.game.app.stage.removeChild(laser);

                        // Remove the laser
                        laser.dead = true;
                    }
                }
            });


            // Remove dead lasers
            this.game.lasers = this.game.lasers.filter(laser => !laser.dead);
            this.game.blobLasers = this.game.blobLasers.filter(laser => !laser.dead);

            // Check if the blob's health reaches zero
            if (this.game.blobHealth === this.game.enemyHealthBarTextures.length) {
                if (this.game.giantBlob) {
                    this.game.gameSceneThree.removeChild(this.game.giantBlob);
                }

                this.game.blobs = [];
                this.game.door.visible = true;
                this.game.gameSceneThree.addChild(this.game.treasure);
                this.game.gameSceneThree.removeChild(this.game.enemyHealthBarSprite);

                // Remove the lasers
                this.game.lasers.forEach(laser => this.game.app.stage.removeChild(laser));
                this.game.lasers = [];

                // Remove the blob lasers
                this.game.blobLasers.forEach(laser => this.game.app.stage.removeChild(laser));
                this.game.blobLasers = [];

            }

            if (this.game.currentHealthBarIndex === this.game.healthBarTextures.length) {
                this.game.message.text = "You lost!";
                this.game.explorerHitCooldown = false;
                this.game.end(this.game.currentGameScene);
            }
        }


        // Does the explorer have enough health? If the width of the `innerBar`
        // is less than zero, end the game and display "You lost!"
        if (this.game.currentHealthBarIndex === this.game.healthBarTextures.length) {
            this.game.message.text = "You lost!";
            this.game.explorerHitCooldown = false;
            this.game.end();
        }

        // If the explorer has brought the treasure to the exit,
        // end the game and display "You won!"
        if (this.game.hitTestRectangle(this.game.treasure, this.game.door)) {
            if (this.game.currentLevel === 3) {
                this.game.message.text = "You win!";
                this.game.explorerHitCooldown = false;
                this.game.end();
            } else {
                this.game.message.text = "Next level!";
                this.game.end();
            }
        }

    }

    gameOverSceneChange = (currentGameScene) => {
        this.game.gameOverScene = new this.game.Container();

        this.game.playAgainContainer = new this.game.Container();
        const playButton = new this.game.Graphics();

        // Define the triangle shape for the play icon
        playButton.beginFill(0xFFFFFF); // Fill color (white)
        playButton.moveTo(30, 20); // Starting point
        playButton.lineTo(30, 80); // First point of triangle
        playButton.lineTo(80, 50); // Second point of triangle
        playButton.lineTo(30, 20); // Closing the triangle

        this.game.playAgainContainer.x = this.game.app.renderer.width / 2 - this.game.playAgainContainer.width / 2 - 52;
        this.game.playAgainContainer.y = this.game.app.renderer.height / 2 - this.game.playAgainContainer.height / 2 + 40;
        // Add the play button to the stage
        this.game.playAgainContainer.addChild(playButton);
        this.game.gameOverScene.addChild(this.game.playAgainContainer);

        this.game.playAgainContainer.interactive = true;
        this.game.playAgainContainer.buttonMode = true;
        this.game.playAgainContainer.on('click', this.resetGame);


        // Create the text sprite and add it to the `gameOver` scene
        const style = new this.game.TextStyle({
            fontFamily: "Futura",
            fontSize: 64,
            fill: "white"
        });
        this.game.message = new this.game.Text("The End!", style);
        this.game.message.x = 120;
        this.game.message.y = this.game.app.renderer.height / 2 - 32;

        this.game.gameOverScene.addChild(this.game.message);

        return this.game.gameOverScene;
    }

    resetGame = () => {
        // Remove the gameOverScene from the app's stage
        this.game.app.stage.removeChild(this.game.gameOverScene);
        // Set the gameActive flag to true
        this.game.gameActive = true;
        this.game.currentHealthBarIndex = 0;
        this.game.healthBarTextures = [];
        this.game.explorer.vx = 0;
        this.game.explorer.vy = 0;

        // Remove the current game scene from the app's stage
        if (this.game.currentGameScene) {
            this.game.app.stage.removeChild(this.game.currentGameScene);
        }

        if (this.game.message.text === "You lost!" || this.game.message.text === "You win!") {
            // Clear any existing game state and reset to level 1

            window.removeEventListener("keydown", this.handleKeysDown);
            window.removeEventListener("keyup", this.handleKeysUp);
            this.game.currentLevel = 1;
            this.game.currentHealthBarIndex = 0;
            this.game.blobHealth = 0;
        } else {
            // Increment the current level
            this.game.currentLevel++;
        }

        // Call the appropriate level setup function based on the new level
        this.switchToLevel(this.game.currentLevel);

        // Reset other game elements and variables as needed

        // Set the game state back to "play"
        this.game.state = this.play;
    }


    switchToLevel(level) {
        // Call the appropriate level setup function based on the level argument
        switch (level) {
            case 1:
                this.level1();
                break;
            case 2:
                this.level2();
                break;
            case 3:
                this.level3();
                break;
            default:
                break;
        }
    }
}


let levels = new Level(game);

