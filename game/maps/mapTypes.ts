
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