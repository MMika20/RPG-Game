import Phaser from 'phaser';
import StartScene from './StartScene.js';
import GameScene from './GameScene.js';
import GameUI from './GameUI.js';

const config = {
    type: Phaser.AUTO,
    width: 1020,
    height: 720,
    backgroundColor: '#2d2d2d',
    physics: {
        default: 'arcade',
        arcade: {
            // Hitbox anzeigen lassen von Charaktern
            debug: false
        }
    },
    scene: [StartScene, GameScene, GameUI]
};

const game = new Phaser.Game(config);
