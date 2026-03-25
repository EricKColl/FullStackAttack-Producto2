import {
  obtenerUsuarios,
  inicializarPublicaciones,
  obtenerPublicaciones,
  obtenerSeleccionDashboard,
  guardarSeleccionDashboard,
  eliminarSeleccionDashboard
} from "./almacenaje.js";
import { pintarUsuarioEnNavbar, configurarBotonCerrarSesion } from "./ui.js";

const totalOfertasElemento = document.getElementById("total-ofertas");
const totalDemandasElemento = document.getElementById("total-demandas");
const totalUsuariosElemento = document.getElementById("total-usuarios");

const contenedorPublicaciones = document.getElementById("contenedor-publicaciones");
const contenedorSeleccion = document.getElementById("contenedor-seleccion");

async function inicializarDashboard() {
  await inicializarPublicaciones();
  pintarUsuarioEnNavbar();
  configurarBotonCerrarSesion();
  await pintarResumen();
  await pintarPublicaciones();
  await pintarSeleccionDashboard();
  configurarZonasDrop();
}

async function pintarResumen() {
  const publicaciones = await obtenerPublicaciones();
  const usuarios = obtenerUsuarios();

  const totalOfertas = publicaciones.filter(
    (publicacion) => publicacion.tipo === "oferta"
  ).length;

  const totalDemandas = publicaciones.filter(
    (publicacion) => publicacion.tipo === "demanda"
  ).length;

  totalOfertasElemento.textContent = totalOfertas;
  totalDemandasElemento.textContent = totalDemandas;
  totalUsuariosElemento.textContent = usuarios.length;
}

async function pintarPublicaciones() {
  const publicaciones = await obtenerPublicaciones();

  if (!publicaciones.length) {
    contenedorPublicaciones.innerHTML = `
      <div class="col-12">
        <div class="alert alert-secondary mb-0">
          Aún no hay publicaciones cargadas.
        </div>
      </div>
    `;
    return;
  }

  contenedorPublicaciones.innerHTML = "";

  publicaciones.forEach((publicacion) => {
    const columna = document.createElement("div");
    columna.className = "col-12 col-md-6";

    const tarjeta = crearTarjetaPublicacion(publicacion, true, "publicaciones");
    columna.appendChild(tarjeta);

    contenedorPublicaciones.appendChild(columna);
  });
}

async function pintarSeleccionDashboard() {
  const seleccion = await obtenerSeleccionDashboard();

  if (!seleccion.length) {
    contenedorSeleccion.innerHTML = `
      <div class="col-12">
        <div class="alert alert-light border mb-0 text-center">
          Todavía no has seleccionado ninguna publicación. Arrastra una tarjeta aquí y, si quieres quitarla, arrástrala de nuevo arriba.
        </div>
      </div>
    `;
    return;
  }

  contenedorSeleccion.innerHTML = "";

  seleccion.forEach((publicacion) => {
    const columna = document.createElement("div");
    columna.className = "col-12 col-md-6";

    const tarjeta = crearTarjetaPublicacion(publicacion, true, "seleccion");
    columna.appendChild(tarjeta);

    contenedorSeleccion.appendChild(columna);
  });
}

function crearTarjetaPublicacion(publicacion, draggable, origen) {
  const tarjeta = document.createElement("div");
  tarjeta.className = "card card-publicacion h-100";
  tarjeta.draggable = draggable;
  tarjeta.dataset.id = publicacion.id;

  if (draggable) {
    tarjeta.addEventListener("dragstart", (evento) => {
      evento.dataTransfer.setData("text/plain", String(publicacion.id));
      evento.dataTransfer.setData("application/jobconnect-origin", origen);
    });
  }

  const badgeClase =
    publicacion.tipo === "oferta" ? "badge-oferta" : "badge-demanda";

  const tipoTexto =
    publicacion.tipo === "oferta" ? "Oferta" : "Demanda";

  tarjeta.innerHTML = `
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <span class="badge ${badgeClase}">${tipoTexto}</span>
        <small class="text-muted">${publicacion.fecha || ""}</small>
      </div>

      <h3 class="h5">${publicacion.titulo}</h3>
      <p class="mb-2"><strong>Categoría:</strong> ${publicacion.categoria}</p>
      <p class="mb-2"><strong>Autor:</strong> ${publicacion.autor}</p>
      <p class="mb-2"><strong>Ubicación:</strong> ${publicacion.ubicacion}</p>
      <p class="mb-0 text-muted">${publicacion.descripcion}</p>
    </div>
  `;

  return tarjeta;
}

function leerDatosArrastre(evento) {
  const idPublicacion = Number(evento.dataTransfer.getData("text/plain"));
  const origen = evento.dataTransfer.getData("application/jobconnect-origin");

  return {
    idPublicacion,
    origen
  };
}

function activarZonaDrop(contenedor, callbackDrop) {
  if (!contenedor) return;

  contenedor.addEventListener("dragover", (evento) => {
    evento.preventDefault();
    contenedor.classList.add("drag-over");
  });

  contenedor.addEventListener("dragleave", () => {
    contenedor.classList.remove("drag-over");
  });

  contenedor.addEventListener("drop", async (evento) => {
    evento.preventDefault();
    contenedor.classList.remove("drag-over");
    await callbackDrop(evento);
  });
}

function configurarZonasDrop() {
  activarZonaDrop(contenedorSeleccion, async (evento) => {
    const { idPublicacion } = leerDatosArrastre(evento);

    if (!idPublicacion) {
      return;
    }

    const publicaciones = await obtenerPublicaciones();
    const publicacionSeleccionada = publicaciones.find(
      (publicacion) => publicacion.id === idPublicacion
    );

    if (!publicacionSeleccionada) {
      return;
    }

    await guardarSeleccionDashboard(publicacionSeleccionada);
    await pintarSeleccionDashboard();
  });

  activarZonaDrop(contenedorPublicaciones, async (evento) => {
    const { idPublicacion, origen } = leerDatosArrastre(evento);

    if (!idPublicacion || origen !== "seleccion") {
      return;
    }

    await eliminarSeleccionDashboard(idPublicacion);
    await pintarSeleccionDashboard();
  });
}

inicializarDashboard();