import Phaser from 'phaser';

class Orc extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // Scene und Physics geaddet
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Enemy Einstellungen
        this.body.setSize(this.width * 0.12, this.height * 0.16); // Größe
        this.speed = 35;   // Geschwindigkeit erhöht für bessere Verfolgung
        this.attackRange = 85
        this.direction = Phaser.Math.RND.pick(['left', 'right', 'up', 'down', 'idle']); // Random direction auswählen

        this.flipX = false; // Für umdrehen der Animation
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        const character = this.scene.charakter; // Referenz auf den Charakter aus der Szene
        if (character) {
            const distance = Phaser.Math.Distance.Between(this.x, this.y, character.x, character.y);
            if (distance < this.attackRange) { // Wenn der Charakter in Reichweite ist (200 Pixel)
                this.moveToCharacter(character);
            } else {
                this.randomMovement(time, delta);
            }
        }
    }

    moveToCharacter(character) {
        const directionX = character.x - this.x;
        const directionY = character.y - this.y;

        const angle = Math.atan2(directionY, directionX);
        this.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);

        if (Math.abs(directionX) > Math.abs(directionY)) {
            this.flipX = directionX < 0;
        }

        this.anims.play('enemy-walk', true);
    }

    randomMovement(time, delta) {
        // Zufällige Bewegungslogik, wenn der Charakter nicht in Reichweite ist
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

        if (time % 2000 < delta) { // 1000 = 1 sek
            this.direction = Phaser.Math.RND.pick(['left', 'right', 'up', 'down', 'idle']);
        }
    }

    idle() {
        this.setVelocity(0);
    }
}

export default Orc;
