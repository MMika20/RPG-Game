function createCharakterAnims(anims) {
    anims.create({
        key: 'charakter-idle',
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

    anims.create({
        key: 'charakter-death',
        frames: anims.generateFrameNames('charakter', { start: 1, end: 4, prefix: 'death0', suffix: '.png' }),
        repeat: 0,
        frameRate: 5
    })
}

export default createCharakterAnims;