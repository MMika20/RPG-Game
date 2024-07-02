// MapNorthEast.js
import Phaser from 'phaser';
import CharacterScene from './CharacterScene';
import createCharakterAnims from '../anims/createCharakterAnims';
import createOrcAnims from '../anims/createOrcAnims';
import Orc from '../Orc';
import Trader from '../Trader';
import sceneEvents from '../events/EventsCenter';

class MapNorthEast extends CharacterScene {
    constructor() {
        super('MapNorthEast');
        this.orcs = null;
        this.trader = null;
    }

    create(data) {
        // Spezifische Szene Implementierungen
        const map2 = this.make.tilemap({ key: "mapNorthEast", tileWidth: 64, tileHeight: 45 });
        const tileset = map2.addTilesetImage("RPG_Map_Tileset2", "tiles2");

        // Ground-Layer erstellen und Kollisionen aktivieren
        map2.createLayer("Ground", tileset, 0, 0);
        const objectLayer = map2.createLayer("Objects", tileset, 0, 0);

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
            this.createCharacter(30, 255, 'charakter', 'Idle01.png');
        } else if (data && data.from === 'MapEast') {
            this.createCharacter(935, 690, 'charakter', 'Idle01.png');
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
        this.orcs.create(215, 100, 'enemy');
        this.orcs.create(180, 100, 'enemy');
        this.orcs.create(215, 140, 'enemy');
        this.orcs.create(100, 190, 'enemy');
        this.orcs.create(100, 240, 'enemy');
        this.orcs.create(100, 600, 'enemy');
        this.orcs.create(130, 600, 'enemy');

        const orcGroup = this.createOrcGroup();
        this.physics.add.collider(this.orcs, objectLayer); // Kollisionsabfrage mit Objektschicht
        this.physics.add.collider(this.orcs, this.orcs); // Kollisionsabfrage innerhalb der Orc-Gruppe

        // Pfeil-Gruppe erstellen und Kollisionen konfigurieren
        this.physics.add.collider(arrowGroup, this.orcs, this.handleArrowOrcCollision, undefined, this); // Kollisionsabfrage zwischen Pfeilen und Orcs
        this.physics.add.collider(arrowGroup, objectLayer, this.handleArrowWallCollision, undefined, this); // Kollisionsabfrage zwischen Pfeilen und Objektschicht
        this.physics.add.collider(this.charakter.swordHitbox, this.orcs, this.handleSwordOrcCollision, null, this); // Kollisionabfrage zwischen Schwert und Orc
        this.physics.add.collider(this.charakter.spinHitbox, this.orcs, this.handleSpinOrcCollision, null, this)

        // Kollisionsabfrage zwischen Charakter und Objektschicht
        this.physics.add.collider(this.charakter, objectLayer);

        // Kamera Einstellungen
        this.cameras.main.startFollow(this.charakter);
        this.cameras.main.setZoom(3);

        // Trader + Kollision erstellt
        this.trader = new Trader(this, 940, 430, 'trader');
        this.add.text(940,410,'Shop', { fontSize: '12px'}).setOrigin(0.5);
        this.physics.add.existing(this.trader);
    

        // Animationen zuweisen
        createCharakterAnims(this.anims);
        createOrcAnims(this.anims);

        // Orc Animation
        orcGroup.getChildren().forEach(orc => {
            orc.play('enemy-walk');
        });

        // Kollisionsbehandlung zwischen Charakter und Orcs
        this.physics.add.collider(this.orcs, this.charakter, (charakter, orc) => {
            this.handlePlayerOrcCollision(charakter, orc);
        });

        sceneEvents.emit('player-health-changed', this.charakter.health);
        // Übergangszone erstellen
        this.createTransitionZone(1, 260, 1, 40, () => {
            this.scene.start('MapNorth', { charakter: this.charakter, from: 'MapNorthEast' });
        });

        this.createTransitionZone(935, 720, 40, 1, () => {
            this.scene.start('MapEast', { charakter: this.charakter, from: 'MapNorthEast' });
        });
    }

    update(time, delta) {

        if (this.trader) {
            this.trader.update();
        }

        this.updateCharacterAndOrcs();
    }
}

export default MapNorthEast;
