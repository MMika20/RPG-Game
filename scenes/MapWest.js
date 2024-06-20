import createOrcAnims from '../anims/createOrcAnims.js';
import createCharakterAnims from '../anims/createCharakterAnims.js';
import Orc from '../Orc.js';
import Charakter from '../Charakter.js';
import sceneEvents from '../events/EventsCenter.js';

class MapWest extends Phaser.Scene {
    constructor() {
        super({ key: 'MapWest' });
        this.cursors = null;
        this.charakter = null;
        this.orcs = null;
        this.playerOrcCollider = null;
        this.arrow = null;
        this.transitionMainMap = null;
    }


    create() {
        // Map erstellen
        const map = this.make.tilemap({ key: "mapWest", tileWidth: 64, tileHeight: 45 });
        const tileset = map.addTilesetImage("RPG_Map_Tileset", "tiles1");
        map.createLayer("Ground", tileset, 0, 0);
        const objectLayer = map.createLayer("Objects", tileset, 0, 0);

        this.cursors = this.input.keyboard.createCursorKeys();

        // Charakter Einstellungen
        this.charakter = new Charakter(this, 980, 150, 'charakter', 'Idle01.png');
        this.add.existing(this.charakter);
        this.physics.add.existing(this.charakter);
        this.charakter.setCollideWorldBounds(true);

        // Arrow
        this.arrow = this.physics.add.group();
        this.charakter.setArrow(this.arrow);

        // Collision aktivieren
        objectLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.charakter, objectLayer);
        this.physics.add.collider(this.arrow, objectLayer, this.handleArrowWallCollision, undefined, this);

        // Enemy kreieren (Orc)
        this.orcs = this.physics.add.group({
            classType: Orc
        });
        this.orcs.create(900, 640, 'enemy');
        this.orcs.create(850, 550, 'enemy');
        this.orcs.create(870, 590, 'enemy');
        this.orcs.create(860, 570, 'enemy');
        this.orcs.create(850, 255, 'enemy');
        this.orcs.create(830, 215, 'enemy');

        this.physics.add.collider(this.arrow, this.orcs, this.handleArrowOrcCollision, undefined, this);
        this.physics.add.collider(this.orcs, objectLayer);
        this.physics.add.collider(this.orcs, this.orcs);

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

        this.playerOrcCollider = this.physics.add.collider(this.orcs, this.charakter, this.handlePlayerOrcCollision, undefined, this);

        // Übergangszone erstellen
        this.transitionMainMap = this.add.zone(1024, 150, 1, 40);
        this.physics.world.enable(this.transitionMainMap);
        this.physics.add.overlap(this.charakter, this.transitionMainMap, this.handleTransition, null, this);
    }

    handleArrowWallCollision(arrow, objectLayer) {
        arrow.setActive(false).setVisible(false);
    }

    handleArrowOrcCollision(arrow, orc) {
        arrow.disableBody(false, true);
        orc.disableBody(true, true);
    }

    handlePlayerOrcCollision(charakter, orc) {
        const dx = this.charakter.x - orc.x;
        const dy = this.charakter.y - orc.y;
        const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

        charakter.handleDamage(dir);
        sceneEvents.emit('player-health-changed', this.charakter.health);

        if (this.charakter.health <= 0) {
            this.playerOrcCollider?.destroy();
        }
    }
    
    // Szenenwechsel
    handleTransition() {
        this.scene.start('GameScene');
    }

    update(t, delta) {
        if (this.charakter) {
            this.charakter.update();
        }

        this.orcs.getChildren().forEach(orc => {
            if (orc.idle) {
                orc.idle();
            }
        });
    }
}

export default MapWest;