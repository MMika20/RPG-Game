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

    anims.create({
        key: 'charakter-bow',
        frames: anims.generateFrameNames('charakter', { start: 6, end: 8, prefix: 'bow0', suffix: '.png' }),
        repeat: 0,
        frameRate: 8
    })

    anims.create({
        key: 'charakter-sword',
        frames: anims.generateFrameNames('charakter', { start: 1, end: 6, prefix: 'sword0', suffix: '.png'}),
        repeat: 1,
        frameRate: 6
    })
}

export default createCharakterAnims;