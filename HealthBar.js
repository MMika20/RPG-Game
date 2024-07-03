import Phaser from 'phaser';

class HealthBar extends Phaser.GameObjects.Container {
    constructor(scene, x, y, maxHealth) {
        super(scene, x, y);

        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;

        this.draw();

        scene.add.existing(this);
    }

    draw() {
        this.bar.clear();

        // Hintergrundfarbe Healthbar (schwarz)
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(-20, -5, 40, 5);

        // Healthbar Farbe (Rot)
        this.bar.fillStyle(0xff0000);
        this.bar.fillRect(-20, -5, 40 * (this.currentHealth / this.maxHealth), 5);

        this.add(this.bar);
    }

    setPercentage(percentage) {
        this.currentHealth = this.maxHealth * Phaser.Math.Clamp(percentage, 0, 1);
        this.draw();
    }
}

export default HealthBar;
