import Phaser from 'phaser';
import sceneEvents from '../events/EventsCenter.js';
import CoinCounter from '../CoinCounter.js';
import Charakter from '../Charakter.js';
import Orc from '../Orc.js';
import Trader from '../Trader.js';
import Necromancer from '../Necromancer.js';
import DamageManager from '../DamageManager.js';

class CharacterScene extends Phaser.Scene {
    constructor(key) {
        super({ key });
        this.charakter = null;
        this.cursors = null;
        this.orcs = null;
        this.necromancer = null;
        this.dmg = DamageManager.getDamage();
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
        this.physics.add.overlap(this.charakter, this.trader, () => {
            this.trader.interactWithCharacter(this.charakter);
        });
    }

    createNecromancer(x, y, texture, frame) {
        this.necromancer = new Necromancer(this, x, y, texture, frame);
        this.physics.add.existing(this.necromancer);
        this.necromancer.setCollideWorldBounds(true);
        this.add.existing(this.necromancer);
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

    handleSwordOrcCollision(swordHitbox, orc) {
        // Deaktiviere die Hitbox des Schwerts und mache sie unsichtbar
        swordHitbox.body.enable = false;
    
        // Zerstöre den Orc
        orc.destroy(true, true);
    
        // Füge Münzen hinzu und aktualisiere die Anzeige
        const coins = Phaser.Math.Between(50, 200);
        CoinCounter.addCoins(coins);
        CoinCounter.coinText(this, orc.x, orc.y, coins);
    
        // Emitiere Event zur Aktualisierung der Münzen
        sceneEvents.emit('player-coins-changed', CoinCounter.getCoins());
    }
    

    handleArrowOrcCollision(arrow, orc) {
        arrow.disableBody(false, true);
        orc.disableBody(true, true);
        const coins = Phaser.Math.Between(50, 200); // Between 50 and 200 coins per orc
        CoinCounter.addCoins(coins);

        CoinCounter.coinText(this, orc.x, orc.y, coins);

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
            this.add.text(charakter.x, charakter.y + 20, 'Please Restart.', { fontSize: '16px'}).setOrigin('0.5');
        }
    }

    handleNecromancerArrowCollision(necromancer, arrow) {
        arrow.destroy();
        necromancer.handleDamage(DamageManager.getDamage()); // Damage vom Pfeil
        necromancer.body.setVelocity(0, 0);
        necromancer.body.stop();
        
        if (necromancer.health <= 0) {
            necromancer.disableBody(true, true);
            const coins = Phaser.Math.Between(4000, 6000);
            CoinCounter.addCoins(coins);
            CoinCounter.coinText(this, necromancer.x, necromancer.y, coins);
            sceneEvents.emit('player-coins-changed', CoinCounter.getCoins());
        } else {
            // Teleportieren des Necromancers bei jedem Treffer
            let necromancerX = Phaser.Math.Between(300, 750);
            let necromancerY = Phaser.Math.Between(200, 600);
            necromancer.setPosition(necromancerX, necromancerY);
        }
    }

    update() {
        if (this.charakter._health <= 0) {
            charakter.destroy();
            this.add.text(charakter.x, charakter.y, 'Game Over!', { fontSize: '32px'}).setOrigin('0.5');
            this.add.text(charakter.x, charakter.y + 20, 'Please Restart.', { fontSize: '16px'}).setOrigin('0.5');
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

        if (this.necromancer) {
            this.necromancer.update();
        }
    }
}

export default CharacterScene;
