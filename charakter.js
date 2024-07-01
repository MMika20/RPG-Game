import Phaser from 'phaser';
import SpeedManager from './SpeedManager';
import HealthManager from './HealthManager';
import sceneEvents from './events/EventsCenter';

class Charakter extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.body.setSize(this.width * 0.10, this.height * 0.12);

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

        this._health = HealthManager.getHealth(); // Tatsächliche Herzen des Charakters
        this.lastDirection = 'right';
        this.canShoot = true;
        this.shootCooldown = 540;
        this.lastShootTime = 0;
        this.speed = SpeedManager.getSpeed();

        // Dash Einstellungen
        this.isDashing = false; // Zustand des Dash
        this.dashSpeed = 400; // Dash-Geschwindigkeit
        this.dashDuration = 200; // Dauer des Dashes, 1000 = 1 sek
        this.dashCooldown = 1000; // Abklingzeit des Dashes, 1000 = 1sek

        // Schwert-Hitbox erstellen
        this.swordHitbox = scene.add.rectangle(0, 0, 20, 20, 0xff0000, 0);
        this.scene.physics.add.existing(this.swordHitbox);

        // Initiale Deaktivierung der Hitbox
        this.swordHitbox.setVisible(false);
        this.swordHitbox.body.enable = false;
        
        // Variable zur Verfolgung des Schwertschlags
        this.isSwingingSword = false;
    }

    swingSword() {
        if (this.isSwingingSword || this.healthState === this.healthStates.DAMAGE) {
            return;
        }

        this.isSwingingSword = true;

        // Positioniere die Hitbox basierend auf der letzten Blickrichtung
        const offsets = {
            left: { x: -10, y: 0 },
            right: { x: 10, y: 0 },
            up: { x: 0, y: -10 },
            down: { x: 0, y: 10 }
        };
        
        const offset = offsets[this.lastDirection];
        this.swordHitbox.setPosition(this.x + offset.x, this.y + offset.y);
        

        // Aktiviere die Kollisionserkennung der Hitbox
        this.swordHitbox.setVisible(true);
        this.swordHitbox.body.enable = true;

        // Deaktiviere die Hitbox nach einer kurzen Verzögerung
        this.scene.time.delayedCall(20, () => {
            this.swordHitbox.setVisible(false);
            this.swordHitbox.body.enable = false;
            this.isSwingingSword = false;
        });

        // Starte die Schwertschlag-Animation
        this.anims.play('charakter-sword', true);
    }

    dash() {
        if (this.isDashing || this.scene.time.now - this.lastDashTime < this.dashCooldown) {
            return;
        }

        this.isDashing = true;
        this.lastDashTime = this.scene.time.now;

        const dashDirection = new Phaser.Math.Vector2(0, 0);

        if (this.customKeys.left.isDown) {
            dashDirection.x = -1;
        } else if (this.customKeys.right.isDown) {
            dashDirection.x = 1;
        } else if (this.customKeys.up.isDown) {
            dashDirection.y = -1;
        } else if (this.customKeys.down.isDown) {
            dashDirection.y = 1;
        } else {
            // Falls keine Richtungstaste gedrückt ist, verwende die letzte Richtung
            switch (this.lastDirection) {
                case 'left':
                    dashDirection.x = -1;
                    break;
                case 'right':
                    dashDirection.x = 1;
                    break;
                case 'up':
                    dashDirection.y = -1;
                    break;
                case 'down':
                    dashDirection.y = 1;
                    break;
            }
        }

        dashDirection.normalize();

        this.setVelocity(dashDirection.x * this.dashSpeed, dashDirection.y * this.dashSpeed);

        this.scene.time.delayedCall(this.dashDuration, () => {
            this.isDashing = false;
            this.setVelocity(0, 0); // Setze die Geschwindigkeit auf Null, um den Dash zu beenden
        });
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
        HealthManager.setHealth(this._health);

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

        sceneEvents.emit('player-health-changed', this._health);
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

    update() {
        if (this.healthState === this.healthStates.DAMAGE || this.healthState === this.healthStates.DEAD) {
            return;
        }

        let animKey = 'charakter-idle';

        if (this.customKeys.dash.isDown) {
            this.dash();
            animKey = 'charakter-dash';
        } else {
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
                this.swingSword();
                animKey = 'charakter-sword'
            } else {
                this.setVelocity(0, 0);
            }
        }

        if (!this.isSwingingSword) {
            this.anims.play(animKey, true);
        }
    }
}

export default Charakter;
