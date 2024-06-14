class GameScene extends Phaser.Scene {
    constructor(){
        super({ key: 'GameScene'})
        let player;
        let cursors;
        let walls;
    }

    

 preload() {
    this.load.image('player', './assets/Player.png');
    this.load.image('wall', './assets/wall.png');
    this.load.image('tiles', './assets/RPG.png');
    this.load.tilemapTiledJSON('map1', './assets/RPG.json');
}

 create() {
  const map = this.make.tilemap({ key: "map1", tileWidth: 64, tileHeight: 45});
  const tileset = map.addTilesetImage("RPG","tiles");
  map.createLayer("Ground",tileset,0,0)
  const objectLayer = map.createLayer("Objects", tileset, 0, 0);
  
  objectLayer.setCollisionByProperty({collides : true})
  
  /*const debugGraphics = this.add.graphics().setAlpha(0.7)
  objectLayer.renderDebug(debugGraphics, {
    tileColor: null,
    collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
    faceColor: new Phaser.Display.Color(40, 39, 37, 255)
  })*/

    this.cursors = this.input.keyboard.createCursorKeys();
    this.player = this.physics.add.sprite(100, 150, 'player');
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, objectLayer)
    
    // Kamera-Einstellungen
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(3);  // Zoom-Faktor einstellen

}

 update() {
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-80);
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(80);
    }

    if (this.cursors.up.isDown) {
        this.player.setVelocityY(-80);
    } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(80);
    }
}
}