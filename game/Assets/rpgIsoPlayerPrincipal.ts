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

    //this.self.on("pointerover", () => this.pointerover());
    this.self.on("pointerout", () => this.pointerout());
    this.self.on("pointerdown", () => this.pointerdown());

    this.type = "PLAYER";
    this.group = group;

    //window.calculatePath = this.calculatePath

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
        //console.log("tiles listener: ", tilesListener);
        if(!tilesListener.includes("pointerdown")) {
          tile.self.on("pointerdown", () => this.possibleMovementMouseDown(tile));
        }
        tile.self.on("pointerover", () => this.possibleMovementMouseOver(tile));
        tile.self.on("pointerout", () => this.possibleMovementMouseOut(tile));


      });
    }
  }
  /*
  //A testear
  calculatePath(start: PositionMatrix, end: PositionMatrix) {
    let path = [];

    let { x: xs, y: ys } = start;
    let { x: xe, y: ye } = end;

    // Movimiento en el eje X primero
    if (xs !== xe) {
        const stepsX = Math.abs(xe - xs);
        const directionX = xe > xs ? 1 : -1; // Determina si va a la derecha o a la izquierda(lo q nos faltaba)

        for (let i = 1; i <= stepsX; i++) {
            path.push({ ...start, x: xs + i * directionX, y: ys });
        }
    }

    // Movimiento en el eje Y después
    if (ys !== ye) {
        const stepsY = Math.abs(ye - ys); 
        const directionY = ye > ys ? 1 : -1; // Determina si va hacia abajo o arriba(lo q nos faltaba)

        for (let i = 1; i <= stepsY; i++) {
            path.push({ ...start, x: xe, y: ys + i * directionY });
        }
    }

    return path;
  }
    */

  checkCubeAround(objectPosition: PositionMatrix) {
    if(this.matrixPosition) {
      const newDistance = {
        x: objectPosition.x - this.matrixPosition.x,
        y: objectPosition.y - this.matrixPosition.y,
        h: objectPosition.h - this.matrixPosition.h,
      };   
      return newDistance;
    }
    return {x:0,y:0,h:0}
  }

  //Se debe optimizar aun mas
  calculatePath(start: PositionMatrix, end: PositionMatrix) {
    let pathXFirst = [];
    let pathYFirst = [];
  
    let { x: xs, y: ys } = start;
    let { x: xe, y: ye } = end;
  
    // Calcula movimiento en el eje X primero
    if (xs !== xe) {
      const stepsX = Math.abs(xe - xs);
      const directionX = xe > xs ? 1 : -1;
  
      for (let i = 1; i <= stepsX; i++) {
        const nextPos = { ...start, x: xs + i * directionX, y: ys };
        // Verifica si la posición es válida usando getTileAt
        const [tile] = this.getTileAt(nextPos);
        const objectOnTile = this.getObjectAt({ x: nextPos.x, y: nextPos.y, h: nextPos.h + 50 });
        if (tile && !objectOnTile) {
          pathXFirst.push(nextPos);
        }else {
          pathXFirst = []; // Si hay obstáculo, resetea la ruta
          break;
        }
      }
    }
  
    // Luego movimiento en el eje Y
    if (pathXFirst.length && ys !== ye) {
      const stepsY = Math.abs(ye - ys);
      const directionY = ye > ys ? 1 : -1;
  
      for (let i = 1; i <= stepsY; i++) {
        const nextPos = { ...start, x: xe, y: ys + i * directionY };
        const [tile] = this.getTileAt(nextPos);
        const objectOnTile = this.getObjectAt({ x: nextPos.x, y: nextPos.y, h: nextPos.h + 50 });
        if (tile && !objectOnTile) {
          pathXFirst.push(nextPos);
        } else {
          pathXFirst = [];
          break;
        }
      }
    }
  
    // Calcula movimiento en el eje Y primero
    if (ys !== ye) {
      const stepsY = Math.abs(ye - ys);
      const directionY = ye > ys ? 1 : -1;
  
      for (let i = 1; i <= stepsY; i++) {
        const nextPos = { ...start, x: xs, y: ys + i * directionY };
        const [tile] = this.getTileAt(nextPos);
        const objectOnTile = this.getObjectAt({ x: nextPos.x, y: nextPos.y, h: nextPos.h + 50 });
        if (tile && !objectOnTile) {
          pathYFirst.push(nextPos);
        }else {
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
        const objectOnTile = this.getObjectAt({ x: nextPos.x, y: nextPos.y, h: nextPos.h + 50 });
        if (tile && !objectOnTile) {
          pathYFirst.push(nextPos);
        } else {
          pathYFirst = [];
          break;
        }
      }
    }
  
    // Elige el camino que no está bloqueado
    if (pathXFirst.length > 0) {
      return pathXFirst;
    } else if (pathYFirst.length > 0) {
      return pathYFirst;
    }
  
    // Si ambos caminos están bloqueados, regresa un array vacío
    return [];
  }
  
  

  movePath(path: PositionMatrix[]) {
    if(path.length === 0) {
      this.self.play("idle-" + this.facingDirection);
      this.clearPossibleMovements();
      return
    }

    //return

    const nextPos = path.shift();
    console.log("move path next mov: ",nextPos);
    if(nextPos && this.matrixPosition) {
      const {x, y} = this.matrixPosition;
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
      //h + 50 
      let testPos: PositionMatrix = {...originalPath[i] , h: originalPath[i].h + 50 };
      let _tile = this.getObjectAt(testPos);
      console.log("checkpath _tile: ", _tile);
      if(!_tile?.type){
        newPath.push(originalPath[i]);
      }
    }
    return newPath;

  }
  
  

  possibleMovementMouseDown(tile: RpgIsoSpriteBox) {
    // this.clearPossibleMovements();
    this.isMoving = true;
    console.log("tilePosition(pos player , pos tile)", this.matrixPosition, tile.matrixPosition)

    // swithc funcion to change direction on depends matrix position dif
    let newDirection = this.facingDirection
    if (tile.matrixPosition && this.matrixPosition) {
      // const { x, y } = tile.matrixPosition;
      // const { x: xp, y: yp } = this.matrixPosition;
      let  path = this.calculatePath(this.matrixPosition,tile.matrixPosition);
      console.log("steps !!!!!: ", path);

      this.movePath(path);
    }
  }

  possibleMovementMouseOver(tile: RpgIsoSpriteBox) {
    //console.log(tile,"barto")
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
    //console.log(tile,"barto")
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
    console.log("matrixPosition get objectAt: ", matrixPosition);
    if (this.matrixPosition) {
      let _tile: RpgIsoSpriteBox | undefined;
      tiles.forEach((tile) => {
        if (tile.matrixPosition) {
          const { x, y, h } = tile.matrixPosition;
          //console.log("tile", x, y, h, tile.type);
          if (
            x == matrixPosition.x &&
            y == matrixPosition.y &&
            h == matrixPosition.h
          ) {
            _tile = tile;
          }
        }
      });
      //console.log("tile", _tile);
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
              const obj = this.getObjectAt({ x: x, y: y, h: h + 50 });
              _object = obj;
            } 
          }
        }
      });
      // console.log("tile", _tile);
      return [_tile,_object];
    } else {
      return [
        undefined,
        undefined
      ]
    }
  }

  tweenTile(tile: PositionMatrix, direction: string, onCallback: () => void) {
    let _tile = this.getObjectAt(tile);
    if(_tile) {
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
          console.log("direction: ", direction);
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
        // console.log("direction: ", direction);
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
      // console.log("config tile: ",x - newX,y - newY,h);
      const [tile, object] = this.getTileAt(
        { x: x - newX, y: y - newY, h: h },
        withObject
      );
      // console.log("move player after move box : ",tile, newX,newY);
      // tile?.self.setTint(0x00ff00);
      if (tile && !object) {
        console.log("tile 1",tile)
        this.isMoving = true;
        this.tweenTileBox(tile, direction);
      } else  if (tile && object) {
        console.log("tile 2",tile)
        if(object.type == "CUBE") {
          console.log("object",object);
          
          (object as CubeIsoSpriteBox).moveCube(this);
        }
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
