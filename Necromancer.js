import Phaser from 'phaser';

class Necromancer extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.body.setSize(this.width * 0.8, this.height * 0.8); // Beispielhafte Hitbox-Größe

        this.health = 15; // Lebenspunkte des Necromancers
        this.shootCooldown = 2000; // Schussabklingzeit
        this.lastShootTime = 0;

        this.speed = 80; // Geschwindigkeit des Necromancers
        this.attackRange = 200; // Angriffsreichweite für Pfeile

        // Variable zur Verfolgung des Spielers
        this.player = null;
    }

    setPlayer(player) {
        this.player = player;
    }

    update() {
        if (!this.player || this.health <= 0) {
            return;
        }

        // Verfolge den Spieler und greife an, wenn in Reichweite
        const distance = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);

        if (distance < this.attackRange && this.scene.time.now - this.lastShootTime > this.shootCooldown) {
            this.shootArrowTowardsPlayer();
        }

        // Beispiel: Bewegungslogik (kann je nach Spielanforderungen angepasst werden)
        this.moveTowardsPlayer();

        this.anims.play('necromancer-idle');
    }

    moveTowardsPlayer() {
        if (!this.player) {
            return;
        }

        const angle = Phaser.Math.Angle.BetweenPoints(this, this.player);
        this.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);

        // Beispiel: Animation und Orientierung basierend auf der Bewegungsrichtung
        if (Math.abs(angle) > Math.PI / 2) {
            this.scaleX = 1; // Links schauen
        } else {
            this.scaleX = -1; // Rechts schauen
        }
    }

    shootArrowTowardsPlayer() {
        const angle = Phaser.Math.Angle.BetweenPoints(this, this.player);

        // Beispiel für das Erstellen eines Pfeils
        const arrow = this.scene.physics.add.sprite(this.x, this.y, 'arrow');
        arrow.setRotation(angle);
        arrow.setVelocity(Math.cos(angle) * 200, Math.sin(angle) * 200);

        // Beispiel für die Kollisionserkennung oder andere Logik nach dem Schuss

        // Setze die Schussabklingzeit
        this.lastShootTime = this.scene.time.now;
    }

    takeDamage(damage) {
        this.health -= damage;

        if (this.health <= 0) {
            // Logik für den Tod des Necromancers hier einfügen, z.B. Animation abspielen, Objekt entfernen, etc.
            this.destroy();
        }
    }
}

export default Necromancer;
