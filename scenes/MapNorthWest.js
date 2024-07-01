// MapNorthWest.js
import Phaser from 'phaser';
import CharacterScene from './CharacterScene';
import createCharakterAnims from '../anims/createCharakterAnims';
import createOrcAnims from '../anims/createOrcAnims';
import Orc from '../Orc';
import sceneEvents from '../events/EventsCenter';

class MapNorthWest extends CharacterScene {
    constructor() {
        super('MapNorthWest');
        this.orcs = null;
    }

    create(data) {
        // Spezifische Szene Implementierungen
        const map = this.make.tilemap({ key: "mapNorthWest", tileWidth: 64, tileHeight: 45 });
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
            this.createCharacter(994, 440, 'charakter', 'Idle01.png');
        } else if (data && data.from === 'MapWest') {
            this.createCharacter(600, 690, 'charakter', 'Idle01.png');
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

        for (var i = 60; i < 970; i = i +30){
            this.orcs.create(i, 200, 'enemy')
        }
        for (var i = 60; i < 970; i = i +30){
            this.orcs.create(i, 100, 'enemy')
        }
        for (var i = 60; i < 970; i = i +30){
            this.orcs.create(i, 300, 'enemy')
        }
        

        const orcGroup = this.createOrcGroup();
        this.physics.add.collider(this.orcs, objectLayer); // Kollisionsabfrage mit Objektschicht
        this.physics.add.collider(this.orcs, this.orcs); // Kollisionsabfrage innerhalb der Orc-Gruppe

        // Pfeil-Gruppe erstellen und Kollisionen konfigurieren
        this.physics.add.collider(arrowGroup, this.orcs, this.handleArrowOrcCollision, undefined, this); // Kollisionsabfrage zwischen Pfeilen und Orcs
        this.physics.add.collider(arrowGroup, objectLayer, this.handleArrowWallCollision, undefined, this); // Kollisionsabfrage zwischen Pfeilen und Objektschicht
        this.physics.add.collider(this.charakter.swordHitbox, this.orcs, this.handleSwordOrcCollision, null, this); // Kollisionabfrage zwischen Schwert und Orc

        // Kollisionsabfrage zwischen Charakter und Objektschicht
        this.physics.add.collider(this.charakter, objectLayer);

        // Kamera Einstellungen
        this.cameras.main.startFollow(this.charakter);
        this.cameras.main.setZoom(3);

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
        this.createTransitionZone(600, 720, 40, 1, () => {
            this.scene.start('MapWest', { charakter: this.charakter, from: 'MapNorthWest' });
        });

        this.createTransitionZone(1024, 440, 1, 40, () => {
            this.scene.start('MapNorth', { charakter: this.charakter, from: 'MapNorthWest' });
        });
    }

    update(time, delta) {
        this.updateCharacterAndOrcs();
    }
}

export default MapNorthWest;
