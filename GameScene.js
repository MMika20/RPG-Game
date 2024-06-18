import createOrcAnims from './anims/createOrcAnims.js';
import createCharakterAnims from './anims/createCharakterAnims.js';
import Orc from './Orc.js';
import Charakter from './charakter.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.cursors = null;
        this.charakter = null; 
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
      
        // Collision aktivieren
        objectLayer.setCollisionByProperty({ collides: true });
      
        // Initializing keys
        this.cursors = this.input.keyboard.createCursorKeys();

        // Charakter Einstellungen
        this.charakter = this.physics.add.sprite(128, 158, 'charakter', 'Idle01.png'); // Corrected sprite creation
        this.charakter.body.setSize(this.charakter.width * 0.12, this.charakter.height * 0.16);
        this.physics.add.collider(this.charakter, objectLayer);
        this.charakter.setCollideWorldBounds(true);

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

    // collision zwischen charakter and Orc
    handlePlayerOrcCollision(obj, obj2) {
        const orc = obj2;

        const dx = this.charakter.x - orc.x;
        const dy = this.charakter.y - orc.y;

        const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

        this.charakter.setVelocity(dir.x, dir.y);
        this.hit = 1;
    }

    // Hit Knockback
    update() {
        if (this.hit > 0) {
            ++this.hit;
            if (this.hit > 10) {
                this.hit = 0;
            }
            return;
        }
        
        this.charakter.setVelocity(0);

        // Character speed
        const speed = 100;

        // Keyzuteilung
        if (this.cursors.left?.isDown) {
            this.charakter.anims.play('charakter-walk', true);
            this.charakter.setVelocity(-speed, 0);   // left
            this.charakter.scaleX = -1;
            this.charakter.body.offset.x = 56;
        } else if (this.cursors.right?.isDown) {
            this.charakter.anims.play('charakter-walk', true);
            this.charakter.setVelocity(speed, 0);    // right
            this.charakter.scaleX = 1;
            this.charakter.body.offset.x = 44;
        } else if (this.cursors.up?.isDown) {
            this.charakter.anims.play('charakter-walk', true);
            this.charakter.setVelocity(0, -speed);   // up
        } else if (this.cursors.down?.isDown) {
            this.charakter.anims.play('charakter-walk', true);
            this.charakter.setVelocity(0, speed);    // down
        } else {
            this.charakter.anims.play('charakter-Idle', true);
            this.charakter.setVelocity(0, 0); // idle
        }

        
        this.orcs.getChildren().forEach(orc => {
            orc.idle();
        });
    }
}

export default GameScene;
