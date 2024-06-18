import StartScene from './StartScene.js';
import GameScene from './GameScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: '#2d2d2d',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: [StartScene, GameScene]
};

const game = new Phaser.Game(config);
