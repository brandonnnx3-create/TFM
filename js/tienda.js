/* ============================================================
   TIME FOR ME — TIENDA
   ------------------------------------------------------------
   Arma todo lo que depende del catálogo (js/productos.js) y de los
   datos del negocio (js/config.js): filtros, grilla, ficha de
   producto, rutinas, diagnóstico y carrito.

   El carrito no cobra: junta el pedido y lo manda armado por
   WhatsApp, donde se confirma stock, envío y forma de pago.
   ============================================================ */

(function () {
  "use strict";

  /* const en un script clásico no cuelga de window: se leen directo. */
  var cfg = typeof CONFIG !== "undefined" ? CONFIG : {};
  var cat = typeof CATALOGO !== "undefined" ? CATALOGO : {};
  var NECESIDADES = cat.necesidades || [];
  var PRODUCTOS = cat.productos || [];
  var RUTINAS = cat.rutinas || [];

  var root = document.documentElement;
  var animar = root.classList.contains("animar");

  /* ---------- utilidades ---------- */
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function icono(id, clase) { return '<svg class="i' + (clase ? " " + clase : "") + '" aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function leer(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function guardar(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  var formato;
  try {
    formato = new Intl.NumberFormat("es-AR", { style: "currency", currency: cfg.moneda || "ARS", maximumFractionDigits: 0, minimumFractionDigits: 0 });
  } catch (e) {
    formato = { format: function (n) { return "$ " + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); } };
  }
  /* "$18.900", como se escribe acá (Intl pone un espacio después del $). */
  function precio(n) { return formato.format(Math.round(n)).replace(/^(\D+?)\s+/, "$1"); }
  function enLista(arr) {
    if (arr.length < 2) return arr.join("");
    return arr.slice(0, -1).join(", ") + " y " + arr[arr.length - 1];
  }

  var DESC = Math.max(0, +cfg.descuentoTransferencia || 0);
  var CUOTAS = Math.max(0, Math.floor(+cfg.cuotasSinInteres || 0));
  var ENVIO_GRATIS = Math.max(0, +cfg.envioGratisDesde || 0);
  var MARCA = cfg.marca || "Time for me";
  var numeroWa = String(cfg.whatsapp || "").replace(/\D/g, "");
  var hayWa = numeroWa.length >= 8;
  function conTransferencia(n) { return n * (1 - DESC / 100); }
  /* Un producto sin precio cargado (null) se muestra "a consultar": el
     pedido se arma igual y el total se pasa por WhatsApp. */
  function tienePrecio(c) { return !!c && typeof c.precio === "number" && c.precio > 0; }
  function linkWa(texto) { return hayWa ? "https://wa.me/" + numeroWa + "?text=" + encodeURIComponent(texto) : null; }
  function ponerWa(a, texto) {
    var h = linkWa(texto);
    if (!h) return false;
    a.href = h; a.target = "_blank"; a.rel = "noopener";
    return true;
  }

  /* ---------- índices ---------- */
  var P = {}, N = {}, K = {};
  PRODUCTOS.forEach(function (p) {
    p.necesidades = p.necesidades || [];
    p.imagenes = (p.imagenes || []).filter(Boolean);
    p.beneficios = p.beneficios || [];
    p.opciones = (p.opciones || []).filter(Boolean);
    P[p.id] = p;
  });
  var HAY_PRECIOS = PRODUCTOS.some(tienePrecio);
  var MARCAS = [];
  PRODUCTOS.forEach(function (p) { if (p.marca && MARCAS.indexOf(p.marca) < 0) MARCAS.push(p.marca); });
  NECESIDADES.forEach(function (n) { N[n.id] = n; });
  RUTINAS.forEach(function (k) {
    k.items = (k.productos || []).map(function (id) { return P[id]; }).filter(Boolean);
    k.suma = k.items.reduce(function (s, p) { return s + (+p.precio || 0); }, 0);
    k.precio = Math.round(k.suma * (1 - (+k.descuento || 0) / 100) / 100) * 100;
    k.ahorro = k.suma - k.precio;
    k.agotado = k.items.some(function (p) { return p.estado === "agotado"; });
    if (k.items.length) K[k.id] = k;
  });
  var PASOS = { limpieza: "Limpiar", tratamiento: "Tratar", finalizacion: "Terminar" };
  var ORDEN_PASOS = ["limpieza", "tratamiento", "finalizacion"];
  var BADGES = { "nuevo": "Nuevo", "mas-vendido": "Más vendido", "agotado": "Agotado" };

  /* ============================================================
     TEMA (versión clara / oscura)
     ============================================================ */
  var COLOR_BARRA = { light: "#FBF7F3", dark: "#230B13" };
  function temaActual() { return root.getAttribute("data-theme") === "dark" ? "dark" : "light"; }
  function pintarTema() {
    var t = temaActual();
    $$("[data-tema-texto]").forEach(function (el) { el.textContent = t === "dark" ? "Versión clara" : "Versión oscura"; });
    $$(".tema-btn").forEach(function (b) { b.setAttribute("aria-label", t === "dark" ? "Cambiar a versión clara" : "Cambiar a versión oscura"); });
    $$('meta[name="theme-color"]').forEach(function (m) { m.setAttribute("content", COLOR_BARRA[t]); });
  }
  $$("[data-tema-toggle]").forEach(function (b) {
    b.addEventListener("click", function () {
      var t = temaActual() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", t);
      guardar("tfm_tema", t);
      pintarTema();
    });
  });
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var alCambiar = function (e) {
      var guardado = leer("tfm_tema");
      if (guardado === "light" || guardado === "dark") return;
      root.setAttribute("data-theme", e.matches ? "dark" : "light");
      pintarTema();
    };
    if (mq.addEventListener) mq.addEventListener("change", alCambiar);
  }
  pintarTema();

  /* ============================================================
     DATOS DEL NEGOCIO EN LA PÁGINA
     data-si="clave"   se oculta si ese dato está vacío o en 0.
     data-dato="clave" muestra el dato (listas como "a, b y c").
     ============================================================ */
  function vacio(v) { return v == null || v === "" || v === 0 || v === "0" || (Array.isArray(v) && !v.length); }
  $$("[data-si]").forEach(function (el) { if (vacio(cfg[el.getAttribute("data-si")])) el.hidden = true; });
  $$("[data-dato]").forEach(function (el) {
    var v = cfg[el.getAttribute("data-dato")];
    if (vacio(v)) return;
    if (Array.isArray(v)) v = enLista(v);
    if (el.getAttribute("data-formato") === "precio") v = precio(+v);
    el.textContent = v;
  });
  $$("[data-wa]").forEach(function (a) { ponerWa(a, a.getAttribute("data-wa")); });

  var anio = $("#anio");
  if (anio) anio.textContent = new Date().getFullYear();

  (function contacto() {
    var ig = String(cfg.instagram || "").replace(/^@/, "").trim();
    var mail = String(cfg.email || "").trim();
    var hay = { whatsapp: hayWa, instagram: !!ig, email: !!mail };
    $$("[data-requiere]").forEach(function (el) { if (!hay[el.getAttribute("data-requiere")]) el.hidden = true; });
    var aIg = $("[data-href-instagram]");
    if (aIg && ig) aIg.href = "https://instagram.com/" + encodeURIComponent(ig);
    var aMail = $("[data-href-email]");
    if (aMail && mail) aMail.href = "mailto:" + mail;
    if (!hayWa && !ig && !mail) {
      var acc = $("#contactoAcciones"); if (acc) acc.hidden = true;
      var v = $("#contactoVacio"); if (v) v.hidden = false;
    }
  })();

  (function pie() {
    var ulN = $("#pieNecesidades");
    if (ulN) {
      ulN.insertAdjacentHTML("beforeend", NECESIDADES.map(function (n) {
        return '<li><a href="#tienda" data-filtro="' + esc(n.id) + '">' + esc(n.nombre) + "</a></li>";
      }).join(""));
    }
    var ulP = $("#piePagos");
    if (ulP) {
      var pagos = (cfg.pagos || []).slice();
      if (CUOTAS) pagos.push(CUOTAS + " cuotas sin interés");
      ulP.innerHTML = pagos.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
      if (!pagos.length) ulP.parentNode.hidden = true;
    }
  })();

  /* ============================================================
     AVISO ROTATIVO (barra de arriba)
     ============================================================ */
  (function avisoBarra() {
    var caja = $("#aviso"), pista = $("#avisoPista");
    if (!caja || !pista) return;
    var msjs = [
      cfg.envios,
      ENVIO_GRATIS ? "Envío gratis desde " + precio(ENVIO_GRATIS) : "",
      DESC ? DESC + "% off pagando por transferencia" : "",
      CUOTAS ? CUOTAS + " cuotas sin interés" : "",
      MARCAS.join(" · ")
    ].filter(Boolean);
    if (!msjs.length) { caja.hidden = true; root.style.setProperty("--aviso-h", "0px"); return; }
    pista.innerHTML = msjs.map(function (m, i) {
      return '<p class="aviso__item' + (i === 0 ? " is-activo" : "") + '"' + (i ? ' aria-hidden="true"' : "") + ">" + esc(m) + "</p>";
    }).join("");
    if (msjs.length < 2 || !animar) return;
    var items = $$(".aviso__item", pista), i = 0, pausa = false;
    caja.addEventListener("mouseenter", function () { pausa = true; });
    caja.addEventListener("mouseleave", function () { pausa = false; });
    setInterval(function () {
      if (pausa || document.hidden) return;
      var actual = items[i];
      i = (i + 1) % items.length;
      var sig = items[i];
      actual.classList.remove("is-activo"); actual.classList.add("is-saliendo"); actual.setAttribute("aria-hidden", "true");
      sig.classList.remove("is-saliendo"); sig.classList.add("is-activo"); sig.removeAttribute("aria-hidden");
      setTimeout(function () { actual.classList.remove("is-saliendo"); }, 900);
    }, 4200);
  })();

  /* ============================================================
     CAPAS: menú, ficha y carrito
     Bloquean el scroll de atrás, atrapan el foco y se cierran con Esc.
     ============================================================ */
  var capas = [];
  var FOCO = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

  function abrirCapa(el, clase, foco) {
    if (capas.some(function (c) { return c.el === el; })) { if (foco) foco.focus({ preventScroll: true }); return; }
    capas.push({ el: el, clase: clase, volver: document.activeElement });
    el.hidden = false;
    root.classList.add("bloqueo");
    void el.offsetWidth;
    requestAnimationFrame(function () { el.classList.add(clase); });
    var f = foco || $(FOCO, el);
    if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 60);
  }
  function cerrarCapa(el, sinFoco) {
    var i = -1;
    capas.forEach(function (c, j) { if (c.el === el) i = j; });
    if (i < 0) return;
    var c = capas.splice(i, 1)[0];
    el.classList.remove(c.clase);
    if (!capas.length) root.classList.remove("bloqueo");
    setTimeout(function () {
      if (!capas.some(function (x) { return x.el === el; })) el.hidden = true;
    }, animar ? 750 : 0);
    if (!sinFoco && c.volver && document.contains(c.volver)) {
      try { c.volver.focus({ preventScroll: true }); } catch (e) {}
    }
    if (el === menu) btnMenu.setAttribute("aria-expanded", "false");
    if (el === carrito) btnCarrito.setAttribute("aria-expanded", "false");
  }
  function capaArriba() { return capas.length ? capas[capas.length - 1].el : null; }

  document.addEventListener("keydown", function (e) {
    var arriba = capaArriba();
    if (!arriba) return;
    if (e.key === "Escape") {
      e.preventDefault();
      if (arriba === ficha) cerrarFicha(); else cerrarCapa(arriba);
      return;
    }
    if (e.key === "Tab") {
      var focos = $$(FOCO, arriba).filter(function (x) { return x.offsetParent !== null || x === document.activeElement; });
      if (!focos.length) return;
      var primero = focos[0], ultimo = focos[focos.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    }
  });

  /* ---------- menú ---------- */
  var menu = $("#menu"), btnMenu = $("#abrirMenu");
  btnMenu.addEventListener("click", function () {
    btnMenu.setAttribute("aria-expanded", "true");
    abrirCapa(menu, "is-abierto");
  });
  $$("[data-cerrar-menu]", menu).forEach(function (el) {
    el.addEventListener("click", function () { cerrarCapa(menu, true); });
  });

  /* ---------- header al hacer scroll ---------- */
  var header = $("#header"), waFlot = $("#waFlotante");
  if (waFlot && hayWa) waFlot.hidden = false;
  var tic = false;
  function alScroll() {
    tic = false;
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle("is-scroll", y > 8);
    if (waFlot && hayWa) waFlot.classList.toggle("is-visible", y > 640);
  }
  window.addEventListener("scroll", function () { if (!tic) { tic = true; requestAnimationFrame(alScroll); } }, { passive: true });
  alScroll();

  /* ============================================================
     APARICIÓN AL SCROLLEAR
     ============================================================ */
  var observador = null;
  if ("IntersectionObserver" in window && animar) {
    observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); observador.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  }
  function revelar(el) {
    if (observador) observador.observe(el); else el.classList.add("is-visible");
  }
  $$("[data-reveal]").forEach(revelar);
  var ritual = $("#ritual"); if (ritual) revelar(ritual);

  /* ============================================================
     HERO: la figura del logo se dibuja trazo por trazo
     ============================================================ */
  (function hero() {
    var sec = $("#inicio"), svg = $("#heroFigura"), fuente = $("#figura path");
    if (svg && fuente && animar) {
      var NS = "http://www.w3.org/2000/svg";
      var partes = fuente.getAttribute("d").split(/(?=M)/).filter(function (s) { return s.trim(); });
      svg.innerHTML = "";
      partes.forEach(function (d, i) {
        var p = document.createElementNS(NS, "path");
        p.setAttribute("d", d);
        p.setAttribute("class", "trazo");
        svg.appendChild(p);
        var l = 0;
        try { l = Math.ceil(p.getTotalLength()); } catch (e) {}
        p.style.setProperty("--l", l || 2000);
        p.style.setProperty("--d", (0.5 + i * 0.07).toFixed(2) + "s");
      });
    }
    var dest = $("[data-destacado]");
    if (dest) {
      var p = P[dest.getAttribute("data-destacado")];
      if (!p) dest.hidden = true;
      else {
        $(".hero__destacado-nombre", dest).textContent = p.nombre;
        $(".hero__destacado-precio", dest).textContent = tienePrecio(p) ? precio(p.precio) : (p.marca || "");
      }
    }
    requestAnimationFrame(function () { requestAnimationFrame(function () { sec && sec.classList.add("is-in"); }); });
  })();

  /* ============================================================
     POR NECESIDAD
     ============================================================ */
  var NEC_CON_PRODUCTOS = NECESIDADES.filter(function (n) {
    return PRODUCTOS.some(function (p) { return p.necesidades.indexOf(n.id) > -1; });
  });
  (function necesidades() {
    var lista = $("#necLista"), foto = $("#necFoto");
    if (!lista) return;
    if (!NEC_CON_PRODUCTOS.length) { $("#necesidades").hidden = true; return; }
    lista.innerHTML = NEC_CON_PRODUCTOS.map(function (n, i) {
      return '<li class="nec' + (i === 0 ? " is-activa" : "") + '" data-nec="' + esc(n.id) + '">' +
        '<a class="nec__link" href="#tienda" data-filtro="' + esc(n.id) + '">' +
          '<span class="nec__n">' + String(i + 1).padStart(2, "0") + "</span>" +
          '<span class="nec__textos"><span class="nec__nombre">' + esc(n.nombre) + '</span><span class="nec__bajada">' + esc(n.bajada || "") + "</span></span>" +
          '<span class="nec__flecha">' + icono("i-flecha") + "</span>" +
        "</a></li>";
    }).join("");
    if (foto) {
      foto.innerHTML = NEC_CON_PRODUCTOS.map(function (n, i) {
        return n.imagen ? '<img src="' + esc(n.imagen) + '" alt="" loading="lazy" width="900" height="1125" data-nec="' + esc(n.id) + '"' + (i === 0 ? ' class="is-activa"' : "") + ">" : "";
      }).join("");
    }
    function activar(id) {
      $$(".nec", lista).forEach(function (li) { li.classList.toggle("is-activa", li.getAttribute("data-nec") === id); });
      if (foto) $$("img", foto).forEach(function (im) { im.classList.toggle("is-activa", im.getAttribute("data-nec") === id); });
    }
    $$(".nec", lista).forEach(function (li) {
      var id = li.getAttribute("data-nec");
      li.addEventListener("mouseenter", function () { activar(id); });
      li.addEventListener("focusin", function () { activar(id); });
    });
  })();

  /* ============================================================
     TIENDA: filtros, orden y grilla
     ============================================================ */
  var filtro = "todos", orden = "destacados", marca = "";
  var grilla = $("#grilla"), chips = $("#filtros"), cuenta = $("#cuenta"), selOrden = $("#orden"), selMarca = $("#marca");

  function tarjeta(p, i) {
    var agotado = p.estado === "agotado";
    var img1 = p.imagenes[0] || "", img2 = p.imagenes[1] || "";
    var badge = BADGES[p.estado] ? '<span class="badge' + (p.estado === "nuevo" ? " badge--nuevo" : "") + '">' + BADGES[p.estado] + "</span>" : "";
    /* Marca y presentación corta (lo largo, como "Caja de 36 sobres
       de 10 g", queda para la ficha). */
    var pres = p.opciones.length ? p.opciones.join(" / ") : (p.contenido && p.contenido.length <= 14 ? p.contenido : p.tipo);
    var meta = [p.marca, pres].filter(Boolean).map(esc).join(" · ");
    /* Con opciones (tamaño, volumen) el botón lleva a la ficha a elegir. */
    var boton = p.opciones.length && !agotado
      ? '<a class="quick" href="#producto/' + esc(p.id) + '" aria-label="Elegir ' + esc((p.opcionesTitulo || "opción").toLowerCase()) + " de " + esc(p.nombre) + '">' +
          icono("i-flecha") + '<span class="quick__txt">Elegir ' + esc((p.opcionesTitulo || "").toLowerCase()) + "</span></a>"
      : '<button class="quick" type="button" data-agregar="' + esc(p.id) + '"' + (agotado ? " disabled" : "") + ' aria-label="Agregar ' + esc(p.nombre) + ' al carrito">' +
          icono("i-mas") + '<span class="quick__txt">' + (agotado ? "Sin stock" : "Agregar") + "</span></button>";
    return '<li class="card' + (agotado ? " card--agotado" : "") + '" style="--d:' + ((i % 4) * 0.08).toFixed(2) + 's">' +
      '<div class="card__foto">' +
        '<a class="card__media" href="#producto/' + esc(p.id) + '" tabindex="-1" aria-hidden="true">' + badge +
          (img1 ? '<img class="card__img1" src="' + esc(img1) + '" alt="' + esc(p.alt || p.nombre) + '" loading="lazy" decoding="async" width="900" height="1125">' : "") +
          (img2 ? '<img class="card__img2" src="' + esc(img2) + '" alt="" loading="lazy" decoding="async" width="900" height="1125">' : "") +
        "</a>" +
        boton +
      "</div>" +
      (meta ? '<p class="card__meta">' + meta + "</p>" : "") +
      '<h3 class="card__titulo"><a href="#producto/' + esc(p.id) + '">' + esc(p.nombre) + "</a></h3>" +
      (p.bajada ? '<p class="card__bajada">' + esc(p.bajada) + "</p>" : "") +
      '<p class="card__precios">' + (tienePrecio(p)
        ? '<span class="precio">' + precio(p.precio) + "</span>" +
          (DESC ? '<span class="card__transf">' + precio(conTransferencia(p.precio)) + " con transferencia</span>" : "")
        : '<span class="precio precio--consultar">Consultar precio</span>') +
      "</p></li>";
  }

  function listaFiltrada() {
    var l = PRODUCTOS.filter(function (p) {
      return (filtro === "todos" || p.necesidades.indexOf(filtro) > -1) && (!marca || p.marca === marca);
    });
    var idx = {}; PRODUCTOS.forEach(function (p, i) { idx[p.id] = i; });
    l.sort(function (a, b) {
      var ag = (a.estado === "agotado") - (b.estado === "agotado");
      if (ag) return ag;
      if (orden !== "destacados") {
        var sp = tienePrecio(b) - tienePrecio(a);
        if (sp) return sp;
        if (tienePrecio(a) && orden === "menor") return a.precio - b.precio;
        if (tienePrecio(a) && orden === "mayor") return b.precio - a.precio;
      }
      return idx[a.id] - idx[b.id];
    });
    return l;
  }

  function pintarChips() {
    if (!chips) return;
    var ops = [{ id: "todos", nombre: "Todos" }].concat(NEC_CON_PRODUCTOS);
    chips.innerHTML = ops.map(function (n) {
      return '<button class="chip" type="button" data-chip="' + esc(n.id) + '" aria-pressed="' + (filtro === n.id) + '">' + esc(n.nombre) + "</button>";
    }).join("");
  }

  function pintarGrilla() {
    if (!grilla) return;
    var l = listaFiltrada();
    grilla.innerHTML = l.length ? l.map(tarjeta).join("") : '<li class="vacio">No hay productos para este filtro todavía.</li>';
    if (cuenta) cuenta.textContent = l.length + (l.length === 1 ? " producto" : " productos");
    $$(".card", grilla).forEach(revelar);
  }

  function aplicarFiltro(id) {
    filtro = N[id] ? id : "todos";
    $$(".chip", chips).forEach(function (c) { c.setAttribute("aria-pressed", String(c.getAttribute("data-chip") === filtro)); });
    pintarGrilla();
  }

  if (chips) {
    chips.addEventListener("click", function (e) {
      var c = e.target.closest(".chip");
      if (c) aplicarFiltro(c.getAttribute("data-chip"));
    });
  }
  if (selOrden) {
    if (!HAY_PRECIOS) selOrden.closest(".orden").hidden = true;
    selOrden.addEventListener("change", function () { orden = selOrden.value; pintarGrilla(); });
  }
  function aplicarMarca(m) {
    marca = MARCAS.indexOf(m) > -1 ? m : "";
    if (selMarca) selMarca.value = marca;
    pintarGrilla();
  }
  if (selMarca) {
    if (MARCAS.length < 2) selMarca.closest(".orden").hidden = true;
    selMarca.insertAdjacentHTML("beforeend", MARCAS.map(function (m) { return '<option value="' + esc(m) + '">' + esc(m) + "</option>"; }).join(""));
    selMarca.addEventListener("change", function () { aplicarMarca(selMarca.value); });
  }
  (function franjaMarcas() {
    var ul = $("#marcas");
    if (!ul) return;
    if (!MARCAS.length) { ul.closest("section").hidden = true; return; }
    ul.innerHTML = MARCAS.map(function (m) { return '<li><a href="#tienda" data-marca="' + esc(m) + '">' + esc(m) + "</a></li>"; }).join("");
  })();
  pintarChips();
  pintarGrilla();

  /* ============================================================
     RUTINAS (kits)
     ============================================================ */
  (function kits() {
    var ul = $("#kits");
    if (!ul) return;
    var ks = RUTINAS.filter(function (k) { return K[k.id]; });
    if (!ks.length) { $("#rutinas").hidden = true; return; }
    ul.innerHTML = ks.map(function (k, i) {
      return '<li class="kit" data-reveal style="--d:' + (i * 0.1).toFixed(2) + 's">' +
        '<div class="kit__media">' +
          (k.imagen ? '<img src="' + esc(k.imagen) + '" alt="' + esc(k.alt || k.nombre) + '" loading="lazy" decoding="async" width="900" height="1125">' : "") +
          (k.ahorro > 0 ? '<span class="kit__ahorro">Ahorrás ' + precio(k.ahorro) + "</span>" : "") +
        "</div>" +
        '<h3 class="kit__nombre">' + esc(k.nombre) + "</h3>" +
        (k.bajada ? '<p class="kit__bajada">' + esc(k.bajada) + "</p>" : "") +
        '<ul class="kit__incluye">' + k.items.map(function (p) {
          return '<li><a href="#producto/' + esc(p.id) + '">' + icono("i-check") + "<span>" + esc(p.nombre) + "</span></a><small>" + esc(p.contenido || "") + "</small></li>";
        }).join("") + "</ul>" +
        '<p class="kit__precios"><span class="precio">' + precio(k.precio) + "</span>" +
          (k.ahorro > 0 ? '<span class="precio-antes">' + precio(k.suma) + "</span>" : "") + "</p>" +
        '<button class="btn btn--bloque" type="button" data-agregar-kit="' + esc(k.id) + '"' + (k.agotado ? " disabled" : "") + ">" +
          "<span>" + (k.agotado ? "Sin stock" : "Agregar rutina") + "</span>" + (k.agotado ? "" : icono("i-mas")) + "</button>" +
        "</li>";
    }).join("");
    $$("[data-reveal]", ul).forEach(revelar);
  })();

  /* ============================================================
     FICHA DE PRODUCTO  (#producto/id)
     ============================================================ */
  var ficha = $("#ficha"), fichaPanel = $("#fichaPanel"), fichaContenido = $("#fichaContenido");
  var fichaId = null, fichaConEntrada = false, fichaCant = 1, fichaOp = 0;

  function complementos(p) {
    var otros = PRODUCTOS.filter(function (x) { return x.id !== p.id && x.estado !== "agotado"; });
    function afinidad(x) {
      return x.necesidades.filter(function (n) { return p.necesidades.indexOf(n) > -1; }).length;
    }
    var elegidos = [];
    ORDEN_PASOS.forEach(function (paso) {
      if (paso === p.paso) return;
      var c = otros.filter(function (x) { return x.paso === paso && afinidad(x) > 0; })
        .sort(function (a, b) { return afinidad(b) - afinidad(a); })[0];
      if (c) elegidos.push(c);
    });
    otros.sort(function (a, b) { return afinidad(b) - afinidad(a); }).forEach(function (x) {
      if (elegidos.length < 3 && elegidos.indexOf(x) < 0) elegidos.push(x);
    });
    return elegidos.slice(0, 3);
  }

  /* "Fidelité, 1000 g": marca y opción elegida (o contenido). */
  function detalle(p, op) { return [p.marca, op || p.contenido].filter(Boolean).join(", "); }

  function textoWaProducto(p, n, op) {
    var d = detalle(p, op);
    return "Hola! Quiero comprar:\n• " + n + " × " + p.nombre + (d ? " (" + d + ")" : "") +
      (tienePrecio(p) ? " — " + precio(p.precio * n) + "\n\n¿Me confirman stock y costo de envío?" : "\n\n¿Me pasan precio, stock y costo de envío?");
  }

  function pintarFicha(p) {
    var agotado = p.estado === "agotado";
    var nec0 = N[p.necesidades.filter(function (n) { return N[n]; })[0]];
    var imgs = p.imagenes.length ? p.imagenes : [""];
    var formas = [];
    if (!tienePrecio(p)) formas.push("Te pasamos el precio por WhatsApp, junto con el stock.");
    else if (DESC) formas.push("<b>" + precio(conTransferencia(p.precio)) + "</b> pagando por transferencia");
    if (CUOTAS > 1 && tienePrecio(p)) formas.push(CUOTAS + " cuotas sin interés de <b>" + precio(p.precio / CUOTAS) + "</b>");
    var garantias = [];
    if (cfg.envios) garantias.push(["i-camion", "<b>" + esc(cfg.envios) + ".</b> " + (ENVIO_GRATIS ? "Gratis desde " + precio(ENVIO_GRATIS) + "." : "El costo te lo pasamos antes de pagar.")]);
    if ((cfg.pagos || []).length) garantias.push(["i-tarjeta", "<b>Medios de pago:</b> " + esc(enLista(cfg.pagos)) + "."]);
    if (cfg.cambios) garantias.push(["i-cambio", "<b>" + esc(cfg.cambios) + ".</b>"]);
    garantias.push(["i-charla", "<b>Te asesoramos</b> para que elijas bien, antes y después de comprar."]);

    var acordeon = [];
    if (p.descripcion) acordeon.push(["Descripción", "<p>" + esc(p.descripcion) + "</p>", true]);
    if (p.beneficios.length) acordeon.push(["Beneficios", "<ul>" + p.beneficios.map(function (b) { return "<li>" + icono("i-check") + "<span>" + esc(b) + "</span></li>"; }).join("") + "</ul>"]);
    if (p.uso) acordeon.push(["Modo de uso", "<p>" + esc(p.uso) + "</p>"]);
    if (p.activos) acordeon.push(["Activos", "<p>" + esc(p.activos) + "</p>"]);

    var ideal = p.necesidades.filter(function (n) { return N[n]; });
    var mas = complementos(p);

    fichaContenido.innerHTML =
      '<div class="ficha__grid">' +
        "<div>" +
          '<div class="galeria" id="galeria">' + imgs.map(function (src, i) {
            return src ? '<img src="' + esc(src) + '" alt="' + (i === 0 ? esc(p.alt || p.nombre) : "") + '" width="900" height="1125" decoding="async"' + (i ? ' loading="lazy"' : "") + ">" : "";
          }).join("") + "</div>" +
          (imgs.length > 1 ? '<div class="galeria__puntos" aria-hidden="true">' + imgs.map(function (_, i) { return "<i" + (i === 0 ? ' class="is-activo"' : "") + "></i>"; }).join("") + "</div>" : "") +
        "</div>" +
        '<div class="ficha__info">' +
          '<p class="ficha__ruta">' + [p.marca ? '<a href="#tienda" data-marca="' + esc(p.marca) + '">' + esc(p.marca) + "</a>" : "", esc(p.tipo || "")].filter(Boolean).join(" · ") + "</p>" +
          '<h2 class="ficha__nombre" id="fichaNombre">' + esc(p.nombre) + "</h2>" +
          (p.bajada ? '<p class="ficha__bajada">' + esc(p.bajada) + "</p>" : "") +
          '<div class="ficha__precios">' +
            '<div class="ficha__precio">' + (tienePrecio(p) ? '<span class="precio">' + precio(p.precio) + "</span>" : '<span class="precio precio--consultar">Precio a consultar</span>') +
              (p.contenido && !p.opciones.length ? '<span class="ficha__contenido-pill">' + esc(p.contenido) + "</span>" : "") + "</div>" +
            (formas.length ? '<p class="ficha__formas">' + formas.join(" · o ") + "</p>" : "") +
          "</div>" +
          (p.opciones.length ? '<div class="opciones" role="radiogroup" aria-label="' + esc(p.opcionesTitulo || "Opción") + '">' +
            '<span class="eyebrow">' + esc(p.opcionesTitulo || "Opción") + "</span>" +
            p.opciones.map(function (o, i) {
              return '<button class="chip" type="button" role="radio" data-opcion="' + i + '" aria-checked="' + (i === 0) + '">' + esc(o) + "</button>";
            }).join("") + "</div>" : "") +
          '<div class="ficha__comprar" id="fichaComprar">' +
            '<div class="cantidad" role="group" aria-label="Cantidad">' +
              '<button type="button" data-cant="-1" aria-label="Uno menos">' + icono("i-menos") + "</button>" +
              '<output id="fichaCant" aria-live="polite">1</output>' +
              '<button type="button" data-cant="1" aria-label="Uno más">' + icono("i-mas") + "</button>" +
            "</div>" +
            '<button class="btn" type="button" data-agregar-ficha="' + esc(p.id) + '"' + (agotado ? " disabled" : "") + "><span>" + (agotado ? "Sin stock" : "Agregar al carrito") + "</span></button>" +
          "</div>" +
          (hayWa ? '<a class="ficha__wa" id="fichaWa" href="#">' + icono("i-whatsapp") + "<span>" + (agotado ? "Avisame cuando vuelva" : "Comprar ya por WhatsApp") + "</span></a>" : "") +
          '<ul class="garantias">' + garantias.map(function (g) { return "<li>" + icono(g[0]) + "<span>" + g[1] + "</span></li>"; }).join("") + "</ul>" +
          (ideal.length ? '<div class="ficha__ideal"><span class="eyebrow">Ideal para</span>' + ideal.map(function (n) {
            return '<a href="#tienda" data-filtro="' + esc(n) + '">' + esc(N[n].nombre) + "</a>";
          }).join("") + "</div>" : "") +
          (acordeon.length ? '<div class="acordeon">' + acordeon.map(function (a) {
            return "<details" + (a[2] ? " open" : "") + "><summary>" + a[0] + icono("i-mas") + '</summary><div class="acordeon__r">' + a[1] + "</div></details>";
          }).join("") + "</div>" : "") +
        "</div>" +
      "</div>" +
      (mas.length ? '<section class="ficha__mas" aria-labelledby="fichaMasTit"><h3 class="titulo" id="fichaMasTit">' + (p.paso ? "Completá tu <em>rutina</em>" : "Para <em>combinar</em>") + '</h3><ul class="grilla">' +
        mas.map(tarjeta).join("") + "</ul></section>" : "") +
      '<div class="ficha__barra" id="fichaBarra"><div>' + (tienePrecio(p)
        ? '<span class="precio">' + precio(p.precio) + "</span>" + (DESC ? "<small>" + precio(conTransferencia(p.precio)) + " con transferencia</small>" : "")
        : '<span class="precio precio--consultar">Consultar precio</span>') + "</div>" +
        '<button class="btn" type="button" data-agregar-ficha="' + esc(p.id) + '"' + (agotado ? " disabled" : "") + "><span>" + (agotado ? "Sin stock" : "Agregar") + "</span></button></div>";

    fichaCant = 1; fichaOp = 0;
    actualizarWaFicha(p);
    $$(".ficha__mas .card", fichaContenido).forEach(function (c) { c.classList.add("is-visible"); });

    var gal = $("#galeria"), puntos = $$(".galeria__puntos i", fichaContenido);
    if (gal && puntos.length) {
      gal.addEventListener("scroll", function () {
        var i = Math.round(gal.scrollLeft / gal.clientWidth);
        puntos.forEach(function (pt, j) { pt.classList.toggle("is-activo", j === i); });
      }, { passive: true });
    }

  }

  /* Celular: cuando el botón de compra queda arriba, aparece una barra
     fija abajo con el precio y "Agregar". */
  var barraTic = false;
  fichaPanel.addEventListener("scroll", function () {
    if (barraTic) return;
    barraTic = true;
    requestAnimationFrame(function () {
      barraTic = false;
      var barra = $("#fichaBarra"), comprar = $("#fichaComprar");
      if (barra && comprar) barra.classList.toggle("is-visible", comprar.getBoundingClientRect().bottom < 0);
    });
  }, { passive: true });

  function actualizarWaFicha(p) {
    var a = $("#fichaWa");
    if (!a) return;
    var texto = p.estado === "agotado"
      ? "Hola! Quiero que me avisen cuando vuelva a haber " + p.nombre + "."
      : textoWaProducto(p, fichaCant, p.opciones[fichaOp]);
    ponerWa(a, texto);
  }

  function abrirFicha(id, conEntrada) {
    var p = P[id];
    if (!p) return false;
    if (capaAbierta(carrito)) cerrarCapa(carrito, true);
    if (capaAbierta(menu)) cerrarCapa(menu, true);
    var yaAbierta = capaAbierta(ficha);
    if (fichaId !== id) pintarFicha(p);
    fichaId = id;
    fichaPanel.scrollTop = 0;
    if (!yaAbierta) {
      fichaConEntrada = !!conEntrada;
      abrirCapa(ficha, "is-abierta", fichaPanel);
    } else {
      fichaPanel.focus({ preventScroll: true });
    }
    document.title = p.nombre + " — " + MARCA;
    return true;
  }
  var tituloBase = document.title;
  function cerrarFichaVisual() {
    if (!capaAbierta(ficha)) return;
    cerrarCapa(ficha);
    document.title = tituloBase;
  }
  function cerrarFicha() {
    if (!capaAbierta(ficha)) return;
    if (fichaConEntrada && /^#producto\//.test(location.hash)) {
      history.back();
    } else {
      if (/^#producto\//.test(location.hash)) historial("replaceState", location.pathname + location.search);
      cerrarFichaVisual();
    }
  }
  function capaAbierta(el) { return capas.some(function (c) { return c.el === el; }); }

  /* En algunos visores embebidos history.* falla: se cae al hash común. */
  function historial(tipo, url) {
    try { history[tipo](null, "", url); return true; } catch (e) {
      if (tipo === "pushState") { location.hash = url.replace(/^[^#]*/, ""); }
      return false;
    }
  }

  function idDelHash() {
    var m = /^#producto\/([^/?#]+)/.exec(location.hash);
    return m ? decodeURIComponent(m[1]) : null;
  }
  function sincronizar() {
    var id = idDelHash();
    if (id && P[id]) abrirFicha(id, true);
    else cerrarFichaVisual();
  }
  window.addEventListener("popstate", sincronizar);
  window.addEventListener("hashchange", sincronizar);

  $$("[data-cerrar-ficha]", ficha).forEach(function (el) { el.addEventListener("click", cerrarFicha); });

  fichaContenido.addEventListener("click", function (e) {
    var o = e.target.closest("[data-opcion]");
    if (o) {
      fichaOp = +o.getAttribute("data-opcion");
      $$("[data-opcion]", fichaContenido).forEach(function (x) {
        var si = x === o;
        x.setAttribute("aria-checked", String(si));
      });
      /* Si hay una foto por opción, la galería (en celular) va a esa. */
      var p = P[fichaId], gal = $("#galeria");
      if (p && gal && p.imagenes.length === p.opciones.length && gal.scrollWidth > gal.clientWidth) {
        gal.scrollTo({ left: fichaOp * gal.clientWidth, behavior: animar ? "smooth" : "auto" });
      }
      if (p) actualizarWaFicha(p);
      return;
    }
    var c = e.target.closest("[data-cant]");
    if (c) {
      fichaCant = Math.max(1, Math.min(20, fichaCant + (+c.getAttribute("data-cant"))));
      var out = $("#fichaCant"); if (out) out.textContent = fichaCant;
      if (P[fichaId]) actualizarWaFicha(P[fichaId]);
    }
  });

  /* Clicks en toda la página: links a productos, filtros y agregar. */
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest("a[href]");

    if (a) {
      var href = a.getAttribute("href");
      var m = /^#producto\/(.+)$/.exec(href);
      if (m && P[decodeURIComponent(m[1])]) {
        e.preventDefault();
        var id = decodeURIComponent(m[1]);
        if (capaAbierta(ficha)) historial("replaceState", href);
        else historial("pushState", href);
        abrirFicha(id, true);
        return;
      }
      if (a.hasAttribute("data-filtro")) aplicarFiltro(a.getAttribute("data-filtro"));
      if (a.hasAttribute("data-marca")) { aplicarFiltro("todos"); aplicarMarca(a.getAttribute("data-marca")); }
      if (href.charAt(0) === "#" && href.length > 1 && capas.length) {
        /* Un link a otra sección cierra lo que esté abierto y deja que
           el navegador baje hasta ahí. */
        if (capaAbierta(ficha)) { cerrarFichaVisual(); }
        if (capaAbierta(carrito)) cerrarCapa(carrito, true);
        if (capaAbierta(menu)) cerrarCapa(menu, true);
      }
      return;
    }

    var b = e.target.closest("button");
    if (!b) return;
    if (b.hasAttribute("data-agregar")) {
      var p = P[b.getAttribute("data-agregar")];
      if (!p) return;
      agregar("p", p.id, 1);
      confirmar(b, "Agregado");
      aviso("Agregaste " + p.nombre, true);
    } else if (b.hasAttribute("data-agregar-ficha")) {
      var pf = P[b.getAttribute("data-agregar-ficha")];
      if (!pf) return;
      agregar("p", pf.id, fichaCant, pf.opciones[fichaOp]);
      confirmar(b, "Agregado");
      setTimeout(abrirCarrito, animar ? 380 : 0);
    } else if (b.hasAttribute("data-agregar-kit")) {
      var k = K[b.getAttribute("data-agregar-kit")];
      if (!k) return;
      agregar("k", k.id, 1);
      confirmar(b, "Agregada");
      setTimeout(abrirCarrito, animar ? 380 : 0);
    }
  });

  /* El botón confirma en el lugar: cambia el texto y el + pasa a ✓. */
  function confirmar(btn, texto) {
    var span = $("span", btn), uso = $("use", btn);
    if (!btn._antes) btn._antes = { txt: span ? span.textContent : "", ico: uso ? uso.getAttribute("href") : "" };
    btn.classList.add("is-ok");
    if (span) span.textContent = texto;
    if (uso) uso.setAttribute("href", "#i-check");
    clearTimeout(btn._t);
    btn._t = setTimeout(function () {
      btn.classList.remove("is-ok");
      if (span) span.textContent = btn._antes.txt;
      if (uso) uso.setAttribute("href", btn._antes.ico);
      btn._antes = null;
    }, 1600);
  }

  /* ---------- aviso flotante ---------- */
  var toast = $("#toast"), toastT;
  function aviso(msj, conCarrito) {
    if (!toast) return;
    toast.innerHTML = "<span>" + esc(msj) + "</span>" + (conCarrito ? '<button type="button" id="toastVer">Ver carrito</button>' : "");
    toast.classList.add("is-visible");
    clearTimeout(toastT);
    toastT = setTimeout(function () { toast.classList.remove("is-visible"); }, 3600);
    var ver = $("#toastVer");
    if (ver) ver.addEventListener("click", function () { toast.classList.remove("is-visible"); abrirCarrito(); });
  }

  /* ============================================================
     CARRITO
     ============================================================ */
  var carrito = $("#carrito"), btnCarrito = $("#abrirCarrito");
  var cuerpo = $("#carritoCuerpo"), pieCarrito = $("#carritoPie");
  var items = [];
  var cp = leer("tfm_cp") || "";

  (function cargar() {
    var raw = leer("tfm_carrito");
    if (!raw) return;
    try {
      items = (JSON.parse(raw) || []).filter(function (it) {
        var existe = it && (it.t === "p" ? P[it.id] && P[it.id].estado !== "agotado" : it.t === "k" ? K[it.id] && !K[it.id].agotado : false);
        return existe && it.n > 0;
      }).map(function (it) {
        var p = it.t === "p" ? P[it.id] : null;
        var op = p && p.opciones.length ? (p.opciones.indexOf(it.op) > -1 ? it.op : p.opciones[0]) : undefined;
        return { t: it.t, id: it.id, op: op, n: Math.min(20, Math.floor(it.n)) };
      });
    } catch (e) { items = []; }
  })();

  function cosa(it) { return it.t === "k" ? K[it.id] : P[it.id]; }
  function unitario(it) { var c = cosa(it); return tienePrecio(c) ? c.precio : 0; }
  function subtotal() { return items.reduce(function (s, it) { return s + unitario(it) * it.n; }, 0); }
  function todosConPrecio() { return items.every(function (it) { return tienePrecio(cosa(it)); }); }
  function unidades() { return items.reduce(function (s, it) { return s + it.n; }, 0); }

  function agregar(t, id, n, op) {
    var p = t === "p" ? P[id] : null;
    if (p && p.opciones.length && p.opciones.indexOf(op) < 0) op = p.opciones[0];
    var it = items.filter(function (x) { return x.t === t && x.id === id && x.op === op; })[0];
    if (it) it.n = Math.min(20, it.n + n);
    else items.push({ t: t, id: id, op: op, n: n });
    persistir();
    pintarCarrito();
    btnCarrito.classList.remove("salta"); void btnCarrito.offsetWidth; btnCarrito.classList.add("salta");
  }
  function cambiar(i, delta) {
    if (!items[i]) return;
    items[i].n += delta;
    if (items[i].n <= 0) items.splice(i, 1);
    else items[i].n = Math.min(20, items[i].n);
    persistir();
    pintarCarrito();
  }
  function persistir() { guardar("tfm_carrito", JSON.stringify(items)); }

  function sugerencia() {
    var enCarrito = {};
    items.forEach(function (it) {
      if (it.t === "p") enCarrito[it.id] = 1;
      else K[it.id].items.forEach(function (p) { enCarrito[p.id] = 1; });
    });
    var necs = {};
    Object.keys(enCarrito).forEach(function (id) { P[id].necesidades.forEach(function (n) { necs[n] = (necs[n] || 0) + 1; }); });
    var pasos = {};
    Object.keys(enCarrito).forEach(function (id) { pasos[P[id].paso] = 1; });
    /* Si en el carrito hay algo de cuidado, se sugiere cuidado (no un oxidante). */
    var cuidado = Object.keys(enCarrito).some(function (id) { return P[id].paso; });
    var candidatos = PRODUCTOS.filter(function (p) { return !enCarrito[p.id] && p.estado !== "agotado" && (!cuidado || p.paso); });
    candidatos.sort(function (a, b) {
      function puntos(p) {
        return p.necesidades.reduce(function (s, n) { return s + (necs[n] || 0); }, 0) * 2 +
          (pasos[p.paso] ? 0 : 3) + (p.estado === "mas-vendido" ? 1 : 0);
      }
      return puntos(b) - puntos(a);
    });
    return candidatos[0];
  }

  function textoPedido() {
    var lineas = items.map(function (it) {
      var c = cosa(it);
      var d = it.t === "k" ? c.items.map(function (p) { return p.nombre; }).join(" + ") : detalle(c, it.op);
      return "• " + it.n + " × " + c.nombre + (d ? " (" + d + ")" : "") + (tienePrecio(c) ? " — " + precio(unitario(it) * it.n) : "");
    });
    var st = subtotal(), conPrecio = todosConPrecio();
    var gratis = conPrecio && ENVIO_GRATIS && st >= ENVIO_GRATIS;
    var t = "Hola " + MARCA + "! Quiero hacer este pedido:\n\n" + lineas.join("\n");
    if (conPrecio) {
      t += "\n\nSubtotal: " + precio(st);
      if (DESC) t += "\nPagando por transferencia (" + DESC + "% off): " + precio(conTransferencia(st));
      if (gratis) t += "\nEnvío: gratis";
    }
    if (cp) t += "\n" + (conPrecio ? "" : "\n") + "Código postal: " + cp;
    t += "\n\n¿Me " + (conPrecio ? "confirman stock" : "pasan precio, stock") + (gratis ? "" : " y costo de envío") + "?";
    return t;
  }

  function pintarCarrito() {
    var n = unidades(), st = subtotal();
    var cuentaEl = $("#carritoCuenta");
    cuentaEl.textContent = n;
    btnCarrito.classList.toggle("tiene", n > 0);
    $("#carritoEtiqueta").textContent = n ? "Carrito, " + n + (n === 1 ? " producto" : " productos") : "Carrito, vacío";
    $("#carritoTituloN").textContent = n ? "(" + n + ")" : "";

    var envio = $("#envio"), conPrecio = todosConPrecio();
    if (ENVIO_GRATIS && n && conPrecio) {
      envio.hidden = false;
      var falta = ENVIO_GRATIS - st;
      $("#envioTexto").innerHTML = falta > 0
        ? "Te faltan <b>" + precio(falta) + "</b> para el envío gratis"
        : "<b>Tu envío es gratis.</b>";
      requestAnimationFrame(function () { $("#envioBarra").style.width = Math.min(100, st / ENVIO_GRATIS * 100) + "%"; });
    } else {
      envio.hidden = true;
    }

    if (!n) {
      cuerpo.innerHTML = '<div class="carrito__vacio">' +
        '<svg aria-hidden="true"><use href="#figura"/></svg>' +
        '<p class="titulo" style="font-size:1.9rem;margin-bottom:8px">Tu carrito está vacío</p>' +
        "<p>Empezá por lo que tu pelo necesita.</p>" +
        '<a class="btn" href="#tienda"><span>Ver productos</span>' + icono("i-flecha") + "</a>" +
        '<p style="margin-top:18px"><a class="link-sub" href="#diagnostico">o hacé el diagnóstico</a></p></div>';
      pieCarrito.hidden = true;
      return;
    }
    pieCarrito.hidden = false;

    var sug = sugerencia();
    cuerpo.innerHTML = '<ul class="items">' + items.map(function (it, i) {
      var c = cosa(it);
      var foto = it.t === "k" ? c.imagen : c.imagenes[0];
      var link = it.t === "k" ? "#rutinas" : "#producto/" + c.id;
      var meta = it.t === "k" ? "Rutina · " + c.items.length + " productos" + (c.ahorro > 0 ? " · ahorrás " + precio(c.ahorro * it.n) : "") : [c.marca, it.op || c.contenido].filter(Boolean).join(" · ");
      return '<li class="item">' +
        '<a class="item__foto" href="' + link + '" tabindex="-1" aria-hidden="true">' + (foto ? '<img src="' + esc(foto) + '" alt="" loading="lazy" width="900" height="1125">' : "") + "</a>" +
        "<div>" +
          '<a class="item__nombre" href="' + link + '">' + esc(c.nombre) + "</a>" +
          '<p class="item__meta">' + esc(meta) + "</p>" +
          '<div class="cantidad cantidad--chica" role="group" aria-label="Cantidad de ' + esc(c.nombre) + '">' +
            '<button type="button" data-item="' + i + '" data-delta="-1" aria-label="Uno menos">' + icono("i-menos") + "</button>" +
            "<output>" + it.n + "</output>" +
            '<button type="button" data-item="' + i + '" data-delta="1" aria-label="Uno más">' + icono("i-mas") + "</button>" +
          "</div>" +
        "</div>" +
        '<div class="item__der">' + (tienePrecio(c) ? '<span class="precio">' + precio(unitario(it) * it.n) + "</span>" : '<span class="item__consultar">A consultar</span>') +
          '<button class="item__quitar" type="button" data-quitar="' + i + '">Quitar</button></div>' +
        "</li>";
    }).join("") + "</ul>" +
    (sug ? '<div class="sumale"><p class="eyebrow">Completá tu rutina</p><div class="sumale__item">' +
      '<img src="' + esc(sug.imagenes[0] || "") + '" alt="" loading="lazy" width="900" height="1125">' +
      '<div><a class="sumale__nombre" href="#producto/' + esc(sug.id) + '">' + esc(sug.nombre) + "</a><small>" + [tienePrecio(sug) ? precio(sug.precio) : sug.marca, sug.bajada ? esc(sug.bajada.split(".")[0]) : ""].filter(Boolean).join(" · ") + "</small></div>" +
      (sug.opciones.length
        ? '<a class="sumale__btn" href="#producto/' + esc(sug.id) + '" aria-label="Ver ' + esc(sug.nombre) + '">' + icono("i-flecha") + "</a>"
        : '<button class="sumale__btn" type="button" data-sumar="' + esc(sug.id) + '" aria-label="Agregar ' + esc(sug.nombre) + '">' + icono("i-mas") + "</button>") +
      "</div></div>" : "");

    var filas;
    if (conPrecio) {
      filas = '<div><dt>Subtotal</dt><dd>' + precio(st) + "</dd></div>";
      if (DESC) filas += '<div class="transf"><dt>Con transferencia (' + DESC + "% off)</dt><dd>" + precio(conTransferencia(st)) + "</dd></div>";
      if (CUOTAS > 1) filas += "<div><dt>o " + CUOTAS + " cuotas sin interés de</dt><dd>" + precio(st / CUOTAS) + "</dd></div>";
    } else {
      filas = '<div class="total"><dt>Total</dt><dd>Te lo pasamos por WhatsApp</dd></div>';
    }
    filas += "<div><dt>Envío</dt><dd>" + (conPrecio && ENVIO_GRATIS && st >= ENVIO_GRATIS ? "Gratis" : "Lo calculamos con tu CP") + "</dd></div>";

    pieCarrito.innerHTML =
      '<dl class="totales">' + filas + "</dl>" +
      '<div class="cp"><label for="cpInput">Tu código postal</label><input id="cpInput" inputmode="numeric" autocomplete="postal-code" maxlength="8" placeholder="Opcional" value="' + esc(cp) + '"></div>' +
      '<a class="btn btn--bloque" id="finalizar" href="#contacto">' + (hayWa ? icono("i-whatsapp") : "") + "<span>" + (hayWa ? "Finalizar por WhatsApp" : "Finalizar pedido") + "</span></a>" +
      '<p class="carrito__nota">Te confirmamos ' + (conPrecio ? "stock" : "precio, stock") + " y envío antes de pagar.</p>";

    var fin = $("#finalizar");
    ponerWa(fin, textoPedido());
    var inp = $("#cpInput");
    inp.addEventListener("input", function () {
      cp = inp.value.replace(/[^\dA-Za-z]/g, "").slice(0, 8);
      if (inp.value !== cp) inp.value = cp;
      guardar("tfm_cp", cp);
      ponerWa(fin, textoPedido());
    });
  }

  carrito.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    if (b.hasAttribute("data-delta")) {
      var i = +b.getAttribute("data-item");
      cambiar(i, +b.getAttribute("data-delta"));
      var otro = $$('[data-item="' + i + '"][data-delta="' + b.getAttribute("data-delta") + '"]', carrito)[0];
      if (otro) otro.focus({ preventScroll: true });
      else $("[data-cerrar-carrito]", carrito).focus();
    } else if (b.hasAttribute("data-quitar")) {
      cambiar(+b.getAttribute("data-quitar"), -Infinity);
      $("[data-cerrar-carrito]", carrito).focus();
    } else if (b.hasAttribute("data-sumar")) {
      agregar("p", b.getAttribute("data-sumar"), 1);
    }
  });
  function abrirCarrito() {
    btnCarrito.setAttribute("aria-expanded", "true");
    abrirCapa(carrito, "is-abierto", $("[data-cerrar-carrito]", carrito));
  }
  btnCarrito.addEventListener("click", abrirCarrito);
  $$("[data-cerrar-carrito]", carrito).forEach(function (el) { el.addEventListener("click", function () { cerrarCapa(carrito); }); });
  pintarCarrito();

  /* ============================================================
     DIAGNÓSTICO
     Tres preguntas suman puntos a etiquetas (las necesidades más
     "calor"); para cada paso de la rutina gana el producto con más
     puntos.
     ============================================================ */
  (function diagnostico() {
    var cuerpoQ = $("#quizCuerpo"), barra = $("#quizProgreso");
    if (!cuerpoQ) return;
    if (PRODUCTOS.length < 2 || !NEC_CON_PRODUCTOS.length) { $("#diagnostico").hidden = true; return; }

    var preguntas = [
      { id: "tipo", q: "¿Cómo es tu pelo?", ops: [
        { t: "Lacio", s: "Cae recto, sin forma", tags: {} },
        { t: "Ondulado", s: "Hace ondas suaves", tags: { rulos: 1, puntas: 1 } },
        { t: "Con rulos", s: "Rulos que se abren o se esponjan", tags: { rulos: 2 } },
        { t: "Muy rizado", s: "Rulos chicos y apretados", tags: { rulos: 2, hidratacion: 1 } }
      ] },
      { id: "necesidad", q: "¿Qué es lo que más te molesta hoy?", ops: NEC_CON_PRODUCTOS.filter(function (n) { return n.diagnostico !== false; }).map(function (n) {
        var t = {}; t[n.id] = 3;
        return { t: n.nombre, s: n.bajada, tags: t, nec: n.id };
      }) },
      { id: "calor", q: "¿Usás plancha, buclera o secador?", ops: [
        { t: "Casi todos los días", s: "Y se nota en las puntas", tags: { calor: 3, reparacion: 1, puntas: 1 } },
        { t: "Algunas veces por semana", s: "Para ocasiones o el flequillo", tags: { calor: 2 } },
        { t: "Casi nunca", s: "Lo dejo secar al aire", tags: {} }
      ] }
    ];
    var resp = [], paso = 0;

    function progreso() { barra.style.width = (Math.min(paso, preguntas.length) / preguntas.length * 100) + "%"; }

    function pintarPregunta() {
      var pr = preguntas[paso];
      cuerpoQ.innerHTML = '<div class="quiz__paso">' +
        '<p class="eyebrow">Pregunta ' + (paso + 1) + " de " + preguntas.length + "</p>" +
        '<h3 class="quiz__pregunta" tabindex="-1">' + esc(pr.q) + "</h3>" +
        '<div class="quiz__opciones">' + pr.ops.map(function (o, i) {
          return '<button class="opcion" type="button" data-op="' + i + '" aria-pressed="' + (resp[paso] === i) + '"><b>' + esc(o.t) + "</b>" + (o.s ? "<small>" + esc(o.s) + "</small>" : "") + "</button>";
        }).join("") + "</div>" +
        '<div class="quiz__nav">' + (paso > 0 ? '<button class="quiz__volver" type="button" data-atras>' + icono("i-volver") + "Anterior</button>" : "<span></span>") + "</div>" +
        "</div>";
      progreso();
    }

    function recomendar() {
      var puntos = {};
      resp.forEach(function (r, i) {
        var tags = preguntas[i].ops[r].tags;
        Object.keys(tags).forEach(function (t) { puntos[t] = (puntos[t] || 0) + tags[t]; });
      });
      function score(p) { return p.necesidades.reduce(function (s, n) { return s + (puntos[n] || 0); }, 0); }
      var disponibles = PRODUCTOS.filter(function (p) { return p.estado !== "agotado"; });
      var elegidos = [];
      ORDEN_PASOS.forEach(function (ps) {
        var mejor = null, mejorS = -1;
        disponibles.forEach(function (p) {
          if (p.paso !== ps) return;
          var s = score(p);
          if (s > mejorS) { mejor = p; mejorS = s; }
        });
        if (mejor) elegidos.push(mejor);
      });
      return elegidos;
    }

    function kitIgual(lista) {
      var ids = lista.map(function (p) { return p.id; }).sort().join("|");
      return RUTINAS.filter(function (k) {
        return K[k.id] && !k.agotado && k.items.map(function (p) { return p.id; }).sort().join("|") === ids;
      })[0];
    }

    function pintarResultado() {
      var lista = recomendar();
      var nec = preguntas[1].ops[resp[1]];
      var kit = kitIgual(lista);
      var suma = lista.reduce(function (s, p) { return s + (tienePrecio(p) ? p.precio : 0); }, 0);
      var conPrecio = lista.every(tienePrecio);
      var texto = "Hola! Hice el diagnóstico (" + preguntas.map(function (pr, i) { return pr.ops[resp[i]].t.toLowerCase(); }).join(", ") +
        ") y me recomendó: " + lista.map(function (p) { return p.nombre; }).join(", ") + ". ¿Me ayudan?";
      cuerpoQ.innerHTML = '<div class="quiz__paso">' +
        '<p class="eyebrow">Tu resultado</p>' +
        '<h3 class="quiz__pregunta" tabindex="-1">' + (kit ? esc(kit.nombre.replace(/\s*\S+$/, "")) + " <em>" + esc(kit.nombre.split(" ").pop()) + "</em>" : "Rutina <em>" + esc(nec.t) + "</em>") + "</h3>" +
        '<p class="resultado__por">Para pelo ' + esc(preguntas[0].ops[resp[0]].t.toLowerCase()) + " · " + esc(nec.t.toLowerCase()) + "</p>" +
        '<ol class="resultado__lista">' + lista.map(function (p, i) {
          return '<li class="resultado__item">' +
            '<img src="' + esc(p.imagenes[0] || "") + '" alt="" loading="lazy" width="900" height="1125">' +
            '<div><span class="resultado__paso">' + (i + 1) + " · " + PASOS[p.paso] + '</span><a class="resultado__nombre" href="#producto/' + esc(p.id) + '">' + esc(p.nombre) + "</a></div>" +
            (tienePrecio(p) ? '<span class="precio">' + precio(p.precio) + "</span>" : '<span class="item__consultar">' + esc(p.marca || "") + "</span>") + "</li>";
        }).join("") + "</ol>" +
        (conPrecio ? '<div class="resultado__total"><span>' + (kit ? "Es nuestra " + esc(kit.nombre) + ": ahorrás " + precio(kit.ahorro) : "Total de la rutina") + '</span><span><span class="precio">' + precio(kit ? kit.precio : suma) + "</span>" +
          (kit && kit.ahorro > 0 ? ' <span class="precio-antes">' + precio(suma) + "</span>" : "") + "</span></div>" : "") +
        '<div class="resultado__acciones">' +
          '<button class="btn btn--bloque" type="button" data-llevar><span>Agregar la rutina al carrito</span>' + icono("i-mas") + "</button>" +
          (hayWa ? '<a class="btn btn--linea btn--bloque" id="quizWa" href="#">' + icono("i-whatsapp") + "<span>Consultar por WhatsApp</span></a>" : "") +
          '<button class="quiz__volver" type="button" data-reiniciar>' + icono("i-volver") + "Volver a empezar</button>" +
        "</div></div>";
      var wa = $("#quizWa"); if (wa) ponerWa(wa, texto);
      progreso();
      cuerpoQ._lista = lista; cuerpoQ._kit = kit;
    }

    cuerpoQ.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      if (b.hasAttribute("data-op")) {
        resp[paso] = +b.getAttribute("data-op");
        $$(".opcion", cuerpoQ).forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
        setTimeout(function () {
          paso++;
          if (paso < preguntas.length) pintarPregunta(); else pintarResultado();
          var h = $(".quiz__pregunta", cuerpoQ); if (h) h.focus({ preventScroll: true });
        }, animar ? 260 : 0);
      } else if (b.hasAttribute("data-atras")) {
        paso = Math.max(0, paso - 1); pintarPregunta();
        var h = $(".quiz__pregunta", cuerpoQ); if (h) h.focus({ preventScroll: true });
      } else if (b.hasAttribute("data-reiniciar")) {
        resp = []; paso = 0; pintarPregunta();
        var h2 = $(".quiz__pregunta", cuerpoQ); if (h2) h2.focus({ preventScroll: true });
      } else if (b.hasAttribute("data-llevar")) {
        if (cuerpoQ._kit) agregar("k", cuerpoQ._kit.id, 1);
        else (cuerpoQ._lista || []).forEach(function (p) { agregar("p", p.id, 1); });
        confirmar(b, "Agregada");
        setTimeout(abrirCarrito, animar ? 380 : 0);
      }
    });
    pintarPregunta();
  })();

  /* ============================================================
     DATOS ESTRUCTURADOS para buscadores (se arman del catálogo)
     ============================================================ */
  (function ld() {
    var base = location.origin && location.origin !== "null" ? location.origin + location.pathname : "";
    var datos = {
      "@context": "https://schema.org",
      "@type": "Store",
      "name": MARCA,
      "description": "Productos capilares",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Productos capilares",
        "itemListElement": PRODUCTOS.map(function (p) {
          return {
            "@type": "Offer",
            "price": tienePrecio(p) ? p.precio : undefined,
            "priceCurrency": tienePrecio(p) ? (cfg.moneda || "ARS") : undefined,
            "availability": "https://schema.org/" + (p.estado === "agotado" ? "OutOfStock" : "InStock"),
            "itemOffered": {
              "@type": "Product",
              "name": p.nombre,
              "brand": p.marca ? { "@type": "Brand", "name": p.marca } : undefined,
              "description": p.bajada || p.descripcion || "",
              "image": p.imagenes[0] ? (base ? new URL(p.imagenes[0], location.href).href : p.imagenes[0]) : undefined,
              "url": base ? base + "#producto/" + p.id : undefined
            }
          };
        })
      }
    };
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(datos);
    document.head.appendChild(s);
  })();

  /* Una sección que quedó oculta (sin datos) se lleva sus links. */
  (function linksDeSecciones() {
    $$('a[href^="#"]').forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      var s = id && !/\//.test(id) ? document.getElementById(id) : null;
      if (s && s.hidden) (a.closest("li") || a).hidden = true;
    });
    $$(".menu__links a:not([hidden]) span").forEach(function (s, i) { s.textContent = String(i + 1).padStart(2, "0"); });
    /* Los números de las secciones (01, 02…) siguen el orden de las visibles. */
    $$("main section").filter(function (s) { return !s.hidden; }).map(function (s) { return $(".eyebrow--num span", s); })
      .filter(Boolean).forEach(function (s, i) { s.textContent = String(i + 1).padStart(2, "0"); });
    var conf = $(".confianza");
    if (conf && !$$("li", conf).some(function (li) { return !li.hidden; })) conf.hidden = true;
  })();

  /* Si se entró directo a un producto (link compartido), abrirlo. */
  if (idDelHash()) {
    var idInicial = idDelHash();
    if (P[idInicial]) abrirFicha(idInicial, false);
  }
})();
