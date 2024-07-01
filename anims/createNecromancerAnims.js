function createNecromancerAnims(anims) {
    anims.create({
        key: 'necromancer-idle',
        frames: anims.generateFrameNames('necromancer', { start: 1, end: 8, prefix: 'idle', suffix: '.png' }),
        repeat: -1,
        frameRate: 8
    });

    anims.create({
        key: 'necromancer-shoot',
        frames: anims.generateFrameNames('necromancer', { start: 1, end: 14, prefix: 'attack', suffix: '.png' }),
        repeat: 0,
        frameRate: 6
    });

    anims.create({
        key: 'necromancer-death',
        frames: anims.generateFrameNames('necromancer', { start: 1, end: 9, prefix: 'death', suffix: '.png' }),
        repeat: 0,
        frameRate: 9
    });
}
export default createNecromancerAnims;