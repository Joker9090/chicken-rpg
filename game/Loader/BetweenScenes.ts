import Phaser from "phaser";
import PreLoadScene from "./PreLoadScene";
import RPG from "../rpg";
import map from "../maps/room";
import MenuScene from "../MenuScene";

export enum BetweenScenesStatus {
    IDLE,
    PROCCESSING,
    WAITING,
}
export default class BetweenScenesScene extends Phaser.Scene {
    status: BetweenScenesStatus;
    blocks?: Phaser.GameObjects.Group;
    newSceneName?: string;
    newSceneWith?: any;
    firstRender: boolean = true
    startTime: number = 0

    constructor() {
        super({ key: "BetweenScenes" });
        this.status = BetweenScenesStatus.IDLE;
    }

    changeSceneTo(sceneName: string, data: any) {
        console.log("CHANGE SCENE TO", sceneName, data)
        if (this.status == BetweenScenesStatus.IDLE) {
            this.newSceneName = sceneName;
            this.newSceneWith = data;
            this.status = BetweenScenesStatus.PROCCESSING;
            this.scene.launch(this);
        }
    }

    loadNewScene() {
        if (this.status == BetweenScenesStatus.PROCCESSING) {
            this.status = BetweenScenesStatus.WAITING;
            if (this.newSceneName) {
                console.log(this.newSceneName, this.newSceneWith, "NEW SCSENE NAME")
                const rpg = new RPG(
                    map.map((m: any) => (typeof m === "string" ? m : JSON.stringify(m)))
                );
                this.scene.add("RPG", rpg, true);
                // const menuScene = new MenuScene()
                // this.scene.add("MenuScene", menuScene, true);

                this.scene.launch(this.newSceneName, this.newSceneWith);
                this.scene.bringToTop("RPG");
            }
            this.turnOff();
        }
    }

    finishLogic() {
        this.newSceneName = undefined;
        this.newSceneWith = undefined;
        this.status = BetweenScenesStatus.IDLE;
        this.scene.remove('PreLoadScene')
        this.scene.remove('MultiScene')
        this.scene.stop();
    }

    turnOff() {
        const self = this;
        let i = 0;
        let ii = 0;

        //@ts-ignore
        this.blocks.children.iterate((c) => {
            const child = c as Phaser.GameObjects.GameObject;
            this.tweens.add({
                targets: child,
                scale: 0,
                angle: 180,
                ease: "Power2",
                duration: 1000,
                delay: i * 50,
                repeat: 0,
                yoyo: false,
                hold: 200,
                //  onCompleteParams: self,
                onComplete: ii == 107 ? self.finishLogic.bind(self) : () => { },
            });

            i++;
            ii++;

            if (i % 12 === 0) {
                i = 0;
            }
        });
    }

    onTurnOnComplete() {
        // check if there is a scene preloadscene

        const preloadScene = new PreLoadScene(this.newSceneWith && this.newSceneWith.loadKey ? this.newSceneWith.loadKey : undefined, () => {
            this.loadNewScene()
            this.turnOff()
        });
        console.log(preloadScene, "PRELOAD SCENE")
        const scene = this.scene.add("PreLoadScene", preloadScene, true);

        console.log("ACAAAA 0123", this.game.scene.getScenes())
        // this.game.scene.start("PreLoadScene").bringToTop("PreLoadScene");
        console.log("ACAAAA 123")

    }
    turnOn() {
        const self = this;
        let i = 0;
        let ii = 0;
        //@ts-ignore
        this.blocks.children.iterate((c) => {
            const child = c as Phaser.GameObjects.GameObject;
            const { width, height } = this.cameras.main;
            const scale = Math.max(width / 20, height / 15);
            this.tweens.add({
                targets: child,
                scale: scale,
                angle: 180,
                ease: "Power2",
                duration: 1000,
                delay: i * 50,
                repeat: 0,
                yoyo: false,
                hold: 200,
                onComplete: ii == 107 ? this.onTurnOnComplete.bind(self) : () => { },
            });
            i++;
            ii++;

            if (i % 12 === 0) {
                i = 0;
            }
        });
    }

    create() {
        this.firstRender = true

        this.blocks = this.add.group({
            key: "block",
            repeat: 107,
            setScale: { x: 0, y: 0 },
        });

        const { width, height } = this.cameras.main;
        Phaser.Actions.GridAlign(this.blocks.getChildren(), {
            width: 12,
            height: 9,
            cellWidth: width / 12,
            cellHeight: height / 9,
            x: 0,
            y: 0,
        });

    }

    update(time: number) {
        if (this.startTime == 0) {
            this.startTime = time
        }
        if (this.firstRender && time - this.startTime > 980) {
            this.firstRender = false
            this.turnOn();
        }
    }
}
