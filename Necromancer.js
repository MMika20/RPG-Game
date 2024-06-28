import Phaser from 'phaser';
import sceneEvents from './events/EventsCenter'; // Annahme: Event-Center korrekt importiert
import Charakter from './Charakter'; // Annahme: Charakter korrekt importiert

class Necromancer extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.body.setSize(this.width * 0.3, this.height * 0.4); // Anpassung der Hitbox-Größe
        this.body.setOffset(55, 60);

        this.scene = scene;
        this._health = 20;
        this.lastShootTime = 0;
        this.shootCooldown = 2000; // 2 Sekunden

    }

    create(){
        // Ground-Layer erstellen und Kollisionen aktivieren
        const objectLayer = map.createLayer("Objects", tileset, 0, 0);
        objectLayer.setCollisionByProperty({ collides: true });

    }
    
    get health() {
        return this._health;
    }

    shootFireball(target) {
        this.play('necromancer-shoot', true); // Starte die Schießanimation

        const vec = new Phaser.Math.Vector2(target.x - this.x, target.y - this.y);
        vec.normalize();

        const angle = vec.angle();

        const fireball = this.scene.physics.add.sprite(this.x, this.y, 'fireball');
        fireball.setRotation(angle);
        fireball.setVelocity(vec.x * 200, vec.y * 200); // Geschwindigkeit des Fireballs
        fireball.body.setSize(20, 20);

        // Kollisionserkennung mit dem Charakter
        this.scene.physics.add.collider(fireball, this.scene.charakter, (fireball, charakter) => {
            charakter.handleDamage(new Phaser.Math.Vector2(vec.x * 100, vec.y * 100)); // Schaden am Charakter
            fireball.destroy(); // Fireball nach Kollision zerstören
            sceneEvents.emit('player-health-changed', this.scene.charakter.health); // Event auslösen
        });

        fireball.on('animationcomplete', () => {
            this.play('necromancer-idle'); // Zurück zur Idle-Animation
        });
    }

    handleDamage(damage) {
        this._health -= damage;
        if (this._health <= 0) {
            this.destroy; // Zerstöre die Necromancer-Instanz
            
            // Timer für die Teleportation des Charakters starten
            this.scene.time.delayedCall(5000, () => {
                const charakter = this.scene.charakter;
                if (charakter) {

                    // Zurück zur MainMap-Szene mit aktualisierten Daten
                    this.scene.scene.start('MainMap', { charakter: charakter, from: 'NecromancerBattle' });
                }
            });
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this._health > 0 && time > this.lastShootTime + this.shootCooldown) {
            this.lastShootTime = time;
            this.shootFireball(this.scene.charakter);
        }
    }
}

export default Necromancer;
