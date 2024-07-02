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

    create() {
        // Coins Label
        this.coinsLabel = this.add.text(5, 45, 'Coins: ' + CoinCounter.getCoins(), { fontSize: '16px', fill: '#ffffff' }).setScrollFactor(0);

        // Event Listener für Coins und Health
        sceneEvents.on('player-coins-changed', this.updateCoins, this);
        sceneEvents.on('player-health-changed', this.handlePlayerHealthChanged, this);

        // Herzen Gruppe
        this.hearts = this.add.group({
            classType: Phaser.GameObjects.Image
        });

        this.updateHearts(HealthManager.getHealth());

        // Steuerleiste ohne Hintergrund
        this.createControlBar();
    }

    createControlBar() {
        const barWidth = this.cameras.main.width - 115;
        const barHeight = 80;

        // Icons und Tastenkombinationen hinzufügen
        const iconSize = 40;
        const iconPadding = 20;

        // Dash Icon
        this.add.image(barWidth / 2 - 100 , this.cameras.main.height - barHeight / 2 + 10, 'dash_icon').setScale(iconSize / 16); // Anpassung der Größe
        this.add.text(barWidth / 2 - 100 + 20, this.cameras.main.height - barHeight / 2 - 10, 'Dash', { fontSize: '18px', fill: '#ffffff' });
        this.add.text(barWidth / 2 - 100 + 20, this.cameras.main.height - barHeight / 2 + 10, 'SHIFT', { fontSize: '18px', fill: '#ffffff' });

        // Sword Icon
        this.add.image(barWidth / 2, this.cameras.main.height - barHeight / 2 + 10, 'sword_icon').setScale(iconSize / 16); // Anpassung der Größe
        this.add.text(barWidth / 2 + 10, this.cameras.main.height - barHeight / 2 - 10, 'Swing', { fontSize: '18px', fill: '#ffffff' });
        this.add.text(barWidth / 2 + 10, this.cameras.main.height - barHeight / 2 + 10, 'E', { fontSize: '18px', fill: '#ffffff' });

        // Bow Icon
        this.add.image(barWidth / 2 + 110 - 10, this.cameras.main.height - barHeight / 2 +10, 'bow_icon').setScale(iconSize / 16); // Anpassung der Größe
        this.add.text(barWidth / 2 + 100 + 15, this.cameras.main.height - barHeight / 2 - 10, 'Shoot', { fontSize: '18px', fill: '#ffffff' });
        this.add.text(barWidth / 2 + 100 + 15, this.cameras.main.height - barHeight / 2 + 10, 'SPACE', { fontSize: '18px', fill: '#ffffff' });

        // Spin Icon
        this.add.image(barWidth / 2 + 210, this.cameras.main.height - barHeight / 2 +10, 'spin_icon').setScale(iconSize / 32); // Anpassung der Größe
        this.add.text(barWidth / 2 + 240, this.cameras.main.height - barHeight / 2 - 10, 'Spin', { fontSize: '18px', fill: '#ffffff' });
        this.add.text(barWidth / 2 + 240, this.cameras.main.height - barHeight / 2 + 10, 'R', { fontSize: '18px', fill: '#ffffff' });

        // Map Icon
        this.add.image(barWidth / 2 + 540, this.cameras.main.height - barHeight / 2 +10, 'map_icon').setScale(iconSize / 750); // Anpassung der Größe
        this.add.text(barWidth / 2 + 525, this.cameras.main.height - barHeight / 2 - 35, 'Map ', { fontSize: '18px', fill: '#ffffff' });
        this.add.text(barWidth / 2 + 525, this.cameras.main.height - barHeight / 2 - 50, '-M-', { fontSize: '18px', fill: '#ffffff' });
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
