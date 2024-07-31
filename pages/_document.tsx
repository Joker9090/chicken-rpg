import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      <link rel="preload" as="font" href="/fonts/Quicksand.otf" type="font/otf" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <div style={{ fontFamily: 'Quicksand' }}></div>
      </body>
    </Html>
  )
}
