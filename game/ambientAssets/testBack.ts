import { globalState } from "../GlobalDataManager";
import EventsCenterManager from "../services/EventsCenter";
import AmbientBackgroundScene from "./backgroundScene";

export default class TestBack extends Phaser.GameObjects.Container {
    scene: AmbientBackgroundScene
    morning: Phaser.GameObjects.Rectangle;
    middleDay: Phaser.GameObjects.Rectangle;
    afternoun: Phaser.GameObjects.Image;
    night: Phaser.GameObjects.Image;
    stars: Phaser.GameObjects.Image;
    eventCenter = EventsCenterManager.getInstance();

    constructor(scene: AmbientBackgroundScene, x: number, y: number, width: number, height: number) {
        super(scene, x, y);
        this.scene = scene
        // this.morning = scene.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0x4ddbff).setAlpha(1).setOrigin(0.5)
        // this.middleDay = scene.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0x4ddbff).setAlpha(0).setOrigin(0.5)
        this.morning = scene.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0xaefbff).setAlpha(1).setOrigin(0.5)
        this.middleDay = scene.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0x4ddbff).setAlpha(0).setOrigin(0.5)
        this.afternoun = scene.add.image(0, 0, "day").setAlpha(0);
        this.night = scene.add.image(0, 0, "night").setAlpha(0);
        this.stars = scene.add.image(0, 0, "stars").setAlpha(0);


        this.add([this.morning, this.middleDay, this.afternoun, this.night, this.stars]);
        this.scene.add.existing(this)

        this.eventCenter.turnEventOn("AmbientBackgroundScene", this.eventCenter.possibleEvents.UPDATE_STATE, () => {
            const globalState = this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.GET_STATE, undefined)
            this.changeSky(globalState.timeOfDay)
        }, this.scene)
    }

    tweenSky(target: 'morning' | 'middleDay' | 'afternoun' | 'night', on: boolean) {
        const targets = {
            'morning': [this.morning],
            'middleDay': [this.middleDay],
            'afternoun': [this.afternoun],
            'night': [this.night, this.stars]
        }
        this.scene.tweens.add({
            targets: targets[target],
            alpha: on ? 1 : 0,
            duration: 800,
            ease: 'ease',
        });

    }

    changeSky(momentOfDay: number) {
        switch (momentOfDay) {
            case 1:
                this.tweenSky('morning', true)
                this.tweenSky('middleDay', false)
                this.tweenSky('afternoun', false)
                this.tweenSky('night', false)
                break;
            case 2:
                this.tweenSky('morning', false)
                this.tweenSky('middleDay', true)
                this.tweenSky('afternoun', false)
                this.tweenSky('night', false)
                break;
            case 3:
                this.tweenSky('morning', false)
                this.tweenSky('middleDay', false)
                this.tweenSky('afternoun', true)
                this.tweenSky('night', false)
                break;
            case 4:
                this.tweenSky('morning', false)
                this.tweenSky('middleDay', false)
                this.tweenSky('afternoun', false)
                this.tweenSky('night', true)
                break;
        }
    }
}