import Phaser from 'phaser';
import CharacterScene from './CharacterScene';
import createCharakterAnims from '../anims/createCharakterAnims';
import createOrcAnims from '../anims/createOrcAnims';
import Orc from '../Orc';
import Trader from '../Trader';
import sceneEvents from '../events/EventsCenter';
import CoinCounter from '../CoinCounter';
import Charakter from '../Charakter';

class MainMap extends CharacterScene {
    constructor() {
        super('MainMap');
        this.orcs = null;
        this.trader = null;
    }

    create(data) {
        // Spezifische Szene Implementierungen
        const map = this.make.tilemap({ key: "mainMap", tileWidth: 64, tileHeight: 45 });
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
        if (data && data.from === 'MapWest') {
            this.createCharacter(30, 150, 'charakter', 'Idle01.png');
        } else if (data && data.from === 'MapSouth') {
            this.createCharacter(185, 690, 'charakter', 'Idle01.png');
        } else if (data && data.from === 'MapEast') {
            this.createCharacter(994, 615, 'charakter', 'Idle01.png');
        } else if (data && data.from === 'MapNorth') {
            this.createCharacter(855, 30, 'charakter', 'Idle01.png');
        } else {
            // Default-Fall oder andere Szenarien
            this.createCharacter(100, 150, 'charakter', 'Idle01.png');
        }
        const arrowGroup = this.createArrowGroup();
        this.charakter.setArrow(arrowGroup);

        // Orc-Gruppe erstellen und Kollisionen konfigurieren
        this.orcs = this.physics.add.group({
            classType: Orc
        });
        this.orcs.create(100, 290, 'enemy');
        this.orcs.create(100, 230, 'enemy');
        this.orcs.create(100, 260, 'enemy');
        this.orcs.create(860, 570, 'enemy');
        this.orcs.create(850, 255, 'enemy');
        this.orcs.create(830, 215, 'enemy');

        this.physics.add.collider(this.orcs, objectLayer); // Kollisionsabfrage mit Objektschicht
        this.physics.add.collider(this.orcs, this.orcs); // Kollisionsabfrage innerhalb der Orc-Gruppe

        // Pfeil-Gruppe erstellen und Kollisionen konfigurieren
        this.physics.add.collider(arrowGroup, this.orcs, this.handleArrowOrcCollision, undefined, this); // Kollisionsabfrage zwischen Pfeilen und Orcs
        this.physics.add.collider(arrowGroup, objectLayer, this.handleArrowWallCollision, undefined, this); // Kollisionsabfrage zwischen Pfeilen und Objektschicht
        this.physics.add.collider(this.charakter.swordHitbox, this.orcs, this.handleSwordOrcCollision, null, this);
        this.physics.add.collider(this.charakter.spinHitbox, this.orcs, this.handleSpinOrcCollision, null, this)
        // Kollisionsabfrage zwischen Charakter und Objektschicht
        this.physics.add.collider(this.charakter, objectLayer);

        // Trader + Kollision erstellt
        this.trader = new Trader(this, 650, 60, 'trader');
        this.add.text(650, 40, 'Shop', { fontSize: '12px' }).setOrigin(0.5);
        this.physics.add.existing(this.trader);

        // Kamera Einstellungen
        this.cameras.main.startFollow(this.charakter);
        this.cameras.main.setZoom(3);

        // Animationen zuweisen
        createCharakterAnims(this.anims);
        createOrcAnims(this.anims);

        // Orc Animation
        this.orcs.getChildren().forEach(orc => {
            orc.play('enemy-walk');
        });

        // Kollisionsbehandlung zwischen Charakter und Orcs
        this.physics.add.collider(this.orcs, this.charakter, (charakter, orc) => {
            this.handlePlayerOrcCollision(charakter, orc);
        });

        sceneEvents.emit('player-health-changed', this.charakter.health);
        // Übergangszone erstellen
        this.createTransitionZone(1, 150, 1, 40, () => {
            this.charakter.walkGrass.stop();
            console.log('Grass entfernt')
            this.scene.start('MapWest', { charakter: this.charakter, from: 'MainMap' });
        });

        this.createTransitionZone(185, 720, 40, 1, () => {
            this.scene.start('MapSouth', { charakter: this.charakter, from: 'MainMap' });
        });
        
        this.createTransitionZone(1024, 615, 1, 40, () => {
            this.scene.start('MapEast', { charakter: this.charakter, from: 'MainMap' });
        });

        this.createTransitionZone(855, 1, 40, 1, () => {
            this.scene.start('MapNorth', { charakter: this.charakter, from: 'MainMap' });
        });

        sceneEvents.emit('update-map-name', 'Middle');
    }

    switchMap(mapName) {
        // Logik zum Wechseln der Map

        // Hole die GameUI-Szene
        const gameUI = this.scene.get('GameUI');
        
        if (gameUI) {
            gameUI.updateMapName(mapName); // Aktualisiere den Namen der aktuellen Map
        }
    }

    update(time, delta) {
        // Update der Nähe des Charakters zum Trader
        if (this.trader) {
            this.trader.update();
        }

        this.updateCharacterAndOrcs();
    }

}

export default MainMap;
