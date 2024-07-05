import Phaser from 'phaser';
import SpeedManager from './SpeedManager';
import HealthManager from './HealthManager';
import sceneEvents from './events/EventsCenter';
import CoinCounter from './CoinCounter';
import MapScene from './scenes/MapScene';

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
            spin: Phaser.Input.Keyboard.KeyCodes.R,
            bow: Phaser.Input.Keyboard.KeyCodes.SPACE,
            dash: Phaser.Input.Keyboard.KeyCodes.SHIFT,
            map: Phaser.Input.Keyboard.KeyCodes.M
        });

        this.bowShot = scene.sound.add('bowShot');
        this.dashSound = scene.sound.add('dash');
        this.walkGrass = scene.sound.add('walkGrass');

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
        this.dashSpeed = 300; // Dash-Geschwindigkeit
        this.dashDuration = 300; // Dauer des Dashes, 1000 = 1 sek
        this.dashCooldown = 1000; // Abklingzeit des Dashes, 1000 = 1sek
        this.lastDashTime = 0;

        // Schwert-Hitbox erstellen
        this.swordHitbox = scene.add.rectangle(0, 0, 20, 20, 0xff0000, 0);
        this.scene.physics.add.existing(this.swordHitbox);
        this.swordHitbox.setVisible(false);
        this.swordHitbox.body.enable = false;

        // Variable zur Verfolgung des Schwertschlags
        this.isSwingingSword = false;

        // Schwertwirbel Einstellungen
        this.isSpinning = false; // Zustand des Schwertwirbels
        this.spinSpeed = 0.3; // Rotation pro Millisekunde (2π für eine vollständige Umdrehung in 500ms)
        this.spinDuration = 5000; // Dauer des Schwertwirbels in Millisekunden
        this.spinCooldown = 10000; // Abklingzeit des Schwertwirbels
        this.lastSpinTime = 0;

        // Schwertwirbel Hitbox
        this.spinHitbox = scene.add.circle(0, 0, 40, 0xff0000, 0);
        this.scene.physics.add.existing(this.spinHitbox);
        this.spinHitbox.setVisible(false);
        this.spinHitbox.body.enable = false;

        this.mapVisible = false; // Zustand der Karte
        this.mapCooldown = 300;
        this.lastMapTime = 0; // Zeitpunkt der letzten Kartennutzung

        // Initialisiere die Karte (erstellt die MapScene, wenn nicht vorhanden)
        this.mapScene = this.scene.scene.get('MapScene') || this.scene.scene.add('MapScene', new MapScene());

        //Sound
        this.swingSound = this.scene.sound.add('swordSwing', {
            loop: true, // Wiederhole den Sound, solange er abgespielt wird
            volume: 0.5 // Lautstärke des Sounds
        });
        
    }

    toggleMap() {
        if (this.isMapVisible) {
            // Karte schließen
            this.scene.scene.stop('MapScene');
        } else {
            // Karte öffnen
            this.scene.scene.launch('MapScene');
        }
        this.isMapVisible = !this.isMapVisible;
    }

    startSwordSpin() {
        if (this.isSpinning || this.scene.time.now - this.lastSpinTime < this.spinCooldown) return;
    
        this.isSpinning = true;
        this.lastSpinTime = this.scene.time.now;
        this.spinTimer = this.scene.time.now;
    
        // Positioniere die Hitbox für den Wirbel am Charakter
        this.spinHitbox.setPosition(this.x, this.y);
        this.spinHitbox.setVisible(true);
        this.spinHitbox.body.enable = true;
    
        // Starte den Sound und lasse ihn 2 Mal wiederholen (insgesamt 3 Mal abspielen)
        if (this.spinSound) {
            this.spinSound.stop(); // Stoppe den Sound, wenn er schon läuft
        }
        
        this.spinSound = this.scene.sound.add('swordSpin', {
            volume: 0.5, // Lautstärke des Sounds
            loop: false // Kein Endlos-Loop
        });
    
        // Zählvariable für die Wiederholungen
        this.spinSoundRepeatCount = 0;
        const maxRepeats = 20; // Anzahl der Wiederholungen (2 Wiederholungen = 3 Mal abspielen)
    
        // Event-Handler für das Ende des Sounds
        this.spinSound.on('complete', () => {
            this.spinSoundRepeatCount++;
            if (this.spinSoundRepeatCount < maxRepeats) {
                this.spinSound.play();
            }
        });
    
        this.spinSound.play();
    
        this.scene.time.addEvent({
            delay: this.spinDuration,
            callback: () => {
                this.isSpinning = false;
                this.spinHitbox.setVisible(false);
                this.spinHitbox.body.enable = false;
                this.rotation = 0; // Setze die Rotation des Charakters zurück
    
                // Stoppe den Sound, wenn der Schwertwirbel endet
                if (this.spinSound) {
                    this.spinSound.stop();
                }
            },
            callbackScope: this
        });
    
        // Starte die Schwertwirbel-Animation
        this.anims.play('charakter-sword-spin', true);
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
    
        // Starte den SwordSwing-Sound, wenn die E-Taste gedrückt ist
        if (this.customKeys.sword.isDown && !this.swingSound.isPlaying) {
            this.swingSound.play();
        }
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
        this.dashSound.play({
            seek: 0.06,
            volume: 0.5
        });
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

    // Bestimme die Richtung basierend auf der letzten Blickrichtung
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

    // Berechne den Winkel für die Rotation des Pfeils
    const angle = vec.angle();

    // Erstelle und initialisiere den Pfeil
    const arrow = this.arrow.get(this.x, this.y, 'arrow');

    if (!arrow) {
        return;
    }

    // Setze die Größe des Pfeils
    if (vec.x !== 0) {
        arrow.setSize(arrow.width * 0.3, arrow.height * 0.3);
    } else {
        arrow.setSize(arrow.width * 0.3, arrow.height * 0.5);
    }

    // Setze die Richtung und Geschwindigkeit des Pfeils
    arrow.setActive(true).setVisible(true);
    arrow.setRotation(angle);
    arrow.setVelocity(vec.x * 300, vec.y * 300); // Passe die Geschwindigkeit nach Bedarf an

    // Verhindere, dass der Pfeil sofort wieder geschossen wird
    this.canShoot = false;
    this.lastShootTime = this.scene.time.now;

    this.bowShot.play({
        
    });
}


    coins(coin) {
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
    
        const now = this.scene.time.now;
    
        if (this.customKeys.map.isDown) {
            if (now - this.lastMapTime >= this.mapCooldown) {
                if (this.mapScene) {
                    this.toggleMap();
                }
                this.lastMapTime = now;
            }
        }
    
        if (this.customKeys.dash.isDown) {
            this.dash();
            animKey = 'charakter-dash';
        } else if (this.customKeys.spin.isDown && !this.isSwingingSword) {
            if (!this.isSpinning) {
                this.startSwordSpin();
            }
            animKey = 'charakter-sword-spin'; // Animation für den Schwertwirbel
        } else if (this.customKeys.sword.isDown && !this.isSwingingSword) {
            this.swingSword();
            animKey = 'charakter-sword'; // Animation für den Schwertschlag
        } else if (!this.customKeys.sword.isDown && this.swingSound.isPlaying) {
            // Stoppe den SwordSwing-Sound, wenn die E-Taste losgelassen wird
            this.swingSound.stop();
        } else if (this.customKeys.bow.isDown) {
            this.setVelocity(0, 0);
            animKey = 'charakter-bow';
            this.shootArrow();
        } else {
            // Bewegung
            let moveDirection = new Phaser.Math.Vector2(0, 0);
    
            if (this.customKeys.left.isDown) {
                moveDirection.x = -1;
            } else if (this.customKeys.right.isDown) {
                moveDirection.x = 1;
            }
    
            if (this.customKeys.up.isDown) {
                moveDirection.y = -1;
            } else if (this.customKeys.down.isDown) {
                moveDirection.y = 1;
            }
    
            if (moveDirection.x !== 0 && moveDirection.y !== 0) {
                moveDirection.normalize();
            }
    
            this.setVelocity(moveDirection.x * this.speed, moveDirection.y * this.speed);
    
            if (moveDirection.x !== 0 || moveDirection.y !== 0) {
                animKey = 'charakter-walk';
    
                // Richtungsabhängiger Flip & Blickrichtung
                if (moveDirection.x < 0) {
                    this.scaleX = -1; // Charakter nach links flippen
                    this.lastDirection = 'left';
                    this.body.offset.x = 56;
                } else if (moveDirection.x > 0) {
                    this.scaleX = 1; // Charakter nach rechts flippen
                    this.lastDirection = 'right';
                    this.body.offset.x = 44;
                }
    
                if (moveDirection.y < 0) {
                    this.lastDirection = 'up';
                } else if (moveDirection.y > 0) {
                    this.lastDirection = 'down';
                }
    
                // Spiel den walkGrass-Sound, wenn der Charakter sich bewegt und der Sound nicht bereits gespielt wird
                if (!this.walkGrass.isPlaying) {
                    this.walkGrass.play({ 
                        rate: 0.8,
                        volume: 0.45
                     });
                    
                }
    
            } else {
                this.setVelocity(0, 0);
    
                // Stoppe den walkGrass-Sound, wenn der Charakter stillsteht
                if (this.walkGrass.isPlaying) {
                    this.walkGrass.stop();
                }
            }
        }
    
        // Schwertwirbel-Logik
        if (this.isSpinning) {
            this.spinHitbox.setPosition(this.x - 5, this.y - 5);
            this.spinHitbox.body.setSize(30, 30); // Größe der Hitbox für den Wirbel
            this.spinHitbox.body.setCircle(20); // Kreisförmige Hitbox für den Wirbel
            this.rotation += this.spinSpeed; // Rotation des Charakters
        }
    
        if (!this.isSwingingSword && !this.isSpinning) {
            this.anims.play(animKey, true);
        }
    }

    // Methode, um den walkGrass-Sound nach einer bestimmten Anzahl von Wiederholungen zu stoppen
    setupWalkGrassSound() {
        this.walkGrass.on('complete', () => {
            this.walkGrassRepeatCount++;
            if (this.walkGrassRepeatCount < this.maxWalkGrassRepeats) {
                this.walkGrass.play();
            }
        });
    }
    
    
    
}

export default Charakter;
