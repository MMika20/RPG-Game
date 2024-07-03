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
        this.coinsRequiredSpeed = 2000;
        this.coinsRequiredDamage = 3000;
        this.coinsRequiredHealth = 5000;

        this.isInRange = false;
        this.upgradeWindow = null;

        // "F to interact" Text hinzufügen
        this.interactText = scene.add.text(this.x, this.y - 40, '-F- to interact', { fontSize: '12px', fill: '#ffffff' });
        this.interactText.setVisible(false);

        this.scene = scene; // Speichern Sie die Szene-Referenz

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
        if (this.upgradeWindow) return;

        const characterX = character.x;
        const characterY = character.y;

        this.upgradeWindow = this.scene.add.container(characterX, characterY);
        const background = this.scene.add.rectangle(0, 0, 220, 200, 0x000000, 0.8);
        const closeButton = this.scene.add.text(80, -90, 'X', { fontSize: '18px', fill: '#fff' }).setInteractive();
        const shopText = this.scene.add.text(-80, -60, 'Shop - Upgrades', { fontSize: '16px', fill: '#fff' });
        const quantityText = this.scene.add.text(-80, -30, 'Amount:', { fontSize: '14px', fill: '#fff' });
        const quantityInput = this.scene.add.text(-20, -30, '1          ', { fontSize: '14px', fill: '#1fff' }).setInteractive();

        const speedButton = this.scene.add.text(-80, 0, `Speed     -${this.coinsRequiredSpeed * 1} Coins-`, { fontSize: '14px', fill: '#fff' }).setInteractive();
        const damageButton = this.scene.add.text(-80, 30, `Damage    -${this.coinsRequiredDamage * 1} Coins-`, { fontSize: '14px', fill: '#fff' }).setInteractive();
        const healthButton = this.scene.add.text(-80, 60, `Health    -${this.coinsRequiredHealth * 1} Coins-`, { fontSize: '14px', fill: '#fff' }).setInteractive();

        const updatePrices = (quantity) => {
            speedButton.setText(`Speed    -${this.coinsRequiredSpeed * quantity} Coins-`);
            damageButton.setText(`Damage   -${this.coinsRequiredDamage * quantity} Coins-`);
            healthButton.setText(`Health   -${this.coinsRequiredHealth * quantity} Coins-`);
        };

        closeButton.on('pointerdown', () => {
            this.closeUpgradeWindow();
        });

        quantityInput.on('pointerdown', () => {
            let newQuantity = prompt('Enter amount:');
            if (newQuantity !== null) {
                newQuantity = parseInt(newQuantity, 10);
                if (!isNaN(newQuantity) && newQuantity > 0) {
                    quantityInput.setText(newQuantity);
                    updatePrices(newQuantity);
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
            this.upgradeWindow = null;
        }
    }

    interactWithCharacterSpeed(character, quantity) {
        const totalCost = this.coinsRequiredSpeed * quantity;
        if (CoinCounter.getCoins() >= totalCost) {
            SpeedManager.increaseSpeed(10 * quantity);
            CoinCounter.subtractCoins(totalCost);
            character.speed = SpeedManager.getSpeed();
            console.log(`Character speed increased by ${10 * quantity}! Remaining coins: ${CoinCounter.getCoins()}`);
            sceneEvents.emit('player-coins-changed', CoinCounter.getCoins());

            // Benachrichtigung anzeigen
            this.scene.showNotification(`Speed increased by ${10 * quantity}!`);
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

            // Benachrichtigung anzeigen
            this.scene.showNotification(`Damage increased by ${0.5 * quantity}!`);
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

            // Benachrichtigung anzeigen
            this.scene.showNotification(`Health increased by ${1 * quantity}!`);
        } else {
            console.log("Not enough coins to purchase Health-Upgrade!");
        }
    }

    update() {
        this.isInRange = this.scene.physics.overlap(this.scene.charakter, this);

        if (this.isInRange) {
            this.interactText.setVisible(true);
            this.interactText.setPosition(this.x + 10, this.y - 5);
        } else {
            this.interactText.setVisible(false);
        }
    }
}

export default Trader;
