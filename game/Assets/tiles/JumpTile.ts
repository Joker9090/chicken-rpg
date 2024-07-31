import { GenericTile } from "./GenericTile";

export class JumpTile extends GenericTile {
    arrows?: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene, x: number, y: number, z: number, texture: string, frame?: string | number, group?: Phaser.GameObjects.Group) {
        super(scene, x, y, z, texture, 0, group);
        this.isoConfig = {x: x, y: y};
        this.arrows = this.scene.add.sprite(0, -135, 'J|arrows');
        this.container.add(this.arrows);
        this.isConnectable = false;
        this.objectType = "JumpTile";
        this.sound = scene.sound.add('jumpSound');
        this.sound.setVolume(0.1);
        this.animateArrows();
    }

    animateArrows() {
        this.scene.tweens.add({
            targets: this.arrows,
            y: '-=7', 
            duration: 700, 
            ease: 'Sine.easeInOut', 
            yoyo: true,
            repeat: -1 
        });
    }
}
