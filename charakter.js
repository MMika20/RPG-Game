import Phaser from 'phaser';

class Charakter extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.body.setSize(this.width * 0.12, this.height * 0.16);

        this.cursors = scene.input.keyboard.createCursorKeys();

        this.healthStates = {
            IDLE: 'IDLE',
            DAMAGE: 'DAMAGE',
            DEAD: 'DEAD'
        };

        this.healthState = this.healthStates.IDLE;
        this.damageTime = 0;

        // Tatsächliche Herzen
        this._health = 5;

        // Letzte Bewegungsrichtung
        this.lastDirection = 'right';

        // Pfeil-Cooldown
        this.canShoot = true;
        this.shootCooldown = 525; // 1000 = 1 sek
        this.lastShootTime = 0;

        this.isSwingingSword = false;
    }

    swingSword(){
        if (this.isSwingingSword || this.healthState === this.healthStates.DAMAGE){
            return;
        }

        this.isSwingingSword = true;
        this.anims.play('charakter-sword');
        this.anims.currentAnim.on('complete', () => {
            this.isSwingingSword = false
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

        // Cooldown aktivieren
        this.canShoot = false;
        this.lastShootTime = this.scene.time.now;

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

        // Pfeil-Cooldowntimer überprüfen
        if (!this.canShoot && this.scene.time.now - this.lastShootTime >= this.shootCooldown) {
            this.canShoot = true;
        }
    }

    update() {
        if (this.healthState === this.healthStates.DAMAGE || this.healthState === this.healthStates.DEAD) {
            return;
        }
        if (!this.cursors) {
            return;
        }
    
        const speed = 70;
        let animKey = 'charakter-idle';

        if (this.cursors.left.isDown) {
            this.setVelocity(-speed, 0);
            this.scaleX = -1;
            this.body.offset.x = 56;
            animKey = 'charakter-walk';
            this.lastDirection = 'left';
        } else if (this.cursors.right.isDown) {
            this.setVelocity(speed, 0);
            this.scaleX = 1;
            this.body.offset.x = 44;
            animKey = 'charakter-walk';
            this.lastDirection = 'right';
        } else if (this.cursors.up.isDown) {
            this.setVelocity(0, -speed);
            animKey = 'charakter-walk';
            this.lastDirection = 'up';
        } else if (this.cursors.down.isDown) {
            this.setVelocity(0, speed);
            animKey = 'charakter-walk';
            this.lastDirection = 'down';
        } else if (this.cursors.space.isDown) {
            this.setVelocity(0, 0);
            animKey = 'charakter-bow';
            this.shootArrow();
        } else {
            this.setVelocity(0, 0);
        }

        this.anims.play(animKey, true);
    }
}

export default Charakter;
