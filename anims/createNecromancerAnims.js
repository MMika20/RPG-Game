function createNecromancerAnims(anims) {
    anims.create({
        key: 'necromancer-idle',
        frames: anims.generateFrameNames('necromancer', { start: 1, end: 8, prefix: 'idle', suffix: '.png' }),
        repeat: -1,
        frameRate: 8
    });
}
export default createNecromancerAnims;