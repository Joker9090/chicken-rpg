import RPG from "../rpg";
import { RpgIsoSpriteBox } from "./rpgIsoSpriteBox";

export class RpgIsoPlayerSecundarioTalker extends RpgIsoSpriteBox {
  direction: string = "s";
  group?: Phaser.GameObjects.Group;
  velocity: number = 1;
  text?: string;
  textDisplayed?: Phaser.GameObjects.Text;
  isWriting: boolean = false;
  constructor(
    scene: RPG,
    x: number,
    y: number,
    z: number,
    texture: string,
    frame: string | number,
    group?: Phaser.GameObjects.Group,
    direction: string = "s",
    matrixPosition?: { x: number; y: number; h: number }
  ) {
    // @ts-ignore
    super(scene, x, y, z, texture, frame, group, matrixPosition);
    this.direction = direction;

    this.self.play("idle-" + this.direction);
    scene.cameras.main.startFollow(this);

    this.self.on("pointerover", () => this.pointerover());
    this.self.on("pointerout", () => this.pointerout());
    this.self.on("pointerdown", () => this.pointerdown());
    
    this.type = "PLAYER";
    this.group = group;

    this.text = "¡Welcome to the jungle of wild chickens!"
    this.textDisplayed = this.scene.add.text(x + 300, y + 300, "", {
      backgroundColor: 'white',
      color: 'black',
      padding: {x: 20, y: 20},
      fontSize: 24,
    }).setVisible(false)

  }


  breakInteract(){
    if (this.textDisplayed?.text === this.text && this.isWriting === true){
      this.isWriting = false
    }
    if (!this.isWriting) {
      this.textDisplayed?.setVisible(false)
      this.textDisplayed?.setText("")
    }
  }

  interact(){
    if (this.text) {
      this.textBuilder(this.text, 100)
      this.isWriting = true
    }
  }

  textBuilder(text: string, deltaTime: number = 100) {
    if (this.textDisplayed?.text === ""){
      const letters = text.split("");
      if (this.textDisplayed) {
        this.textDisplayed.setVisible(true)
        this.showText(
          this.textDisplayed,
          letters,
          0,
          deltaTime,
          this.showText,
        );
      }
    } 
  }

  showText(
    target: Phaser.GameObjects.Text,
    message: string[],
    index: number = 0,
    interval: number,
    callBack: Function,
  ) {
    if (index < message.length) {
      if (index === message.length - 1) this.isWriting = false
      const self = this;
      target.setText(target.text + message[index]);
      setTimeout(() => {
        index++;
        callBack.bind(self)(
          target,
          message,
          index,
          interval,
          callBack,
        );
      }, interval);
    }
  }

  pointerover() {
    this.self.setTint(0xff00ff);
  }

  pointerout() {
    this.self.setTint(0xffffff);
  }

  pointerdown() {
    this.scene.cameras.main.startFollow(this);
    this.cleanMovements();
    this.drawMovements();
  }

  cleanMovements() {
    this.group?.children.entries.forEach((tile) => {
      const t = tile as unknown as RpgIsoSpriteBox;
      if (t.type === "GRASS") t.self.clearTint();
    });
  }

  drawMovementsRecursive(tile: RpgIsoSpriteBox) {
    const x = tile.isoX;
    const y = tile.isoY;
    const z = tile.isoZ;
    const t = this.group?.children.entries as unknown as RpgIsoSpriteBox[];

    const tileN = t.find(
      (tile) => tile.isoX === x && tile.isoY === y - 1 && tile.isoZ === z
    ) as RpgIsoSpriteBox;
    const tileS = t.find(
      (tile) => tile.isoX === x && tile.isoY === y + 1 && tile.isoZ === z
    ) as RpgIsoSpriteBox;
    const tileE = t.find(
      (tile) => tile.isoX === x + 1 && tile.isoY === y && tile.isoZ === z
    ) as RpgIsoSpriteBox;
    const tileW = t.find(
      (tile) => tile.isoX === x - 1 && tile.isoY === y && tile.isoZ === z
    ) as RpgIsoSpriteBox;

    if (tileN) {
      tileN.self.setTint(0x00ff00);
      this.drawMovementsRecursive(tileN);
    }
    if (tileS) {
      tileS.self.setTint(0x00ff00);
      this.drawMovementsRecursive(tileS);
    }
    if (tileE) {
      tileE.self.setTint(0x00ff00);
      this.drawMovementsRecursive(tileE);
    }
    if (tileW) {
      tileW.self.setTint(0x00ff00);
      this.drawMovementsRecursive(tileW);
    }
  }

  update(){

  }

  drawMovements() {
    const tiles = this.group?.children.entries as unknown as RpgIsoSpriteBox[];

    const grassTiles = tiles.filter(
      (tile) => tile.type === "GRASS" && tile.matrixPosition
    );
    if (this.matrixPosition) {
      const { x: xp, y: yp, h: hp } = this.matrixPosition;
      grassTiles.forEach((tile) => {
        if (tile.matrixPosition) {
          const { x, y, h } = tile.matrixPosition;

          const reach = this.velocity;

           if (
            (x >= xp - reach && x <= xp + reach && y === yp) ||
            (y >= yp - reach && y <= yp + reach && x === xp)
          ) {
            tile.self.setTint(0x00ffff);
          }  else if (
            Math.abs(x - xp) <= reach &&
            Math.abs(y - yp) <= reach &&
            Math.abs(x - xp) + Math.abs(y - yp) <= reach // Ajuste para diagonal
          ) {
            tile.self.setTint(0x00ff00);
          }
          
        }
      });
    }
  }
}
