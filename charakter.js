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
        if (!this.arrow) {
            return;
        }

        const parts = this.anims.currentAnim.key.split('-');
        const direction = parts[2];

        const vec = new Phaser.Math.Vector2(0, 0);

        switch (direction) {
            case 'up':
                vec.y = -1;
                break;
            
            case 'down':
                vec.y = 1;
                break;
            
            default:
            case 'side':
                if (this.scaleX < 0) {
                    vec.x = -1;
                } else {
                    vec.x = 1;
                }
                break;
        }

        const angle = vec.angle();
        const arrow = this.arrow.get(this.x, this.y, 'arrow');
        arrow.setRotation(angle);
        arrow.setVelocity(vec.x * 300, vec.y * 300);
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
    }

    update() {
        if (this.healthState === this.healthStates.DAMAGE || this.healthState === this.healthStates.DEAD) {
            return;
        }
        if (!this.cursors) {
            return;
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            this.shootArrow();
            return;
        }

        const speed = 70;
        let animKey = 'charakter-idle';

        if (this.cursors.left.isDown) {
            this.setVelocity(-speed, 0);
            this.scaleX = -1;
            this.body.offset.x = 56;
            animKey = 'charakter-walk';
        } else if (this.cursors.right.isDown) {
            this.setVelocity(speed, 0);
            this.scaleX = 1;
            this.body.offset.x = 44;
            animKey = 'charakter-walk';
        } else if (this.cursors.up.isDown) {
            this.setVelocity(0, -speed);
            animKey = 'charakter-walk';
        } else if (this.cursors.down.isDown) {
            this.setVelocity(0, speed);
            animKey = 'charakter-walk';
        } else {
            this.setVelocity(0, 0);
        }

        this.anims.play(animKey, true);
    }
}

export default Charakter;
