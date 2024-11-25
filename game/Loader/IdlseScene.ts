import Phaser from "phaser";
import MultiScene from "./MultiScene";
import BetweenScenes from "./BetweenScenes";

export default class IdleSceen extends Phaser.Scene {
  

    constructor() {
        super({ key: "IdleScene" });
    }

    create(){
        console.log("ENTRO AL IDLE SCENE")
        
        setTimeout(() => {
            const rpgScene = this.game.scene.getScene("RPG")
            rpgScene.events.once("destroy", () => {
                const multiScene = new MultiScene("MenuScene");
                this.scene.add("MultiScene", multiScene, true);
            },this)
            rpgScene.scene.stop();
            rpgScene.scene.remove();
            // console log de todas las escenas
           
         
          }, 13000)
    }
}
