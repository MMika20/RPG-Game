// Trader.js

import Phaser from 'phaser';
import SpeedManager from './SpeedManager';
import CoinCounter from './CoinCounter';
import DamageManager from './DamageManager';
import CharacterScene from './scenes/CharacterScene';

class Trader extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setInteractive();
        this.coinsRequiredSpeed = 2000; // Anzahl der benötigten Coins für das Speed-Upgrade
        this.coinsRequiredDamage= 3000; // " für Damage-Upgrade
    }

    interactWithCharacterSpeed(character) {
        if (CoinCounter.getCoins() >= this.coinsRequiredSpeed) {
            SpeedManager.increaseSpeed(10); // Beispiel: Erhöhung um 50 Einheiten
            CoinCounter.subtractCoins(this.coinsRequiredSpeed);

            // Aktualisierung der Charakter-Geschwindigkeit
            character.speed = SpeedManager.getSpeed();

            console.log(`Character speed increased! Remaining coins: ${CoinCounter.getCoins()}`);
        } else {
            console.log("Not enough coins to purchase speed upgrade!");
        }
    }

    interactWithCharacterDamage(character){
        if (CoinCounter.getCoins() >= this.coinsRequiredDamage){
            DamageManager.increaseDamage(1);
            CoinCounter.subtractCoins(this.coinsRequiredDamage);

            DamageManager.increaseDamage(1);

            console.log(`Dmg wurde increased! Remaining coins: ${CoinCounter.getCoins()}`);
        } else {
            console.log("Not enough coins to purchase Damage upgrade!");
        }
    }
}

export default Trader;
