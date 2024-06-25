function createTraderAnims(anims) {
    anims.create({
        key: 'trader-idle',
        frames: anims.generateFrameNames('trader', { start: 1, end: 2, prefix: 'idle0', suffix: '.png' }),
        repeat: -1,
        frameRate: 5
    });
}

export default createTraderAnims;