import Phaser from 'phaser';
import CharacterScene from './CharacterScene';
import Necromancer from '../Necromancer';
import createCharakterAnims from '../anims/createCharakterAnims';
import createNecromancerAnims from '../anims/createNecromancerAnims';
import Orc from '../Orc';
import createOrcAnims from '../anims/createOrcAnims';
import HealthBar from '../HealthBar'; // Annahme: HealthBar-Klasse muss noch implementiert werden

class BossLevel extends CharacterScene {
    constructor() {
        super('BossLevel');
        this.necromancer = null;
        this.orcs = null;
        this.healthBar = null;
        this.fireballGroup = null;
    }

    create(data) {
        // Initialisierungen und Kollisionen
        const map = this.make.tilemap({ key: "bossLevel", tileWidth: 64, tileHeight: 45 });
        const tileset = map.addTilesetImage("RPG_Map_Tileset", "tiles1");
        map.createLayer("Ground", tileset, 0, 0);
        const objectLayer = map.createLayer("Objects", tileset, 0, 0);
        objectLayer.setCollisionByProperty({ collides: true });

        this.cursors = this.input.keyboard.createCursorKeys();

        // Entfernen aller existierenden Charaktere, Orks, Necromancer und HealthBar
        if (this.charakter) {
            this.charakter.destroy();
            this.charakter = null;
        }
        if (this.orcs) {
            this.orcs.destroy(true, true);
            this.orcs = null;
        }

        // Charakter erstellen oder setzen
        if (data && data.from === 'MapNorth') {
            this.createCharacter(532, 600, 'charakter', 'Idle01.png');
        } else {
            this.createCharacter(100, 100, 'charakter', 'Idle01.png');
        }

        const arrowGroup = this.createArrowGroup();
        this.charakter.setArrow(arrowGroup);

        // Orks und Kollisionen
        this.orcs = this.physics.add.group({ classType: Orc });
        const orcGroup = this.createOrcGroup();

        // Fireball-Gruppe erstellen
        this.fireballGroup = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            createCallback: fireball => {
                fireball.body.setSize(fireball.width * 0.8, fireball.height * 0.8); // Anpassung der Hitbox-Größe
                fireball.setCollideWorldBounds(true);

            }
        });
        

        this.physics.add.collider(this.fireballGroup, objectLayer, (fireball, layer) => {
            fireball.destroy(); // Fireball zerstören, wenn er auf die Objektschicht trifft
        });

        // Necromancer erstellen und Kollisionen
        this.necromancer = new Necromancer(this, 532, 200, 'necromancer');
        this.physics.add.collider(this.necromancer, objectLayer);

        // HealthBar für Necromancer erstellen
        this.healthBar = new HealthBar(this, this.necromancer.x, this.necromancer.y - 20, this.necromancer.health);

        this.cameras.main.startFollow(this.charakter);
        this.cameras.main.setZoom(2);

        // Animationen erstellen
        createCharakterAnims(this.anims);
        createNecromancerAnims(this.anims);
        createOrcAnims(this.anims);

        orcGroup.getChildren().forEach(orc => {
            orc.play('enemy-walk');
        });

        this.physics.add.collider(arrowGroup, this.necromancer, this.handleNecromancerArrowCollision, undefined, this);
        this.physics.add.collider(arrowGroup, objectLayer, this.handleArrowWallCollision, undefined, this);
        this.physics.add.collider(this.charakter, objectLayer);
        this.physics.add.collider(this.charakter, this.necromancer, this.handlePlayerNecromancerCollision, null, this);
        this.physics.add.collider(this.charakter, this.fireballGroup, this.handleFireballCollision, undefined, this)
        
    }

    update(time, delta) {
        this.updateCharacterAndOrcs();
        if (this.necromancer) {
            this.necromancer.preUpdate(time, delta);
            if (this.healthBar) {
                this.healthBar.setPosition(this.necromancer.x, this.necromancer.y - 20);
                this.healthBar.setPercentage(this.necromancer.health / 20); // Annahme: 20 ist der maximale Gesundheitswert des Necromancers
            }
        }
    }

    handlePlayerNecromancerCollision(charakter, necromancer) {
        if (!charakter.isSwingingSword) {
            charakter.handleDamage(necromancer.body.velocity);
        }
    }
    
}

export default BossLevel;
