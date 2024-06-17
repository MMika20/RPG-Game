import Phaser from 'phaser';

export default class Orc extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.anims.play('orc-idle');
    }
}
