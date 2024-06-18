import createOrcAnims from './anims/createOrcAnims.js';
import createCharakterAnims from './anims/createCharakterAnims.js';
import Orc from './Orc.js';
import Charakter from './charakter.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.cursors = null;
        this.charakter = this.Charakter;
        this.orcs = null;
        this.hit = 0;
    }

    preload() {
        this.load.image('tiles', './assets/RPG.png');
        this.load.tilemapTiledJSON('map1', './assets/RPG.json');
        this.load.atlas('charakter', './assets/CharakterAnimations.png', './assets/CharakterAnimations.json');
        this.load.atlas('enemy', './assets/EnemyAnimations.png', './assets/EnemyAnimations.json');
    }

    create() {
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

        // Collision aktivieren
        objectLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.charakter, objectLayer);

        // Enemy kreieren (Orc)
        this.orcs = this.physics.add.group({
            classType: Orc
        });
        this.orcs.create(128, 300, 'enemy', 'idle1.png');

        this.physics.add.collider(this.orcs, objectLayer);

        // Kamera Einstellungen
        this.cameras.main.startFollow(this.charakter);
        this.cameras.main.setZoom(3);

        // Animation zugewiesen
        createCharakterAnims(this.anims);
        createOrcAnims(this.anims);

        // Orc Animation
        this.orcs.getChildren().forEach(orc => {
            orc.play('enemy-walk');
        });

        this.physics.add.collider(this.orcs, this.charakter, this.handlePlayerOrcCollision, undefined, this);
    }

    // Kollision zwischen Charakter und Orc
    handlePlayerOrcCollision(charakter, orc) {

        const dx = this.charakter.x - orc.x;
        const dy = this.charakter.y - orc.y;

        const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

        //this.charakter.setVelocity(dir.x, dir.y)
        //this.hit = 1;
        charakter.handleDamage(dir);
    }
        
    
    update() {
        // Hit Knockback
        if (this.hit > 0) {
            ++this.hit;
            if (this.hit > 10) {
                this.hit = 0;
            }
            return;
        }

        // Charakter.js aufgerufen für die Steuerung des Charakters
        this.charakter.update(this.cursors);

        this.orcs.getChildren().forEach(orc => {
            if (orc.idle) {
                orc.idle();
            }
        });
    }
}

export default GameScene;
