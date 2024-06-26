import Phaser from 'phaser';
import StartScene from './scenes/StartScene.js';
import MainMap from './scenes/MainMap.js';
import GameUI from './scenes/GameUI.js';
import MapWest from './scenes/MapWest.js';
import MapSouthWest from './scenes/MapSouthWest.js';
import MapSouth from './scenes/MapSouth.js';
import MapSouthEast from './scenes/MapSouthEast.js';
import MapEast from './scenes/MapEast.js';
import MapNorthEast from './scenes/MapNorthEast.js';
import Preloader from './scenes/Preloader.js'
import MainScene from './scenes/MainScene.js';


const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 720,
    backgroundColor: '#2d2d2d',
    scene: [Preloader, StartScene, MainMap, MapWest, MapSouthWest, MapSouth, MapSouthEast, MapEast, MapNorthEast, GameUI],
    physics: {
        default: 'arcade',
        arcade: {
            // Hitbox anzeigen lassen
            debug: true
        }
    },
    
};

const game = new Phaser.Game(config);