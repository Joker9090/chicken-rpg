import axios, { AxiosInstance } from 'axios';

export type globalType = {
  CKApiInstance?: CKApi;
};

const apiUrls = {
  prompt: "/prompt",
};

class CKApi {
  axios: AxiosInstance;
  corpusId?: string;
  headers?: { Authorization: string; }

  constructor() {
    if ((global as globalType).CKApiInstance) {
      throw new Error("New instance cannot be created!!");
    } else {
      this.axios = axios.create({
        baseURL: "/",
        // timeout: 1000,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    (global as globalType).CKApiInstance = this;
  }

  setBaseUrl(url: string) {
    this.axios.defaults.baseURL = url;
  }
  setCorpusId(corpusId: string) {
    this.corpusId = corpusId;
  }
  setAuthorization(token: string) {
    this.headers = { Authorization: `Token ${token}` };
  }

  buildUrlWithCorpusId(url: string) {
    return url + "?corpus_id=" + this.corpusId
  }

  repaceBrakeLines(text: string) {
    return text // text.replace(/\n/g, "")
  }
  objectToFormData(obj: any) {
    const formData = new FormData();

    Object.entries(obj).forEach(([key, value]) => {
      //@ts-ignore
      formData.append(key, value);
    });

    return formData;
  }

  sendMessage(text: string) {
    const body = {
      text: text,
      model: "gpt-4",
      chat_k: 22,
      temperature: 0.1,
    }
    return new Promise((resolve, reject) => {

      this.axios
        .post(`${this.buildUrlWithCorpusId(apiUrls.prompt)}`, this.objectToFormData(body), {
          headers: {
            "Content-Type": "multipart/form-data",
            ...this.headers
          },
        })
        .then((response) => {
          if (!response) reject()
          const context = response.data.text;
          resolve(context);
        })
        .catch(reject);
    });
  }

  getMaps(n?: number) {

    const prefix = `
      Don't use text to responde this message, use numbers instead. I'll parse your response diretcly. 
      It's mandatory to have only numbers and spaces.
      So if there is any invalid character it will fail.
      Return only numbers with an empty space between them, use brakeline to separate rows. 
      The idea is to return a 2D array of numbers, where each number represents a tile.
      Each Map generated returned is a floor. The final idea is to generate a 3D map with multiple floors.
      The map needs to be of 5x5 and have only one tile with number 2 near the middle.
    `

    const preMapPrefix = `
      Declarations for new map:
      1 number is equivalent to a floor tile.
      0 number is equivalent to an empty tile.
      9 number is equivalent to a jump tile, which will make the player jump to the next floor.
      2 number is equivalent to a focus tile, the focus tile will be used like a pivot tile between different floors.
      Its' mandatory to replace all 0 for 1, so the player can walk on it.
      It's neccesary to have floors so the player can walk on it.
      It's mandatory to don¿t have anyone with number 2.
      It's mandatory to have between 1 and 3 tiles with number 9.
      It's mandatory to respond with only numbers; remove all the text from the response.
      It's mandatory to respond only one map.


    `

    const mapPrefix = `
      Declarations for new map:
      0 number is equivalent to an empty tile.
      1 number is equivalent to a floor tile.
      9 number is equivalent to a jump tile, which will make the player jump to the next floor.
      2 number is equivalent to a focus tile, the focus tile will be used like a pivot tile between different floors. Need to have one of those and no more.
      It's neccesary to have floors so the player can walk on it.
      It's mandatory to have 25% of the map with number 0 at least.
      It's mandatory to have only one number 2.
      It's mandatory to respond with only numbers; remove all the text from the response.
      It's mandatory to respond only one map.


    `

    const nMapPrefix = `
      Another One With different shape pls.
    `

    const playerMapPrefix = `
      Declarations for new map:
      0 number is equivalent to an empty tile.
      3 number is equivalent to the start position of the player.
      2 number is equivalent to a focus tile, the focus tile will be used like a pivot tile between different floors.
      It's mandatory to have only one number 3 no less.
      It's mandatory to have only one number 2 no less.
      It's mandatory to respond with only numbers; remove all the text from the response.
      It's mandatory to respond only one map.

    `


    const swapElements = (array: any[], index1: number, index2: number) => {
      array[index1] = array.splice(index2, 1, array[index1])[0];
    };


    return new Promise((resolve, reject) => {
      const maps: string[] = []

      const nMapPrefixText = this.repaceBrakeLines(`${nMapPrefix}`)

      /* N Map */
      if (n) {
        this.sendMessage(nMapPrefixText).then((nLvlMap) => {
          maps.push(nLvlMap as string)
          resolve(maps)
        }).catch(reject)
        return
      }

      const preMapText = this.repaceBrakeLines(`${prefix}${preMapPrefix}`)
      this.sendMessage(preMapText).then((preMap) => {
        maps.push(preMap as string)

        const playerMapText = this.repaceBrakeLines(`${playerMapPrefix}`)

        this.sendMessage(playerMapText).then((playerMap) => {
          maps.push(playerMap as string)

          const LevelMapText = this.repaceBrakeLines(`${mapPrefix}`)

          this.sendMessage(LevelMapText).then((levelMap1) => {
            maps.push(levelMap1 as string)
            this.sendMessage(LevelMapText).then((levelMap2) => {
              maps.push(levelMap2 as string)
              swapElements(maps, 0, 1);
              resolve(maps)
            }).catch(reject)
          }).catch(reject)
        }).catch(reject)
      }).catch(reject)
    })
  }

}

let CKApiSingleton;
if (!(global as globalType).CKApiInstance) CKApiSingleton = new CKApi();
else CKApiSingleton = (global as globalType).CKApiInstance;
export default CKApiSingleton as CKApi;
