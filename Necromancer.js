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
        this._health = 20;  // Bossleben
        this.lastShootTime = 0;
        this.shootCooldown = 2000; // 2 Sekunden

        this.lastSprintTime = 0;
        this.sprintCooldown = 12000; // 15 Sekunden
        this.sprintSpeed = 500; // Geschwindigkeit des Sprints

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
        this.scene.physics.add.collider(Necromancer, this.scene.charakter);
        this.scene.physics.add.collider(fireball, this.scene.charakter, (fireball, charakter) => {
            charakter.handleDamage(new Phaser.Math.Vector2(vec.x * 100, vec.y * 100)); // Schaden am Charakter
            fireball.destroy(); // Fireball nach Kollision zerstören
            sceneEvents.emit('player-health-changed', this.scene.charakter.health); // Event auslösen
        });

        fireball.on('animationcomplete', () => {
            this.play('necromancer-idle'); // Zurück zur Idle-Animation
        });

        if (this.scene.charakter._health <= 0) {
            this.scene.charakter.destroy();
            this.scene.add.text(this.scene.charakter.x, this.scene.charakter.y - 20, 'Game Over!', { fontSize: '40px'}).setOrigin('0.5');
            this.scene.add.text(this.scene.charakter.x, this.scene.charakter.y + 20, 'Please Restart.', { fontSize: '24px'}).setOrigin('0.5');
        }
    }

    sprintToTarget(target) {

        // Berechne die Richtung zum Ziel
        const targetVec = new Phaser.Math.Vector2(target.x - this.x, target.y - this.y);
        targetVec.normalize();

        // Setze die Geschwindigkeit und bewege den Necromancer
        this.setVelocity(targetVec.x * this.sprintSpeed, targetVec.y * this.sprintSpeed);

        // Stoppe die Bewegung nach kurzer Zeit
        this.scene.time.delayedCall(500, () => {
            this.setVelocity(0, 0);
            this.play('necromancer-idle'); // Zurück zur Idle-Animation
        });
    }

    handleDamage(damage) {
        this._health -= damage;
        if (this._health <= 0) {
            this.destroy; // Zerstöre die Necromancer-Instanz
            
            // Timer für die Teleportation des Charakters starten
            this.scene.time.delayedCall(5000, () => {  // Zeit nach Boss bis zur Teleportation
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
    
        // Überprüfen, ob der Necromancer bereit ist, eine neue Feuerball-Attacke auszulösen
        if (this._health > 0 && time > this.lastShootTime + this.shootCooldown) {
            this.lastShootTime = time;
    
            // Delay zwischen den einzelnen Schüssen
            const delayBetweenShots = 300; // Millisekunden
            const numberOfShots = Phaser.Math.Between(2, 5);
    
            // Schießen von Feuerbällen mit Verzögerung
            for (let i = 0; i < numberOfShots; i++) {
                this.scene.time.delayedCall(i * delayBetweenShots, () => {
                    this.shootFireball(this.scene.charakter);
                });
            }
        }

        if (this._health > 0 && time > this.lastSprintTime + this.sprintCooldown) {
            this.lastSprintTime = time;
            this.sprintToTarget(this.scene.charakter); // Lasse den Necromancer zum Charakter sprinten
        }
    }
    
}

export default Necromancer;
