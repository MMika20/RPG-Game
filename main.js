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
import MapNorth from './scenes/MapNorth.js';
import MapNorthWest from './scenes/MapNorthWest.js';
import BossLevel from './scenes/BossLevel.js';
import Preloader from './scenes/Preloader.js'



const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 720,
    backgroundColor: '#2d2d2d',
    scene: [Preloader, StartScene, MainMap, MapWest, MapSouthWest, MapSouth, MapSouthEast, MapEast, MapNorthEast, MapNorth, MapNorthWest, BossLevel, GameUI],
    physics: {
        default: 'arcade',
        arcade: {
            // Hitbox anzeigen lassen [true = an | false = aus]
            debug: true
        }
    },
    // test
};

const game = new Phaser.Game(config);