import { RpgIsoSpriteBox } from "./rpgIsoSpriteBox";

export class RpgIsoPlayerPrincipal extends RpgIsoSpriteBox {
  direction: string = "s";
  group?: Phaser.GameObjects.Group;
  velocity: number = 2;
  name: string;
  isMoving: boolean = false;
  facingDirection: string = "s";
  possibleMovements: RpgIsoSpriteBox[] = [];

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
    name: string = "test"
  ) {

    const interactivityBox = {
      x: 50,
      y: 25,
      w: 50,
      h: 80,
    };
    
    // @ts-ignore
    super(scene, x, y, z, texture, frame, group, matrixPosition, interactivityBox);
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

  clearPossibleMovements() {
    this.possibleMovements.forEach((tile) => {
      tile.self.clearTint();
      tile.self.off("pointerdown", () => this.possibleMovementMouseDown(tile));
      tile.self.off("pointerover", () => this.possibleMovementMouseOver(tile));
      tile.self.off("pointerout", () => this.possibleMovementMouseOut(tile));
    });
    this.possibleMovements = [];
  }

  drawMovements() {
    const tiles = this.group?.children.entries as unknown as RpgIsoSpriteBox[];
    const mouseMovement = [] as RpgIsoSpriteBox[];
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
            (y >= yp - reach && y <= yp + reach && x === xp) ||
            (Math.abs(x - xp) <= reach &&
              Math.abs(y - yp) <= reach &&
              Math.abs(x - xp) + Math.abs(y - yp) <= reach) // Ajuste para diagonal
          ) {
            mouseMovement.push(tile);
          }
        }
      });

      this.possibleMovements = mouseMovement;

      this.possibleMovements.forEach((tile) => {
        tile.self.setTint(0x00ff00);

        tile.self.on("pointerdown", () => this.possibleMovementMouseDown(tile));
        tile.self.on("pointerover", () => this.possibleMovementMouseOver(tile));
        tile.self.on("pointerout", () => this.possibleMovementMouseOut(tile));


      });
    }
  }

  possibleMovementMouseDown(tile: RpgIsoSpriteBox) {
    // this.clearPossibleMovements();
    this.isMoving = true;
    console.log("tilePosition", tile.matrixPosition, this.matrixPosition)

    // swithc funcion to change direction on depends matrix position dif
    let newDirection = this.facingDirection
    if (tile.matrixPosition && this.matrixPosition) {
      const { x, y } = tile.matrixPosition;
      const { x: xp, y: yp } = this.matrixPosition;
      if (x > xp) {
        newDirection = "w";
      } else if (x < xp) {
        newDirection = "e";
      } else if (y > yp) {
        newDirection = "s";
      } else if (y < yp) {
        newDirection = "n";
      }
    }
    this.facingDirection = newDirection;
    this.self.play("walk-" + this.facingDirection);
    this.tweenTile(tile, this.facingDirection);
  }

  possibleMovementMouseOver(tile: RpgIsoSpriteBox) {
    console.log(tile,"barto")
    if(tile){
      // @ts-ignore
      if(!tile.baseZ) tile.baseZ = tile.isoZ;
      this.scene.tweens.add({
        targets: tile,
        isoZ: tile.isoZ + 5,
        duration: 100,
        yoyo: false,
        repeat: 0,
      });
    }
    // if(tile) tile.setTint(0x0000ff);
  }

  possibleMovementMouseOut(tile: RpgIsoSpriteBox) {
    console.log(tile,"barto")
    if(tile){
      this.scene.tweens.add({
        targets: tile,
        // @ts-ignore
        isoZ: tile.baseZ,
        duration: 100,
        yoyo: false,
        repeat: 0,
      });
    }
  }

  getObjectAt(matrixPosition: { x: number; y: number; h: number }) {
    const tiles = this.group?.children.entries as unknown as RpgIsoSpriteBox[];

    if (this.matrixPosition) {
      let _tile: RpgIsoSpriteBox | undefined;
      tiles.forEach((tile) => {
        if (tile.matrixPosition) {
          const { x, y, h } = tile.matrixPosition;
          console.log("tile", x, y, h, tile.type);
          if (
            x == matrixPosition.x &&
            y == matrixPosition.y &&
            h == matrixPosition.h
          ) {
            _tile = tile;
          }
        }
      });
      console.log("tile", _tile);
      return _tile;
    }
  }

  getTileAt(
    matrixPosition: { x: number; y: number; h: number },
    hasObject: boolean = false
  ) {
    const tiles = this.group?.children.entries as unknown as RpgIsoSpriteBox[];

    const grassTiles = tiles.filter(
      (tile) => tile.type === "GRASS" && tile.matrixPosition
    );

    const allTiles = tiles.filter((tile) => tile.matrixPosition);

    if (this.matrixPosition) {
      let _tile: RpgIsoSpriteBox | undefined;
      (hasObject ? allTiles : grassTiles).forEach((tile) => {
        if (tile.matrixPosition) {
          const { x, y, h } = tile.matrixPosition;
          if (
            x == matrixPosition.x &&
            y == matrixPosition.y &&
            h == matrixPosition.h
          ) {
            if (hasObject) {
              const obj = this.getObjectAt({ x: x, y: y, h: h + 50 });
              console.log("ENTRO?", obj, hasObject);
              if (!obj) _tile = tile;
            } else {
              _tile = tile;
            }
          }
        }
      });
      console.log("tile", _tile);
      return _tile;
    }
  }

  tweenTile(tile: RpgIsoSpriteBox, direction: string) {
    this.scene.tweens.add({
      targets: this.self,
      isoZ: this.isoZ,
      isoX: tile.isoX,
      isoY: tile.isoY,
      duration: 400,
      yoyo: false,
      repeat: 0,
      onComplete: () => {
        if (tile.matrixPosition)
          this.matrixPosition = { ...tile.matrixPosition };
        this.isMoving = false;
        this.self.play("idle-" + direction);
        console.log("direction: ", direction);
      },
    });
  }

  move(direction: string, newX: number, newY: number) {
    this.clearPossibleMovements()
    //this.self.play("idle-" + this.direction);
    this.self.play("walk-" + direction);
    this.facingDirection = direction;
    if (this.matrixPosition) {
      const { x, y, h } = this.matrixPosition;
      const withObject = true;
      const tile = this.getTileAt(
        { x: x - newX, y: y - newY, h: h },
        withObject
      );
      tile?.self.setTint(0x00ff00);
      if (tile) {
        this.isMoving = true;
        this.tweenTile(tile, direction);
      }
    }
  }

  updateAnim(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (cursors && !this.isMoving) {
      const { up, down, left, right } = cursors;
      // if (up.isUp && down.isUp && left.isUp && right.isUp) this.self.stop(); // se comentó esto
      if (up.isDown) {
        //this.self.play("walk-n", true);
        this.move("e", 1, 0);
      } else if (down.isDown) this.move("w", -1, 0);
      else if (left.isDown) this.move("n", 0, 1);
      else if (right.isDown) this.move("s", 0, -1);
    }
  }
}
