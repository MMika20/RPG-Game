import Phaser from 'phaser';

class Orc extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // Scene und Physics geaddet
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Enemy Einstellungen
        this.body.setSize(this.width * 0.12, this.height * 0.16); // Größe
        this.speed = 20;   // Geschwindigkeit

        this.direction = Phaser.Math.RND.pick(['left', 'right', 'up', 'down', 'idle']); // Random direction auswählen

        //this.anims.play('enemy-idle');
        this.flipX = false; // Für umdrehen der Animation
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // Implement movement logic here
        switch (this.direction) {
            case 'left':
                this.setVelocityX(-this.speed);
                this.flipX = true;
                break;
            case 'right':
                this.setVelocityX(this.speed);
                this.flipX = false;
                break;
            case 'up':
                this.setVelocityY(-this.speed);
                break;
            case 'down':
                this.setVelocityY(this.speed);
                break;
            case 'idle':
                this.setVelocity(0);
                break;
        }

        if (this.direction !== 'idle') {
            this.anims.play('enemy-walk', true);
        } else {
            this.anims.play('enemy-idle', true);
        }

        // Einstellung für wie lange er in eine Richtung läuft
        if (time % 2000 < delta) { // 1000 = 1 sek
            this.direction = Phaser.Math.RND.pick(['left', 'right', 'up', 'down', 'idle']);
        }
    }

    idle() {
        this.setVelocity(0);
    }
}

export default Orc;
