import Phaser from 'phaser';

class Charakter extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.body.setSize(this.width * 0.12, this.height * 0.16);

        this.cursors = scene.input.keyboard.createCursorKeys();

        this.HealthState = {
            IDLE: 'IDLE',
            DAMAGE: 'DAMAGE'
        };
 
        this.HealthState = HealthState.IDLE;
        this.damageTime = 0;
    }

    handleDamage(dir) {
        if (this.HealthState === HealthState.DAMAGE) {
            return;
        }
        this.setVelocity(dir.x, dir.y);

        this.setTint(0xff0000);

        this.HealthState = this.HealthState.DAMAGE;
        this.damageTime = 0;
    }

    preUpdate(t, delta) {
        super.preUpdate(t, delta);

        switch (this.healthState) {
            case this.HealthState.IDLE:
                break;

            case HealthState.DAMAGE:
                this.damageTime += delta;
                if (this.damageTime >= 250) {
                    this.healthState = this.HealthState.IDLE;
                    this.setTint(0xffffff);
                    this.damageTime = 0;
                }
                break;
        }
    }

    update() {
        if (this.healthState === this.HealthState.DAMAGE){
            return
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
