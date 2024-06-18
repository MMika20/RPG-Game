import Phaser from 'phaser';

class charakter extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);


        this.body.setSize(this.width * 0.12, this.height * 0.16);
    }

}

Phaser.GameObjects.GameObjectFactory.register('charakter', function (x, y, texture, frame) {
    var sprite = new charakter(this.scene, x, y, texture, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);


    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);
    
    return sprite;
});

export default charakter;
