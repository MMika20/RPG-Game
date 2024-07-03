import Phaser from 'phaser';
import SpeedManager from './SpeedManager';
import CoinCounter from './CoinCounter';
import DamageManager from './DamageManager';
import HealthManager from './HealthManager';
import sceneEvents from './events/EventsCenter';

class Trader extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setInteractive();
        this.coinsRequiredSpeed = 2000; // Anzahl der benötigten Coins für das Speed-Upgrade
        this.coinsRequiredDamage = 3000; // " für Damage-Upgrade
        this.coinsRequiredHealth = 5000; // " für Health-Upgrade

        this.isInRange = false; // Flag, um zu überprüfen, ob der Charakter in der Nähe des Traders ist
        this.upgradeWindow = null; // Referenz zum aktuellen Upgrade-Fenster

        // "F to interact" Text hinzufügen
        this.interactText = scene.add.text(this.x, this.y - 40, '-F- to interact', { fontSize: '12px', fill: '#ffffff' });
        this.interactText.setVisible(false); // Standardmäßig unsichtbar

        // Event-Listener für die Taste 'F' und 'Escape'
        this.scene.input.keyboard.on('keydown-F', () => this.handleInteraction(), this);
        this.scene.input.keyboard.on('keydown-ESC', () => this.closeUpgradeWindow(), this);
    }

    handleInteraction() {
        if (this.isInRange) {
            this.showUpgradeWindow(this.scene.charakter);
        } else {
            console.log('You need to be closer to the trader to interact.');
        }
    }

    showUpgradeWindow(character) {
        if (this.upgradeWindow) return; // Verhindert mehrfaches Öffnen des Fensters

        // Fensterposition berechnen
        const characterX = character.x;
        const characterY = character.y;

        // Fenster erstellen
        this.upgradeWindow = this.scene.add.container(characterX, characterY);
        const background = this.scene.add.rectangle(0, 0, 220, 200, 0x000000, 0.8);
        const closeButton = this.scene.add.text(80, -90, 'X', { fontSize: '18px', fill: '#fff' }).setInteractive();
        const shopText = this.scene.add.text(-80, -60, 'Shop - Upgrades', { fontSize: '16px', fill: '#fff' });
        const quantityText = this.scene.add.text(-80, -30, 'Amount:', { fontSize: '14px', fill: '#fff' });
        const quantityInput = this.scene.add.text(-20, -30, '1          ', { fontSize: '14px', fill: '#1fff' }).setInteractive();

        // Initiale Preise anzeigen
        const speedButton = this.scene.add.text(-80, 0, `Speed     -${this.coinsRequiredSpeed * 1} Coins-`, { fontSize: '14px', fill: '#fff' }).setInteractive();
        const damageButton = this.scene.add.text(-80, 30, `Damage    -${this.coinsRequiredDamage * 1} Coins-`, { fontSize: '14px', fill: '#fff' }).setInteractive();
        const healthButton = this.scene.add.text(-80, 60, `Health    -${this.coinsRequiredHealth * 1} Coins-`, { fontSize: '14px', fill: '#fff' }).setInteractive();

        // Methode zum Aktualisieren der Preise
        const updatePrices = (quantity) => {
            speedButton.setText(`Speed    -${this.coinsRequiredSpeed * quantity} Coins-`);
            damageButton.setText(`Damage   -${this.coinsRequiredDamage * quantity} Coins-`);
            healthButton.setText(`Health   -${this.coinsRequiredHealth * quantity} Coins-`);
        };

        // Button-Interaktionen
        closeButton.on('pointerdown', () => {
            this.closeUpgradeWindow();
        });

        quantityInput.on('pointerdown', () => {
            // Prompt für die Benutzereingabe
            let newQuantity = prompt('Enter amount:');
            
            // Eingabevalidierung
            if (newQuantity !== null) { // Überprüfe, ob der Benutzer etwas eingegeben hat
                newQuantity = parseInt(newQuantity, 10); // Wandle die Eingabe in eine Ganzzahl um
                
                // Überprüfe, ob die Eingabe eine gültige positive Ganzzahl ist
                if (!isNaN(newQuantity) && newQuantity > 0) {
                    quantityInput.setText(newQuantity);
                    updatePrices(newQuantity); // Preise aktualisieren
                } else {
                    alert('Please enter a valid positive number.');
                }
            }
        });

        speedButton.on('pointerdown', () => {
            const quantity = parseInt(quantityInput.text, 10);
            this.interactWithCharacterSpeed(character, quantity);
            this.closeUpgradeWindow();
        });

        damageButton.on('pointerdown', () => {
            const quantity = parseInt(quantityInput.text, 10);
            this.interactWithCharacterDamage(character, quantity);
            this.closeUpgradeWindow();
        });

        healthButton.on('pointerdown', () => {
            const quantity = parseInt(quantityInput.text, 10);
            this.interactWithCharacterHealth(character, quantity);
            this.closeUpgradeWindow();
        });

        this.upgradeWindow.add([background, closeButton, shopText, quantityText, quantityInput, speedButton, damageButton, healthButton]);
    }

    closeUpgradeWindow() {
        if (this.upgradeWindow) {
            this.upgradeWindow.destroy();
            this.upgradeWindow = null; // Setze die Referenz zurück
        }
    }

    interactWithCharacterSpeed(character, quantity) {
        const totalCost = this.coinsRequiredSpeed * quantity;
        if (CoinCounter.getCoins() >= totalCost) {
            SpeedManager.increaseSpeed(10 * quantity); // Beispiel: Erhöhung um 10 Einheiten pro Upgrade
            CoinCounter.subtractCoins(totalCost);
            character.speed = SpeedManager.getSpeed();
            console.log(`Character speed increased by ${10 * quantity}! Remaining coins: ${CoinCounter.getCoins()}`);
            sceneEvents.emit('player-coins-changed', CoinCounter.getCoins());
        } else {
            console.log("Not enough coins to purchase Speed-Upgrade!");
        }
    }

    interactWithCharacterDamage(character, quantity) {
        const totalCost = this.coinsRequiredDamage * quantity;
        if (CoinCounter.getCoins() >= totalCost) {
            DamageManager.increaseDamage(0.5 * quantity);
            CoinCounter.subtractCoins(totalCost);
            console.log(`Damage increased by ${0.5 * quantity}! Remaining coins: ${CoinCounter.getCoins()}`);
            sceneEvents.emit('player-coins-changed', CoinCounter.getCoins());
        } else {
            console.log("Not enough coins to purchase Damage-Upgrade!");
        }
    }

    interactWithCharacterHealth(character, quantity) {
        const totalCost = this.coinsRequiredHealth * quantity;
        if (CoinCounter.getCoins() >= totalCost) {
            HealthManager.increaseHealth(1 * quantity);
            CoinCounter.subtractCoins(totalCost);
            console.log(`Health increased by ${1 * quantity}! Remaining coins: ${CoinCounter.getCoins()}`);
            sceneEvents.emit('player-coins-changed', CoinCounter.getCoins());
        } else {
            console.log("Not enough coins to purchase Health-Upgrade!");
        }
    }

    update() {
        // Überprüfe, ob der Charakter in der Nähe des Traders ist
        this.isInRange = this.scene.physics.overlap(this.scene.charakter, this);

        // "F to interact" Text ein- oder ausblenden
        if (this.isInRange) {
            this.interactText.setVisible(true);
            this.interactText.setPosition(this.x + 10, this.y - 5); // Text über dem Trader positionieren
        } else {
            this.interactText.setVisible(false);
        }
    }
}

export default Trader;
