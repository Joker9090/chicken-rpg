import { Scene } from "phaser";
import { TileObject } from "./TileObject";
import { Player } from "../Player";

export class BarrierTower extends TileObject {

    constructor(scene: Phaser.Scene, x: number, y: number, z: number, texture: string,frame?: string | number, group?: Phaser.GameObjects.Group) {
        super(scene, x, y, z, texture, frame, {group, hasOffTexture: true});
        this.isoConfig = {x: x, y: y}
        this.isConnectable = true;
        this.offsetY = 0.97;
        this.objectType = "BarrierTower";
        this.onConnect = () => {
            this.toggleObjImage()
            this.isOn = !this.isOn
        }
        console.log(this, '44444')
    }
}

export class Star extends TileObject {

    constructor(scene: Phaser.Scene, x: number, y: number, z: number, texture: string,frame?: string | number, group?: Phaser.GameObjects.Group) {
        super(scene, x, y, z, texture, frame, {group, hasOffTexture: true});
        this.isoConfig = {x: x, y: y}
        this.objectType = "Star";
        this.isConnectable = false
        this.self.setAlpha(1)
        this.sound = scene.sound.add('starSound');
        this.sound.setVolume(0.4);
        this.anim();
    }

    anim() {
        this.scene.tweens.add({
            targets: this,
            y: '-=7',
            duration: 700,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }

    shrinkAnim() {
        this.scene.tweens.add({
            targets: this.self,
            scaleX: 0,
            scaleY: 0,
            duration: 300,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.self.setAlpha(0);
            }
        });
    }

    grabItem() {
        if  (this.body) this.body.enable = false;
        this.shrinkAnim();
        //@ts-ignore
        this.scene.uiReference.getItem('star')
    }
}
export class Barrier extends TileObject {
    blinkTween?: Phaser.Tweens.Tween | null | any = 10;

    constructor(scene: Phaser.Scene, x: number, y: number,z: number, texture: string, frame?: string | number, group?: Phaser.GameObjects.Group, offset?: any) {
        super(scene, x, y, z, texture, frame, {group, hasOffTexture: false});
        this.isoConfig = {x: x, y: y}
        this.offsetY = 2;
        this.offsetX = 0.5;
        this.objectType = "Barrier";
        this.isConnectable = true;
        this.self.setAngle(180);
        this.sound = scene.sound.add('barrierSound');
        this.sound.setVolume(0.4);
        this.self.setVisible(false);
        // this.primarySprite = this.scene.add.sprite(x, y, texture)
        // this.scene.add.existing(this.primarySprite);
        if (this.self.body) {
            //@ts-ignore
            this.self.body.setSize(this.self.body.widthX + 50, this.self.body.widthY, this.self.body.height + 150, -50);
        }
        this.blink();
        
        this.onConnect = () => {
            this.toggleObjImage();
            this.isOn = !this.isOn;
            if (this.blinkTween) {
                if (!this.isOn) this.blinkTween.stop();
                else {
                    this.blinkTween = null;
                    this.blink()
                }
            }
        };
    }

    toggleObjImage() {
        if (!this.isOn) {
            this.container.list.forEach((sprite: any) => {
                sprite.setAlpha(1);
            });
            if  (this.body) this.body.enable = true;
        } else {
            this.container.list.forEach((sprite: any) => {
                sprite.setAlpha(0);
            });
            if  (this.body) this.body.enable = false;
        }
    }

    blink() {
        if (this.isOn) {
            this.blinkTween = this.scene.tweens.add({
                targets: this.self,
                alpha: 0.7,
                duration: 700,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
        }
    }


    stopBlink() {
        if (this.blinkTween) {
            this.blinkTween.stop();
            this.blinkTween = null;
        }
    }
}