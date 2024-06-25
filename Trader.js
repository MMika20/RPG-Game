// Trader.js

import Phaser from 'phaser';
import SpeedManager from './SpeedManager';
import CoinCounter from './CoinCounter';

class Trader extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setInteractive();
        this.coinsRequired = 2000; // Anzahl der benötigten Coins für das Speed-Upgrade
    }

    interactWithCharacter(character) {
        if (CoinCounter.getCoins() >= this.coinsRequired) {
            SpeedManager.increaseSpeed(10); // Beispiel: Erhöhung um 50 Einheiten
            CoinCounter.subtractCoins(this.coinsRequired);

            // Aktualisierung der Charakter-Geschwindigkeit
            character.speed = SpeedManager.getSpeed();

            console.log(`Character speed increased! Remaining coins: ${CoinCounter.getCoins()}`);
        } else {
            console.log("Not enough coins to purchase speed upgrade!");
        }
    }
}

export default Trader;
