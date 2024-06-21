import Phaser from 'phaser';

class EventsCenter extends Phaser.Events.EventEmitter {
    constructor() {
        super();
        // Initialisieren Sie den EventEmitter der Elternklasse
    }
}

const sceneEvents = new EventsCenter();

export default sceneEvents;
 