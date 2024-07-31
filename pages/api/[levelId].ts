// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import CKApiSingleton from '@/services/ck_api'
import lvl1json from './lvl1.json'
import { LevelJSON, TileCreatorParams, Direction, TileType, ObjType } from '@/game/types'

type Data = {
  maps?: (string | LevelJSON & any)[],
  error?: string,
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'OPTIONS') {
    res.status(200).send({})
    return
  } else if (req.method !== 'GET') {
    res.status(404).send({})
    return
  } else {
    const levelId = req.query.levelId;
    if (!levelId) {
      res.status(400).json({ error: 'Missing levelId parameter' });
      return;
    }
    const createTile = (...params: TileCreatorParams[]) => {

      const [tileType, Direction, isTileOn, objectType, objectDirection, isObjOn] = params

      return {
        tileType,
        Direction,
        isTileOn,
        objectType,
        objectDirection,
        isObjOn,
        compoundKey: `${tileType}${Direction ? `|${Direction}` : ''}${(typeof isTileOn === 'boolean') ? isTileOn ? `+` : '-' : ''}${objectType ?  `/${objectType}` :  ''}${objectDirection ? `|${objectDirection}` : ''}${(typeof isObjOn === 'boolean') ? isObjOn ? `+` : '-' : ''}`
      }
    }
    
    const DefaultTile = createTile(TileType.D);

    const maps = [[
      {...lvl1json, tiles: {
        "1": createTile(TileType.D),
        "3": createTile(TileType.CO),
        "4": createTile(TileType.E, null, true)
      }},
      "0 P 0 0 0 0 0 0 0 2",
      // "0 0 E+ \n 0 D \n 0 D \n 0 CO \n CO D \n D 0 \n CO 0 \n D 0 \n D 0 \n D 0",
      "0 0 4 \n 0 1 \n 0 1 \n 0 3 \n 3 1 \n 1 0 \n 3 0 \n 1 0 \n 1 0 \n 1 0",
    ],
    [
      {...lvl1json, tiles: {
        "1": createTile(TileType.D),
        "3": createTile(TileType.W, Direction.BT, true),
        "4": createTile(TileType.W, Direction.LT, true),
        "5": createTile(TileType.E, null, true),
        "6": createTile(TileType.BN, Direction.R, true),
        "7": createTile(TileType.I),
        "8": createTile(TileType.D, null, null, ObjType.S)
      }},
      "0 0 0 P 0 0 0 0 0 2",
      "0 0 0 5 \n 0 0 3 \n 0 0 3 \n 8 6 4 \n 0 0 1 \n 0 0 7 \n 0 0 7 \n 0 0 1 \n 0 0 1 \n 0 0 1 ",
    ],
    [
      {...lvl1json, tiles: {
        "1": createTile(TileType.D),
        "3": createTile(TileType.E, null, false),
        "4": createTile(TileType.W, Direction.BT, false),
        "5": createTile(TileType.T),
        "6": createTile(TileType.BN, Direction.R, false),
        "7": createTile(TileType.W, Direction.LT, false),
        "8": createTile(TileType.J),
        "9": createTile(TileType.D, null, null, ObjType.S)
      }},
      "0 0 0 P 0 0 0 0 0 2",
      "0 0 0 3 \n0 0 0 4 \n0 0 0 4 \n9 5 6 7 \n1 0 0 1 \n1 0 0 1 \n1 8 0 1 \n0 0 0 1 \n0 0 0 1 \n0 0 0 1",
    ],
    [
      {...lvl1json, tiles: {
        "1": createTile(TileType.D),
        "3": createTile(TileType.E, null, false),
        "4": createTile(TileType.W, Direction.BT, false),
        "5": createTile(TileType.T),
        "6": createTile(TileType.BN, Direction.R, false),
        "7": createTile(TileType.W, Direction.LT, false),
        "8": createTile(TileType.PO, null, true),
        "9": createTile(TileType.CO),
        "10": createTile(TileType.D, null, null, ObjType.S)
      }},
      "0 0 0 0 0 P 0 0 0 2",
      "0 0 0 0 0 3 0 0 0 0\n 0 0 0 0 4 0 0 0 0\n 0 0 0 0 4 0 0 0 0\n 10 5 5 6 7 0 0 0 0\n 8 0 0 0 1 0 0 0 0\n 0 0 0 0 1 0 0 0 8\n 0 0 0 0 1 1 1 9 1\n 0 0 0 0 1 0 0 0 0\n 0 0 0 0 1 0 0 0 0 \n 0 0 0 0 1 0 0 0 0",
    ],
    [
      {...lvl1json, tiles: {
        "1": createTile(TileType.D),
        "3": createTile(TileType.W, Direction.BR, true),
        "4": createTile(TileType.W, Direction.LR, true),
        "5": createTile(TileType.E, null, true),
        "6": createTile(TileType.W, Direction.BT, true),
        "7": createTile(TileType.W, Direction.BR, true, ObjType.BT2, Direction.LR, true),
        "8": createTile(TileType.W, Direction.LR, true, ObjType.B, null, true),
        "9": createTile(TileType.W, Direction.L, true, ObjType.BT, Direction.LR, true),
        "10": createTile(TileType.BN, Direction.T, true),
        "11": createTile(TileType.J),
        "12": createTile(TileType.CO),
        "13": createTile(TileType.BN, Direction.R, true),
        "14": createTile(TileType.W, Direction.LT, true),
        // "15": createTile(TileType.D, null, null, ObjType.S),
        "16": createTile(TileType.W, Direction.BT, true, ObjType.S2)
      }},
      "0 P 0 0 0 0 0 0 2",
      "3 4 4 5 0 \n6 0 0 1 0 \n16 0 7 8 9 \n10 0 6 11 0 \n1 0 6 1 1 \n12 0 6 0 1 \n1 13 14 1 1 \n0 0 0 0 1 \n0 1 1 1 1",
    ]]

    res.status(200).json({ maps: maps[Number(levelId) - 1] })
    
  }

}

// {
//   tileType:"W",
//   isTileOn:'TL',
//   objectType:'BT',
//   objectDirection:'LT'

// }

/**
 * 1: Tile Normal
 * 3: Cubo
 * 4: Tile Esquina - 4.1: Boton esquina OFF - 4.2 Boton esquina ON
 * 5: Tile Horizontal - 5.1 Horizontal ON
 * 6: Tile Vertical - 6.1 Vertical ON
 */


// const emptyJSON = {
//   type: "0",
//   objectInside : null,
//   direction: "LEFT"
//  }
//  const tileJSON = {
//   type: "1",
//   objectInside : anotherObj,
//   direction: "LEFT"
//  }
//  const maps = [
//   [emptyTile,tileJSON,tileJSON,emptyTle]
//   [emptyTile,tileJSON,tileJSON,emptyTle]
//  ]
//  Juan Martin Cerruti
//  3:14 p.m.
//  NIvel1 = () => {
//  const emptyJSON = {
//   type: "0",
//   objectInside : null,
//   direction: "LEFT"
//  }
//  const tileJSON = {
//   type: "1",
//   objectInside : anotherObj,
//   direction: "LEFT"
//  }
//  const maps = [
//   [emptyTile,tileJSON,tileJSON,emptyTle]
//   [emptyTile,tileJSON,tileJSON,emptyTle]
//  ]
 
//  const wordCOnfig = {
//  gravity:1000,
//  ballTexture: 2
//  weight: 800
//  }
//  start(wordCOnfig,maps)
//  }