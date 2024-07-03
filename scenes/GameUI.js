import Phaser from 'phaser';
import sceneEvents from '../events/EventsCenter';
import HealthManager from '../HealthManager';
import CoinCounter from '../CoinCounter';
import SpeedManager from '../SpeedManager';
import DamageManager from '../DamageManager';
import KillCounter from '../KillCounter';

class GameUI extends Phaser.Scene {
    constructor() {
        super({ key: 'GameUI' });
        this.hearts = null;
        this.coinsLabel = null;
        this.mapLabel = null;
        this.statsWindow = null; // Hinzufügen für das Statistik-Fenster
        this.menuWindow = null;  // Hinzufügen für das Menü-Fenster
        this.music = null; // Referenz zur Hintergrundmusik
        this.volumeText = null; // Text für die Lautstärkeanzeige
    }

    create() {
        // Coins Label
        this.coinsLabel = this.add.text(5, 45, 'Coins: ' + CoinCounter.getCoins(), { fontSize: '16px', fill: '#ffffff' }).setScrollFactor(0);

        // Map Name Label
        this.mapLabel = this.add.text(10, this.cameras.main.height - 30, 'Region: Middle', { fontSize: '16px', fill: '#ffffff' }).setScrollFactor(0);

        // Event Listener für Coins und Health
        sceneEvents.on('player-coins-changed', this.updateCoins, this);
        sceneEvents.on('player-health-changed', this.handlePlayerHealthChanged, this);
        sceneEvents.on('update-map-name', this.updateMapName, this);

        // Herzen Gruppe
        this.hearts = this.add.group({
            classType: Phaser.GameObjects.Image
        });

        this.updateHearts(HealthManager.getHealth());

        // Steuerleiste ohne Hintergrund
        this.createControlBar();

        // Event Listener für die C-Taste
        this.input.keyboard.on('keydown-C', () => {
            this.showStatsWindow();
        });

        // Event Listener für die Escape-Taste
        this.input.keyboard.on('keydown-ESC', () => {
            this.toggleMenu();
        });

        // Hintergrundmusik referenzieren
        this.music = this.scene.get('Preloader').music; // Angenommen, die Musik läuft in der MainScene
    }

    createControlBar() {
        const barWidth = this.cameras.main.width - 115;
        const barHeight = 80;

        // Icons und Tastenkombinationen hinzufügen
        const iconSize = 40;
        const iconPadding = 20;

        // Dash Icon
        this.add.image(barWidth / 2 - 100, this.cameras.main.height - barHeight / 2 + 10, 'dash_icon').setScale(iconSize / 16);
        this.add.text(barWidth / 2 - 100 + 20, this.cameras.main.height - barHeight / 2 - 10, 'Dash', { fontSize: '18px', fill: '#ffffff' });
        this.add.text(barWidth / 2 - 100 + 20, this.cameras.main.height - barHeight / 2 + 10, 'SHIFT', { fontSize: '18px', fill: '#ffffff' });

        // Sword Icon
        this.add.image(barWidth / 2, this.cameras.main.height - barHeight / 2 + 10, 'sword_icon').setScale(iconSize / 16);
        this.add.text(barWidth / 2 + 10, this.cameras.main.height - barHeight / 2 - 10, 'Swing', { fontSize: '18px', fill: '#ffffff' });
        this.add.text(barWidth / 2 + 10, this.cameras.main.height - barHeight / 2 + 10, '-E-', { fontSize: '18px', fill: '#ffffff' });

        // Bow Icon
        this.add.image(barWidth / 2 + 110 - 10, this.cameras.main.height - barHeight / 2 + 10, 'bow_icon').setScale(iconSize / 16);
        this.add.text(barWidth / 2 + 100 + 15, this.cameras.main.height - barHeight / 2 - 10, 'Shoot', { fontSize: '18px', fill: '#ffffff' });
        this.add.text(barWidth / 2 + 100 + 15, this.cameras.main.height - barHeight / 2 + 10, 'SPACE', { fontSize: '18px', fill: '#ffffff' });

        // Spin Icon
        this.add.image(barWidth / 2 + 210, this.cameras.main.height - barHeight / 2 + 10, 'spin_icon').setScale(iconSize / 32);
        this.add.text(barWidth / 2 + 240, this.cameras.main.height - barHeight / 2 - 10, 'Spin', { fontSize: '18px', fill: '#ffffff' });
        this.add.text(barWidth / 2 + 240, this.cameras.main.height - barHeight / 2 + 10, '-R-', { fontSize: '18px', fill: '#ffffff' });

        // Map Icon
        this.add.image(barWidth / 2 + 540, this.cameras.main.height - barHeight / 2 + 10, 'map_icon').setScale(iconSize / 750);
        this.add.text(barWidth / 2 + 525, this.cameras.main.height - barHeight / 2 - 35, 'Map ', { fontSize: '18px', fill: '#ffffff' });
        this.add.text(barWidth / 2 + 525, this.cameras.main.height - barHeight / 2 - 50, '-M-', { fontSize: '18px', fill: '#ffffff' });

        // Stats Icon
        this.add.image(barWidth / 2 + 480, this.cameras.main.height - barHeight / 2 + 10, 'marker').setScale(iconSize / 12);
        this.add.text(barWidth / 2 + 455, this.cameras.main.height - barHeight / 2 - 35, 'Stats', { fontSize: '18px', fill: '#ffffff' });
        this.add.text(barWidth / 2 + 465, this.cameras.main.height - barHeight / 2 - 50, '-C-', { fontSize: '18px', fill: '#ffffff' });
    }

    showStatsWindow() {
        // Falls ein Statistik-Fenster bereits angezeigt wird, zerstöre es
        if (this.statsWindow) {
            this.statsWindow.destroy();
            this.statsWindow = null;
            return;
        }

        // Fensterposition berechnen
        const x = this.cameras.main.centerX;
        const y = this.cameras.main.centerY;

        // Fenster erstellen
        this.statsWindow = this.add.container(x, y);
        const background = this.add.rectangle(0, 0, 300, 250, 0x000000, 0.8);
        const closeButton = this.add.text(130, -115, 'X', { fontSize: '18px', fill: '#fff' }).setInteractive();

        const statsText = this.add.text(-130, -100, 
            `Stats\n\n` +
            `Health:        ${HealthManager.getHealth()}\n` +
            `Speed:         ${SpeedManager.getSpeed()}\n` +
            `Damage:        ${DamageManager.getDamage()}\n` +
            `Coins:         ${CoinCounter.getCoins()}\n\n\n`+
            `Kills\n\n`+ 
            `Orc:           ${KillCounter.getOrcKills()}\n` +
            `Necromancer:   ${KillCounter.getNecromancerKills()}`, 
            { fontSize: '16px', fill: '#fff' });

        closeButton.on('pointerdown', () => {
            this.statsWindow.destroy();
            this.statsWindow = null;
        });

        this.statsWindow.add([background, closeButton, statsText]);
    }

    createMenu() {
        // Falls ein Menü bereits angezeigt wird, zerstöre es
        if (this.menuWindow) {
            this.menuWindow.destroy();
            this.menuWindow = null;
            return;
        }

        // Fensterposition berechnen
        const x = this.cameras.main.centerX;
        const y = this.cameras.main.centerY;

        // Fenster erstellen
        this.menuWindow = this.add.container(x, y);
        const background = this.add.rectangle(0, 0, 300, 200, 0x000000, 0.8);
        const resumeButton = this.add.text(-60, -60, 'Resume', { fontSize: '18px', fill: '#fff' }).setInteractive();
        const restartButton = this.add.text(-60, -25, 'Restart', { fontSize: '18px', fill: '#fff' }).setInteractive();
        const volumeLabel = this.add.text(-60, 10, 'Volume', { fontSize: '18px', fill: '#fff' });
        this.volumeText = this.add.text(50, 10, (this.music.volume * 100).toFixed(0) + '%', { fontSize: '18px', fill: '#fff' });

        // Lautstärke erhöhen Button
        const increaseVolumeButton = this.add.text(95, 10, '+', { fontSize: '18px', fill: '#fff' }).setInteractive();
        increaseVolumeButton.on('pointerdown', () => {
            let newVolume = Phaser.Math.Clamp(this.music.volume + 0.1, 0, 1);
            this.music.setVolume(newVolume);
            this.volumeText.setText((newVolume * 100).toFixed(0) + '%');
        });

        // Lautstärke verringern Button
        const decreaseVolumeButton = this.add.text(30, 10, '-', { fontSize: '18px', fill: '#fff' }).setInteractive();
        decreaseVolumeButton.on('pointerdown', () => {
            let newVolume = Phaser.Math.Clamp(this.music.volume - 0.1, 0, 1);
            this.music.setVolume(newVolume);
            this.volumeText.setText((newVolume * 100).toFixed(0) + '%');
        });

        resumeButton.on('pointerdown', () => {
            this.menuWindow.destroy();
            this.menuWindow = null;
        });

        restartButton.on('pointerdown', () => {
            this.restartGame();
        });

        this.menuWindow.add([background, resumeButton, restartButton, volumeLabel, this.volumeText, increaseVolumeButton, decreaseVolumeButton]);
    }

    toggleMenu() {
        if (this.menuWindow) {
            this.menuWindow.destroy();
            this.menuWindow = null;
        } else {
            this.createMenu();
        }
    }

    restartGame(data) {
        // Holen Sie sich alle aktiven Szenen
        this.scene.stop('MainMap');
        this.scene.stop('MapEast');
        this.scene.stop('MapNorth');
        this.scene.stop('MapNorthEast');
        this.scene.stop('MapNorthWest');
        this.scene.stop('MapSouth');
        this.scene.stop('MapSouthEast');
        this.scene.stop('MapSouthWest');
        this.scene.stop('MapWest');
        this.scene.stop('BossLevel');
        this.scene.stop('GameUI');

        // Starten Sie die aktuelle Szene neu (wir nehmen an, dass die Hauptszene "Game" heißt)
        this.scene.start('StartScene');

        this.scene.start('GameUI');
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

    updateMapName(mapName) {
        if (this.mapLabel) {
            this.mapLabel.setText(`Region: ${mapName}`);
        }
    }

    shutdown() {
        sceneEvents.off('player-coins-changed', this.updateCoins, this);
        sceneEvents.off('player-health-changed', this.handlePlayerHealthChanged, this);
        sceneEvents.off('update-map-name', this.updateMapName, this);
    }
}

export default GameUI;
