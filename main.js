class TCG extends Phaser.Scene {
    constructor() {
        super({ key: 'TCG' });
    }

    preload() {
        this.load.image('card', 'assets/card.png');
        this.load.image('deck', 'assets/deck.png');
    }

    create() {
        // Player stats
        this.player1Life = 20;
        this.player2Life = 20;
        this.currentPlayer = 1;

        // UI elements
        this.player1LifeText = this.add.text(50, 50, `Player 1: ${this.player1Life}`, { fontSize: '20px', fill: '#fff' });
        this.player2LifeText = this.add.text(600, 50, `Player 2: ${this.player2Life}`, { fontSize: '20px', fill: '#fff' });
        this.turnText = this.add.text(350, 50, `Player ${this.currentPlayer}'s Turn`, { fontSize: '20px', fill: '#fff' });

        // Decks
        this.player1Deck = this.createDeck(10);
        this.player2Deck = this.createDeck(10);

        this.deckSpriteP1 = this.add.sprite(100, 500, 'deck').setInteractive();
        this.deckSpriteP2 = this.add.sprite(700, 500, 'deck').setInteractive();

        this.deckSpriteP1.on('pointerdown', () => this.drawCard(1));
        this.deckSpriteP2.on('pointerdown', () => this.drawCard(2));

        // Hands & Field
        this.player1Hand = [];
        this.player2Hand = [];
        this.player1Field = [];
        this.player2Field = [];

        // Attacking mechanics
        this.selectedCard = null;

        // End turn button
        this.endTurnButton = this.add.text(350, 550, "End Turn", { fontSize: "20px", fill: "#fff" })
            .setInteractive()
            .on('pointerdown', () => this.endTurn());
    }

    createDeck(size) {
        let deck = [];
        for (let i = 0; i < size; i++) {
            deck.push({
                attack: Phaser.Math.Between(1, 5),
                health: Phaser.Math.Between(2, 6)
            });
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
        cardSprite.health = card.health;
        cardSprite.on('pointerdown', () => this.playCard(player, cardSprite));

        if (player === 1) {
            this.player1Hand.push(cardSprite);
        } else {
            this.player2Hand.push(cardSprite);
        }
    }

    playCard(player, cardSprite) {
        if (this.currentPlayer !== player) return; // Only play cards on your turn

        let xPos = player === 1 ? 200 + this.player1Field.length * 100 : 200 + this.player2Field.length * 100;
        let yPos = player === 1 ? 400 : 200;

        cardSprite.x = xPos;
        cardSprite.y = yPos;
        cardSprite.off('pointerdown'); // Remove hand interaction

        cardSprite.on('pointerdown', () => this.selectCard(player, cardSprite)); // Add attack selection

        if (player === 1) {
            this.player1Field.push(cardSprite);
            this.player1Hand = this.player1Hand.filter(card => card !== cardSprite);
        } else {
            this.player2Field.push(cardSprite);
            this.player2Hand = this.player2Hand.filter(card => card !== cardSprite);
        }
    }

    selectCard(player, cardSprite) {
        if (this.currentPlayer !== player) return; // Can't select on enemy's turn

        if (this.selectedCard) {
            // If a card is already selected, attack!
            this.attackCard(this.selectedCard, cardSprite);
            this.selectedCard = null;
        } else {
            // Select a card
            this.selectedCard = cardSprite;
        }
    }

    attackCard(attacker, defender) {
        defender.health -= attacker.attack;
        console.log(`Attacker deals ${attacker.attack} damage. Defender has ${defender.health} HP left.`);

        if (defender.health <= 0) {
            defender.destroy();
            if (this.player1Field.includes(defender)) {
                this.player1Field = this.player1Field.filter(card => card !== defender);
            } else {
                this.player2Field = this.player2Field.filter(card => card !== defender);
            }
        }
    }

    endTurn() {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.turnText.setText(`Player ${this.currentPlayer}'s Turn`);
        this.selectedCard = null;
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
