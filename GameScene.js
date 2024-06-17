class GameScene extends Phaser.Scene {
    constructor(){
        super({ key: 'GameScene'})
        let cursors;
        let charakter;
    }
    
    

 preload() {
    this.load.image('tiles', './assets/RPG.png');
    this.load.tilemapTiledJSON('map1', './assets/RPG.json');
    this.load.atlas('charakter', './assets/CharakterAnimations.png', './assets/CharakterAnimations.json')
}

 create() {
  const map = this.make.tilemap({ key: "map1", tileWidth: 64, tileHeight: 45});
  const tileset = map.addTilesetImage("RPG","tiles");
  map.createLayer("Ground",tileset,0,0)
  const objectLayer = map.createLayer("Objects", tileset, 0, 0);
  
    // Kollision erlauben
  objectLayer.setCollisionByProperty({collides : true})
  
    // Objekte anzeigen lassen
  /*const debugGraphics = this.add.graphics().setAlpha(0.7)
  objectLayer.renderDebug(debugGraphics, {
    tileColor: null,
    collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
    faceColor: new Phaser.Display.Color(40, 39, 37, 255)
  })*/
    // Initialisierung der Tasten
    this.cursors = this.input.keyboard.createCursorKeys();

    // Charakter Einstellungen
    this.charakter = this.physics.add.sprite(128, 158, 'charakter', 'Idle01.png')
    this.charakter.body.setSize(this.charakter.width * 0.12, this.charakter.height * 0.16)
    this.charakter.anims.play('charakter-Idle')
    this.physics.add.collider(this.charakter, objectLayer)
    this.charakter.setCollideWorldBounds(true);

    // Kamera-Einstellungen
    this.cameras.main.startFollow(this.charakter);
    this.cameras.main.setZoom(3);  // Zoom-Faktor einstellen

    // Animationen erstellen
    this.anims.create({
        key: 'charakter-Idle',
        frames: this.anims.generateFrameNames('charakter', {start: 1, end: 6, prefix: 'Idle0', suffix: '.png'}),
        repeat: -1,
        frameRate: 5
    })

    this.anims.create({
        key: 'charakter-walk',
        frames: this.anims.generateFrameNames('charakter', {start: 1, end: 8, prefix: 'walk0', suffix: '.png'}),
        repeat: -1,
        frameRate: 8
    })

}

 update() {
    this.charakter.setVelocity(0);

    // Charakter Geschwindigkeit
    const speed = 100;

    // Tasten und Animationen zuweisen
    if (this.cursors.left?.isDown) {
        this.charakter.anims.play('charakter-walk', true)
        this.charakter.setVelocity(-speed, 0);   // links
        this.charakter.scaleX = -1
        this.charakter.body.offset.x = 56;
    }
    else if (this.cursors.right?.isDown) 
    {
        this.charakter.anims.play('charakter-walk', true)
        this.charakter.setVelocity(speed, 0);    // rechts
        this.charakter.scaleX = 1
        this.charakter.body.offset.x = 44;
    }
    else if (this.cursors.up?.isDown) {
        this.charakter.anims.play('charakter-walk', true)
        this.charakter.setVelocity(0, -speed);   // unten
    } 
    else if (this.cursors.down?.isDown) 
    {
        this.charakter.anims.play('charakter-walk', true)
        this.charakter.setVelocity(0, speed);    // oben
    } 
    
    else
    {
        this.charakter.anims.play('charakter-Idle', true)
        this.charakter.setVelocity(0,0) // idle
    }
}
}