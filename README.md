# Time for me — tienda online

Tienda de productos capilares. Página estática (HTML, CSS y JavaScript, sin
compilar nada): se puede publicar tal cual en GitHub Pages, Cloudflare Pages o
cualquier hosting.

Tiene versión clara y oscura (sigue la del teléfono o compu, y se puede cambiar
con el botón de la luna/sol), catálogo con filtros por necesidad, ficha de cada
producto, rutinas (kits) con descuento, un diagnóstico de tres preguntas que
recomienda una rutina, y un carrito que manda el pedido armado por WhatsApp.

## ⚠ Antes de publicar

El catálogo que trae es **de ejemplo**: nombres, precios, textos y fotos son de
muestra para armar el diseño. Las fotos son renders, no fotos de productos
reales. Antes de vender hay que cargar lo real:

1. **`js/config.js`** — WhatsApp, Instagram, email, monto de envío gratis,
   descuento por transferencia, cuotas, medios de pago y política de cambios.
   Todo lo que la página promete sale de ahí: si algo no es cierto para tu
   negocio, cambialo o dejalo vacío y desaparece de la página.
2. **`js/productos.js`** — tus productos, precios y rutinas. Arriba de todo
   está explicado cada campo.
3. **`img/productos/`** — tus fotos (ver abajo).

Sin WhatsApp cargado, los botones de compra llevan a la sección de contacto.

## Fotos

- Verticales **4:5**, por ejemplo 900 × 1125 px. JPG o WebP de menos de
  200 KB cada una.
- Fondo liso y claro, el producto centrado y entero, misma luz en todas: así la
  grilla se ve pareja.
- La primera foto de cada producto es la de la grilla; la segunda aparece al
  pasar el mouse y en la ficha (puede ser el producto en uso, la textura, o
  en otro ángulo).
- Para las rutinas, una foto con los productos juntos.

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

En GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a
branch**, elegir la rama y la carpeta `/ (root)`. No hay paso de compilación.
