import createOrcAnims from './anims/createOrcAnims.js';
import createCharakterAnims from './anims/createCharakterAnims.js';
import Orc from './Orc.js';
import Charakter from './Charakter.js';
import sceneEvents from './events/EventsCenter.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.cursors = null;
        this.charakter = null;
        this.orcs = null;
        this.playerOrcCollider = null;
        this.arrow = null;
    }

    preload() {
        this.load.image('tiles', './assets/RPG.png');
        this.load.tilemapTiledJSON('map1', './assets/RPG.json');
        this.load.atlas('charakter', './assets/CharakterAnimations.png', './assets/CharakterAnimations.json');
        this.load.atlas('enemy', './assets/EnemyAnimations.png', './assets/EnemyAnimations.json');
        this.load.image('heart_full', './ui/heart_full.png');
        this.load.image('heart_empty', './ui/heart_empty.png');
        this.load.image('arrow', './assets/arrow.png');
    }

    create() {
        this.scene.run('GameUI');
        // Map erstellen
        const map = this.make.tilemap({ key: "map1", tileWidth: 64, tileHeight: 45 });
        const tileset = map.addTilesetImage("RPG", "tiles");
        map.createLayer("Ground", tileset, 0, 0);
        const objectLayer = map.createLayer("Objects", tileset, 0, 0);

        this.cursors = this.input.keyboard.createCursorKeys();

        // Charakter Einstellungen
        this.charakter = new Charakter(this, 180, 158, 'charakter', 'Idle01.png');
        this.add.existing(this.charakter);
        this.physics.add.existing(this.charakter);
        this.charakter.setCollideWorldBounds(true);

        // Arrow
        this.arrow = this.physics.add.group();
        this.charakter.setArrow(this.arrow);

        // Collision aktivieren
        objectLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.charakter, objectLayer);
        this.physics.add.collider(this.arrow, objectLayer);
        this.physics.add.collider(this.arrow, this.orcs, this.handleArrowOrcCollision, undefined, this);

        // Enemy kreieren (Orc)
        this.orcs = this.physics.add.group({
            classType: Orc
        });
        this.orcs.create(128, 300, 'enemy', 'idle1.png');

        this.physics.add.collider(this.orcs, objectLayer);

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
    }

    handleArrowOrcCollision(arrow, orc) {
        // Hier sollte die Logik für den Pfeil-Ork-Kollision eingefügt werden
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

    update(t, delta) {
        // Charakter.js aufgerufen für die Steuerung des Charakters
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

export default GameScene;
