// Aliases
const Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    Graphics = PIXI.Graphics,
    Sprite = PIXI.Sprite,
    Text = PIXI.Text,
    TextStyle = PIXI.TextStyle;

// Create a Pixi Application
const app = new Application({
    width: 512,
    height: 512,
    antialias: true,
    transparent: false,
    resolution: 1
});


// Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

// Define variables that might be used in more
// than one function
let state, explorer, treasure, blobs, dungeon, lasers, blobHealth, giantBlob, blobLasers,
    door, message, gameScene, gameSceneTwo, gameSceneThree, gameOverScene, id, playAgainContainer, helathId, healthBarTextures, enemyHealthBar,
    enemyHealthBarTextures, enemyHealthBarSprite, initialEnemyHealthBarTexture, healthBarSprite, initialHealthBarTexture, currentGameScene;
let explorerHitCooldown = false;

let currentHealthBarIndex = 0;
blobHealth = 0;
let gameActive = true;
let currentLevel = 1;
let gameLoopFunction;


// Select the restart button by its ID
// Declare a flag to track whether the restart button has been created
let restartButtonCreated = false;
// Load assets
loader
    .add("./images/treasureHunter.json")
    .add("./images/healthbar.json")
    .load(() => {
        switchToLevel(currentLevel); // You can set `currentLevel` as needed
    });



// Define a keys object to track the state of individual keys
const keys = {
    left: false,
    right: false,
    up: false,
    down: false,
};




function switchToLevel(level) {
    // Call the appropriate level setup function based on the level argument
    switch (level) {
        case 1:
            level1();
            break;
        case 2:
            level2();
            break;
        case 3:
            level3();
            break;
        default:
            break;
    }

}

function handleKeysDown(event) {
    switch (event.keyCode) {
        case 37: // Left arrow key is pressed
            keys.left = true;
            explorer.vx = -5;
            explorer.vy = 0;
            break;
        case 39: // Right arrow key is pressed
            keys.right = true;
            explorer.vx = 5;
            explorer.vy = 0;
            break;
        case 38: // Up arrow key is pressed
            keys.up = true;
            explorer.vy = -5;
            explorer.vx = 0;
            break;
        case 40: // Down arrow key is pressed
            keys.down = true;
            explorer.vy = 5;
            explorer.vx = 0;
            break;
        default:
            explorer.vy = 0;
            explorer.vx = 0;
            break;
    }
}

function handleKeysUp(event) {
    explorer.vx = 0;
    explorer.vy = 0;

    switch (event.keyCode) {
        case 37: // Left arrow key is released
            keys.left = false;
            break;
        case 39: // Right arrow key is released
            keys.right = false;
            break;
        case 38: // Up arrow key is released
            keys.up = false;
            break;
        case 40: // Down arrow key is released
            keys.down = false;
            break;
    }
}


function level1() {

    app.ticker.remove(gameLoop);

    gameScene = new Container();
    app.stage.addChild(gameScene);
    // Make the sprites and add them to the `gameScene`
    // Create an alias for the texture atlas frame ids
    id = loader.resources["./images/treasureHunter.json"].textures;
    helathId = loader.resources["./images/healthbar.json"].textures; // Second JSON file
    currentGameScene = gameScene;

    // Dungeon
    dungeon = new Sprite(id["dungeon.png"]);
    gameScene.addChild(dungeon);

    // Door
    door = new Sprite(id["door.png"]);
    door.position.set(32, 0);
    gameScene.addChild(door);

    // Explorer
    explorer = new Sprite(id["explorer.png"]);
    explorer.x = 68;
    explorer.y = app.renderer.height / 2 - explorer.height / 2;
    explorer.vx = 0;
    explorer.vy = 0;
    gameScene.addChild(explorer);

    // Treasure
    treasure = new Sprite(id["treasure.png"]);
    treasure.x = app.renderer.width - treasure.width - 48;
    treasure.y = app.renderer.height / 2 - treasure.height / 2;
    gameScene.addChild(treasure);

    // Make the blobs
    let numberOfBlobs = 6,
        spacing = 48,
        xOffset = 150,
        speed = 1,
        direction = 1;
    blobScale = 2; // Set the scale factor for the blobs

    // An array to store all the blob monsters
    blobs = [];

    // Make as many blobs as there are `numberOfBlobs`
    for (let i = 0; i < numberOfBlobs; i++) {

        // Make a blob
        const blob = new Sprite(id["blob.png"]);

        // Space each blob horizontally according to the `spacing` value.
        // `xOffset` determines the point from the left of the screen
        // at which the first blob should be added
        const x = spacing * i + xOffset;

        // Give the blob a random y position
        const y = randomInt(0, app.renderer.height - blob.height);

        // Set the blob's position
        blob.x = x;
        blob.y = y;

        // Set the blob's vertical velocity. `direction` will be either `1` or
        // `-1`. `1` means the enemy will move down and `-1` means the blob will
        // move up. Multiplying `direction` by `speed` determines the blob's
        // vertical direction
        blob.vx = 0;
        blob.vy = speed * direction;

        // Reverse the direction for the next blob
        direction *= -1;

        // Set the blob's scale
        blob.scale.set(blobScale);

        // Push the blob into the `blobs` array
        blobs.push(blob);

        // Add the blob to the `gameScene`
        gameScene.addChild(blob);
    }

    healthBarTextures = [];

    // Populate the healthBarTextures array using a for loop
    for (let i = 1; i <= 6; i++) {
        const texture = helathId[`healthbar_0${i}.png`];
        healthBarTextures.push(texture);
    }

    initialHealthBarTexture = healthBarTextures[0];
    healthBarSprite = new Sprite(initialHealthBarTexture);
    healthBarSprite.position.set(app.renderer.width - 160, -3);

    // Set the initial width for 'outer'
    healthBarSprite.width = 128;
    healthBarSprite.height = 20;

    gameScene.addChild(healthBarSprite);

    gameOverScene = gameOverSceneChange(currentGameScene);

    window.addEventListener("keydown", handleKeysDown);
    window.addEventListener("keyup", handleKeysUp);
    // Set the game state
    state = play;
    // Start the game loop
    gameLoopFunction = (delta) => gameLoop(delta, currentGameScene);

    app.ticker.add(gameLoopFunction);

}

function level2() {

    currentLevel = 2;
    // Make the game scene and add it to the stage
    gameSceneTwo = new Container();
    app.stage.addChild(gameSceneTwo);
    currentGameScene = gameSceneTwo;

    // Make the sprites and add them to the `gameS  cene`
    // Create an alias for the texture atlas frame ids
    id = loader.resources["./images/treasureHunter.json"].textures;
    helathId = loader.resources["./images/healthbar.json"].textures; // Second JSON file

    // Dungeon
    dungeon = new Sprite(id["dungeon.png"]);
    gameSceneTwo.addChild(dungeon);

    // Door
    door = new Sprite(id["door.png"]);
    door.position.set(32, 0);
    gameSceneTwo.addChild(door);

    // Explorer
    explorer = new Sprite(id["explorer.png"]);
    explorer.x = app.renderer.width / 2 - explorer.width / 2;
    explorer.y = 15;
    explorer.vx = 0;
    explorer.vy = 0;
    gameSceneTwo.addChild(explorer);

    // Treasure
    treasure = new Sprite(id["treasure.png"]);
    treasure.x = app.renderer.width / 2 - treasure.width / 2;
    treasure.y = app.renderer.height - treasure.height - 48;
    gameSceneTwo.addChild(treasure);

    let numberOfBlobs = 7,
        spacing = 50,
        yOffset = 160, // Change this to control the vertical position
        speed = 1,
        direction = 1;
    blobScale = 2; // Set the scale factor for the blobs

    // An array to store all the blob monsters
    blobs = [];

    // Make as many blobs as there are `numberOfBlobs`
    for (let i = 0; i < numberOfBlobs; i++) {

        // Make a blob
        const blob = new Sprite(id["blob.png"]);

        // Space each blob horizontally according to the `spacing` value.
        // `yOffset` determines the point from the top of the screen
        // at which the first blob should be added
        const y = spacing * i + yOffset;

        // Give the blob a random x position
        const x = randomInt(0, app.renderer.width - blob.width);

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
        blobs.push(blob);

        // Add the blob to the `gameScene`
        gameSceneTwo.addChild(blob);
    }

    healthBarTextures = [];

    // Populate the healthBarTextures array using a for loop
    for (let i = 1; i <= 6; i++) {
        const texture = helathId[`healthbar_0${i}.png`];
        healthBarTextures.push(texture);
    }

    initialHealthBarTexture = healthBarTextures[0];
    healthBarSprite = new Sprite(initialHealthBarTexture);
    healthBarSprite.position.set(app.renderer.width - 160, -3);

    // Set the initial width for 'outer'
    healthBarSprite.width = 128;
    healthBarSprite.height = 20;

    gameSceneTwo.addChild(healthBarSprite);

    gameOverScene = gameOverSceneChange(currentGameScene);

    state = play;

}


function level3() {
    lasers = [];
    blobLasers = [];

    currentLevel = 3;
    // Make the game scene and add it to the stage
    gameSceneThree = new Container();
    app.stage.addChild(gameSceneThree);

    // Make the sprites and add them to the `gameScene`
    // Create an alias for the texture atlas frame ids
    id = loader.resources["./images/treasureHunter.json"].textures;
    helathId = loader.resources["./images/healthbar.json"].textures;

    // Dungeon
    dungeon = new Sprite(id["dungeon.png"]);
    dungeon.interactive = true; // Make the sprite interactive to listen for pointer events
    dungeon.on('pointerdown', fireBullets);
    dungeon.on('pointerup', fireLaser);

    gameSceneThree.addChild(dungeon);

    // Door
    door = new Sprite(id["door.png"]);
    door.position.set(32, 0);
    // gameSceneThree.addChild(door);

    // Explorer
    explorer = new Sprite(id["explorer.png"]);
    explorer.x = app.renderer.width / 2 - explorer.width / 2;
    explorer.y = 15;
    explorer.vx = 0;
    explorer.vy = 0;
    gameSceneThree.addChild(explorer);



    // Treasure
    treasure = new Sprite(id["treasure.png"]);
    treasure.x = app.renderer.width / 2 - treasure.width / 2;
    treasure.y = app.renderer.height - treasure.height - 48;
    // gameSceneThree.addChild(treasure);

    let speed = 1,
        direction = 1,
        blobScale = 4;

    blobs = [];

    // Make a big blob
    giantBlob = new Sprite(id["blob.png"]);

    // Set the blob's position to the center of the screen
    giantBlob.x = app.renderer.width - 50;
    giantBlob.y = app.renderer.height / 2 - giantBlob.height / 2;

    giantBlob.vx = speed * direction;
    giantBlob.vy = 0;

    // Set the blob's scale to make it bigger
    giantBlob.scale.set(blobScale);

    // Add the blob to the `blobs` array
    blobs.push(giantBlob);

    // Add the blob to the `gameScene`
    gameSceneThree.addChild(giantBlob);

    state = play;

    currentGameScene = gameSceneThree;

    healthBarTextures = [];
    enemyHealthBarTextures = [];

    // Populate the healthBarTextures array using a for loop
    for (let i = 1; i <= 6; i++) {
        const texture = helathId[`healthbar_0${i}.png`];
        healthBarTextures.push(texture);
        enemyHealthBarTextures.push(texture);
    }

    initialHealthBarTexture = healthBarTextures[0];
    healthBarSprite = new Sprite(initialHealthBarTexture);
    healthBarSprite.position.set(app.renderer.width - 160, -3);

    // Set the initial width for 'outer'
    healthBarSprite.width = 128;
    healthBarSprite.height = 20;

    initialEnemyHealthBarTexture = enemyHealthBarTextures[0];
    enemyHealthBarSprite = new Sprite(initialEnemyHealthBarTexture);
    enemyHealthBarSprite.position.set(10, app.renderer.height - 20);

    enemyHealthBarSprite.width = 128;
    enemyHealthBarSprite.height = 20;

    gameSceneThree.addChild(healthBarSprite);
    gameSceneThree.addChild(enemyHealthBarSprite);

    gameOverScene = gameOverSceneChange(currentGameScene);

    state = play;
}


function play(event, delta, currentGameScene, key) {
    // Use the explorer's velocity to make it move
    // Use the explorer's velocity to make it move

    explorer.x += explorer.vx;
    explorer.y += explorer.vy;


    // Contain the explorer inside the area of the dungeon
    contain(explorer, { x: 28, y: 10, width: 488, height: 480 });

    // Set `explorerHit` to `false` before checking for a collision
    let explorerHit = false;

    // Loop through all the sprites in the `blobs` array
    blobs.forEach(function (blob) {

        currentLevel === 1 ? blob.y += blob.vy : blob.x += blob.vx;


        // Check the blob's screen boundaries
        const blobHitsWall = contain(blob, { x: 28, y: 10, width: 488, height: 480 });

        // If the blob hits the top or bottom of the stage, reverse its direction
        if (blobHitsWall === "top" || blobHitsWall === "bottom") {
            blob.vy *= -1;
        }

        if (blobHitsWall === "right" || blobHitsWall === "left") {
            blob.vx *= -1;
        }

        // Test for a collision. If any of the enemies are touching the explorer, set `explorerHit` to `true`
        if (hitTestRectangle(explorer, blob)) {
            explorerHit = true;
        }
    });


    if (explorerHit && !explorerHitCooldown) {
        // Make the explorer semi-transparent
        explorer.alpha = 0.5;

        // Change the health bar texture to the next one in the array
        currentHealthBarIndex++;

        if (currentHealthBarIndex < healthBarTextures.length) {
            healthBarSprite.texture = healthBarTextures[currentHealthBarIndex];
        }

        // Set the cooldown timer to prevent immediate damage
        explorerHitCooldown = true;
        setTimeout(() => {
            explorerHitCooldown = false;
        }, 500);
    } else {
        // Make the explorer fully opaque (non-transparent) if it hasn't been hit
        explorer.alpha = 1;
    }

    // Check for a collision between the explorer and the treasure
    if (hitTestRectangle(explorer, treasure)) {

        // If the treasure is touching the explorer, center it over the explorer
        treasure.x = explorer.x + 8;
        treasure.y = explorer.y + 8;
    }

    // if (currentLevel === 3) {
    //     // Check for collisions between lasers and the blob

    //     lasers.forEach((laser, i) => {
    //         laser.position.y += laser.speed;

    //         if (laser.position.y > dungeon.height) {
    //             laser.dead = true;
    //             app.stage.removeChild(laser);
    //         } else {
    //             // Check for collision with the blob
    //             if (hitTestRectangle(laser, giantBlob)) {
    //                 // Reduce blob's health
    //                 lasers.splice(i, 1);
    //                 app.stage.removeChild(laser);

    //                 // Change blob's health bar texture to the next one
    //                 if (blobHealth < enemyHealthBarTextures.length) {
    //                     enemyHealthBarSprite.texture = enemyHealthBarTextures[blobHealth++];
    //                 }

    //                 // Remove the laser
    //                 laser.dead = true;
    //             }
    //         }
    //     });

    //     blobLasers.forEach((laser, i) => {
    //         laser.position.y += -laser.speed;

    //         if (laser.position.y < 0) {
    //             laser.dead = true;
    //         } else {
    //             // Check for collision with the blob
    //             if (hitTestRectangle(laser, explorer)) {
    //                 healthBarSprite.texture = healthBarTextures[currentHealthBarIndex++];
    //                 blobLasers.splice(i, 1);
    //                 app.stage.removeChild(laser);

    //                 // Remove the laser
    //                 laser.dead = true;
    //             }
    //         }
    //     });


    //     // Remove dead lasers
    //     lasers = lasers.filter(laser => !laser.dead);
    //     blobLasers = blobLasers.filter(laser => !laser.dead);

    //     // Check if the blob's health reaches zero
    //     if (blobHealth === enemyHealthBarTextures.length) {

    //         gameSceneThree.removeChild(giantBlob);
    //         blobs = [];
    //         gameSceneThree.addChild(door);
    //         gameSceneThree.addChild(treasure);
    //         gameSceneThree.removeChild(enemyHealthBarSprite);

    //         // Remove the lasers
    //         lasers.forEach(laser => app.stage.removeChild(laser));
    //         lasers = [];

    //         // Remove the blob lasers
    //         blobLasers.forEach(laser => app.stage.removeChild(laser));
    //         blobLasers = [];

    //     }

    //     if (currentHealthBarIndex === healthBarTextures.length) {
    //         message.text = "You lost!";
    //         end(currentGameScene, key);
    //     }
    // }


    // Does the explorer have enough health? If the width of the `innerBar`
    // is less than zero, end the game and display "You lost!"
    if (currentHealthBarIndex === healthBarTextures.length) {
        message.text = "You lost!";
        end(currentGameScene, key);
    }

    // If the explorer has brought the treasure to the exit,
    // end the game and display "You won!"
    if (hitTestRectangle(treasure, door)) {
        if (currentLevel === 3) {
            message.text = "You win!";
            end();
        } else {
            message.text = "Next level!";
            end();
        }
    }

}



// /* Helper functions */

function fireBullets() {
    let laser = new createLaser();
    lasers.push(laser);
}

function createLaser() {
    let laser = new Sprite.from("./images/laser.png")
    laser.anchor.set(0.5, 1);
    laser.x = explorer.x;
    laser.y = explorer.y;
    laser.speed = 5;
    app.stage.addChild(laser);

    return laser;
}

function fireLaser() {
    let laser = new createBlobLaser();
    blobLasers.push(laser);
}


function createBlobLaser() {
    let laser = new Sprite.from("./images/laser.png")
    laser.anchor.set(0.5, 1);
    laser.x = giantBlob.x;
    laser.y = giantBlob.y;
    laser.speed = 5;
    app.stage.addChild(laser);

    return laser;
}

function end() {
    // Set the gameActive flag to false when the game ends
    if (message.text === "You lost!" || message.text === "You win!") {
        for (let i = app.stage.children.length - 1; i >= 0; i--) {
            app.stage.removeChild(app.stage.children[i]);
        }

        app.ticker.remove(gameLoopFunction);
    }

    if (message.text === "Next level!") {
        app.stage.removeChild(currentGameScene);

        app.stage.addChild(gameOverScene);
    }

    gameActive = false;

    // Remove the gameScene from the app's stage
    app.stage.removeChild(currentGameScene);

    // Add the gameOverScene to the app's stage
    app.stage.addChild(gameOverScene);

}


function gameLoop(delta, currentGameScene) {
    // Update the current game state only if the game is active
    if (gameActive) {

        state(delta, currentGameScene);
    }
}


function contain(sprite, container) {
    let collision = undefined;

    // Left
    if (sprite.x < container.x) {
        sprite.x = container.x;
        collision = "left";
    }

    // Top
    if (sprite.y < container.y) {
        sprite.y = container.y;
        collision = "top";
    }

    // Right
    if (sprite.x + sprite.width > container.width) {
        sprite.x = container.width - sprite.width;
        collision = "right";
    }

    // Bottom
    if (sprite.y + sprite.height > container.height) {
        sprite.y = container.height - sprite.height;
        collision = "bottom";
    }

    // Return the `collision` value
    return collision;
}


function hitTestRectangle(r1, r2) {
    // Calculate the distance between the centers of the sprites
    const dx = r1.x + r1.width / 2 - (r2.x + r2.width / 2);
    const dy = r1.y + r1.height / 2 - (r2.y + r2.height / 2);

    // Calculate the sum of the half-widths and half-heights of the sprites
    const combinedHalfWidths = (r1.width + r2.width) / 2;
    const combinedHalfHeights = (r1.height + r2.height) / 2;

    // Check for overlap on the x and y axes
    if (Math.abs(dx) < combinedHalfWidths && Math.abs(dy) < combinedHalfHeights) {
        // Collision detected
        return true;
    } else {
        // No collision
        return false;
    }
}


// The `randomInt` helper function
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gameOverSceneChange(currentGameScene) {
    gameOverScene = new Container();

    playAgainContainer = new Container();
    const playButton = new Graphics();

    // Define the triangle shape for the play icon
    playButton.beginFill(0xFFFFFF); // Fill color (white)
    playButton.moveTo(30, 20); // Starting point
    playButton.lineTo(30, 80); // First point of triangle
    playButton.lineTo(80, 50); // Second point of triangle
    playButton.lineTo(30, 20); // Closing the triangle

    playAgainContainer.x = app.renderer.width / 2 - playAgainContainer.width / 2 - 52;
    playAgainContainer.y = app.renderer.height / 2 - playAgainContainer.height / 2 + 40;
    // Add the play button to the stage
    playAgainContainer.addChild(playButton);
    gameOverScene.addChild(playAgainContainer);

    playAgainContainer.interactive = true;
    playAgainContainer.buttonMode = true;
    playAgainContainer.on('click', resetGame);


    // Create the text sprite and add it to the `gameOver` scene
    const style = new TextStyle({
        fontFamily: "Futura",
        fontSize: 64,
        fill: "white"
    });
    message = new Text("The End!", style);
    message.x = 120;
    message.y = app.renderer.height / 2 - 32;
    gameOverScene.addChild(message);

    return gameOverScene;
}

function resetGame() {
    // Remove the gameOverScene from the app's stage
    app.stage.removeChild(gameOverScene);
    // Set the gameActive flag to true
    gameActive = true;

    explorer.vx = 0;
    explorer.vy = 0;

    // Remove the current game scene from the app's stage
    if (currentGameScene) {
        app.stage.removeChild(currentGameScene);
    }

    if (message.text === "You lost!" || message.text === "You win!") {
        // Clear any existing game state and reset to level 1

        window.removeEventListener("keydown", handleKeysDown);
        window.removeEventListener("keyup", handleKeysUp);
        currentLevel = 1;
        currentHealthBarIndex = 0;
        blobHealth = 0;
    } else {
        // Increment the current level
        currentLevel++;
    }

    // Call the appropriate level setup function based on the new level
    switchToLevel(currentLevel);

    // Reset other game elements and variables as needed

    // Set the game state back to "play"
    state = play;
}

