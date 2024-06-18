function createOrcAnims(anims) {
    anims.create({
        key: 'enemy-idle',
        frames: anims.generateFrameNames('enemy', { start: 1, end: 6, prefix: 'idle', suffix: '.png' }),
        repeat: -1,
        frameRate: 5
    });

    anims.create({
        key: 'enemy-walk',
        frames: anims.generateFrameNames('enemy', { start: 1, end: 9, prefix: 'walk', suffix: '.png' }),
        repeat: -1,
        frameRate: 9
    });
}

export default createOrcAnims;
