class Preloader extends Phaser.Scene {
    constructor() {
        super({ key: 'Preloader' });
    }

    preload() {
        // Bilder laden
        this.load.image('tiles1', './assets/RPG_Map_Tileset.png');
        this.load.image('tiles2', './assets/RPG_Map_Tileset2.png');
        this.load.tilemapTiledJSON('mainMap', './assets/RPG.json');
        this.load.tilemapTiledJSON('mapWest', './assets/RPG_MapWest.json');
        this.load.tilemapTiledJSON('mapSouthWest', './assets/RPG_MapSouthWest.json');
        this.load.tilemapTiledJSON('mapSouth', './assets/RPG_MapSouth.json');
        this.load.tilemapTiledJSON('mapSouthEast', './assets/RPG_MapSouthEast.json');
        this.load.tilemapTiledJSON('mapEast', './assets/RPG_mapEast.json');
        this.load.tilemapTiledJSON('mapNorthEast', './assets/RPG_mapNorthEast.json');
        this.load.tilemapTiledJSON('mapNorth', './assets/RPG_MapNorth.json');
        this.load.tilemapTiledJSON('mapNorthWest', './assets/RPG_MapNorthWest.json');
        this.load.tilemapTiledJSON('bossLevel', './assets/RPG_BossLevel.json');
        this.load.atlas('charakter', './assets/CharakterAnimations.png', './assets/CharakterAnimations.json');
        this.load.atlas('enemy', './assets/EnemyAnimations.png', './assets/EnemyAnimations.json');
        this.load.atlas('trader', './assets/TraderAnimations.png', './assets/TraderAnimations.json');
        this.load.atlas('necromancer', './assets/NecromancerAnimations.png', './assets/NecromancerAnimations.json');
        this.load.image('heart_full', './ui/heart_full.png');
        this.load.image('heart_empty', './ui/heart_empty.png');
        this.load.image('arrow', './assets/arrow.png');
        this.load.image('fireball', './assets/Fireball.png');
        this.load.image('swordSpin', './assets/swordSpin.png');
        this.load.image('dash_icon', './assets/Dash.png');
        this.load.image('sword_icon', './assets/swing.png');
        this.load.image('bow_icon', './assets/bow.png');
        this.load.image('spin_icon', './assets/spin.png');
        this.load.image('map_icon', './assets/MapIcon.png');
        this.load.image('map', './assets/FullMap.png');
        this.load.image('marker', './assets/marker.png');
        
        // Audio-Dateien laden
        this.load.audio('backgroundMusic', './assets/sounds/backgroundMusic.mp3');
        this.load.audio('swordSwing', './assets/sounds/swordSound.mp3');
        this.load.audio('bowShot', './assets/sounds/bowSound.mp3');
        this.load.audio('dash', './assets/sounds/dash.mp3');
        this.load.audio('swordSpin', './assets/sounds/swordSpin.mp3');
        this.load.audio('orcDeath', './assets/sounds/orcDeath.mp3');
    }

    create() {
        // Hintergrundmusik abspielen
        this.music = this.sound.add('backgroundMusic', {
            loop: true, // Wiederholt die Musik
            volume: 0.5 // Lautstärke (0.0 bis 1.0)
        });
        this.music.play();

        // Starte die StartSzene
        this.scene.start('StartScene');
    }

    stopMusic() {
        if (this.music) {
            this.music.stop();
        }
    }
}

export default Preloader;
