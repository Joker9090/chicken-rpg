// Importa los módulos necesarios
import Head from 'next/head'
import React from 'react'
import Link from 'next/link';
import { useRouter } from 'next/router';

// Componente principal Home
export default function Home() {
  const router = useRouter();

  // Redireccionar al primer nivel cuando el componente se monta
  React.useEffect(() => {
    router.push('/1'); // Redirige a la ruta del primer nivel
  }, []);

  return (
    <>
      <Head>
        <title>Chambix</title>
        <meta name="description" content="Welcome to the game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Este contenido puede ser opcional, ya que se redirigirá automáticamente */}
      <main>

      </main>
    </>
  )
}
