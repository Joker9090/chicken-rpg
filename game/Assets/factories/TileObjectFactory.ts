import { Scene } from "phaser";
import { Barrier, BarrierTower, Star } from "../tileObjects/TileObjects";
import GlobalDataSingleton from "@/game/services/GlobalData";
import IsoExperimentalMap from "@/game/scene";

export class TileObjectFactory {
    static createObject(scene: IsoExperimentalMap, x: number, y: number, z: number, texture: string, frame?: string | number, props?: any) {
        const key = texture.replace(/[+\-]/g, '').split('|')[0];
        const level = scene.level

        switch (key) {
            case "BT":
                return [new BarrierTower(scene, x, y, z, texture, frame, props)];
            //TODO: agregar extra key en los objetos para casos especiales (tipo de torre, portales comunicados, estrellas)
            case "BT2":
                return [new BarrierTower(scene, x, y, z, texture, frame, props)];
            case "S":
                // @ts-ignore
                console.log(GlobalDataSingleton.getScope(),  "CONDICION EN STAR ARIEL")
                console.log(level,  "level en facotry ARIEL")
                // @ts-ignore
                if (GlobalDataSingleton.getScope().starByLevel[level] === true) {
                    return
                } else {
                    return [new Star(scene, x, y, z - 180, texture, frame, props)];
                }
            case "S2":
                // @ts-ignore
                console.log(GlobalDataSingleton.getScope(),  "CONDICION EN STAR ARIEL")
                console.log(level,  "level en facotry ARIEL")
                // @ts-ignore
                if (GlobalDataSingleton.getScope().starByLevel[level] === true) {
                    return
                } else {
                    return [new Star(scene, x, y, z - 180, texture, frame, props)];
                }
                
            case "B":
                const bt1 = new Barrier(scene, x, y, z + 67, texture, frame, props)
                const bt2 = new Barrier(scene, x, y, z - 21, texture, frame, props)
                const bt3 = new Barrier(scene, x, y, z - 110, texture, frame, props)
                const bt4 = new Barrier(scene, x, y, z - 199, texture, frame, props)
                /* ACA esta EL FIX  del problema del ulstimo laser de la barrera
                El problema era que si llevamos las posiciones al mundo iso, la ultima barrera queda atras de la columna 
                porque esta muy cerca del piso, y la barrera estaria mas adelante que el ultimo laser,
                Ahora para fixear esto podemos crear un nuevo sprite de laser y agregarlo al container del objeto Barrier
                El container va a estar todo el tiempo forzando que su posicion y su depth sean iguales que la del objeto barrier
                Pero podemos modificar eso facilmente
                Posicion => modificamos el x , y del sprite no del container, de esa manera podemos mover el sprite para donde queramos
                Depth => modificamos el customDpeth que es el depth que se actualiza en todos los frames, y lo ponemos donde queramos
                */
                // new sprite over 
                bt4.customDepth = 3500
                let barriers = [bt1, bt2, bt3, bt4]
                barriers.forEach(b => {
                    const sprite = scene.add.sprite(0, 0, "B+", 0).setAngle(180).setOrigin(0.4, 0.5)
                    scene.add.existing(sprite);
                    b.container.add(sprite)
                })
                return barriers;
            default:
                return null;
        }
    }
}