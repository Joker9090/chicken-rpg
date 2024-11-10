const createBase = (n: number, playerPos: number[] = [0, 0]): string => {
  let _mn: number[][] = new Array(n).fill(new Array(n).fill(0));
  _mn = _mn.map((row, i) => row.map((_, j) => Number(0)));

  //@ts-ignore
  _mn[playerPos[0]][playerPos[1]] = "PS";

  const builded = _mn.map((row) => row.join(" ")).join("\n");
  return builded;
};

const createGrass = (n: number, withParser: boolean = true): string | number[][] => {
  let _mn: number[][] = new Array(n).fill(new Array(n).fill(1));
  _mn = _mn.map((row, i) => row.map((_, j) => Number(1)));
  const builded = _mn
  return !withParser ? builded : builded.map((row) => row.join(" ")).join("\n");;
};

const createStreets = (base: number[][] | string, streetConfig: streetConfig): string => {
  if (typeof base === "string") {
    return base;
  }
    let newXPos = streetConfig.xPos.map((x:number) => {
      // return array of streetWidth items with x+1, x+2...
      const street = new Array(streetConfig.streetWidth).fill(0).map((_, i) => x + i)
      return street
    }).flat()
    let newYPos = streetConfig.yPos.map((y:number) => {
      // return array of streetWidth items with x+1, x+2...
      const street = new Array(streetConfig.streetWidth).fill(0).map((_, i) => y + i)
      return street
    }).flat()
    // delete duplicated items in the arrays
    newXPos = newXPos.filter((item, index) => newXPos.indexOf(item) === index)
    newYPos = newYPos.filter((item, index) => newYPos.indexOf(item) === index)

    console.log("pos", newXPos, newYPos)

    const builded = base.map((row, i) => {
        //go through streetConfig and if i is equal to any xPos return all 3
        if (newXPos.includes(i)) {
            return row.map((_, j) => 10)
        } else {
          // map row and if j is equal to any yPos return 10
          return row.map((_, j) => {
            if (newYPos.includes(j)) {
              return 10
            }
            return 1
          })
        }
    }
    );
    const buildedWithStreet = builded.map((row) => row.join(" ")).join("\n");
    console.log("ARI", buildedWithStreet)
    return buildedWithStreet
    
}

export type streetConfig = {
  streetWidth: number,
  xPos: number[]
  yPos: number[]
}


export type BuildingConfig = {
  x: number; // POS X
  y: number; // POS Y
  w: number; // width
  h: number; // height
  z: number; // height
  type: string; // type
};

const generateBuildings = (n: number, buildings: BuildingConfig[]) => {
  let r = [];
  const generateLayer = () => {
    let _mn: number[][] = new Array(n).fill(new Array(n).fill(1));
    _mn = _mn.map((row, i) => row.map((_, j) => Number(0)));
    return _mn;
  };

  //grab highest building
  const largestBuilding = buildings.reduce((acc, building) => {
    if (building.h > acc.h) {
      return building;
    }
    return acc;
  });

  for (let i = 0; i < largestBuilding.h; i++) {
    let _mn = generateLayer();

    buildings.forEach((building) => {
      const { x, y, w, h, z, type } = building;
      for (let j = 0; j < z; j++) {
        for (let k = 0; k < w; k++) {
          if (i >= h) {
            continue;
          } else {
            _mn[x + k][y + j] = Number(type);
          }
        }
      }
    });
    r.push(_mn);
  }

  return r;
};

const buildings = generateBuildings(40, [
  // first line
  { x: 1, y: 1, w: 4, z: 4, h: 4, type: "4" },
  { x: 6, y: 2, w: 3, z: 3, h: 6, type: "4" },
  // { x: 10, y: 0, w: 5, z: 5, h: 12, type: "4" },
  { x: 16, y: 1, w: 4, z: 4, h: 6, type: "4" },
  { x: 21, y: 1, w: 4, z: 4, h: 7, type: "4" },
  // { x: 26, y: 1, w: 4, z: 4, h: 9, type: "4" },
  { x: 31, y: 1, w: 4, z: 4, h: 3, type: "4" },
  { x: 36, y: 0, w: 4, z: 4, h: 20, type: "4" },
  // second line
  { x: 1, y: 9, w: 4, z: 4, h: 12, type: "4" },
  { x: 6, y: 9, w: 3, z: 4, h: 4, type: "4" },
  // { x: 10, y: 9, w: 5, z: 4, h: 8, type: "4" },
  { x: 16, y: 9, w: 4, z: 4, h: 10, type: "4" },
  { x: 21, y: 9, w: 4, z: 4, h: 4, type: "4" },
  // { x: 26, y: 9, w: 4, z: 4, h: 5, type: "4" },
  { x: 31, y: 9, w: 4, z: 4, h: 3, type: "4" },
  { x: 36, y: 9, w: 4, z: 4, h: 10, type: "4" },
  // thrid line
  { x: 1, y: 18, w: 4, z: 4, h: 6, type: "4" },
  { x: 6, y: 18, w: 3, z: 4, h: 12, type: "4" },
  // { x: 10, y: 18, w: 5, z: 4, h: 3, type: "4" },
  { x: 16, y: 18, w: 4, z: 4, h: 10, type: "4" },
  { x: 21, y: 18, w: 4, z: 4, h: 15, type: "4" },
  // { x: 26, y: 18, w: 4, z: 4, h: 5, type: "4" },
  { x: 31, y: 18, w: 4, z: 4, h: 12, type: "4" },
  { x: 36, y: 18, w: 4, z: 4, h: 10, type: "4" },
  // fourth line
  { x: 1, y: 27, w: 4, z: 4, h: 6, type: "4" },
  { x: 6, y: 27, w: 3, z: 4, h: 8, type: "4" },
  // { x: 10, y: 27, w: 5, z: 4, h: 9, type: "4" },
  { x: 16, y: 27, w: 4, z: 4, h: 10, type: "4" },
  { x: 21, y: 27, w: 4, z: 4, h: 4, type: "4" },
  // { x: 26, y: 27, w: 4, z: 4, h: 10, type: "4" },
  { x: 31, y: 27, w: 4, z: 4, h: 12, type: "4" },
  { x: 36, y: 27, w: 4, z: 4, h: 5, type: "4" },
  // follow the patter until reach x 40
  // // {x: 15, y: 5,w: 4, z:4, h: 4,type: "4"},
  // { x: 15, y: 10, w: 4, z: 4, h: 4, type: "4" },
  // { x: 15, y: 15, w: 4, z: 4, h: 4, type: "4" },
  // { x: 15, y: 20, w: 4, z: 4, h: 4, type: "4" },
  // { x: 15, y: 25, w: 4, z: 4, h: 4, type: "4" },
  // { x: 15, y: 30, w: 4, z: 4, h: 4, type: "4" },
  // { x: 15, y: 35, w: 4, z: 4, h: 4, type: "4" },

  // // generate a cool city
  // { x: 10, y: 10, w: 4, z: 4, h: 4, type: "4" },
  // { x: 10, y: 15, w: 4, z: 4, h: 4, type: "4" },
  // { x: 10, y: 20, w: 4, z: 4, h: 4, type: "4" },
  // { x: 10, y: 25, w: 4, z: 4, h: 9, type: "4" },
]);

console.log(buildings);
const map = [
  {
    nivel: "city",
    player: "pepito",
    musica: "bkg-uno.mp3",
    ballTexture: "123",
    gravity: 9.8,
    tiles: {
      "1": "GRASS",
      "10": "STREET",
      "3": "BLOQUE-1",
      "4": "BLOQUERANDOM",
      "5": "COLUMNALARGA",
      "6": "COLUMNACORTA",
      "7": "SEMIBLOQUE",
      "8": "TREE",
      "9": "CUBE",
      PN: "PLAYER-N",
      PS: "PLAYER-S",
      PE: "PLAYER-E",
      PW: "PLAYER-W",
    },
  },

  // MAP PLAYER / ITEMS CONFIG
  [createBase(40, [5, 5])],
  createStreets(createGrass(40, false), {streetWidth: 3, xPos: [10,12, 26, 27], yPos: [5,14, 23, 32]}),
  ...buildings.map((building) =>
    building.map((row) => row.join(" ")).join("\n")
  ),
];
export default map;
