function createCharakterAnims(anims) {
    anims.create({
        key: 'charakter-Idle',
        frames: anims.generateFrameNames('charakter', { start: 1, end: 6, prefix: 'Idle0', suffix: '.png' }),
        repeat: -1,
        frameRate: 5
    });

    anims.create({
        key: 'charakter-walk',
        frames: anims.generateFrameNames('charakter', { start: 1, end: 8, prefix: 'walk0', suffix: '.png' }),
        repeat: -1,
        frameRate: 8
    });
}

export default createCharakterAnims;