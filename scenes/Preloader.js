class Preloader extends Phaser.Scene {
    constructor() {
        super({ key: 'Preloader' });
    }
    preload(){
        this.load.image('tiles1', './assets/RPG_Map_Tileset.png');
        this.load.tilemapTiledJSON('mainMap', './assets/RPG.json');
        this.load.tilemapTiledJSON('mapWest', './assets/RPG_MapWest.json');
        this.load.tilemapTiledJSON('mapSouthWest', './assets/RPG_MapSouthWest.json');
        this.load.tilemapTiledJSON('mapSouth', './assets/RPG_MapSouth.json');
        this.load.tilemapTiledJSON('mapSouthEast', './assets/RPG_MapSouthEast.json');
        this.load.tilemapTiledJSON('mapEast', './assets/RPG_mapEast.json');
        this.load.atlas('charakter', './assets/CharakterAnimations.png', './assets/CharakterAnimations.json');
        this.load.atlas('enemy', './assets/EnemyAnimations.png', './assets/EnemyAnimations.json');
        this.load.atlas('trader', './assets/TraderAnimations.png', './assets/TraderAnimations.json');
        this.load.image('heart_full', './ui/heart_full.png');
        this.load.image('heart_empty', './ui/heart_empty.png');
        this.load.image('arrow', './assets/arrow.png');
        
    }

    create(){
        this.scene.start('StartScene')
    }
}
export default Preloader;