import Phaser from 'phaser';
import StartScene from './scenes/StartScene.js';
import GameScene from './scenes/GameScene.js';
import GameUI from './scenes/GameUI.js';
import MapWest from './scenes/MapWest.js';
import MapSouthWest from './scenes/MapSouthWest.js';
import MapSouth from './scenes/MapSouth.js';
import Preloader from './scenes/Preloader.js'
import MainScene from './scenes/MainScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 720,
    backgroundColor: '#2d2d2d',
    physics: {
        default: 'arcade',
        arcade: {
            // Hitbox anzeigen lassen
            debug: true
        }
    },
    scene: [Preloader, StartScene, GameScene, MapWest, MapSouthWest, MapSouth, GameUI]
};

// test

const game = new Phaser.Game(config);