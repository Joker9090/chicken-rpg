export default class MapManager {
  constructor(mapFile, game) {
    this.game = game;
    this.mapFile = mapFile;
    this.rows = [];
    this.posOfAnchor = [0, 0];
    this.distanceOfTiles = { width: 40, height: 40 };
    this.initMapParser();

    this.drawMap = this.drawMap.bind(this);
    this.setPosFromAnchor = this.setPosFromAnchor.bind(this);
  }

  initMapParser() {
    this.rows = this.mapFile.split('\n');
    this.iterateMapRows();
  }

  iterateMapRows(fn) {
    let blocks;
    for (let row_i = 0; row_i < this.rows.length; row_i += 1) {
      blocks = this.rows[row_i].split(' ');
      for (let block_i = 0; block_i < blocks.length; block_i += 1) {
        if (blocks[block_i] === "2") this.posOfAnchor = [row_i, block_i];
        if (typeof fn === "function") fn(blocks[block_i], row_i, block_i);
      }
    }
  }

  setPosFromAnchor(rowI, blockI) {
    return {
      x: (this.posOfAnchor[0] + blockI) * this.distanceOfTiles.width,
      y: (this.posOfAnchor[1] + rowI) * this.distanceOfTiles.height
    };
  }

  drawMap(isoGroup, conf = {}) {
    let tile, cube;
    const self = this;
    this.iterateMapRows((a, b, c) => {
      if (a === "1") {
        if (conf["1"] && typeof conf["1"] == "function") {
          conf["1"](a, b, c, this);
        } else {
          tile = self.game.add.isoSprite(
            self.setPosFromAnchor(b, c).x,
            self.setPosFromAnchor(b, c).y,
            conf.height,
            'tile',
            isoGroup
          );
          self.game.isoPhysics.world.enable(tile);
          tile.body.collideWorldBounds = true;
          tile.tileType = "1";

          tile.setInteractive();
          tile.on('pointerover', function() {
            this.setTint(0x86bfda);
            this.isoZ += 5;
          });

          tile.on('pointerout', function() {
            this.clearTint();
            this.isoZ -= 5;
          });
        }
      }

      if (a === "3") {
        if (conf["3"] && typeof conf["3"] == "function") {
          conf["3"](a, b, c, this);
        } else {

          cube = self.game.add.isoSprite(self.setPosFromAnchor(b, c).x, self.setPosFromAnchor(b, c).y, 2150, 'cube', isoGroup);
          // cube.setScale(2);
          self.game.isoPhysics.world.enable(cube);
          cube.isoZ += 10;
          cube.body.collideWorldBounds = true;
          cube.isPlayer = true;
          cube.body.bounce.set(1, 1, 0.2);
        }
      }
      if (a === "9") {
        if (conf["9"] && typeof conf["9"] == "function") {
          conf["9"](a, b, c, this);
        } else {
          tile = self.game.add.isoSprite(
            self.setPosFromAnchor(b, c).x,
            self.setPosFromAnchor(b, c).y,
            conf.height,
            'tile',
            isoGroup
          );
          tile.tileType = "9";
          self.game.isoPhysics.world.enable(tile);
          tile.body.collideWorldBounds = true;
          tile.body.immovable = true;

          tile.body.allowGravity = false;
          tile.setTint(0x8ffffa);
          tile.isJump = true;

        }
      }
      if (a === "8") {
        if (conf["8"] && typeof conf["8"] == "function") {
          conf["8"](a, b, c, this);
        } else {
          tile = self.game.add.isoSprite(
            self.setPosFromAnchor(b, c).x,
            self.setPosFromAnchor(b, c).y,
            conf.height,
            'tile',
            isoGroup
          );
          tile.tileType = "8";
          self.game.isoPhysics.world.enable(tile);
          tile.body.collideWorldBounds = true;
          tile.body.allowGravity = false;
          tile.setTint(0x8aaffa);
          tile.isCollapsable = true;

        }
      }
    });
  }
}
