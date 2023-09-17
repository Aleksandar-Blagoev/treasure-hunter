class Game {
    constructor() {
        // Aliases
        this.Application = PIXI.Application;
        this.Container = PIXI.Container;
        this.loader = PIXI.loader;
        this.Graphics = PIXI.Graphics;
        this.Sprite = PIXI.Sprite;
        this.Text = PIXI.Text;
        this.TextStyle = PIXI.TextStyle;

        // Create a Pixi Application
        this.app = new this.Application({
            width: 512,
            height: 512,
            antialias: true,
            transparent: false,
            resolution: 1
        });

        // Add the canvas that Pixi automatically created for you to the HTML document
        document.body.appendChild(this.app.view);

        // Define variables that might be used in more than one function
        this.state = null;
        this.explorer = null;
        this.treasure = null;
        this.blobs = [];
        this.dungeon = null;
        this.lasers = [];
        this.blobHealth = 0;
        this.giantBlob = null;
        this.blobLasers = [];
        this.door = null;
        this.message = null;
        this.gameScene = null;
        this.gameSceneTwo = null;
        this.gameSceneThree = null;
        this.gameOverScene = null;
        this.id = null;
        this.playAgainContainer = null;
        this.helathId = null;
        this.healthBarTextures = [];
        this.enemyHealthBar = null;
        this.enemyHealthBarTextures = [];
        this.enemyHealthBarSprite = null;
        this.initialEnemyHealthBarTexture = null;
        this.healthBarSprite = null;
        this.initialHealthBarTexture = null;
        this.currentGameScene = null;
        this.explorerHitCooldown = false;
        this.currentHealthBarIndex = 0;
        this.blobHealth = 0;
        this.gameActive = true;
        this.currentLevel = 1;
        this.gameLoopFunction = null;
        this.restartButtonCreated = false;

        // Select the restart button by its ID
        this.keys = {
            left: false,
            right: false,
            up: false,
            down: false,
        };

        this.app.ticker.autoStart = true;
    }

    fireBullets = () => {
        let laser = this.createLaser();
        this.lasers.push(laser);
    }

    createLaser = () => {
        let laser = new this.Sprite.from("./images/laser.png");
        laser.anchor.set(0.5, 1);
        laser.x = this.explorer.x;
        laser.y = this.explorer.y;
        laser.speed = 5;
        this.app.stage.addChild(laser);

        return laser;
    }

    fireLaser = () => {
        let laser = this.createBlobLaser();
        this.blobLasers.push(laser);
    }

    createBlobLaser = () => {
        let laser = new this.Sprite.from("./images/laser.png");
        laser.anchor.set(0.5, 1);
        laser.x = this.giantBlob.x;
        laser.y = this.giantBlob.y;
        laser.speed = 5;
        this.app.stage.addChild(laser);

        return laser;
    }

    end = () => {
        // Set the gameActive flag to false when the game ends
        if (this.message.text === "You lost!" || this.message.text === "You win!") {
            for (let i = this.app.stage.children.length - 1; i >= 0; i--) {
                this.app.stage.removeChild(this.app.stage.children[i]);
            }

            this.app.ticker.remove(this.gameLoopFunction);
        }

        if (this.message.text === "Next level!") {
            this.app.stage.removeChild(this.currentGameScene);
            this.app.stage.addChild(this.gameOverScene);
        }

        this.gameActive = false;

        // Remove the gameScene from the app's stage
        this.app.stage.removeChild(this.currentGameScene);

        // Add the gameOverScene to the app's stage
        this.app.stage.addChild(this.gameOverScene);
    }

    gameLoop = (delta) => {
        // Update the current game state only if the game is active
        if (this.gameActive) {
            this.state(delta, this.currentGameScene);
        }
    }

    contain = (sprite, container) => {
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

    hitTestRectangle = (r1, r2) => {
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

    handleKeysDown = (event) => {
        switch (event.keyCode) {
            case 37: // Left arrow key is pressed
                this.keys.left = true;
                this.explorer.vx = -5;
                this.explorer.vy = 0;
                break;
            case 39: // Right arrow key is pressed
                this.keys.right = true;
                this.explorer.vx = 5;
                this.explorer.vy = 0;
                break;
            case 38: // Up arrow key is pressed
                this.keys.up = true;
                this.explorer.vy = -5;
                this.explorer.vx = 0;
                break;
            case 40: // Down arrow key is pressed
                this.keys.down = true;
                this.explorer.vy = 5;
                this.explorer.vx = 0;
                break;
            default:
                this.explorer.vy = 0;
                this.explorer.vx = 0;
                break;
        }
    }

    handleKeysUp = (event) => {
        this.explorer.vx = 0;
        this.explorer.vy = 0;

        switch (event.keyCode) {
            case 37: // Left arrow key is released
                this.keys.left = false;
                break;
            case 39: // Right arrow key is released
                this.keys.right = false;
                break;
            case 38: // Up arrow key is released
                this.keys.up = false;
                break;
            case 40: // Down arrow key is released
                this.keys.down = false;
                break;
        }
    }

    // Define your other helper methods here
}

// Instantiate the Game class to start the game
let game = new Game();

