import { RpgIsoSpriteBox } from "./rpgIsoSpriteBox";

export class RpgIsoPlayerPrincipal extends RpgIsoSpriteBox {
  direction: string = "s";
  group?: Phaser.GameObjects.Group;
  velocity: number = 1;
  name: string;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    z: number,
    texture: string,
    frame: string | number,
    group?: Phaser.GameObjects.Group,
    direction: string = "s",
    matrixPosition?: { x: number; y: number; h: number },
    name: string = "test",
  ) {
    // @ts-ignore
    super(scene, x, y, z, texture, frame, group, matrixPosition, name);
    this.direction = direction;
    this.name = name;
    this.self.play("idle-" + this.direction);
    scene.cameras.main.startFollow(this);

    this.self.on("pointerover", () => this.pointerover());
    this.self.on("pointerout", () => this.pointerout());
    this.self.on("pointerdown", () => this.pointerdown());

    this.type = "PLAYER";
    this.group = group;

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

  getTileAt(matrixPosition: { x: number; y: number; h: number }) {
    
    const tiles = this.group?.children.entries as unknown as RpgIsoSpriteBox[];

    const grassTiles = tiles.filter(
      (tile) => tile.type === "GRASS" && tile.matrixPosition
    );
    if (this.matrixPosition) {
      
      let _tile : RpgIsoSpriteBox | undefined;
      grassTiles.forEach((tile) => {
        if (tile.matrixPosition) {
          
          const { x, y, h } = tile.matrixPosition;
          if(x == matrixPosition.x && y == matrixPosition.y && h == matrixPosition.h) {
            _tile = tile;

          }
          
        }
      });
      console.log("tile", _tile);
      return _tile
    }
  }

  move(direction: string) {
    this.self.play(direction);
    if(this.matrixPosition) {
      const { x, y, h } = this.matrixPosition;
      const tile = this.getTileAt({x: x, y: y + 1, h: h});
      if(tile) {
        this.scene.tweens.add(
          {
            targets: this.self,
            x: tile.x,
            y: tile.y,

          }
        )
      }
    }
  }
  

  updateAnim(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (cursors) {
      const { up, down, left, right } = cursors;
      if (up.isUp && down.isUp && left.isUp && right.isUp) 
      this.self.stop();
      else if (up.isDown) {
        //this.self.play("walk-n", true);
        this.move("walk-n");
      }
      else if (down.isDown) this.self.play("walk-s", true);
      else if (left.isDown) this.self.play("walk-w", true);
      else if (right.isDown) this.self.play("walk-e", true);
    }
  }
  setVelocity(x: number, y: number, z: number) {
    //@ts-ignore
    this.body?.velocity.setTo(x, y, z);
  }
  setPosition(x: number, y: number, z: number) {
    //@ts-ignore
    this.body?.position.setTo(x, y, z);
  }
}
