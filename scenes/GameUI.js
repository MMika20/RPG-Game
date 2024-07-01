import Phaser from 'phaser';
import sceneEvents from '../events/EventsCenter.js';
import HealthManager from '../HealthManager.js';
import CoinCounter from '../CoinCounter.js';

class GameUI extends Phaser.Scene {
    constructor() {
        super({ key: 'GameUI' });
        this.hearts = null;
        this.coinsLabel = null;
        
    }

    preload() {
        // Stelle sicher, dass die Texturen geladen werden
        this.load.image('heart_full', 'path/to/heart_full.png');
        this.load.image('heart_empty', 'path/to/heart_empty.png');
    }

    create() {
        // Anzeige für Coins oben links
        this.coinsLabel = this.add.text(5, 45, 'Coins: 0', { fontSize: '16px', fill: '#ffffff' }).setScrollFactor(0);

        // Events
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
            quantity: HealthManager.getHealth() // Anzahl der Herzensbilder
        });

        // Event für Änderungen der Lebenspunkte des Spielers
        sceneEvents.on('player-health-changed', this.handlePlayerHealthChanged, this);
    }

    updateCoins(coins) {
        this.coinsLabel.setText(`Coins: ${coins}`);
    }

    handlePlayerHealthChanged(health) {
        console.log(`Updating hearts, new health: ${health}`); // Debugging
        this.hearts.children.each((heart, idx) => {
            console.log(`Heart ${idx}: ${idx < health ? 'full' : 'empty'}`); // Debugging
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
