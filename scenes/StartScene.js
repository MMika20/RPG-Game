class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }


    create() {
        this.add.text(310, 280, 'Willkommen zu meinem Spiel!', { fontSize: '25px' });
        this.add.text(140, 310, 'In dieser Welt kannst du frei herumlaufen und erkunden, ', { fontSize: '25px' });
        this.add.text(200, 340, 'was auch immer du willst. Nur pass auf, dass du', { fontSize: '25px' });
        this.add.text(270, 370, 'keinen Gegnern über den Weg läufst!', { fontSize: '25px' });
        this.add.text(370, 430, 'Click to Start!', { fontSize: '35px' });
        this.add.text(1, 1, '-W,A,S,D- zum Laufen')
        this.add.text(1, 15, '-Leertaste- zum Schießen')
        this.add.text(1, 30, '-E- (gedrückt halten) Schwertschlag')
        this.input.on('pointerdown', () => {
            this.scene.stop('StartScene');
            this.scene.start('MainMap');
			this.scene.run('GameUI');
        });
    }
}

export default StartScene;
