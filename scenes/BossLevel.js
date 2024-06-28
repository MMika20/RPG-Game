import Phaser from 'phaser';
import Necromancer from '../Necromancer'; // Stelle sicher, dass der Pfad korrekt ist und Necromancer existiert
import CharacterScene from './CharacterScene'; // Stelle sicher, dass der Pfad korrekt ist und CharacterScene existiert
import createCharakterAnims from '../anims/createCharakterAnims'; // Stelle sicher, dass der Pfad korrekt ist und createCharakterAnims existiert
import Charakter from '../Charakter'; // Stelle sicher, dass der Pfad korrekt ist und Charakter existiert
import createNecromancerAnims from '../anims/createNecromancerAnims'; // Stelle sicher, dass der Pfad korrekt ist und createNecromancerAnims existiert
import createOrcAnims from '../anims/createOrcAnims';
import Orc from '../Orc';

class BossLevel extends CharacterScene {
    constructor() {
        super('BossLevel');
        this.necromancer = null;
        this.orcs = null;
    }

    create(data) {
        // Spezifische Szene Implementierungen
        const map = this.make.tilemap({ key: "bossLevel", tileWidth: 64, tileHeight: 45 });
        const tileset = map.addTilesetImage("RPG_Map_Tileset", "tiles1");

        // Ground-Layer erstellen und Kollisionen aktivieren
        map.createLayer("Ground", tileset, 0, 0);
        const objectLayer = map.createLayer("Objects", tileset, 0, 0);

        // Setze die Kollisionseigenschaften für die Objektschicht
        objectLayer.setCollisionByProperty({ collides: true });

        // Gemeinsame Initialisierungen
        this.cursors = this.input.keyboard.createCursorKeys();

        // Entfernen aller existierenden Orks und des Charakters
        if (this.charakter) {
            this.charakter.destroy();
            this.charakter = null;
        }
        if (this.orcs) {
            this.orcs.destroy(true, true); // true, true entfernt auch das Physics-Body und zerstört das Spielobjekt
            this.orcs = null;
        }

        // Charakter erstellen oder setzen
        if (data && data.from === 'MapNorth') {
            this.createCharacter(532, 600, 'charakter', 'Idle01.png');
        } else {
            // Default-Fall oder andere Szenarien
            this.createCharacter(100, 100, 'charakter', 'Idle01.png');
        }

        const arrowGroup = this.createArrowGroup();
        this.charakter.setArrow(arrowGroup);
        
        // Orc-Gruppe erstellen und Kollisionen konfigurieren
        this.orcs = this.physics.add.group({
            classType: Orc
        });

        const orcGroup = this.createOrcGroup();
    

        // Pfeil-Gruppe erstellen und Kollisionen konfigurieren
        this.physics.add.collider(arrowGroup, this.orcs, this.handleArrowOrcCollision, undefined, this); // Kollisionsabfrage zwischen Pfeilen und Orcs
        this.physics.add.collider(arrowGroup, objectLayer, this.handleArrowWallCollision, undefined, this); // Kollisionsabfrage zwischen Pfeilen und Objektschicht
        this.physics.add.collider(this.charakter.swordHitbox, this.orcs, this.handleSwordOrcCollision, null, this); // Kollisionabfrage zwischen Schwert und Orc

        // Kollisionsabfrage zwischen Charakter und Objektschicht
        this.physics.add.collider(this.charakter, objectLayer);

        // Necromancer erstellen
        this.necromancer = new Necromancer(this, 532, 200, 'necromancer'); // Überprüfe, ob Necromancer korrekt importiert und definiert ist
        this.physics.add.collider(this.necromancer, objectLayer); // Kollisionsabfrage mit Objektschicht

        // Kamera Einstellungen
        this.cameras.main.startFollow(this.charakter);
        this.cameras.main.setZoom(2);

        // Animationen zuweisen
        createCharakterAnims(this.anims);
        createNecromancerAnims(this.anims);
        createOrcAnims(this.anims);

        // Orc Animation
        orcGroup.getChildren().forEach(orc => {
            orc.play('enemy-walk');
        });

        // Kollisionsbehandlung zwischen Charakter und Orcs
        this.physics.add.collider(this.orcs, this.charakter, (charakter, orc) => {
            this.handlePlayerOrcCollision(charakter, orc);
        });
    }

    update(time, delta) {
        this.updateCharacterAndOrcs();
    }

    // Beispiel für Kollisionsbehandlung zwischen Charakter und Necromancer
    handlePlayerNecromancerCollision(charakter, necromancer) {
        // Beispielhafte Logik für die Interaktion zwischen Charakter und Necromancer
        if (!charakter.isSwingingSword) { // Stelle sicher, dass charakter.isSwingingSword oder eine entsprechende Eigenschaft existiert
            charakter.handleDamage(necromancer.body.velocity); // Stelle sicher, dass charakter.handleDamage oder eine entsprechende Methode existiert
        }
    }
}

export default BossLevel;
