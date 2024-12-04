import { ObjetsConfig, BuildingConfig, sideWalkConfig, streetConfig } from "./mapTypes";

export const createBase = (n: number, playerPos: number[] = [0, 0]): string => {
    let _mn: number[][] = new Array(n).fill(new Array(n).fill(0));
    _mn = _mn.map((row, i) => row.map((_, j) => Number(0)));
  
    //@ts-ignore
    _mn[playerPos[0]][playerPos[1]] = "PS";
  
    const builded = _mn.map((row) => row.join(" ")).join("\n");
    return builded;
  };
  
  export const createGrass = (
    n: number,
    withParser: boolean = true
  ): string | number[][] => {
    let _mn: number[][] = new Array(n).fill(new Array(n).fill(1));
    _mn = _mn.map((row, i) => row.map((_, j) => Number(1)));
    const builded = _mn;
    return !withParser ? builded : builded.map((row) => row.join(" ")).join("\n");
  };
  
  export const addItems = (base: number[][], objets: ObjetsConfig[]) => {
    for (let i = 0; i < objets.length; i++) {
      const { x, y, type } = objets[i];
      // @ts-ignore
      base[x][y] = type;
    }
  
    return base;
  };
  
  export  const createBullets = (
    base: number[][],
    withParser: boolean = true
  ): string | number[][] => {
    console.log("createBullets", base);
    return !withParser ? base : base.map((row) => row.join(" ")).join("\n");
  };
  
  export  const createSideWalk = (
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
        return row.map((_, j) => 133);
      } else {
        // map row and if j is equal to any yPos return 10
        return row.map((_, j) => {
          if (newYPos.includes(j)) {
            return 133;
          }
          return _;
        });
      }
    });
    return !withParser ? builded : builded.map((row) => row.join(" ")).join("\n");
  
  }
  
  export  const createStreets = (
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
  
  export const generateBuildings = (n: number, buildings: BuildingConfig[]) => {
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