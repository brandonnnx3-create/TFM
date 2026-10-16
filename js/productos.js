/* ============================================================
   TIME FOR ME — CATÁLOGO
   ------------------------------------------------------------
   Lo que está entre llaves es JSON: comillas dobles y sin coma
   después del último elemento de cada lista.

   NECESIDADES  (arman los filtros, "¿Qué necesita tu pelo hoy?" y
                el diagnóstico)
     id            palabra corta sin espacios ni tildes.
     nombre        como se muestra.
     bajada        una línea de descripción.
     imagen        foto que aparece al pasar el mouse.
     diagnostico   false = no aparece como respuesta del diagnóstico
                   (por ejemplo "Coloración", que no es una rutina).

   PRODUCTOS
     id         único, sin espacios ni tildes. Link directo:
                tusitio/#producto/fidelite-argan
     nombre     como se muestra.
     marca      "Fidelité", "Frilayp"...
     tipo       "Ampollas", "Máscara", "Shampoo"...
     paso       "limpieza", "tratamiento" o "finalizacion": ordena la
                rutina que recomienda el diagnóstico. "" = no entra en
                el diagnóstico (coloración, oxidantes).
     contenido  "30 ml", "12 ampollas de 15 ml". "" = no se muestra.
     opciones   opcional: tamaños, volúmenes o tonos para elegir
                (["270 g", "1000 g"]). opcionesTitulo: "Tamaño".
                Con opciones, el botón de la grilla lleva a la ficha
                para elegir.
     precio     número sin puntos (18900), o null para "Consultar
                precio": se arma el pedido igual y el total se pasa
                por WhatsApp.
     estado     "", "nuevo", "mas-vendido" o "agotado".
     necesidades  ids de la lista de arriba. Además existe "calor"
                (para quien usa plancha o secador seguido).
     bajada     una línea corta: qué hace, para quién.
     descripcion, beneficios, uso, activos: textos de la ficha. Lo
                vacío no se muestra.
     imagenes   1 o más fotos verticales 4:5 (900 × 1125).
     alt        qué se ve en la foto, para quien no la ve.

   RUTINAS  (kits con descuento sobre la suma de los precios)
     Vacío = la sección no aparece. Necesita productos con precio.
   ============================================================ */

const CATALOGO = {
  "necesidades": [
    { "id": "hidratacion", "nombre": "Hidratación",        "bajada": "Seco, opaco o áspero al tacto",              "imagen": "img/productos/fidelite-mascara-almendras.jpg" },
    { "id": "reparacion",  "nombre": "Reparación",         "bajada": "Dañado, quebradizo o castigado",             "imagen": "img/productos/karseell-collagen.jpg" },
    { "id": "color",       "nombre": "Teñido o decolorado","bajada": "Cuidar el color y cerrar la cutícula",       "imagen": "img/productos/frilayp-combo-acido.jpg" },
    { "id": "puntas",      "nombre": "Frizz y puntas",     "bajada": "Puntas abiertas, frizz y calor",             "imagen": "img/productos/fidelite-reparador-girasol.jpg" },
    { "id": "rulos",       "nombre": "Rulos",              "bajada": "Hidratación y elasticidad",                  "imagen": "img/productos/frilayp-rulos.jpg" },
    { "id": "coloracion",  "nombre": "Coloración",         "bajada": "Tinturas, oxidantes y decolorante",          "imagen": "img/productos/fidelite-colormaster.jpg", "diagnostico": false }
  ],

  "productos": [
    {
      "id": "fidelite-argan",
      "nombre": "Tratamiento Restaurador Argán",
      "marca": "Fidelité",
      "tipo": "Ampollas",
      "paso": "tratamiento",
      "contenido": "12 ampollas de 15 ml",
      "precio": null,
      "estado": "",
      "necesidades": ["hidratacion", "reparacion"],
      "bajada": "Hidrata y nutre intensamente.",
      "descripcion": "Ampollas de tratamiento concentrado a base de aceite de argán, de la línea Mythical Hair Complex de Fidelité. Para el pelo seco o castigado que necesita hidratación y nutrición intensas.",
      "beneficios": ["Hidrata y nutre intensamente", "A base de aceite de argán", "Caja de 12 ampollas de 15 ml"],
      "uso": "",
      "activos": "Aceite de argán.",
      "imagenes": ["img/productos/fidelite-argan.jpg"],
      "alt": "Caja negra y dorada de ampollas Argán de Fidelité, con una ampolla al costado"
    },
    {
      "id": "fidelite-caviar",
      "nombre": "Complejo Caviar Hidro-Nutritivo",
      "marca": "Fidelité",
      "tipo": "Ampollas",
      "paso": "finalizacion",
      "contenido": "12 ampollas de 15 ml",
      "precio": null,
      "estado": "",
      "necesidades": ["hidratacion", "reparacion"],
      "bajada": "Reestructura el cabello al instante. Sin enjuague.",
      "descripcion": "Complejo hidro-nutritivo de la línea Caviar de Fidelité, de uso sin enjuague (leave on). Reestructura el cabello al instante.",
      "beneficios": ["Reestructura el cabello al instante", "Sin enjuague", "Caja de 12 ampollas de 15 ml"],
      "uso": "",
      "activos": "",
      "imagenes": ["img/productos/fidelite-caviar.jpg"],
      "alt": "Caja violeta de ampollas Caviar de Fidelité, con una ampolla al costado"
    },
    {
      "id": "fidelite-keratina-ampollas",
      "nombre": "Complejo Keratínico Reestructurante",
      "marca": "Fidelité",
      "tipo": "Ampollas",
      "paso": "tratamiento",
      "contenido": "12 ampollas de 15 ml",
      "precio": null,
      "estado": "",
      "necesidades": ["reparacion", "color"],
      "bajada": "Recupera la keratina natural.",
      "descripcion": "Ampollas Keratin Complex de Fidelité: un tratamiento reestructurante intensivo a base de keratina.",
      "beneficios": ["Recupera la keratina natural", "Tratamiento reestructurante intensivo", "Caja de 12 ampollas de 15 ml"],
      "uso": "",
      "activos": "Keratina.",
      "imagenes": ["img/productos/fidelite-keratina-ampollas.jpg"],
      "alt": "Caja naranja de ampollas Keratin Complex de Fidelité"
    },
    {
      "id": "fidelite-lino-ampollas",
      "nombre": "Tratamiento Reestructurante de Semillas de Lino",
      "marca": "Fidelité",
      "tipo": "Ampollas",
      "paso": "tratamiento",
      "contenido": "12 ampollas de 15 ml",
      "precio": null,
      "estado": "",
      "necesidades": ["reparacion", "puntas"],
      "bajada": "Reestructura y cierra las cutículas.",
      "descripcion": "Ampollas Linen Seeds de Fidelité, a base de extracto de semillas de lino. Reestructuran el cabello y cierran las cutículas.",
      "beneficios": ["Reestructura el cabello", "Cierra las cutículas", "Caja de 12 ampollas de 15 ml"],
      "uso": "",
      "activos": "Extracto de semillas de lino.",
      "imagenes": ["img/productos/fidelite-lino-ampollas.jpg"],
      "alt": "Caja turquesa de ampollas Linen Seeds de Fidelité"
    },
    {
      "id": "fidelite-mascara-keratina",
      "nombre": "Máscara Keratina Reparadora",
      "marca": "Fidelité",
      "tipo": "Máscara",
      "paso": "tratamiento",
      "contenido": "",
      "opciones": ["270 g", "1000 g"],
      "opcionesTitulo": "Tamaño",
      "precio": null,
      "estado": "",
      "necesidades": ["reparacion", "color"],
      "bajada": "Repara y devuelve la keratina al cabello.",
      "descripcion": "Máscara capilar de keratina de la línea Reparación de Fidelité. Repara el pelo dañado y le devuelve la keratina. En pote de 270 g o de 1 kg.",
      "beneficios": ["Repara y devuelve la keratina al cabello", "Línea Reparación", "En 270 g o 1000 g"],
      "uso": "",
      "activos": "Keratina.",
      "imagenes": ["img/productos/fidelite-mascara-keratina.jpg"],
      "alt": "Dos potes naranjas de máscara Keratina de Fidelité, de 270 g y de 1000 g"
    },
    {
      "id": "fidelite-mascara-almendras",
      "nombre": "Máscara Almendras Hidratante",
      "marca": "Fidelité",
      "tipo": "Máscara",
      "paso": "tratamiento",
      "contenido": "",
      "opciones": ["270 g", "1000 g"],
      "opcionesTitulo": "Tamaño",
      "precio": null,
      "estado": "",
      "necesidades": ["hidratacion", "rulos"],
      "bajada": "Aporta vitaminas e hidratación profunda.",
      "descripcion": "Máscara capilar de almendras de la línea Hidratación de Fidelité. Aporta vitaminas e hidratación profunda al pelo seco u opaco. En pote de 270 g o de 1 kg.",
      "beneficios": ["Hidratación profunda", "Aporta vitaminas", "En 270 g o 1000 g"],
      "uso": "",
      "activos": "Almendras.",
      "imagenes": ["img/productos/fidelite-mascara-almendras.jpg"],
      "alt": "Dos potes cobrizos de máscara Almendras de Fidelité, de 270 g y de 1000 g"
    },
    {
      "id": "fidelite-reparador-lino",
      "nombre": "Reparador de Puntas de Lino",
      "marca": "Fidelité",
      "tipo": "Reparador de puntas",
      "paso": "finalizacion",
      "contenido": "30 ml",
      "precio": null,
      "estado": "",
      "necesidades": ["puntas"],
      "bajada": "Densidad media. Ideal para cabellos finos.",
      "descripcion": "Sérum reparador de puntas de lino, de densidad media. Repara las puntas dañadas; ideal para el pelo fino.",
      "beneficios": ["Repara las puntas dañadas", "Densidad media", "Ideal para cabellos finos"],
      "uso": "",
      "activos": "Lino.",
      "imagenes": ["img/productos/fidelite-reparador-lino.jpg"],
      "alt": "Frasco violeta con dosificador del Reparador de Puntas de Lino de Fidelité, junto a su caja"
    },
    {
      "id": "fidelite-reparador-girasol",
      "nombre": "Reparador de Puntas de Girasol",
      "marca": "Fidelité",
      "tipo": "Reparador de puntas",
      "paso": "finalizacion",
      "contenido": "30 ml",
      "precio": null,
      "estado": "",
      "necesidades": ["puntas", "reparacion"],
      "bajada": "Densidad alta. Ideal para cabellos castigados.",
      "descripcion": "Sérum reparador de puntas de girasol, de densidad alta. Repara las puntas dañadas: ideal para el pelo castigado.",
      "beneficios": ["Repara las puntas dañadas", "Densidad alta", "Ideal para cabellos castigados"],
      "uso": "",
      "activos": "Girasol.",
      "imagenes": ["img/productos/fidelite-reparador-girasol.jpg"],
      "alt": "Frasco rojo con dosificador del Reparador de Puntas de Girasol de Fidelité, junto a su caja dorada"
    },
    {
      "id": "fidelite-protector-termico",
      "nombre": "Protector Térmico Caviar",
      "marca": "Fidelité",
      "tipo": "Protector térmico",
      "paso": "finalizacion",
      "contenido": "120 ml",
      "precio": null,
      "estado": "",
      "necesidades": ["puntas", "calor", "reparacion"],
      "bajada": "Escudo protector contra el calor.",
      "descripcion": "Protector térmico en spray de la línea Caviar de Fidelité. Un escudo para el pelo antes de usar plancha, buclera o secador.",
      "beneficios": ["Escudo protector contra el calor", "En spray", "120 ml"],
      "uso": "",
      "activos": "",
      "imagenes": ["img/productos/fidelite-protector-termico.jpg"],
      "alt": "Spray violeta Protector Térmico Caviar de Fidelité"
    },
    {
      "id": "frilayp-combo-acido",
      "nombre": "Combo pH Ácido",
      "marca": "Frilayp",
      "tipo": "Shampoo + acondicionador",
      "paso": "limpieza",
      "contenido": "2 envases de 370 ml",
      "precio": null,
      "estado": "",
      "necesidades": ["color"],
      "bajada": "Para teñidos y decolorados: fija el color y aporta brillo.",
      "descripcion": "Shampoo y acondicionador de pH ácido. Tratan el pelo teñido o decolorado y el pelo procesado que quedó poroso. Ideales para el cierre técnico: fijan el color y aportan brillo y protección.",
      "beneficios": ["Para pelo teñido, decolorado o procesado", "Ideal para el cierre técnico", "Fija el color y aporta brillo y protección"],
      "uso": "",
      "activos": "",
      "imagenes": ["img/productos/frilayp-combo-acido.jpg"],
      "alt": "Shampoo y acondicionador pH Ácido de Frilayp, rodeados de rodajas de limón y naranja"
    },
    {
      "id": "frilayp-combo-keratina-argan",
      "nombre": "Combo Keratina y Argán",
      "marca": "Frilayp",
      "tipo": "Shampoo + acondicionador",
      "paso": "limpieza",
      "contenido": "2 envases de 370 ml",
      "precio": null,
      "estado": "",
      "necesidades": ["reparacion", "puntas", "hidratacion"],
      "bajada": "Repara, reduce el frizz y previene las puntas abiertas.",
      "descripcion": "Shampoo y acondicionador de keratina y argán, para todo tipo de pelo. Penetran en la fibra capilar para reconstruir y fortalecer el pelo desde adentro, reducen el frizz y previenen las puntas abiertas.",
      "beneficios": ["Para todo tipo de pelo", "Reconstruye y fortalece desde adentro", "Reduce el frizz y previene las puntas abiertas"],
      "uso": "",
      "activos": "Keratina y aceite de argán.",
      "imagenes": ["img/productos/frilayp-combo-keratina-argan.jpg"],
      "alt": "Shampoo y acondicionador Keratina y Argán de Frilayp, con semillas de argán"
    },
    {
      "id": "frilayp-acido-hialuronico",
      "nombre": "Tratamiento Ácido Hialurónico",
      "marca": "Frilayp",
      "tipo": "Tratamiento capilar",
      "paso": "tratamiento",
      "contenido": "240 g",
      "precio": null,
      "estado": "",
      "necesidades": ["hidratacion"],
      "bajada": "Cabello fuerte y lleno de vida.",
      "descripcion": "Tratamiento capilar de ácido hialurónico de Frilayp, para un pelo fuerte y lleno de vida.",
      "beneficios": ["Cabello fuerte y lleno de vida", "Pote de 240 g"],
      "uso": "",
      "activos": "Ácido hialurónico.",
      "imagenes": ["img/productos/frilayp-acido-hialuronico.jpg"],
      "alt": "Pote blanco de Tratamiento Ácido Hialurónico de Frilayp"
    },
    {
      "id": "frilayp-ph-acido",
      "nombre": "Tratamiento pH Ácido",
      "marca": "Frilayp",
      "tipo": "Tratamiento capilar",
      "paso": "tratamiento",
      "contenido": "",
      "precio": null,
      "estado": "",
      "necesidades": ["color"],
      "bajada": "Tratamiento capilar profesional de pH ácido.",
      "descripcion": "Tratamiento capilar profesional de pH ácido de Frilayp.",
      "beneficios": ["Tratamiento capilar profesional", "pH ácido"],
      "uso": "",
      "activos": "",
      "imagenes": ["img/productos/frilayp-ph-acido.jpg"],
      "alt": "Pote con etiqueta verde de Tratamiento pH Ácido de Frilayp"
    },
    {
      "id": "frilayp-rulos",
      "nombre": "Tratamiento Rulos",
      "marca": "Frilayp",
      "tipo": "Tratamiento capilar",
      "paso": "tratamiento",
      "contenido": "240 g",
      "precio": null,
      "estado": "",
      "necesidades": ["rulos", "hidratacion"],
      "bajada": "Hidratación intensa y elasticidad.",
      "descripcion": "Tratamiento capilar para rulos de Frilayp: hidratación intensa y elasticidad.",
      "beneficios": ["Hidratación intensa", "Elasticidad", "Pote de 240 g"],
      "uso": "",
      "activos": "",
      "imagenes": ["img/productos/frilayp-rulos.jpg"],
      "alt": "Pote blanco de Tratamiento Rulos de Frilayp"
    },
    {
      "id": "karseell-collagen",
      "nombre": "Máscara Maca Power Collagen",
      "marca": "Karseell",
      "tipo": "Máscara",
      "paso": "tratamiento",
      "contenido": "500 ml",
      "precio": null,
      "estado": "",
      "necesidades": ["reparacion", "hidratacion", "puntas"],
      "bajada": "Nutrición, reparación y brillo desde la primera aplicación.",
      "descripcion": "La mascarilla Karseell Maca Power Collagen, con extracto de maca. Para todo tipo de pelo, especialmente dañado y seco.",
      "beneficios": ["Repara el cabello dañado y previene el quiebre", "Hidratación y acondicionamiento profundos", "Controla el frizz y aporta brillo"],
      "uso": "",
      "activos": "Extracto de maca y colágeno.",
      "imagenes": ["img/productos/karseell-collagen.jpg", "img/productos/karseell-collagen-sachets.jpg"],
      "alt": "Pote de Mascarilla Karseell Maca Power Collagen de 500 ml"
    },
    {
      "id": "karseell-collagen-sachets",
      "nombre": "Maca Power Collagen en sachets",
      "marca": "Karseell",
      "tipo": "Máscara en sachet",
      "paso": "tratamiento",
      "contenido": "",
      "precio": null,
      "estado": "",
      "necesidades": ["reparacion", "hidratacion"],
      "bajada": "La mascarilla Karseell en formato sachet.",
      "descripcion": "La mascarilla Karseell Maca Power Collagen en sachets individuales.",
      "beneficios": ["Formato individual", "Para pelo dañado y seco"],
      "uso": "",
      "activos": "Extracto de maca y colágeno.",
      "imagenes": ["img/productos/karseell-collagen-sachets.jpg"],
      "alt": "Caja y sachets de Karseell Maca Power Collagen"
    },
    {
      "id": "mary-bosques-ph7",
      "nombre": "Shampoo Neutro pH7 Pre Tratamiento",
      "marca": "Mary Bosques",
      "tipo": "Shampoo",
      "paso": "limpieza",
      "contenido": "Caja de 36 sobres de 10 g",
      "precio": null,
      "estado": "",
      "necesidades": ["reparacion", "color", "hidratacion"],
      "bajada": "Prepara tu pelo para que el tratamiento rinda más.",
      "descripcion": "Shampoo neutro de pH balanceado, el primer paso antes de cualquier tratamiento: limpia suave y profundamente, elimina residuos y abre la cutícula para que el tratamiento penetre mejor.",
      "beneficios": ["Limpia suave y profundamente", "Elimina residuos y abre la cutícula", "pH balanceado"],
      "uso": "Aplicá la cantidad necesaria sobre el pelo húmedo. Masajeá suavemente el cuero cabelludo y todo el largo, sin enredarlo. Enjuagá con abundante agua, secá con toalla y aplicá el tratamiento elegido.",
      "activos": "",
      "imagenes": ["img/productos/mary-bosques-ph7.jpg"],
      "alt": "Caja y sobre de Shampoo Neutro pH7 Pre Tratamiento de Mary Bosques"
    },
    {
      "id": "mary-bosques-colageno",
      "nombre": "Colágeno Capilar",
      "marca": "Mary Bosques",
      "tipo": "Tratamiento en sachet",
      "paso": "tratamiento",
      "contenido": "Sobre de 20 g",
      "precio": null,
      "estado": "",
      "necesidades": ["reparacion"],
      "bajada": "Elasticidad y fuerza para el pelo dañado.",
      "descripcion": "Tratamiento capilar para la reconstrucción del pelo dañado. Mejora la elasticidad y la fuerza del cabello. En crema, en sachet, para una aplicación fácil.",
      "beneficios": ["Reconstruye el pelo dañado", "Mejora la elasticidad y la fuerza", "Sachet de 20 g"],
      "uso": "",
      "activos": "Colágeno.",
      "imagenes": ["img/productos/mary-bosques-colageno.jpg"],
      "alt": "Caja y sobres de Colágeno Capilar de Mary Bosques"
    },
    {
      "id": "mary-bosques-3-minutos",
      "nombre": "Tratamiento Reparador Intensivo 3 Minutos",
      "marca": "Mary Bosques",
      "tipo": "Tratamiento en sachet",
      "paso": "tratamiento",
      "contenido": "Sobre de 20 g",
      "precio": null,
      "estado": "",
      "necesidades": ["reparacion", "color"],
      "bajada": "Reconstruye y fortalece en 3 minutos.",
      "descripcion": "Tratamiento reparador intensivo de acción rápida: reconstruye y fortalece el pelo y lo deja sin porosidad, en 3 minutos.",
      "beneficios": ["Reconstruye y fortalece", "Cabello sin porosidad", "Actúa en 3 minutos"],
      "uso": "",
      "activos": "",
      "imagenes": ["img/productos/mary-bosques-3-minutos.jpg"],
      "alt": "Sobre de Tratamiento Reparador Intensivo 3 Minutos de Mary Bosques"
    },
    {
      "id": "fidelite-colormaster",
      "nombre": "Coloración Color Master",
      "marca": "Fidelité",
      "tipo": "Tintura",
      "paso": "",
      "contenido": "60 g",
      "precio": null,
      "estado": "",
      "necesidades": ["coloracion"],
      "bajada": "Coloración premium en crema. Consultá los tonos.",
      "descripcion": "Tintura en crema Color Master de Fidelité, coloración premium en pomo de 60 g. Escribinos para saber qué tonos hay disponibles.",
      "beneficios": ["Coloración premium", "Pomo de 60 g"],
      "uso": "",
      "activos": "",
      "imagenes": ["img/productos/fidelite-colormaster.jpg"],
      "alt": "Pomo y caja roja de coloración Color Master de Fidelité"
    },
    {
      "id": "frilayp-oxidante-hierbas",
      "nombre": "Crema Oxidante Hierbas",
      "marca": "Frilayp",
      "tipo": "Oxidante",
      "paso": "",
      "contenido": "",
      "opciones": ["20 vol", "30 vol"],
      "opcionesTitulo": "Volumen",
      "precio": null,
      "estado": "",
      "necesidades": ["coloracion"],
      "bajada": "Crema oxidante con hierbas, en 20 y 30 volúmenes.",
      "descripcion": "Crema oxidante con hierbas de Frilayp, para usar con tinturas y decolorantes. En 20 o 30 volúmenes.",
      "beneficios": ["Con hierbas", "En 20 o 30 volúmenes"],
      "uso": "",
      "activos": "",
      "imagenes": ["img/productos/frilayp-oxidante-hierbas.jpg", "img/productos/frilayp-oxidante-hierbas-30.jpg"],
      "alt": "Botella violeta de Crema Oxidante Hierbas de Frilayp"
    },
    {
      "id": "frilayp-oxidante-chico",
      "nombre": "Crema Oxidante 20 vol",
      "marca": "Frilayp",
      "tipo": "Oxidante",
      "paso": "",
      "contenido": "Envase chico",
      "precio": null,
      "estado": "",
      "necesidades": ["coloracion"],
      "bajada": "Crema oxidante de 20 volúmenes en envase chico.",
      "descripcion": "Crema oxidante de 20 volúmenes de Frilayp, en envase chico.",
      "beneficios": ["20 volúmenes", "Envase chico"],
      "uso": "",
      "activos": "",
      "imagenes": ["img/productos/frilayp-oxidante-chico.jpg"],
      "alt": "Envases blancos chicos de Crema Oxidante 20 vol de Frilayp"
    },
    {
      "id": "frilayp-revelador",
      "nombre": "Revelador",
      "marca": "Frilayp",
      "tipo": "Revelador",
      "paso": "",
      "contenido": "920 cc",
      "precio": null,
      "estado": "",
      "necesidades": ["coloracion"],
      "bajada": "Revelador para coloración, en envase de 920 cc.",
      "descripcion": "Revelador de Frilayp para coloración, en envase de 920 cc.",
      "beneficios": ["Envase de 920 cc"],
      "uso": "",
      "activos": "",
      "imagenes": ["img/productos/frilayp-revelador.jpg"],
      "alt": "Botellas violetas de Revelador de Frilayp"
    },
    {
      "id": "mary-bosques-decolorante",
      "nombre": "Polvo Decolorante",
      "marca": "Mary Bosques",
      "tipo": "Decolorante",
      "paso": "",
      "contenido": "Caja de 12 sobres de 70 g",
      "precio": null,
      "estado": "",
      "necesidades": ["coloracion"],
      "bajada": "Decolorante en polvo, en sobres de 70 g.",
      "descripcion": "Polvo decolorante de Mary Bosques en sobres de 70 g. Se prepara con crema oxidante.",
      "beneficios": ["Sobres de 70 g", "Caja de 12 sobres"],
      "uso": "",
      "activos": "",
      "imagenes": ["img/productos/mary-bosques-decolorante.jpg"],
      "alt": "Caja y sobre de Polvo Decolorante de Mary Bosques"
    }
  ],

  "rutinas": []
};
