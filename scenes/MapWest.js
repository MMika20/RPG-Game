import Phaser from 'phaser';
import CharacterScene from './CharacterScene';
import createCharakterAnims from '../anims/createCharakterAnims';
import createOrcAnims from '../anims/createOrcAnims';
import Orc from '../Orc';
import sceneEvents from '../events/EventsCenter';

class MapWest extends CharacterScene {
    constructor() {
        super('MapWest');
        this.orcs = null;
    }

    create(data) {
        // Spezifische Szene Implementierungen
        const map = this.make.tilemap({ key: "mapWest", tileWidth: 64, tileHeight: 45 });
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

        // Charakter erstellen
        if (data && data.from === 'MainMap') {
            this.createCharacter(1000, 150, 'charakter', 'Idle01.png');
        } else if (data && data.from === 'MapSouthWest') {
            this.createCharacter(615, 690, 'charakter', 'Idle01.png');
        } else if (data && data.from === 'MapNorthWest') {
            this.createCharacter(580, 30, 'charakter', 'Idle01.png');
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
        this.orcs.create(900, 640, 'enemy');
        this.orcs.create(850, 550, 'enemy');
        this.orcs.create(870, 590, 'enemy');
        this.orcs.create(860, 570, 'enemy');
        this.orcs.create(850, 255, 'enemy');
        this.orcs.create(830, 215, 'enemy');

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
        this.createTransitionZone(1024, 150, 1, 40, () => {
            this.scene.start('MainMap', { charakter: this.charakter, from: 'MapWest' });
        });

        this.createTransitionZone(615, 720, 40, 1, () => {
            this.scene.start('MapSouthWest', { charakter: this.charakter, from: 'MapWest' });
        });

        this.createTransitionZone(585, 1, 40, 1, () => {
            this.scene.start('MapNorthWest', { charakter: this.charakter, from: 'MapWest' });
        });
    }

    update(time, delta) {
        this.updateCharacterAndOrcs();

    }
}

export default MapWest;
