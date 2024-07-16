class AnimationHandler {
    constructor(scene, imageKey, frameWidth, frameHeight, numFrames, frameDuration) {
        this.scene = scene;
        this.spriteSheet = scene.textures.get(imageKey).getSourceImage();
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.numFrames = numFrames;
        this.frameDuration = frameDuration;
        this.frames = [];
        this.currentFrameIndex = 0;
        this.timeSinceLastFrame = 0;

        this.loadFrames();
    }

    loadFrames() {
        for (let i = 0; i < this.numFrames; i++) {
            let x = (i * this.frameWidth) % this.spriteSheet.width;
            let y = Math.floor((i * this.frameWidth) / this.spriteSheet.width) * this.frameHeight;
            let frame = this.scene.add.sprite(x, y, this.spriteSheet.key, i);
            frame.setVisible(false);
            this.frames.push(frame);
        }
        this.frames[0].setVisible(true); // Initially set the first frame as visible
    }

    update(dt) {
        this.timeSinceLastFrame += dt;
        if (this.timeSinceLastFrame >= this.frameDuration) {
            this.timeSinceLastFrame = 0;
            this.frames[this.currentFrameIndex].setVisible(false);
            this.currentFrameIndex = (this.currentFrameIndex + 1) % this.numFrames;
            this.frames[this.currentFrameIndex].setVisible(true);
        }
    }

    getCurrentFrame() {
        return this.frames[this.currentFrameIndex];
    }
}

class MyGame extends Phaser.Scene {
    constructor() {
        super({ key: 'MyGame' });
        this.animationHandler = null;
        this.cardSprite = null;
    }

    preload() {
        this.load.spritesheet('animation_sheet', 'assets/animation_sheet.png', {
            frameWidth: 64,
            frameHeight: 64
        });
        this.load.image('card', 'assets/card.png');
    }

    create() {
        // Verify if assets are loaded
        console.log('Assets loaded:', this.textures.exists('animation_sheet'), this.textures.exists('card'));

        this.cardSprite = this.add.sprite(400, 300, 'card');
        this.cardSprite.setInteractive();

        this.cardSprite.on('pointerdown', () => {
            console.log('Card clicked!');
            // Trigger animations or other effects
        });

        this.animationHandler = new AnimationHandler(this, 'animation_sheet', 64, 64, 8, 100);

        // Move the animation to a visible position
        this.animationHandler.frames.forEach(frame => {
            frame.setPosition(400, 300);
            frame.setScale(2);  // Adjust the scale for visibility
            frame.setStrokeStyle(2, 0x00ff00);  // Add a green outline for visibility
        });
    }

    update(time, delta) {
        this.animationHandler.update(delta);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    scene: MyGame
};

const game = new Phaser.Game(config);
