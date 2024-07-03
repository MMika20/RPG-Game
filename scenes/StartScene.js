class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }


    create() {
        this.add.text(310, 280, 'Willkommen zu meinem Spiel!', { fontSize: '25px' });
        this.add.text(140, 310, 'In dieser Welt kannst du frei herumlaufen und erkunden, ', { fontSize: '25px' });
        this.add.text(200, 340, 'was auch immer du willst. Nur pass auf, dass du', { fontSize: '25px' });
        this.add.text(270, 370, 'keinen Gegnern über den Weg läufst!', { fontSize: '25px' });
        this.add.text(350, 400, 'Falls doch... Kill Sie!', { fontSize: '25px' });
        this.add.text(370, 480, 'Click to Start!', { fontSize: '35px' });
        this.add.text(1, 1, '-W,A,S,D-     zum Laufen')
        this.add.text(1, 15, '-Space-       zum Schießen')
        this.add.text(1, 30, '-E-           Schwertschlag');
        this.add.text(1, 45, '-Shift-       Dash');
        this.add.text(1, 60, '-R-           Schwertwirbel');
        this.add.text(1, 75, '-F-           Interaktion Shop');
        this.input.on('pointerdown', () => {
            this.scene.stop('StartScene');
            this.scene.start('MainMap');
			this.scene.start('GameUI');
        });
    }
}

export default StartScene;
