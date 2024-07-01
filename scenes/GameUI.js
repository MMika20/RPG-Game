import Phaser from 'phaser';
import sceneEvents from '../events/EventsCenter';
import HealthManager from '../HealthManager';
import CoinCounter from '../CoinCounter';

class GameUI extends Phaser.Scene {
    constructor() {
        super({ key: 'GameUI' });
        this.hearts = null;
        this.coinsLabel = null;
    }

    preload() {
        this.load.image('heart_full', 'path/to/heart_full.png');
        this.load.image('heart_empty', 'path/to/heart_empty.png');
    }

    create() {
        this.coinsLabel = this.add.text(5, 45, 'Coins: ' + CoinCounter.getCoins(), { fontSize: '16px', fill: '#ffffff' }).setScrollFactor(0);

        sceneEvents.on('player-coins-changed', this.updateCoins, this);
        sceneEvents.on('player-health-changed', this.handlePlayerHealthChanged, this);

        this.hearts = this.add.group({
            classType: Phaser.GameObjects.Image
        });

        this.updateHearts(HealthManager.getHealth());
    }

    updateCoins(coins) {
        this.coinsLabel.setText(`Coins: ${coins}`);
    }

    handlePlayerHealthChanged(health) {
        this.updateHearts(health);
    }

    
    updateHearts(health) {
        this.hearts.clear(true, true); // Alte Herzen löschen

        for (let i = 0; i < health; i++) {
            this.hearts.create(10 + i * 16, 30, 'heart_full');
        }

        for (let i = health; i < HealthManager.getHealth(); i++) { // Angenommene maximale Gesundheit
            this.hearts.create(10 + i * 16, 30, 'heart_empty');
        }
    }


    shutdown() {
        sceneEvents.off('player-coins-changed', this.updateCoins, this);
        sceneEvents.off('player-health-changed', this.handlePlayerHealthChanged, this);
    }
}

export default GameUI;
