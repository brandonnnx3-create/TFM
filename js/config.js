/* ============================================================
   TIME FOR ME — DATOS DEL NEGOCIO
   ------------------------------------------------------------
   Todo lo que la página promete sale de acá. Si algo no es
   cierto para tu negocio, cambialo o dejalo vacío: lo que queda
   vacío (o en 0) no se muestra.

   whatsapp   formato internacional, sólo números:
              54 + 9 + característica sin el 0 + número sin el 15.
              Ej.: La Plata 221 605-6950 → "5492216056950".
              Vacío: los botones de compra llevan a #contacto.
   instagram  usuario sin @.

   envioGratisDesde       monto del pedido desde el que el envío
                          es gratis. 0 = no hay envío gratis (se
                          oculta la barra de progreso del carrito).
   descuentoTransferencia porcentaje. 0 = no se muestra.
   cuotasSinInteres       cantidad. 0 = no se muestra.
   ============================================================ */

const CONFIG = {
  "marca": "Time for me",
  "whatsapp": "",
  "instagram": "",
  "email": "",
  "ciudad": "",

  "moneda": "ARS",
  "envioGratisDesde": 60000,
  "descuentoTransferencia": 10,
  "cuotasSinInteres": 3,

  "pagos": ["Transferencia", "Mercado Pago", "Tarjetas de débito y crédito"],
  "envios": "Envíos a todo el país",
  "cambios": "Cambios dentro de los 30 días, con el producto cerrado"
};
