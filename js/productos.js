/* ============================================================
   TIME FOR ME — CATÁLOGO
   ------------------------------------------------------------
   ⚠ CATÁLOGO DE EJEMPLO. Los nombres, precios, textos y fotos
   de abajo son de muestra para armar el diseño: reemplazalos por
   tus productos reales antes de publicar la página.

   Lo que está entre llaves es JSON: comillas dobles y sin coma
   después del último elemento de cada lista.

   NECESIDADES  (lo que el pelo necesita; arman los filtros, la
                sección "¿Qué necesita tu pelo hoy?" y el diagnóstico)
     id        palabra corta sin espacios ni tildes ("hidratacion").
     nombre    como se muestra.
     bajada    una línea de descripción.
     imagen    foto que aparece al pasar el mouse en esa necesidad.

   PRODUCTOS
     id         único, sin espacios ni tildes. Link directo:
                tusitio/#producto/shampoo-hidratacion
     nombre     como se muestra.
     tipo       "Shampoo", "Máscara", "Sérum"...
     paso       "limpieza", "tratamiento" o "finalizacion". Ordena la
                rutina que recomienda el diagnóstico (1, 2, 3).
     contenido  "300 ml", "250 g".
     precio     número sin puntos (18900).
     estado     "" , "nuevo", "mas-vendido" o "agotado".
     necesidades  ids de la lista de arriba. Además existe "calor"
                (para quien usa plancha o secador seguido).
     bajada     una línea corta que vende: qué hace, para quién.
     descripcion  párrafo de la ficha del producto.
     beneficios lista corta (3 a 4 puntos).
     uso        cómo se usa.
     activos    opcional: ingredientes destacados. Vacío = no se muestra.
     imagenes   1 o más fotos, verticales 4:5 (ej. 900 × 1125).
                La primera es la de la grilla; la segunda aparece al
                pasar el mouse.
     alt        qué se ve en la foto, para quien no la ve.

   RUTINAS  (kits: varios productos juntos con descuento)
     productos  ids de los productos que incluye.
     descuento  porcentaje sobre la suma de los precios.
   ============================================================ */

const CATALOGO = {
  "necesidades": [
    { "id": "hidratacion", "nombre": "Hidratación",   "bajada": "Seco, opaco o áspero al tacto",            "imagen": "img/productos/acondicionador-hidratacion-2.webp" },
    { "id": "reparacion",  "nombre": "Reparación",    "bajada": "Castigado por decoloración, plancha o sol", "imagen": "img/productos/mascara-reparacion-2.webp" },
    { "id": "rulos",       "nombre": "Rulos y ondas", "bajada": "Definición sin frizz ni efecto duro",       "imagen": "img/productos/crema-rulos-2.webp" },
    { "id": "antifrizz",   "nombre": "Frizz y brillo","bajada": "Control en días húmedos, brillo sin peso",  "imagen": "img/productos/serum-puntas-2.webp" },
    { "id": "rubios",      "nombre": "Rubios y canas","bajada": "Chau tonos amarillos",                      "imagen": "img/productos/shampoo-matizador-2.webp" },
    { "id": "fuerza",      "nombre": "Fuerza",        "bajada": "Fino, sin volumen o que se quiebra",        "imagen": "img/productos/tonico-fortalecedor-2.webp" }
  ],

  "productos": [
    {
      "id": "shampoo-hidratacion",
      "nombre": "Shampoo Hidratación",
      "tipo": "Shampoo",
      "paso": "limpieza",
      "contenido": "300 ml",
      "precio": 18900,
      "estado": "mas-vendido",
      "necesidades": ["hidratacion", "rulos", "reparacion"],
      "bajada": "Limpia sin resecar. Para lavar seguido sin perder suavidad.",
      "descripcion": "Una fórmula suave que limpia el cuero cabelludo y deja el largo suave y fácil de desenredar. Pensado para pelo seco u opaco, y para quien necesita lavarse seguido sin que el pelo quede áspero.",
      "beneficios": ["Limpieza suave, apta para uso diario", "Deja el pelo suave y fácil de desenredar", "La base de cualquier rutina"],
      "uso": "Aplicá sobre el pelo mojado y masajeá el cuero cabelludo con las yemas, sin frotar el largo. Enjuagá bien. Si usás mucho producto de peinado, repetí.",
      "activos": "",
      "imagenes": ["img/productos/shampoo-hidratacion.webp", "img/productos/shampoo-hidratacion-2.webp"],
      "alt": "Botella blanca de Shampoo Hidratación con tapa bordó"
    },
    {
      "id": "acondicionador-hidratacion",
      "nombre": "Acondicionador Hidratación",
      "tipo": "Acondicionador",
      "paso": "tratamiento",
      "contenido": "300 ml",
      "precio": 19900,
      "estado": "",
      "necesidades": ["hidratacion", "rulos", "antifrizz"],
      "bajada": "Desenreda y sella. El pelo queda suelto, suave y con movimiento.",
      "descripcion": "El paso que no se saltea. Desenreda al instante, suaviza la fibra y ayuda a controlar el frizz sin dejar el pelo pesado ni graso.",
      "beneficios": ["Desenreda sin tirones", "Suavidad y brillo desde el primer uso", "No apelmaza"],
      "uso": "Después del shampoo, escurrí el exceso de agua y aplicá de medios a puntas. Peiná con los dedos, dejá actuar 2 o 3 minutos y enjuagá.",
      "activos": "",
      "imagenes": ["img/productos/acondicionador-hidratacion.webp", "img/productos/acondicionador-hidratacion-2.webp"],
      "alt": "Botella rosa de Acondicionador Hidratación con tapa bordó"
    },
    {
      "id": "mascara-reparacion",
      "nombre": "Máscara Reparación Profunda",
      "tipo": "Máscara",
      "paso": "tratamiento",
      "contenido": "250 g",
      "precio": 24900,
      "estado": "mas-vendido",
      "necesidades": ["reparacion", "hidratacion", "rubios"],
      "bajada": "Para pelo castigado por decoloración, plancha o sol. Una vez por semana.",
      "descripcion": "Un tratamiento intensivo para el pelo que pide ayuda: decolorado, con muchas planchitas encima o reseco después del verano. Lo deja más suave, flexible y con menos quiebre al peinar.",
      "beneficios": ["Nutrición intensiva en un solo uso", "Menos quiebre al peinar", "Ideal para rubios y decolorados"],
      "uso": "Una o dos veces por semana, en lugar del acondicionador. Aplicá sobre el pelo limpio y escurrido, de medios a puntas, y dejá actuar entre 5 y 10 minutos. Ese es tu rato. Enjuagá con agua tibia.",
      "activos": "",
      "imagenes": ["img/productos/mascara-reparacion.webp", "img/productos/mascara-reparacion-2.webp"],
      "alt": "Pote de Máscara Reparación Profunda con tapa bordó"
    },
    {
      "id": "serum-puntas",
      "nombre": "Sérum de Puntas",
      "tipo": "Sérum",
      "paso": "finalizacion",
      "contenido": "30 ml",
      "precio": 16900,
      "estado": "",
      "necesidades": ["antifrizz", "reparacion", "hidratacion"],
      "bajada": "Dos gotas en las puntas: brillo y control del frizz.",
      "descripcion": "El toque final. Sella las puntas, controla el frizz y suma brillo sin dejar el pelo graso. Un frasco chico que rinde mucho: con dos o tres gotas alcanza.",
      "beneficios": ["Brillo inmediato", "Controla el frizz y el volumen", "Rinde meses"],
      "uso": "Frotá 2 o 3 gotas entre las palmas y aplicá sólo en las puntas, con el pelo húmedo o seco. Menos es más.",
      "activos": "",
      "imagenes": ["img/productos/serum-puntas.webp", "img/productos/serum-puntas-2.webp"],
      "alt": "Frasco gotero de vidrio bordó de Sérum de Puntas"
    },
    {
      "id": "crema-rulos",
      "nombre": "Crema de Peinar Rulos",
      "tipo": "Crema de peinar",
      "paso": "finalizacion",
      "contenido": "200 ml",
      "precio": 17900,
      "estado": "nuevo",
      "necesidades": ["rulos", "antifrizz", "hidratacion"],
      "bajada": "Define sin endurecer. Rulos marcados y suaves al tacto.",
      "descripcion": "Para rulos y ondas que se abren o se esponjan. Define cada rulo, controla el frizz y los deja suaves y con movimiento, sin efecto duro ni acartonado.",
      "beneficios": ["Definición que dura todo el día", "Sin efecto duro", "Controla el frizz"],
      "uso": "Con el pelo bien mojado, aplicá por mechones de medios a puntas. Arrugá hacia arriba con las manos y dejá secar al aire o con difusor.",
      "activos": "",
      "imagenes": ["img/productos/crema-rulos.webp", "img/productos/crema-rulos-2.webp"],
      "alt": "Pomo color arena de Crema de Peinar Rulos con tapa bordó"
    },
    {
      "id": "termoprotector",
      "nombre": "Spray Termoprotector",
      "tipo": "Spray",
      "paso": "finalizacion",
      "contenido": "200 ml",
      "precio": 18500,
      "estado": "",
      "necesidades": ["reparacion", "calor", "antifrizz"],
      "bajada": "Antes de la plancha, la buclera o el secador. Siempre.",
      "descripcion": "La capa que se pone entre tu pelo y el calor. Ayuda a cuidar la fibra de la plancha, la buclera y el secador, y deja el pelo suave y con brillo, sin peso.",
      "beneficios": ["Cuida el pelo del calor", "Ayuda a que el peinado dure más", "Liviano, no engrasa"],
      "uso": "Rociá a 20 cm sobre el pelo húmedo o seco, mechón por mechón, antes de usar calor. Peiná para distribuir.",
      "activos": "",
      "imagenes": ["img/productos/termoprotector.webp", "img/productos/termoprotector-2.webp"],
      "alt": "Botella bordó de Spray Termoprotector con válvula clara"
    },
    {
      "id": "shampoo-matizador",
      "nombre": "Shampoo Matizador",
      "tipo": "Shampoo",
      "paso": "limpieza",
      "contenido": "300 ml",
      "precio": 19900,
      "estado": "",
      "necesidades": ["rubios"],
      "bajada": "Neutraliza los tonos amarillos en rubios, mechas y canas.",
      "descripcion": "Un shampoo violeta para mantener el rubio frío entre visitas a la peluquería. Neutraliza los reflejos amarillos o anaranjados en rubios, mechas, decolorados y canas.",
      "beneficios": ["Rubio más frío y luminoso", "Para mechas, decolorados y canas", "Usalo 1 o 2 veces por semana"],
      "uso": "Una o dos veces por semana, en lugar de tu shampoo habitual. Aplicá, masajeá y dejá actuar entre 1 y 3 minutos: cuanto más tiempo, más matiza. Enjuagá y seguí con acondicionador o máscara.",
      "activos": "",
      "imagenes": ["img/productos/shampoo-matizador.webp", "img/productos/shampoo-matizador-2.webp"],
      "alt": "Botella lila de Shampoo Matizador con tapa ciruela"
    },
    {
      "id": "tonico-fortalecedor",
      "nombre": "Tónico Fortalecedor",
      "tipo": "Tónico",
      "paso": "tratamiento",
      "contenido": "100 ml",
      "precio": 21900,
      "estado": "nuevo",
      "necesidades": ["fuerza"],
      "bajada": "Para el cuero cabelludo. Pelo fino, sin volumen o que se quiebra.",
      "descripcion": "Un tónico liviano para aplicar directo en el cuero cabelludo. Pensado para pelo fino o sin cuerpo: aporta sensación de volumen desde la raíz y deja el pelo más fuerte al tacto.",
      "beneficios": ["Volumen desde la raíz", "Textura liviana, no engrasa", "Se aplica en un minuto"],
      "uso": "Con el pelo limpio, húmedo o seco, aplicá 3 o 4 pulsos sobre el cuero cabelludo, separando por zonas. Masajeá con las yemas. No se enjuaga.",
      "activos": "",
      "imagenes": ["img/productos/tonico-fortalecedor.webp", "img/productos/tonico-fortalecedor-2.webp"],
      "alt": "Frasco verde salvia de Tónico Fortalecedor con válvula dosificadora bordó"
    }
  ],

  "rutinas": [
    {
      "id": "rutina-hidratacion",
      "nombre": "Rutina Hidratación",
      "bajada": "Para pelo seco que pide suavidad y brillo.",
      "productos": ["shampoo-hidratacion", "acondicionador-hidratacion", "serum-puntas"],
      "descuento": 15,
      "imagen": "img/productos/rutina-hidratacion.webp",
      "alt": "Shampoo, acondicionador y sérum de la línea Hidratación"
    },
    {
      "id": "rutina-reparacion",
      "nombre": "Rutina Reparación",
      "bajada": "Para pelo castigado por el calor o la decoloración.",
      "productos": ["shampoo-hidratacion", "mascara-reparacion", "termoprotector"],
      "descuento": 15,
      "imagen": "img/productos/rutina-reparacion.webp",
      "alt": "Shampoo, máscara de reparación y spray termoprotector"
    },
    {
      "id": "rutina-rulos",
      "nombre": "Rutina Rulos",
      "bajada": "Definición que dura, sin frizz y sin efecto duro.",
      "productos": ["shampoo-hidratacion", "acondicionador-hidratacion", "crema-rulos"],
      "descuento": 15,
      "imagen": "img/productos/rutina-rulos.webp",
      "alt": "Shampoo, acondicionador y crema de peinar para rulos"
    }
  ]
};
