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
    this.load.image('player', './assets/Player.png');
    this.load.image('wall', './assets/wall.png');
    this.load.image('tiles', './assets/plains.png');
    this.load.tilemapTiledJSON('map1', './assets/tilemap1.json');
}

function create() {
  const map = this.make.tilemap({ key: "map1", tileWidth: 64, tileHeight: 32});
  const tileset = map.addTilesetImage("tileset1","tiles");
  const layer = map.createLayer("toplayer", tileset, 0, 0);


     cursors = this.input.keyboard.createCursorKeys();
    player = this.physics.add.sprite(0, 0, 'player');
    //player.setCollideWorldBounds(true);
    


    
    // Kamera-Einstellungen
    this.cameras.main.startFollow(player);
    this.cameras.main.setZoom(3);  // Zoom-Faktor einstellen

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
