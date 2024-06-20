import sceneEvents from '../events/EventsCenter.js';

class GameUI extends Phaser.Scene {
    constructor() {
        super({ key: 'GameUI' });
        this.hearts = null;
    }

    create() {
        // Gruppe erstellt für Hearts
        this.hearts = this.add.group({
            classType: Phaser.GameObjects.Image
        });

        // Hearts erstellen
        this.hearts.createMultiple({
            key: 'heart_full',
            setXY: {
                x: 10,
                y: 10,
                stepX: 16
            },
            // Anzeige der Herzen
            quantity: 5
        });

        sceneEvents.on('player-health-changed', this.handlePlayerHealthChanged, this);

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            sceneEvents.off('player-health-changed', this.handlePlayerHealthChanged, this)
        });
    }

    handlePlayerHealthChanged(health) {
        this.hearts.children.each((go, idx) => {
            const heart = go;
            if (idx < health) {
                heart.setTexture('heart_full');
            } else {
                heart.setTexture('heart_empty');
            }
        });
    }
}

export default GameUI;
