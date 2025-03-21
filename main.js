class TCG extends Phaser.Scene {
    constructor() {
        super({ key: 'TCG' });
    }

    preload() {
        this.load.image('card', 'assets/card.png'); // Card image
        this.load.image('deck', 'assets/deck.png'); // Deck image
    }

    create() {
        // Players' life points
        this.player1Life = 20;
        this.player2Life = 20;

        this.player1LifeText = this.add.text(50, 50, `Player 1: ${this.player1Life}`, { fontSize: '20px', fill: '#fff' });
        this.player2LifeText = this.add.text(600, 50, `Player 2: ${this.player2Life}`, { fontSize: '20px', fill: '#fff' });

        // Decks
        this.player1Deck = this.createDeck(10);
        this.player2Deck = this.createDeck(10);

        this.deckSpriteP1 = this.add.sprite(100, 500, 'deck').setInteractive();
        this.deckSpriteP2 = this.add.sprite(700, 500, 'deck').setInteractive();

        this.deckSpriteP1.on('pointerdown', () => this.drawCard(1));
        this.deckSpriteP2.on('pointerdown', () => this.drawCard(2));

        // Hands
        this.player1Hand = [];
        this.player2Hand = [];

        // Turn system
        this.currentPlayer = 1;
        this.turnText = this.add.text(350, 50, `Player ${this.currentPlayer}'s Turn`, { fontSize: '20px', fill: '#fff' });

        this.input.keyboard.on('keydown-SPACE', () => this.endTurn());
    }

    createDeck(size) {
        let deck = [];
        for (let i = 0; i < size; i++) {
            deck.push({ attack: Phaser.Math.Between(1, 5) });
        }
        return deck;
    }

    drawCard(player) {
        if (player === 1 && this.player1Deck.length > 0 && this.currentPlayer === 1) {
            let card = this.player1Deck.pop();
            this.addCardToHand(1, card);
        } else if (player === 2 && this.player2Deck.length > 0 && this.currentPlayer === 2) {
            let card = this.player2Deck.pop();
            this.addCardToHand(2, card);
        }
    }

    addCardToHand(player, card) {
        let xPos = player === 1 ? 200 + this.player1Hand.length * 80 : 200 + this.player2Hand.length * 80;
        let yPos = player === 1 ? 500 : 100;

        let cardSprite = this.add.sprite(xPos, yPos, 'card').setInteractive();
        cardSprite.attack = card.attack;
        cardSprite.on('pointerdown', () => this.playCard(player, cardSprite));

        if (player === 1) {
            this.player1Hand.push(cardSprite);
        } else {
            this.player2Hand.push(cardSprite);
        }
    }

    playCard(player, cardSprite) {
        if (this.currentPlayer === player) {
            let damage = cardSprite.attack;
            if (player === 1) {
                this.player2Life = Math.max(0, this.player2Life - damage);
                this.player2LifeText.setText(`Player 2: ${this.player2Life}`);
                this.player1Hand = this.player1Hand.filter(c => c !== cardSprite);
            } else {
                this.player1Life = Math.max(0, this.player1Life - damage);
                this.player1LifeText.setText(`Player 1: ${this.player1Life}`);
                this.player2Hand = this.player2Hand.filter(c => c !== cardSprite);
            }
            cardSprite.destroy();

            if (this.player1Life === 0 || this.player2Life === 0) {
                this.endGame();
            }
        }
    }

    endTurn() {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.turnText.setText(`Player ${this.currentPlayer}'s Turn`);
    }

    endGame() {
        let winner = this.player1Life > 0 ? "Player 1" : "Player 2";
        this.add.text(300, 300, `${winner} Wins!`, { fontSize: '40px', fill: '#ff0' });
        this.scene.pause();
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
