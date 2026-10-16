# Time for me — tienda online

Tienda de productos capilares. Página estática (HTML, CSS y JavaScript, sin
compilar nada): se puede publicar tal cual en GitHub Pages, Cloudflare Pages o
cualquier hosting.

Tiene versión clara y oscura (sigue la del teléfono o compu, y se puede cambiar
con el botón de la luna/sol), catálogo con filtros por necesidad y por marca,
ficha de cada producto con tamaños o volúmenes para elegir, un diagnóstico de
tres preguntas que recomienda una rutina, y un carrito que manda el pedido
armado por WhatsApp. Si se cargan rutinas (kits) con precio en
`js/productos.js`, aparece también esa sección.

## Lo que falta para vender

El catálogo ya tiene los productos reales (Fidelité, Frilayp, Mary Bosques y
Karseell), pero faltan datos que no estaban en las fotos:

1. **Precios** — en `js/productos.js`, `"precio": null` muestra "Consultar
   precio". Se puede comprar igual: el pedido llega por WhatsApp y ahí se pasa
   el total. Con un número (`"precio": 18900`) aparece el precio, el total del
   carrito y el orden por precio.
2. **WhatsApp** — en `js/config.js`. Sin número, "Finalizar pedido" lleva a la
   sección de contacto y no se puede comprar.
3. **Envíos, pagos, cuotas, descuentos y cambios** — en `js/config.js`. Están
   vacíos a propósito: la página no promete nada que no esté cargado ahí.
4. **Tamaños que no se ven en las fotos**: Tratamiento pH Ácido (Frilayp),
   Crema Oxidante Hierbas 30 vol, Crema Oxidante 20 vol en envase chico,
   Maca Power Collagen en sachets, y si el Polvo Decolorante se vende por caja
   o por sobre.

## Fotos

- Están en `img/productos/`, verticales **4:5** (900 × 1125 px). Salieron de
  las imágenes de los proveedores, recortadas y con el fondo emparejado.
- Para cambiar una: guardá la nueva con el mismo nombre, o cargá el nombre
  nuevo en `imagenes` del producto.
- La primera foto es la de la grilla; si hay una segunda, aparece al pasar el
  mouse y en la ficha.

## Cómo está armado

```
index.html          la página (secciones, header, footer)
css/fuentes.css     tipografías (Cormorant Garamond y Jost, servidas desde el sitio)
css/tienda.css      estilos; colores de cada versión arriba de todo
js/config.js        datos del negocio
js/productos.js     catálogo: necesidades, productos y rutinas
js/tienda.js        filtros, ficha, carrito, diagnóstico
img/                logo vectorizado, íconos y fotos
fonts/              archivos de las tipografías y sus licencias (SIL OFL)
```

- El logo está vectorizado del original: es el mismo dibujo, en SVG, y toma el
  color de cada versión (bordó en la clara, crema en la oscura).
- Link directo a un producto: `tusitio/#producto/id-del-producto`.
- El carrito se guarda en el navegador de quien compra; el pedido se confirma
  por WhatsApp (stock, envío y pago). La página no cobra sola.

## Publicar

La página se publica con **GitHub Pages** (gratis, el repositorio es público).
Se activa una sola vez:

1. En GitHub, entrá a **TFM → Settings → Pages**.
2. En **Build and deployment → Source** elegí **Deploy from a branch**.
3. En **Branch** elegí `claude/dazzling-johnson-faehwf` y la carpeta `/ (root)`.
   Tocá **Save**.

Queda en **https://brandonnnx3-create.github.io/TFM/**. Cada cambio que se suba
a esa rama se publica solo (se ve en la pestaña **Actions** como "pages build
and deployment"). No hay paso de compilación (por eso está el archivo
`.nojekyll`).

Mientras no se pueda comprar (sin WhatsApp ni precios), la página le pide a
Google que no la indexe (`<meta name="robots" content="noindex">` en
`index.html`). Sacá esa línea cuando esté lista para vender.

Alternativa: **Cloudflare Pages** → Workers & Pages → Create → Pages →
Connect to Git → elegir TFM, sin comando de build y con `/` como carpeta de
salida. Si se usa otro dominio, actualizar `og:url` y `og:image` en
`index.html` para que la vista previa del link en WhatsApp muestre la imagen.
