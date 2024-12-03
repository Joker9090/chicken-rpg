// helpers functions

import { RpgIsoPlayerPrincipal } from "../Assets/rpgIsoPlayerPrincipal";
import { RpgIsoSpriteBox } from "../Assets/rpgIsoSpriteBox";
import MultiScene from "../Loader/MultiScene";
import RPG from "../rpg";

export const getDimensionOfMaps = (map: string[]) => {
    let mapsSize = []
    for (let i = 0; i < map.length; i++) {
      let rows ,cols;
      const currentMatrix = map[i].split("\n");
      let newMatrix = currentMatrix.map((row) => row.split(" "));
      newMatrix = newMatrix.map((row) =>
        row.filter((element) => element !== "")
      );
      rows = newMatrix.length;
      let maxCols = 0;
      for (let j = 0; j < newMatrix.length; j++) {
        if (newMatrix[j].length >= maxCols) {
          maxCols = newMatrix[j].length
        }
      }
      cols = maxCols;
      mapsSize.push([rows,cols])
    }
    return mapsSize;
  }

  export const changeSceneTo = (scene: RPG, sceneToStart: string, sceneToStop: string, data: any) => {
    scene.game.plugins.removeScenePlugin("IsoPlugin");
    scene.game.plugins.removeScenePlugin("IsoPhysics");
    const multiScene = new MultiScene(sceneToStart, sceneToStop, data);
    scene.game.scene.getScenes(true)[0].scene.add("MultiScene", multiScene, true);
  }

export const getObjectByType = (scene: RPG, type: string) => {
  return scene.isoGroup?.children.entries.filter((t) => {
    const tile = t as unknown as RpgIsoSpriteBox;
    return tile.type === type;
  });
}


  export const makeOpacityNearPlayer = (scene: RPG) => {
    if (!scene.cameraTunnel) {
      scene.cameraTunnel = scene.add.circle(
        scene.player?.self.x,
        scene.player?.self.y,
        100,
        0x6666ff,
        0
      );
      scene.cameraTunnel.setDepth(100000);
    } else
      scene.cameraTunnel.setPosition(scene.player?.self.x, scene.player?.self.y);

    const checkCameraContains = (t: RpgIsoSpriteBox) => {
      return scene.cameraTunnel?.getBounds().contains(t.self.x, t.self.y);
    };

    const checkObjectIsInFrontOfPlayer = (
      t: RpgIsoSpriteBox,
      player: RpgIsoPlayerPrincipal
    ) => {
      if (t.matrixPosition && player.matrixPosition) {
        // check if x is the same and y is above
        if (
          t.matrixPosition.x === player.matrixPosition.x &&
          t.matrixPosition.y > player.matrixPosition.y
        )
          return true;
        // check if y is the same and x is above
        if (
          t.matrixPosition.y === player.matrixPosition.y &&
          t.matrixPosition.x > player.matrixPosition.x
        )
          return true;
        // check if both are above
        if (
          t.matrixPosition.y > player.matrixPosition.y &&
          t.matrixPosition.x > player.matrixPosition.x
        )
          return true;

        return false;
      }
      return false;
    };

    //@ts-ignore
    scene.isoGroup?.children.each((_t) => {
      const t = _t as unknown as RpgIsoSpriteBox;
      if (
        t.type == "STONE" &&
        t.matrixPosition &&
        scene.player?.matrixPosition
      ) {
        if (
          checkCameraContains(t) &&
          checkObjectIsInFrontOfPlayer(t, scene.player)
        ) {
          t.self.setAlpha(0.05);
        } else t.self.setAlpha(1);
      }
    });
  }
