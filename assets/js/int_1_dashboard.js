import {
  publicaciones,
  obtenerTotalOfertas,
  obtenerTotalDemandas,
  obtenerTotalUsuarios
} from "./datos.js";
import { pintarUsuarioEnNavbar, configurarBotonCerrarSesion } from "./ui.js";

// Elementos del DOM
const totalOfertasElemento = document.getElementById("total-ofertas");
const totalDemandasElemento = document.getElementById("total-demandas");
const totalUsuariosElemento = document.getElementById("total-usuarios");
const contenedorPublicaciones = document.getElementById("contenedor-publicaciones");

// Inicializar dashboard
function inicializarDashboard() {
  pintarUsuarioEnNavbar();
  configurarBotonCerrarSesion();
  pintarResumen();
  pintarPublicaciones();
}

// Mostrar cifras resumen
function pintarResumen() {
  totalOfertasElemento.textContent = obtenerTotalOfertas();
  totalDemandasElemento.textContent = obtenerTotalDemandas();
  totalUsuariosElemento.textContent = obtenerTotalUsuarios();
}

// Mostrar tarjetas de publicaciones
function pintarPublicaciones() {
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

    const badgeClase =
      publicacion.tipo === "oferta" ? "badge-oferta" : "badge-demanda";

    const tipoTexto =
      publicacion.tipo === "oferta" ? "Oferta" : "Demanda";

    columna.innerHTML = `
      <div class="card card-publicacion h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <span class="badge ${badgeClase}">${tipoTexto}</span>
            <small class="text-muted">${publicacion.fecha}</small>
          </div>

          <h3 class="h5">${publicacion.titulo}</h3>
          <p class="mb-2"><strong>Categoría:</strong> ${publicacion.categoria}</p>
          <p class="mb-2"><strong>Autor:</strong> ${publicacion.autor}</p>
          <p class="mb-2"><strong>Ubicación:</strong> ${publicacion.ubicacion}</p>
          <p class="mb-0 text-muted">${publicacion.descripcion}</p>
        </div>
      </div>
    `;

    contenedorPublicaciones.appendChild(columna);
  });
}

inicializarDashboard();