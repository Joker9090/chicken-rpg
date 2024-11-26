const createBase = (n: number, playerPos: number[] = [0, 0]): string => {
  let _mn: number[][] = new Array(n).fill(new Array(n).fill(0));
  _mn = _mn.map((row, i) => row.map((_, j) => Number(0)));

  //@ts-ignore
  _mn[playerPos[0]][playerPos[1]] = "PS";

  const builded = _mn.map((row) => row.join(" ")).join("\n");
  return builded;
};

const createGrass = (
  n: number,
  withParser: boolean = true
): string | number[][] => {
  let _mn: number[][] = new Array(n).fill(new Array(n).fill(1));
  _mn = _mn.map((row, i) => row.map((_, j) => Number(1)));
  const builded = _mn;
  return !withParser ? builded : builded.map((row) => row.join(" ")).join("\n");
};

const addItems = (base: number[][], objets: ObjetsConfig[]) => {
  for (let i = 0; i < objets.length; i++) {
    const { x, y, type } = objets[i];
    // @ts-ignore
    base[x][y] = type;
  }

  return base;
};

const createBullets = (
  base: number[][],
  withParser: boolean = true
): string | number[][] => {
  console.log("createBullets", base);
  return !withParser ? base : base.map((row) => row.join(" ")).join("\n");
};

const createSideWalk = (
  base: number[][] | string,
  sideWalkConfig: sideWalkConfig,
  withParser: boolean = true
): string | number[][] => {
  if (typeof base === "string") {
    return base;
  }
  let newXPos = sideWalkConfig.xPos
    .map((x: number) => {
      // return array of streetWidth items with x+1, x+2...
      const street = new Array(1)
        .fill(0)
        .map((_, i) => x + i);
      console.log("STR", street);
      return street;
    })
    .flat();
  let newYPos = sideWalkConfig.yPos
    .map((y: number) => {
      // return array of streetWidth items with x+1, x+2...
      const street = new Array(1)
        .fill(0)
        .map((_, i) => y + i);
      console.log("STRETY", street);
      return street;
    })
    .flat();
  // delete duplicated items in the arrays
  newXPos = newXPos.filter((item, index) => newXPos.indexOf(item) === index);
  newYPos = newYPos.filter((item, index) => newYPos.indexOf(item) === index);

  const builded = base.map((row, i) => {
    console.log("ENTRO ACA")
    //go through sideWalkConfig and if i is equal to any xPos return all 3
    if (newXPos.includes(i)) {
      console.log("ENTRO ACA123123123")
      return row.map((_, j) => 133);
    } else {
      // map row and if j is equal to any yPos return 10
      return row.map((_, j) => {
      console.log("ENTRO ACA123123123")
        if (newYPos.includes(j)) {
          return 133;
        }
        return _;
      });
    }
  });
  return !withParser ? builded : builded.map((row) => row.join(" ")).join("\n");

}

const createStreets = (
  base: number[][] | string,
  streetConfig: streetConfig,
  withParser: boolean = true
): string | number[][] => {
  if (typeof base === "string") {
    return base;
  }
  let newXPos = streetConfig.xPos
    .map((x: number) => {
      // return array of streetWidth items with x+1, x+2...
      const street = new Array(streetConfig.streetWidth)
        .fill(0)
        .map((_, i) => x + i);
      return street;
    })
    .flat();
  let newYPos = streetConfig.yPos
    .map((y: number) => {
      // return array of streetWidth items with x+1, x+2...
      const street = new Array(streetConfig.streetWidth)
        .fill(0)
        .map((_, i) => y + i);
      return street;
    })
    .flat();
  // delete duplicated items in the arrays
  newXPos = newXPos.filter((item, index) => newXPos.indexOf(item) === index);
  newYPos = newYPos.filter((item, index) => newYPos.indexOf(item) === index);

  const builded = base.map((row, i) => {
    //go through streetConfig and if i is equal to any xPos return all 3
    if (newXPos.includes(i)) {
      return row.map((_, j) => 10);
    } else {
      // map row and if j is equal to any yPos return 10
      return row.map((_, j) => {
        if (newYPos.includes(j)) {
          return 10;
        }
        return 1;
      });
    }
  });

  // now we need to change all vertical streets to number 10, all horizontal streets to number 11 and all possible intersections to number 12

  // first we need to find all intersections
  let xIntersections = [];
  let yIntersections = [];

  let xPosStreets =
    typeof streetConfig.xPos == "number"
      ? [streetConfig.xPos]
      : streetConfig.xPos;
  let yPosStreets =
    typeof streetConfig.yPos == "number"
      ? [streetConfig.yPos]
      : streetConfig.yPos;
  let maxMapSize = builded.length;

  // check the width of the street and add subadditionals streets

  for (let i = 0; i < streetConfig.streetWidth; i++) {
    let toAddOnX = [];
    let toAddOnY = [];
    for (let j = 0; j < xPosStreets.length; j++) {
      toAddOnX.push(xPosStreets[j] + i);
    }
    xPosStreets = xPosStreets.concat(toAddOnX);

    for (let j = 0; j < yPosStreets.length; j++) {
      toAddOnY.push(yPosStreets[j] + i);
    }
    yPosStreets = yPosStreets.concat(toAddOnY);

    xPosStreets = xPosStreets.filter(
      (item, index) => xPosStreets.indexOf(item) === index
    );
    yPosStreets = yPosStreets.filter(
      (item, index) => yPosStreets.indexOf(item) === index
    );
  }

  for (let i = 0; i < xPosStreets.length; i++) {
    for (let j = 0; j < maxMapSize; j++) {
      if (xPosStreets[i] && builded[i][j]) {
        xIntersections.push([xPosStreets[i], j]);
        builded[xPosStreets[i]][j] = 11;
      }
    }
  }

  for (let i = 0; i < yPosStreets.length; i++) {
    for (let j = 0; j < maxMapSize; j++) {
      if (yPosStreets[i] && builded[j][i]) {
        yIntersections.push([j, yPosStreets[i]]);
        builded[j][yPosStreets[i]] = 10;
      }
    }
  }

  for (let i = 0; i < xIntersections.length; i++) {
    for (let j = 0; j < yIntersections.length; j++) {
      if (
        xIntersections[i][0] === yIntersections[j][0] &&
        xIntersections[i][1] === yIntersections[j][1]
      ) {
        builded[xIntersections[i][0]][xIntersections[i][1]] = 12;
      }
    }
  }



  // const buildedWithStreet = builded.map((row) => row.join(" ")).join("\n");
  return !withParser ? builded : builded.map((row) => row.join(" ")).join("\n");
};

export type ObjetsConfig = {
  x: number;
  y: number;
  h: number;
  type: string;
};

export type streetConfig = {
  streetWidth: number;
  xPos: number[];
  yPos: number[];
};

export type sideWalkConfig = {
  xPos: number[];
  yPos: number[];
};

export type BuildingConfig = {
  x: number; // POS X
  y: number; // POS Y
  w: number; // width
  h: number; // height
  z: number; // height
  type: string; // type
  replace?: number[][][]; // type
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
      const { x, y, w, h, z, type, replace } = building;

      if (replace) {
        for (let j = 0; j < z; j++) {
          for (let k = 0; k < w; k++) {
            if (i >= h) {
              continue;
            } else {
              _mn[x + k][y + j] = replace[i] && replace[i][j] && replace[i][j][k] ? Number(replace[i][j][k]) : Number(type);

            }
          }
        }
      } else {
        for (let j = 0; j < z; j++) {
          for (let k = 0; k < w; k++) {
            if (i >= h) {
              continue;
            } else {
              _mn[x + k][y + j] = Number(type);
            }
          }
        }
      }
    });
    r.push(_mn);
  }

  return r;
};




const objects: ObjetsConfig[] = [
  {
    x: 5,
    y: 31,
    h: 400,
    type: "15",
  },
  {
    x: 8,
    y: 36,
    h: 0,
    type: "8",
  },
  {
    x: 8,
    y: 2,
    h: 0,
    type: "8",
  },
  {
    x: 6,
    y: 3,
    h: 0,
    type: "8",
  },
  {
    x: 3,
    y: 36,
    h: 0,
    type: "8",
  },
];

// create an object with type ObjetsConfig[] to add trees in random places of thje map
for (let i = 0; i < 200; i++) {
  objects.push({
    x: Math.floor(20 + Math.random() * 20),
    y: Math.floor(Math.random() * 40),
    h: 0,
    type: "8",
  });
}

console.log("OBJECTS", objects);

const streetConfig = {
  streetWidth: 3,
  xPos: [10, 12],
  yPos: [],
};

const sideWalkConfig = {
  xPos: [9, 15],
  yPos: [],
};

const buidling1 = [
  [
    [18, 18, 18, 18],
    [18, 18, 18, 28],
    [18, 18, 18, 29],
    [18, 18, 18, 18],
  ],
  [
    [18, 18, 18, 18],
    [18, 18, 18, 28],
    [18, 18, 18, 29],
    [18, 23, 23, 18],
  ],
  [
    [18, 18, 18, 18],
    [18, 18, 18, 26],
    [18, 18, 18, 27],
    [18, 25, 25, 18],
  ],
  [
    [18, 18, 18, 18],
    [18, 18, 18, 18],
    [18, 18, 18, 18],
    [18, 18, 18, 18],
  ],
  [
    [18, 18, 18, 18],
    [18, 18, 18, 20],
    [18, 18, 18, 20],
    [18, 23, 23, 18],
  ],
  [
    [18, 18, 18, 18],
    [18, 18, 18, 22],
    [18, 18, 18, 22],
    [18, 25, 25, 18],
  ],
  [
    [18, 18, 18, 18],
    [18, 18, 18, 20],
    [18, 18, 18, 20],
    [18, 23, 23, 18],
  ],
  [
    [18, 18, 18, 18],
    [18, 18, 18, 22],
    [18, 18, 18, 22],
    [18, 25, 25, 18],
  ],
  [
    [18, 18, 18, 18],
    [18, 18, 18, 20],
    [18, 18, 18, 20],
    [18, 23, 23, 18],
  ],
  [
    [18, 18, 18, 18],
    [18, 18, 18, 22],
    [18, 18, 18, 22],
    [18, 25, 25, 18],
  ],
  [
    [18, 18, 18, 18],
    [18, 18, 18, 20],
    [18, 18, 18, 20],
    [18, 23, 23, 18],
  ],
  [
    [18, 18, 18, 18],
    [18, 18, 18, 22],
    [18, 18, 18, 22],
    [18, 25, 25, 18],
  ],
  [
    [18, 18, 18, 18],
    [18, 18, 18, 20],
    [18, 18, 18, 20],
    [18, 23, 23, 18],
  ],
  [
    [18, 18, 18, 18],
    [18, 18, 18, 22],
    [18, 18, 18, 22],
    [18, 25, 25, 18],
  ],
  [
    [18, 18, 18, 18],
    [18, 18, 18, 20],
    [18, 18, 18, 20],
    [18, 23, 23, 18],
  ],
  [
    [18, 18, 18, 18],
    [18, 18, 18, 22],
    [18, 18, 18, 22],
    [18, 25, 25, 18],
  ],
  [
    [18, 18, 18, 31],
    [18, 18, 18, 32],
    [18, 18, 18, 32],
    [34, 35, 35, 33],
  ]
];

const buidling3 = [
  [
    [18, 18, 18, 18],
    [18, 18, 18, 28],
    [18, 18, 18, 29],
    [18, 18, 18, 18],
  ],
  [
    [18, 18, 18, 18],
    [18, 18, 18, 28],
    [18, 18, 18, 29],
    [18, 23, 23, 18],
  ],
  [
    [18, 18, 18, 18],
    [18, 18, 18, 26],
    [18, 18, 18, 27],
    [18, 25, 25, 18],
  ],
  [
    [18, 18, 18, 18],
    [18, 18, 18, 18],
    [18, 18, 18, 18],
    [18, 18, 18, 18],
  ],
  [
    [18, 18, 18, 18],
    [18, 18, 18, 20],
    [18, 18, 18, 20],
    [18, 23, 23, 18],
  ],
  [
    [18, 18, 18, 18],
    [18, 18, 18, 22],
    [18, 18, 18, 22],
    [18, 25, 25, 18],
  ],
  [
    [18, 18, 18, 18],
    [18, 18, 18, 20],
    [18, 18, 18, 20],
    [18, 23, 23, 18],
  ],
  [
    [18, 18, 18, 18],
    [18, 18, 18, 22],
    [18, 18, 18, 22],
    [18, 25, 25, 18],
  ],
  [
    [18, 18, 18, 18],
    [18, 18, 18, 20],
    [18, 18, 18, 20],
    [18, 23, 23, 18],
  ],
  [
    [18, 18, 18, 18],
    [18, 18, 18, 22],
    [18, 18, 18, 22],
    [18, 25, 25, 18],
  ],
  [
    [18, 18, 18, 41],
    [18, 18, 18, 42],
    [18, 18, 18, 42],
    [44, 45, 45, 43],
  ]
];

const buidling4 = [
  [
    [18, 18, 18, 18],
    [18, 18, 18, 28],
    [18, 18, 18, 29],
    [18, 18, 18, 18],
  ],
  [
    [18, 18, 18, 18],
    [18, 18, 18, 28],
    [18, 18, 18, 29],
    [18, 23, 23, 18],
  ],
  [
    [18, 18, 18, 18],
    [18, 18, 18, 26],
    [18, 18, 18, 27],
    [18, 25, 25, 18],
  ],
  [
    [18, 18, 18, 18],
    [18, 18, 18, 20],
    [18, 18, 18, 20],
    [18, 23, 23, 18],
  ],
  [
    [18, 18, 18, 18],
    [18, 18, 18, 22],
    [18, 18, 18, 22],
    [18, 25, 25, 18],
  ],
  [
    [18, 18, 18, 41],
    [18, 18, 18, 42],
    [18, 18, 18, 42],
    [44, 45, 45, 43],
  ]
];


const buildings = generateBuildings(40, [
  { x: 4, y: 5, w: 4, z: 4, h: 17, type: "21", replace: buidling1 }, // <----
  { x: 4, y: 10, w: 4, z: 4, h: 11, type: "21", replace: buidling3 }, // <----
  { x: 4, y: 15, w: 4, z: 4, h: 6, type: "21", replace: buidling4 }, // <----
  { x: 4, y: 20, w: 4, z: 4, h: 17, type: "21", replace: buidling1 }, // <----
  { x: 4, y: 25, w: 4, z: 4, h: 11, type: "21", replace: buidling3 }, // <----
  { x: 4, y: 30, w: 4, z: 4, h: 6, type: "21", replace: buidling4 }, // <----
]);


let distanceBetweenFloors = 50;
const map = [
  {
    nivel: "city",
    player: "pepito",
    musica: "bkg-uno.mp3",
    ballTexture: "123",
    gravity: 9.8,
    distanceBetweenFloors: distanceBetweenFloors,
    tiles: {
      "1": "GRASS",
      "10": "STREET-A",
      "11": "STREET-B",
      "12": "STREET-C",
      "133": "SIDEWALK",
      "3": "BLOQUE-1",
      "4": "BLOQUERANDOM",
      "5": "COLUMNALARGA",
      "6": "COLUMNACORTA",
      "7": "SEMIBLOQUE",
      "8": "TREE",
      "9": "CUBE",
      "15": "PIN",
      "16": "TRAFFIC-LIGHT-A",
      "17": "TRAFFIC-LIGHT-B",
      "18": "BUILDINGBLOCK",
      "20": "BUILDINGWINDOW1",
      "21": "BUILDINGWINDOW2",
      "22": "BUILDINGWINDOW3",
      "23": "BUILDINGWINDOWB1",
      "24": "BUILDINGWINDOWB2",
      "25": "BUILDINGWINDOWB3",
      "26": "BUILDINGDOORLEFTCORNER",
      "27": "BUILDINGDOORRIGHTCORNER",
      "28": "BUILDINGDOORLEFT",
      "29": "BUILDINGDOORRIGHT",
      "31": "BUILDINGTOP1",
      "32": "BUILDINGTOP2",
      "33": "BUILDINGTOP3",
      "34": "BUILDINGTOP4",
      "35": "BUILDINGTOP5",
      "41": "BUILDINGTOP1B",
      "42": "BUILDINGTOP2B",
      "43": "BUILDINGTOP3B",
      "44": "BUILDINGTOP4B",
      "45": "BUILDINGTOP5B",
      PN: "PLAYER-N",
      PS: "PLAYER-S",
      PE: "PLAYER-E",
      PW: "PLAYER-W",
    },
  },

  // MAP PLAYER / ITEMS CONFIG
  [createBase(40, [10, 25])],
  createSideWalk(createStreets(createGrass(40, false), streetConfig, false) as number[][], sideWalkConfig, true) as number[][],
  ...buildings.map((_buildings, index) => {
    const items = objects.filter(
      (item) => item.h === index * distanceBetweenFloors
    );
    if (items.length) {
      let newBuildings = addItems(_buildings, items);
      return newBuildings.map((row) => row.join(" ")).join("\n");
    } else {
      return _buildings.map((row) => row.join(" ")).join("\n");
    }
  }),
];
export default map;
