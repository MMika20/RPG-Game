import Phaser from 'phaser';
import SpeedManager from './SpeedManager';
import CoinCounter from './CoinCounter';
import sceneEvents from './events/EventsCenter';

class Charakter extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.body.setSize(this.width * 0.12, this.height * 0.16);

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.customKeys = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            sword: Phaser.Input.Keyboard.KeyCodes.E,
            bow: Phaser.Input.Keyboard.KeyCodes.SPACE,
            dash: Phaser.Input.Keyboard.KeyCodes.SHIFT
        });

        this.healthStates = {
            IDLE: 'IDLE',
            DAMAGE: 'DAMAGE',
            DEAD: 'DEAD'
        };

        this.healthState = this.healthStates.IDLE;
        this.damageTime = 0;

        this._health = 5;
        this.lastDirection = 'right';
        this.canShoot = true;
        this.shootCooldown = 540;
        this.lastShootTime = 0;
        this.isSwingingSword = false;
        this.speed = SpeedManager.getSpeed();

        // Schwert-Hitbox erstellen
        this.swordHitbox = scene.add.rectangle(0, 0, 20, 10, 0xff0000, 0);
        scene.physics.add.existing(this.swordHitbox);
        this.swordHitbox.body.enable = false;
        this.swordHitbox.body.setAllowGravity(false); // Schwerkraft deaktivieren

        // Schwert-Hitbox zur Physik-Gruppe hinzufügen
        this.swordHitboxGroup = scene.physics.add.group(this.swordHitbox);
    }

swingSword() {
    if (this.isSwingingSword || this.healthState === this.healthStates.DAMAGE) {
        return;
    }

    this.isSwingingSword = true;
    this.anims.play('charakter-sword');

    // Hitbox positionieren und aktivieren
    this.updateSwordHitbox();
    this.swordHitbox.body.enable = true;

    this.once('animationcomplete', (animation) => {
        if (animation.key === 'charakter-sword') {
            this.isSwingingSword = false;
            this.swordHitbox.body.enable = false; // Hitbox deaktivieren
            this.swordHitbox.setPosition(-100, -100); // Setze Hitbox außerhalb der Spielwelt
        }
    });


    }
    dash() {
        if (this.healthState === this.healthStates.DAMAGE || this.healthState === this.healthStates.DEAD) {
            return;
        }
    
        const dashSpeed = 400; // Beispiel für die Dash-Geschwindigkeit
        const dashDuration = 200; // Beispiel für die Dauer des Dashes in Millisekunden
    
        let velocityX = 0;
        let velocityY = 0;
    
        switch (this.lastDirection) {
            case 'left':
                velocityX = -dashSpeed;
                break;
            case 'right':
                velocityX = dashSpeed;
                break;
            case 'up':
                velocityY = -dashSpeed;
                break;
            case 'down':
                velocityY = dashSpeed;
                break;
        }
    
        this.setVelocity(velocityX, velocityY);
    
        // Setze einen Timer, um den Dash nach der angegebenen Dauer zu beenden
        this.scene.time.delayedCall(dashDuration, () => {
            this.setVelocity(0, 0); // Setze die Geschwindigkeit auf Null, um den Dash zu beenden
        }, [], this);
    }

    // In der Charakter-Klasse

updateSwordHitbox() {
    let offsetX = 0, offsetY = 0;
    const hitboxWidth = 20, hitboxHeight = 10;

    switch (this.lastDirection) {
        case 'left':
            offsetX = -hitboxWidth;
            break;
        case 'right':
            offsetX = hitboxWidth;
            break;
        case 'up':
            offsetY = -hitboxHeight;
            break;
        case 'down':
            offsetY = hitboxHeight;
            break;
    }

    this.swordHitbox.setPosition(this.x + offsetX, this.y + offsetY);
}


    get health() {
        return this._health;
    }

    setArrow(arrow) {
        this.arrow = arrow;
    }

    handleDamage(dir) {
        if (this._health <= 0 || this.healthState === this.healthStates.DEAD) {
            return;
        }

        --this._health;

        if (this._health <= 0) {
            this.healthState = this.healthStates.DEAD;
            this.anims.play('charakter-death');
            this.setVelocity(0, 0);
        } else {
            this.setVelocity(dir.x, dir.y);
            this.setTint(0xff0000);
            this.healthState = this.healthStates.DAMAGE;
            this.damageTime = 0;
        }
    }

    shootArrow() {
        if (!this.arrow || !this.canShoot) {
            return;
        }

        const vec = new Phaser.Math.Vector2(0, 0);

        switch (this.lastDirection) {
            case 'up':
                vec.y = -1;
                break;
            case 'down':
                vec.y = 1;
                break;
            case 'left':
                vec.x = -1;
                break;
            case 'right':
            default:
                vec.x = 1;
                break;
        }

        const angle = vec.angle();
        const arrow = this.arrow.get(this.x, this.y, 'arrow');

        if (!arrow) {
            return;
        }

        if (vec.x !== 0) {
            arrow.setSize(arrow.width * 0.3, arrow.height * 0.3);
        } else {
            arrow.setSize(arrow.width * 0.3, arrow.height * 0.5);
        }

        arrow.setActive(true).setVisible(true);
        arrow.setRotation(angle);
        arrow.setVelocity(vec.x * 300, vec.y * 300);

        this.canShoot = false;
        this.lastShootTime = this.scene.time.now;
    }

    coins(coin){
        return Phaser.Math.Between(50, 200);
    }

    preUpdate(t, delta) {
        super.preUpdate(t, delta);

        switch (this.healthState) {
            case this.healthStates.IDLE:
                break;
            case this.healthStates.DAMAGE:
                this.damageTime += delta;
                if (this.damageTime >= 250) {
                    this.healthState = this.healthStates.IDLE;
                    this.setTint(0xffffff);
                    this.damageTime = 0;
                }
                break;
        }

        if (!this.canShoot && this.scene.time.now - this.lastShootTime >= this.shootCooldown) {
            this.canShoot = true;
        }
    }
/*
    increaseSpeed() {
        this.SpeedManager.increaseSpeed(50); // Beispielhafte Erhöhung der Geschwindigkeit um 10
        console.log(`Character speed increased to ${this.speed}`);
    }*/

    update() {
        if (this.healthState === this.healthStates.DAMAGE || this.healthState === this.healthStates.DEAD) {
            return;
        }

        let animKey = 'charakter-idle';

        if (this.customKeys.left.isDown) {
            this.setVelocity(-this.speed, 0);
            this.scaleX = -1;
            this.body.offset.x = 56;
            animKey = 'charakter-walk';
            this.lastDirection = 'left';
        } else if (this.customKeys.right.isDown) {
            this.setVelocity(this.speed, 0);
            this.scaleX = 1;
            this.body.offset.x = 44;
            animKey = 'charakter-walk';
            this.lastDirection = 'right';
        } else if (this.customKeys.up.isDown) {
            this.setVelocity(0, -this.speed);
            animKey = 'charakter-walk';
            this.lastDirection = 'up';
        } else if (this.customKeys.down.isDown) {
            this.setVelocity(0, this.speed);
            animKey = 'charakter-walk';
            this.lastDirection = 'down';
        } else if (this.customKeys.bow.isDown) {
            this.setVelocity(0, 0);
            animKey = 'charakter-bow';
            this.shootArrow();
        } else if (this.customKeys.sword.isDown) {
            this.setVelocity(0, 0);
            animKey = 'charakter-sword';
            this.swingSword();
        } else if (this.customKeys.dash.isDown) {
            this.setVelocity(0, 0);
            this.dash();
            animKey = 'charakter-dash';
        }else {
            this.setVelocity(0, 0);
        }

        this.anims.play(animKey, true);

        // Kollisionserkennung zwischen Schwert-Hitbox und Orks
        this.scene.physics.world.overlap(this.swordHitbox, this.scene.orcs, this.hitOrk, null, this);
    }

    hitOrk(swordHitbox, ork) {
        ork.destroy(); // Entfernt den Ork
        const coins = Phaser.Math.Between(50, 200); // Zwischen 50 bis 200 Coins pro Orc
        CoinCounter.addCoins(coins);

        sceneEvents.emit('player-coins-changed', CoinCounter.getCoins());
    }
}

export default Charakter;
