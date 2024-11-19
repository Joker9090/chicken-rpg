// Importa los módulos necesarios
import Head from 'next/head'
import React from 'react'
import Phaser from 'phaser'
import Game from '@/game'
import axios from 'axios';
import { useRouter } from 'next/router';
import { scryRenderedComponentsWithType } from 'react-dom/test-utils';
import MultiScene from '@/game/Loader/MultiScene';
import RPG from '@/game/rpg';

// Declara la interfaz global si es necesario
declare global {
  interface Window { Phaser: typeof Phaser }
}

// Componente principal Home
export default function Level() {
  // Declaración de estados y referencias
  const [_phaser, setPhaser] = React.useState<typeof Phaser>()
  const [GameConstructor, setGameConstructor] = React.useState<Game>()
  const [game, setGame] = React.useState<Phaser.Game>();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [maps, setMaps] = React.useState<string[]>();

  
  // Hook useRouter para acceder a los parámetros de la ruta
  const router = useRouter();
  const { levelId } = router.query; // levelId se obtiene de la URL
  // Efecto para cargar el juego y los mapas
  React.useEffect(() => {
    // if (typeof levelId !== 'number') router.push('/1')
    if (!game && levelId) { // Solo carga cuando levelId está definido
      const DynamicPhaser = require('phaser')
      setPhaser(DynamicPhaser)
      //TODO: SACAR ESTO AHORA SE HACE EN EL BETWEEN SCENE
      const axiosInstance = axios.create({
        baseURL: "/",
        headers: {
          "Content-Type": "application/json",
        },
      });
      axiosInstance.get(`/api/${levelId}`).then((res) => { // Hacer una solicitud al servidor para obtener el mapa específico para levelId
        setMaps(res.data.maps)
      }).catch(error => {
        console.error('Error fetching maps:', error);
      });
    }
  }, [levelId])

  // Efecto para inicializar el juego cuando se cargan los mapas
  React.useEffect(() => {
    if (canvasRef.current && maps) {
      const DynamicGame = require('@/game')
      const multiScene = require('@/game/Loader/MultiScene')
      const rpg = require('@/game/rpg')
      const betweenScenes = require('@/game/Loader/BetweenScenes')
      const assetLoader = require('@/game/Loader/AssetsLoader')
      const scenes = [multiScene.default, rpg.default, betweenScenes.default, assetLoader.default]
      // const scenes = [multiScene.default, rpg.default]
      const G = DynamicGame.default as typeof Game
      setGameConstructor(new G(canvasRef.current, maps, scenes))
    }
  }, [canvasRef, maps])

  // Efecto para iniciar el juego cuando Phaser y GameConstructor están disponibles
  React.useEffect(() => {
    if (_phaser && canvasRef.current && GameConstructor) {
      const game = GameConstructor.init();
      setGame(game)
    } 
  }, [_phaser, GameConstructor])

  // React.useEffect(() => {
  //   //Load scenes async when windows is ready
  //   Promise.all([
  //     import("@/game/Loader/MultiScene"),
  //     import("@/game/rpg"),
  //   ]).then((scenes) => {
  //     setScenes(scenes.map(s => s.default))
  //   })
  // }, [])

  return (
    <>
      <Head>
        <title>ChickenRPG by Noswar</title> {/* Cambia el título para mostrar el nivel actual */}
        <meta name="description" content={`Experimental Map - Level ${levelId}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="game-container">
          <canvas ref={canvasRef} width={'100%'} height={'100%'}/>
        </div>
      </main>
    </>
  )
}
