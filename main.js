import Phaser from 'phaser';
import StartScene from './scenes/StartScene.js';
import GameScene from './scenes/GameScene.js';
import GameUI from './scenes/GameUI.js';
import MapWest from './scenes/MapWest.js';
import Preloader from './scenes/Preloader.js'

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 720,
    backgroundColor: '#2d2d2d',
    physics: {
        default: 'arcade',
        arcade: {
            // Hitbox anzeigen lassen von Charaktern
            debug: false
        }
    },
    scene: [Preloader, StartScene, GameScene, MapWest, GameUI]
};

const game = new Phaser.Game(config);
