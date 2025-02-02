class TCG extends Phaser.Scene {
    constructor() {
        super({ key: 'TCG' });
    }

    preload() {
        this.load.image('card', 'assets/card.png');
    }

    create() {
        // Check if the card asset is loaded
        console.log('Card asset loaded:', this.textures.exists('card'));

        this.cardSprite = this.add.sprite(400, 300, 'card');
        this.cardSprite.setInteractive();

        this.cardSprite.on('pointerdown', () => {
            console.log('Card clicked!');
            // Add logic for what happens when the card is clicked
        });

        // Add text for player life points
        this.player1LifeText = this.add.text(50, 50, 'Player 1: 20', { fontSize: '20px', fill: '#fff' });
        this.player2LifeText = this.add.text(650, 50, 'Player 2: 20', { fontSize: '20px', fill: '#fff' });

        // Example logic for modifying life points
        this.player1LifePoints = 20;
        this.player2LifePoints = 20;
    }

    update(time, delta) {
        // Update the game logic here
    }

    modifyLifePoints(player, amount) {
        if (player === 1) {
            this.player1LifePoints += amount;
            this.player1LifeText.setText(`Player 1: ${this.player1LifePoints}`);
        } else if (player === 2) {
            this.player2LifePoints += amount;
            this.player2LifeText.setText(`Player 2: ${this.player2LifePoints}`);
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    scene: TCG
};

const game = new Phaser.Game(config);
