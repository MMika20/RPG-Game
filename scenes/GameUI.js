import Phaser from 'phaser';
import sceneEvents from '../events/EventsCenter.js';
import CoinCounter from '../CoinCounter.js';

class GameUI extends Phaser.Scene {
    constructor() {
        super({ key: 'GameUI' });
        this.hearts = null;
        this.coinsLabel = null;
    }

    create() {
        // Anzeige für Coins oben links
        this.coinsLabel = this.add.text(5, 45, 'Coins: 0', { fontSize: '16px', fill: '#ffffff' }).setScrollFactor(0);

        // Events abonnieren
        sceneEvents.on('player-coins-changed', this.updateCoins, this);
        sceneEvents.on(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);

        // Gruppe für Herzen erstellen
        this.hearts = this.add.group({
            classType: Phaser.GameObjects.Image
        });

        // Herzen erstellen
        this.hearts.createMultiple({
            key: 'heart_full',
            setXY: {
                x: 10,
                y: 30,
                stepX: 16
            },
            quantity: 5
        });

        // Event für Änderungen der Lebenspunkte des Spielers abonnieren
        sceneEvents.on('player-health-changed', this.handlePlayerHealthChanged, this);
    }

    updateCoins(coins) {
        this.coinsLabel.setText(`Coins: ${coins}`);
    }

    handlePlayerHealthChanged(health) {
        this.hearts.children.each((heart, idx) => {
            if (idx < health) {
                heart.setTexture('heart_full');
            } else {
                heart.setTexture('heart_empty');
            }
        });
    }

    shutdown() {
        // Events beim Herunterfahren der Szene aufräumen
        sceneEvents.off('player-coins-changed', this.updateCoins, this);
        sceneEvents.off('player-health-changed', this.handlePlayerHealthChanged, this);
    }
}

export default GameUI;
