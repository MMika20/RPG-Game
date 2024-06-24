import Phaser from 'phaser';
import MainMap from './MainMap.js';
import MapWest from './MapWest';
import MapSouthWest from './MapSouthWest';
import Charakter from '../Charakter.js';

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        // Laden aller notwendigen Assets
    }

    create() {
        // Charakter initialisieren und in den Szenen-Manager speichern
        this.charakter = new Charakter(this, 40, 150, 'charakter', 'Idle01.png');
        this.physics.add.existing(this.charakter);
        this.add.existing(this.charakter);

        this.scene.start('StartScene', { charakter: this.charakter });
    }
}

export default MainScene;
