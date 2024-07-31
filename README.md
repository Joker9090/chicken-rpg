This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Compound keys

| Symbol | Explanation                                                               |
| ----------------- | ------------------------------------------------------------------ |
| / | Separa el tile del objeto |
| \| | Separa el tile o el objeto de su respectiva dirección |

## Example

| Type | Key | Result                                                               |
| ----------------- | --------------------------------------|--------------------------- |
| Tile | W\|LR- | Tile de camino de izquierda a derecha, apagada |
| Object | BT\|LR+ | Torre con barrera de izquierda a derecha, encendida |
| Structure | W\|LR-/BT\|LR+ |

## Mapping - On/Off

| Key | Img                                                               |
| ----------------- | ------------------------------------------------------------------ |
| + (on) | <img src="./public/assets/Pisos/plataformaFin.png" alt="alt" height="100"> |
| - (off)  | <img src="./public/assets/Pisos/plataformaFin2.png" alt="alt" height="100"> |

## Mapping - Tiles

| Key | Img                                                               |
| ----------------- | ------------------------------------------------------------------ |
| R (right) | <img src="./public/assets/Pisos/balzonasFinal/baldozaFinal7.png" alt="alt" height="100"> |
| L (left)  | <img src="./public/assets/Pisos/balzonasFinal/baldozaFinal8.png" alt="alt" height="100"> |
| B (bottom)| <img src="./public/assets/Pisos/balzonasFinal/baldozaFinal5.png" alt="alt" height="100"> |
| T (top)| <img src="./public/assets/Pisos/balzonasFinal/baldozaFinal6.png" alt="alt" height="100"> |
| C (cross)| <img src="./public/assets/Pisos/baldozas/baldoza2.png" alt="alt" height="100"> |
| LR | <img src="./public/assets/Pisos/baldozas/baldoza4.png" alt="alt" height="100"> |
| TB  | <img src="./public/assets/Pisos/baldozas/baldoza3.png" alt="alt" height="100"> |
| W (wayTile)| <img src="./public/assets/Pisos/baldozas/baldozaConLuz2.png" alt="alt" height="100"> |
| J (jump)| <img src="./public/assets/Pisos/plataformaSalto1.png" alt="alt" height="100"> |
| BN (button)| <img src="./public/assets/Pisos/baldozaBtnOff/btnOff2.png" alt="alt" height="100"> |
| CO (collapsible)| <img src="./public/assets/Pisos/plataformaRota2.png" alt="alt" height="100"> |
| BG (beginning)| <img src="./public/assets/Pisos/plataformaInicio.png" alt="alt" height="100"> |
| E (end)| <img src="./public/assets/Pisos/plataformaFin.png" alt="alt" height="100"> |

## Mapping - Objects

| Key | Img                                                               |
| ----------------- | ------------------------------------------------------------------ |
| B (barrier)| <img src="./public/assets/assets/cercaDeLuz/cercaLuz2.png" alt="alt" height="100"> |
| BT (barrierTower)| <img src="./public/assets/assets/cercaDeLuz/poste1.png" alt="alt" height="100"> |





