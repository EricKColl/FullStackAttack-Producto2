// ====== Datos comunes del proyecto JobConnect (Producto 1) ======

// Usuarios del sistema (prototipo en memoria)
export const usuarios = [
  {
    id: 1,
    nombre: "Laura",
    apellidos: "Martínez",
    email: "laura@jobconnect.com",
    password: "1234",
    rol: "candidato"
  },
  {
    id: 2,
    nombre: "Carlos",
    apellidos: "Gómez",
    email: "carlos@techempresa.com",
    password: "1234",
    rol: "empresa"
  },
  {
    id: 3,
    nombre: "Ana",
    apellidos: "Ruiz",
    email: "ana@jobconnect.com",
    password: "1234",
    rol: "candidato"
  }
];

// Publicaciones (ofertas y demandas)
export const publicaciones = [
  {
    id: 1,
    tipo: "oferta",
    titulo: "Desarrollador/a Web Junior",
    categoria: "Desarrollo Web",
    autor: "TechNova SL",
    ubicacion: "Barcelona",
    descripcion: "Buscamos perfil junior con conocimientos de HTML, CSS y JavaScript.",
    emailContacto: "rrhh@technova.com",
    fecha: "2025-02-10"
  },
  {
    id: 2,
    tipo: "demanda",
    titulo: "Busco prácticas en frontend",
    categoria: "Frontend",
    autor: "Laura Martínez",
    ubicacion: "Girona",
    descripcion: "Estudiante DAW interesada en prácticas para aprender React y UX/UI.",
    emailContacto: "laura@jobconnect.com",
    fecha: "2025-02-12"
  },
  {
    id: 3,
    tipo: "oferta",
    titulo: "Técnico/a soporte IT",
    categoria: "Sistemas",
    autor: "Innova Services",
    ubicacion: "Tarragona",
    descripcion: "Se requiere perfil para soporte técnico presencial y remoto.",
    emailContacto: "empleo@innovaservices.com",
    fecha: "2025-02-14"
  },
  {
    id: 4,
    tipo: "demanda",
    titulo: "Colaboración en proyecto startup",
    categoria: "Full Stack",
    autor: "Ana Ruiz",
    ubicacion: "Remoto",
    descripcion: "Busco colaborar en startup tecnológica para ganar experiencia práctica.",
    emailContacto: "ana@jobconnect.com",
    fecha: "2025-02-15"
  }
];

// Utilidades simples (nos servirán más adelante también)
export function obtenerTotalOfertas() {
  return publicaciones.filter((publicacion) => publicacion.tipo === "oferta").length;
}

export function obtenerTotalDemandas() {
  return publicaciones.filter((publicacion) => publicacion.tipo === "demanda").length;
}

export function obtenerTotalUsuarios() {
  return usuarios.length;
}
// ====== Funciones de gestión de usuarios ======

export function obtenerSiguienteIdUsuario() {
  if (usuarios.length === 0) return 1;

  const ids = usuarios.map((usuario) => usuario.id);
  return Math.max(...ids) + 1;
}

export function agregarUsuario(nuevoUsuario) {
  usuarios.push(nuevoUsuario);
}

export function eliminarUsuarioPorId(idUsuario) {
  const indice = usuarios.findIndex((usuario) => usuario.id === idUsuario);

  if (indice !== -1) {
    usuarios.splice(indice, 1);
    return true;
  }

  return false;
}
// ====== Funciones de gestión de publicaciones ======

export function obtenerSiguienteIdPublicacion() {
  if (publicaciones.length === 0) return 1;

  const ids = publicaciones.map((publicacion) => publicacion.id);
  return Math.max(...ids) + 1;
}

export function agregarPublicacion(nuevaPublicacion) {
  publicaciones.push(nuevaPublicacion);
}

export function eliminarPublicacionPorId(idPublicacion) {
  const indice = publicaciones.findIndex(
    (publicacion) => publicacion.id === idPublicacion
  );

  if (indice !== -1) {
    publicaciones.splice(indice, 1);
    return true;
  }

  return false;
}