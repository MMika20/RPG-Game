import Phaser from 'phaser';
import sceneEvents from '../events/EventsCenter.js';
import CoinCounter from '../CoinCounter.js';
import Charakter from '../Charakter.js';
import Orc from '../Orc.js';
import Trader from '../Trader.js';
import SpeedManager from '../SpeedManager.js';

class CharacterScene extends Phaser.Scene {
    constructor(key) {
        super({ key });
        this.charakter = null;
        this.cursors = null;
        this.orcs = null;
    }

    createCharacter(x, y, texture, frame) {
        if (!this.charakter) {
            this.charakter = new Charakter(this, x, y, texture, frame);
            this.add.existing(this.charakter);
            this.physics.add.existing(this.charakter);
            this.charakter.setCollideWorldBounds(true);
        } else {
            this.charakter.setPosition(x, y);
        }
    }

    createTrader(x, y, texture, frame) {
        this.trader = new Trader(this, x, y, texture, frame);
        this.physics.add.existing(this.trader);
        this.physics.add.overlap(this.character, this.trader, () => {
            this.trader.interactWithCharacter(this.character);
        });
    }

    createArrowGroup() {
        return this.physics.add.group();
    }

    createOrcGroup() {
        const orcs = this.physics.add.group({ classType: Orc });
        return orcs;
    }

    createTransitionZone(x, y, width, height, callback) {
        const zone = this.add.zone(x, y, width, height);
        this.physics.world.enable(zone);
        this.physics.add.overlap(this.charakter, zone, callback, null, this);
    }

    handleArrowWallCollision(arrow, objectLayer) {
        arrow.setActive(false).setVisible(false);
    }

    handleArrowOrcCollision(arrow, orc) {
        CoinCounter.getCoins;
        arrow.disableBody(false, true);
        orc.disableBody(true, true);
        const coins = Phaser.Math.Between(50, 200); // Zwischen 50 bis 200 Coins pro Orc
        CoinCounter.addCoins(coins);
        
        const coinsText = this.add.text(orc.x, orc.y, `+${coins}`, { fontSize: '12px', fill: '#ffffff' }).setOrigin(0.5);

        // Timer, um den Text nach kurzer Zeit zu entfernen
        this.time.delayedCall(1000, () => {
            coinsText.destroy();
        });

        sceneEvents.emit('player-coins-changed', CoinCounter.getCoins());
    }

    handlePlayerOrcCollision(charakter, orc) {
        const dx = charakter.x - orc.x;
        const dy = charakter.y - orc.y;
        const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

        charakter.handleDamage(dir);
        sceneEvents.emit('player-health-changed', charakter.health);

        if (charakter.health <= 0) {
        charakter.destroy();
        this.add.text(charakter.x, charakter.y, 'Game Over!', { fontSize: '32px'}).setOrigin('0.5');
        this.add.text(charakter.x, charakter.y+20, 'Please Restart.', { fontSize: '16px'}).setOrigin('0.5');
       }
    }

    updateCharacterAndOrcs() {
        if (this.charakter) {
            this.charakter.update();
        }

        if (this.orcs) {
            this.orcs.getChildren().forEach(orc => {
                if (orc.idle) {
                    orc.idle();
                }
            });
        }
    }
}

export default CharacterScene;
