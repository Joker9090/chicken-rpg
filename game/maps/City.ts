import { buidling1, buidling3, buidling4 } from "./buildings";
import { generateBuildings, createBase, createSideWalk, createStreets, createGrass, addItems } from "./mapCreationFunctions";
import { ObjetsConfig } from "./mapTypes";
import { RpgIsoSpriteBox } from "../Assets/rpgIsoSpriteBox";
import { changeSceneTo } from "../helpers/helpers";
import RPG from "../rpg";
import EventsCenter from "../services/EventsCenter";

export default class City {
  scene: RPG;
  map: any[];
  eventCenter = EventsCenter.getInstance();
  constructor(scene: RPG) {
    this.scene = scene;
    const randomYPin = [11, 16, 26, 31]
    const randomHPin = [11, 6, 11, 6]
    const objects: ObjetsConfig[] = [

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

    for (let i = 0; i < 200; i++) {
      if (i === 0) {
        const randomNumber = Math.floor(Math.random() * randomYPin.length)
        objects.push(
          {
            x: 5,
            y: randomYPin[randomNumber],
            h: randomHPin[randomNumber] * 50 + 100,
            type: "15",
          },
        )
      }
      objects.push({
        x: Math.floor(20 + Math.random() * 20),
        y: Math.floor(Math.random() * 40),
        h: 0,
        type: "8",
      });
    }

    const streetConfig = {
      streetWidth: 3,
      xPos: [10, 12],
      yPos: [],
    };

    const sideWalkConfig = {
      xPos: [9, 15],
      yPos: [],
    };

    const buildings = generateBuildings(40, [
      { x: 4, y: 5, w: 4, z: 4, h: 17, type: "21", replace: buidling1 }, // <----
      { x: 4, y: 10, w: 4, z: 4, h: 11, type: "21", replace: buidling3 }, // <----
      { x: 4, y: 15, w: 4, z: 4, h: 6, type: "21", replace: buidling4 }, // <----
      { x: 4, y: 20, w: 4, z: 4, h: 17, type: "21", replace: buidling1 }, // <----
      { x: 4, y: 25, w: 4, z: 4, h: 11, type: "21", replace: buidling3 }, // <----
      { x: 4, y: 30, w: 4, z: 4, h: 6, type: "21", replace: buidling4 }, // <----
    ]);


    let distanceBetweenFloors = 50;
    this.map = [
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
  }

  addMapFunctionalities() {
    if(this.scene.player){
      this.scene.player.self.setScale(0.7);
    }
  }
}
