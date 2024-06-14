import Phaser from 'phaser';
import './style.css';

const config = {
    type: Phaser.AUTO,
    width: 1080,
    height: 720,
    backgroundColor: '#2d2d2d',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    parent: 'gameContainer'
};

const game = new Phaser.Game(config);

let player;
let cursors;
let walls;

function preload() {
    this.load.image('player', 'assets/Player.png');
    this.load.image('map', 'assets/map.png');
    this.load.image('wall', 'assets/wall.png');
    this.load.tilemapTiledJSON('map', 'assets/map.json')
}

function create() {
  var map = this.make.tilemap({ key: 'map' });

    this.add.image(0, 0, 'map').setOrigin(0, 0);

    player = this.physics.add.sprite(220, 480, 'player');
    player.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();

    walls = this.physics.add.staticGroup();
    walls.create(127, 34, 'wall');
    walls.create(127, 110, 'wall');
    walls.create(255, 110, 'wall');
    walls.create(320, 34, 'wall');
    walls.create(450, 130, 'wall');
    walls.create(450, 270, 'wall');
    walls.create(367, 225, 'wall');
    walls.create(225, 320, 'wall');
    walls.create(270, 320, 'wall');
    walls.create(305, 400, 'wall');
    walls.create(353, 400, 'wall');
    walls.create(445, 400, 'wall');
    walls.create(480, 400, 'wall');
    walls.create(575, 400, 'wall');
    walls.create(610, 400, 'wall');
    walls.create(640, 400, 'wall');
    walls.create(830, 400, 'wall');
    walls.create(865, 400, 'wall');
    walls.create(847, 240, 'wall');
    walls.create(847, 95, 'wall');
    walls.create(847, 30, 'wall');
    walls.create(930, 20, 'wall');
    walls.create(930, 270, 'wall');
    walls.create(945, 575, 'wall');
    walls.create(845, 575, 'wall');
    walls.create(945, 575, 'wall');
    this.physics.add.collider(player, walls);
   /* 
    // Kamera-Einstellungen
    this.cameras.main.startFollow(player);
    this.cameras.main.setZoom(3);  // Zoom-Faktor einstellen
*/
}

function update() {
    player.setVelocity(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-80);
    } else if (cursors.right.isDown) {
        player.setVelocityX(80);
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-80);
    } else if (cursors.down.isDown) {
        player.setVelocityY(80);
    }
}
export default SceneMain;
