import RPG from "../rpg";
import { PlayerBuilder, PossibleMovements } from "../PlayerBuilder";
import { CubeIsoSpriteBox } from "./cubeIsoSpriteBox";
import { RpgIsoSpriteBox } from "./rpgIsoSpriteBox";

export type PositionMatrix = {
  x: number,
  y: number,
  h: number,
}
export class RpgIsoPlayerPrincipal extends RpgIsoSpriteBox {
  direction: string = "s";
  group?: Phaser.GameObjects.Group;
  velocity: number = 4;
  name: string;
  isMoving: boolean = false;
  facingDirection: string = "s";
  possibleMovements: RpgIsoSpriteBox[] = [];
  levelConfig: any;
  distanceBetweenFloors: number
  playerBuilder: PlayerBuilder;
  lastDirection: string = "s";
  step: 0 | 1 = 0;

  constructor(
    scene: RPG,
    x: number,
    y: number,
    z: number,
    texture: string,
    frame: string | number,
    group?: Phaser.GameObjects.Group,
    direction: string = "s",
    matrixPosition?: { x: number; y: number; h: number },
    name: string = "test",
    distanceBetweenFloors: number = 50
  ) {

    const interactivityBox = {
      x: 50,
      y: 25,
      w: 80,
      h: 80,
    };

    // @ts-ignore
    super(scene, x, y, z + 20, texture, frame, group, matrixPosition, interactivityBox);
    this.direction = direction;
    this.name = name;
    this.distanceBetweenFloors = distanceBetweenFloors;
    this.self.play("idle-" + this.direction);
    scene.cameras.main.startFollow(this);

    this.type = "PLAYER";
    this.group = group;

    this.playerBuilder = new PlayerBuilder(scene);

    this.playerBuilder.getContainer().setPosition(this.self.x, this.self.y, this.self.z);
    this.playerBuilder.getContainer().setDepth(this.customDepth || this.self.depth);
    this.self?.setAlpha(0);
  }

  playAnimBarto (direction: string) {
      switch (direction) {
        case "n":
          this.self.play("walk-n");
          this.playerBuilder.chainMovement([
            PossibleMovements.LEFT1, PossibleMovements.LEFT2, PossibleMovements.LEFT1, PossibleMovements.LEFT2,
          ])
          break;
        case "s":
          this.self.play("walk-s");
          this.playerBuilder.chainMovement([
            PossibleMovements.BOTTOM1, PossibleMovements.BOTTOM2, PossibleMovements.BOTTOM1, PossibleMovements.BOTTOM2,
          ])
          break;
        case "e":
          this.self.play("walk-e");
          this.playerBuilder.chainMovement([
            PossibleMovements.RIGHT1, PossibleMovements.RIGHT2, PossibleMovements.RIGHT1, PossibleMovements.RIGHT2,
          ])
          break;
        case "w":
          this.self.play("walk-w");
          this.playerBuilder.chainMovement([
            PossibleMovements.TOP1, PossibleMovements.TOP2,PossibleMovements.TOP1, PossibleMovements.TOP2,
          ])
          break;
        default:
          this.self.play("idle-s");
          break;
        }
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
      tile.self.removeAllListeners();
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

        let tilesListener = tile.self.eventNames();
        if (!tilesListener.includes("pointerdown")) {
          tile.self.on("pointerdown", () => this.possibleMovementMouseDown(tile));
        }
        tile.self.on("pointerover", () => this.possibleMovementMouseOver(tile));
        tile.self.on("pointerout", () => this.possibleMovementMouseOut(tile));


      });
    }
  }

  checkCubeAround(objectPosition: PositionMatrix) {
    if (this.matrixPosition) {
      const newDistance = {
        x: objectPosition.x - this.matrixPosition.x,
        y: objectPosition.y - this.matrixPosition.y,
        h: objectPosition.h - this.matrixPosition.h,
      };
      return newDistance;
    }
    return { x: 0, y: 0, h: 0 }
  }

  calculatePath(start: PositionMatrix, end: PositionMatrix) {
    let pathXFirst = [];
    let pathYFirst = [];

    let { x: xs, y: ys } = start;
    let { x: xe, y: ye } = end;

    if (xs !== xe) {
      const stepsX = Math.abs(xe - xs);
      const directionX = xe > xs ? 1 : -1;

      for (let i = 1; i <= stepsX; i++) {
        const nextPos = { ...start, x: xs + i * directionX, y: ys };
        const [tile] = this.getTileAt(nextPos);
        const objectOnTile = this.getObjectAt({ x: nextPos.x, y: nextPos.y, h: nextPos.h + this.distanceBetweenFloors });
        if (tile && !objectOnTile) {
          pathXFirst.push(nextPos);
        } else {
          pathXFirst = []; 
          break;
        }
      }
    }

    if (pathXFirst.length && ys !== ye) {
      const stepsY = Math.abs(ye - ys);
      const directionY = ye > ys ? 1 : -1;

      for (let i = 1; i <= stepsY; i++) {
        const nextPos = { ...start, x: xe, y: ys + i * directionY };
        const [tile] = this.getTileAt(nextPos);
        const objectOnTile = this.getObjectAt({ x: nextPos.x, y: nextPos.y, h: nextPos.h + this.distanceBetweenFloors });
        if (tile && !objectOnTile) {
          pathXFirst.push(nextPos);
        } else {
          pathXFirst = [];
          break;
        }
      }
    }

    if (ys !== ye) {
      const stepsY = Math.abs(ye - ys);
      const directionY = ye > ys ? 1 : -1;

      for (let i = 1; i <= stepsY; i++) {
        const nextPos = { ...start, x: xs, y: ys + i * directionY };
        const [tile] = this.getTileAt(nextPos);
        const objectOnTile = this.getObjectAt({ x: nextPos.x, y: nextPos.y, h: nextPos.h + this.distanceBetweenFloors });
        if (tile && !objectOnTile) {
          pathYFirst.push(nextPos);
        } else {
          pathYFirst = [];
          break;
        }
      }
    }

    if (pathYFirst.length && xs !== xe) {
      const stepsX = Math.abs(xe - xs);
      const directionX = xe > xs ? 1 : -1;

      for (let i = 1; i <= stepsX; i++) {
        const nextPos = { ...start, x: xs + i * directionX, y: ye };
        const [tile] = this.getTileAt(nextPos);
        const objectOnTile = this.getObjectAt({ x: nextPos.x, y: nextPos.y, h: nextPos.h + this.distanceBetweenFloors });
        if (tile && !objectOnTile) {
          pathYFirst.push(nextPos);
        } else {
          pathYFirst = [];
          break;
        }
      }
    }

    if (pathXFirst.length > 0) {
      return pathXFirst;
    } else if (pathYFirst.length > 0) {
      return pathYFirst;
    }

    return [];
  }



  movePath(path: PositionMatrix[]) {
    if (path.length === 0) {
      this.self.play("idle-" + this.facingDirection);
      this.clearPossibleMovements();
      return
    }

    const nextPos = path.shift();
    if (nextPos && this.matrixPosition) {
      const { x, y } = this.matrixPosition;
      let newDirection = this.facingDirection;

      if (nextPos.x > x) {
        newDirection = "w";
      } else if (nextPos.x < x) {
        newDirection = "e";
      } else if (nextPos.y > y) {
        newDirection = "s";
      } else if (nextPos.y < y) {
        newDirection = "n";
      }

      this.facingDirection = newDirection;
      this.self.play("walk-" + this.facingDirection);


      this.tweenTile(nextPos, this.facingDirection, () => {
        this.movePath(path);
      });
    }
  }

  //No esta en uso actualmente
  checkpath(originalPath: PositionMatrix[]) {

    let newPath = [];
    for (let i = 0; i < originalPath.length; i++) {
      //h + this.distanceBetweenFloors 
      let testPos: PositionMatrix = { ...originalPath[i], h: originalPath[i].h + this.distanceBetweenFloors };
      let _tile = this.getObjectAt(testPos);
      if (!_tile?.type) {
        newPath.push(originalPath[i]);
      }
    }
    return newPath;

  }



  possibleMovementMouseDown(tile: RpgIsoSpriteBox) {
    this.isMoving = true;
    let newDirection = this.facingDirection
    if (tile.matrixPosition && this.matrixPosition) {
      let path = this.calculatePath(this.matrixPosition, tile.matrixPosition);
      this.movePath(path);
    }
  }

  possibleMovementMouseOver(tile: RpgIsoSpriteBox) {
    if (tile) {
      // @ts-ignore
      if (!tile.baseZ) tile.baseZ = tile.isoZ;
      this.scene.tweens.add({
        targets: tile,
        isoZ: tile.isoZ + 5,
        duration: 100,
        yoyo: false,
        repeat: 0,
      });
    }
  }

  possibleMovementMouseOut(tile: RpgIsoSpriteBox) {
    if (tile) {
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
          if (
            x == matrixPosition.x &&
            y == matrixPosition.y &&
            h == matrixPosition.h
          ) {
            _tile = tile;
          }
        }
      });
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
      let _object: RpgIsoSpriteBox | undefined;

      (hasObject ? allTiles : grassTiles).forEach((tile) => {
        if (tile.matrixPosition) {
          const { x, y, h } = tile.matrixPosition;
          if (
            x == matrixPosition.x &&
            y == matrixPosition.y &&
            h == matrixPosition.h
          ) {
            _tile = tile;
            if (hasObject) {
              const obj = this.getObjectAt({ x: x, y: y, h: h + this.distanceBetweenFloors });
              _object = obj;
            }
          }
        }
      });
      return [_tile, _object];
    } else {
      return [
        undefined,
        undefined
      ]
    }
  }

  tweenTile(tile: PositionMatrix, direction: string, onCallback: () => void) {
    let _tile = this.getObjectAt(tile);
    if (_tile) {
      this.scene.tweens.add({
        targets: this.self,
        isoZ: this.isoZ,
        isoX: _tile.isoX,
        isoY: _tile.isoY,
        duration: 400,
        yoyo: false,
        repeat: 0,
        onComplete: () => {
          this.matrixPosition = { ...tile };
          this.isMoving = false;
          this.self.play("idle-" + direction);
          onCallback();
        },
      });
    }
  }

  tweenTileBox(tile: RpgIsoSpriteBox, direction: string) {
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
      },
    });
  }

  move(direction: string, newX: number, newY: number) {

    this.clearPossibleMovements()

    this.self.play("idle-" + this.direction);
    this.self.play("walk-" + direction);

    const pm = {
      n: PossibleMovements.TOP1,
      s: PossibleMovements.BOTTOM1,
      e: PossibleMovements.RIGHT1,
      w: PossibleMovements.LEFT1
    }
    const pm2 = {
      n: PossibleMovements.TOP2,
      s: PossibleMovements.BOTTOM2,
      e: PossibleMovements.RIGHT2,
      w: PossibleMovements.LEFT2
    }
    if(this.step == 0) {
      //@ts-ignore
      this.playerBuilder.selectMovement(pm[direction]);
      this.step = 1;
    } else {
      //@ts-ignore
      this.playerBuilder.selectMovement(pm2[direction]);
      this.step = 0;
    }

    this.facingDirection = direction;
    if (this.matrixPosition) {
      const { x, y, h } = this.matrixPosition;
      const withObject = true;
      const [tile, object] = this.getTileAt(
        { x: x - newX, y: y - newY, h: h },
        withObject
      );
      if (tile && !object) {
        this.isMoving = true;
        this.tweenTileBox(tile, direction);
      } else if (tile && object) {
        if (object.type == "CUBE") {

          (object as CubeIsoSpriteBox).moveCube(this);
        }
      }
    }
  }


  updateAnim(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {

    this.playerBuilder.getContainer().setPosition(this.self.x, this.self.y, this.self.z);
    this.playerBuilder.getContainer().setDepth(this.customDepth || this.self.depth);
    this.playerBuilder.getContainer().setScale(this.self.scaleX, this.self.scaleY);

    if (cursors && !this.isMoving) {
      const { up, down, left, right } = cursors;
      if (up.isDown) {
        this.move("e", 1, 0);
      } else if (down.isDown) this.move("w", -1, 0);
      else if (left.isDown) this.move("n", 0, 1);
      else if (right.isDown) this.move("s", 0, -1);
    }
  }
}
