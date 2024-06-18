class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    create() {
        this.add.text(470, 320, 'Willkommen zu meinem Spiel!', { fontSize: '25px' });
        this.add.text(300, 350, 'In dieser Welt kannst du frei rum laufen und erkunden ', { fontSize: '25px' });
        this.add.text(360, 380, 'was auch immer du willst. Nur pass auf das du', { fontSize: '25px' });
        this.add.text(430, 410, 'keinen Gegnern über den Weg läufst', { fontSize: '25px' });
        this.add.text(530, 450, 'Click to Start!', { fontSize: '30px' });
        this.input.on('pointerdown', () => {
            this.scene.stop('StartScene');
            this.scene.start('GameScene');
        });
    }
}

export default StartScene;
