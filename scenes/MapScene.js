import Phaser from 'phaser';

class MapScene extends Phaser.Scene {
    constructor() {
        super('MapScene');
    }

    create() {
        // Karte erstellen und auf die Bildschirmmitte zentrieren
        this.mapImage = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'map');
        this.mapImage.setOrigin(0.5, 0.5);
        this.cameras.main.setZoom(0.2); // Herauszoomen

        this.marker = this.add.image(0, 0, 'marker').setOrigin(0.5, 0.5);
        this.marker.setVisible(false);
    }

    
}

export default MapScene;
