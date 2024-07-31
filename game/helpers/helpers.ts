// helpers functions

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