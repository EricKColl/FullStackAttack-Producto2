import {
  usuarios as usuariosIniciales,
  publicaciones as publicacionesIniciales
} from "./datos-iniciales.js";

const CLAVE_USUARIOS = "jobconnect_usuarios";
const CLAVE_USUARIO_ACTIVO = "jobconnect_usuario_activo";

const NOMBRE_BD = "jobconnect_bd";
const VERSION_BD = 1;
const STORE_PUBLICACIONES = "publicaciones";
const STORE_SELECCION = "seleccion_dashboard";

function obtenerUsuarios() {
  const usuariosGuardados = localStorage.getItem(CLAVE_USUARIOS);

  if (!usuariosGuardados) {
    return [...usuariosIniciales];
  }

  try {
    return JSON.parse(usuariosGuardados);
  } catch (error) {
    return [...usuariosIniciales];
  }
}

function guardarUsuarios(usuarios) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

function inicializarUsuarios() {
  const usuariosGuardados = localStorage.getItem(CLAVE_USUARIOS);

  if (!usuariosGuardados) {
    guardarUsuarios(usuariosIniciales);
  }
}

function obtenerUsuarioActivo() {
  const usuarioGuardado = localStorage.getItem(CLAVE_USUARIO_ACTIVO);

  if (!usuarioGuardado) {
    return null;
  }

  try {
    return JSON.parse(usuarioGuardado);
  } catch (error) {
    return null;
  }
}

function guardarUsuarioActivo(usuario) {
  localStorage.setItem(CLAVE_USUARIO_ACTIVO, JSON.stringify(usuario));
}

function cerrarSesion() {
  localStorage.removeItem(CLAVE_USUARIO_ACTIVO);
}

function loguearUsuario(email, password) {
  const usuarios = obtenerUsuarios();

  const usuarioEncontrado = usuarios.find(
    (usuario) =>
      usuario.email.toLowerCase() === email.toLowerCase() &&
      usuario.password === password
  );

  if (!usuarioEncontrado) {
    return null;
  }

  const usuarioActivo = {
    id: usuarioEncontrado.id,
    nombre: usuarioEncontrado.nombre,
    apellidos: usuarioEncontrado.apellidos,
    email: usuarioEncontrado.email,
    rol: usuarioEncontrado.rol
  };

  guardarUsuarioActivo(usuarioActivo);
  return usuarioActivo;
}

function obtenerSiguienteIdUsuario() {
  const usuarios = obtenerUsuarios();

  if (usuarios.length === 0) {
    return 1;
  }

  const ids = usuarios.map((usuario) => usuario.id);
  return Math.max(...ids) + 1;
}

function registrarUsuario(datosUsuario) {
  const usuarios = obtenerUsuarios();

  const emailExiste = usuarios.some(
    (usuario) => usuario.email.toLowerCase() === datosUsuario.email.toLowerCase()
  );

  if (emailExiste) {
    return {
      ok: false,
      mensaje: "Ya existe un usuario con ese correo electrónico."
    };
  }

  const nuevoUsuario = {
    id: obtenerSiguienteIdUsuario(),
    nombre: datosUsuario.nombre,
    apellidos: datosUsuario.apellidos,
    email: datosUsuario.email.toLowerCase(),
    password: datosUsuario.password,
    rol: datosUsuario.rol
  };

  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);

  return {
    ok: true,
    mensaje: "Usuario registrado correctamente.",
    usuario: nuevoUsuario
  };
}

function eliminarUsuarioPorId(idUsuario) {
  const usuarios = obtenerUsuarios();

  const indice = usuarios.findIndex(
    (usuario) => usuario.id === Number(idUsuario)
  );

  if (indice === -1) {
    return false;
  }

  usuarios.splice(indice, 1);
  guardarUsuarios(usuarios);
  return true;
}

function abrirBaseDeDatos() {
  return new Promise((resolve, reject) => {
    const solicitud = indexedDB.open(NOMBRE_BD, VERSION_BD);

    solicitud.onupgradeneeded = (evento) => {
      const bd = evento.target.result;

      if (!bd.objectStoreNames.contains(STORE_PUBLICACIONES)) {
        bd.createObjectStore(STORE_PUBLICACIONES, { keyPath: "id" });
      }

      if (!bd.objectStoreNames.contains(STORE_SELECCION)) {
        bd.createObjectStore(STORE_SELECCION, { keyPath: "id" });
      }
    };

    solicitud.onsuccess = () => {
      resolve(solicitud.result);
    };

    solicitud.onerror = () => {
      reject(solicitud.error);
    };
  });
}

function inicializarPublicaciones() {
  return new Promise(async (resolve, reject) => {
    try {
      const bd = await abrirBaseDeDatos();
      const transaccion = bd.transaction(STORE_PUBLICACIONES, "readwrite");
      const store = transaccion.objectStore(STORE_PUBLICACIONES);
      const solicitudConteo = store.count();

      solicitudConteo.onsuccess = () => {
        if (solicitudConteo.result === 0) {
          publicacionesIniciales.forEach((publicacion) => {
            store.add(publicacion);
          });
        }
      };

      transaccion.oncomplete = () => {
        resolve(true);
      };

      transaccion.onerror = () => {
        reject(transaccion.error);
      };
    } catch (error) {
      reject(error);
    }
  });
}

function obtenerPublicaciones() {
  return new Promise(async (resolve, reject) => {
    try {
      const bd = await abrirBaseDeDatos();
      const transaccion = bd.transaction(STORE_PUBLICACIONES, "readonly");
      const store = transaccion.objectStore(STORE_PUBLICACIONES);
      const solicitud = store.getAll();

      solicitud.onsuccess = () => {
        resolve(solicitud.result);
      };

      solicitud.onerror = () => {
        reject(solicitud.error);
      };
    } catch (error) {
      reject(error);
    }
  });
}

async function obtenerSiguienteIdPublicacion() {
  const publicaciones = await obtenerPublicaciones();

  if (publicaciones.length === 0) {
    return 1;
  }

  const ids = publicaciones.map((publicacion) => publicacion.id);
  return Math.max(...ids) + 1;
}

function registrarPublicacion(datosPublicacion) {
  return new Promise(async (resolve, reject) => {
    try {
      const bd = await abrirBaseDeDatos();
      const idNuevaPublicacion = await obtenerSiguienteIdPublicacion();

      const nuevaPublicacion = {
        id: idNuevaPublicacion,
        tipo: datosPublicacion.tipo,
        titulo: datosPublicacion.titulo,
        categoria: datosPublicacion.categoria,
        autor: datosPublicacion.autor,
        ubicacion: datosPublicacion.ubicacion,
        descripcion: datosPublicacion.descripcion,
        emailContacto: datosPublicacion.emailContacto,
        fecha: datosPublicacion.fecha
      };

      const transaccion = bd.transaction(STORE_PUBLICACIONES, "readwrite");
      const store = transaccion.objectStore(STORE_PUBLICACIONES);

      store.add(nuevaPublicacion);

      transaccion.oncomplete = () => {
        resolve({
          ok: true,
          mensaje: "Publicación guardada correctamente.",
          publicacion: nuevaPublicacion
        });
      };

      transaccion.onerror = () => {
        reject(transaccion.error);
      };
    } catch (error) {
      reject(error);
    }
  });
}

function eliminarPublicacionPorId(idPublicacion) {
  return new Promise(async (resolve, reject) => {
    try {
      const bd = await abrirBaseDeDatos();
      const transaccion = bd.transaction(STORE_PUBLICACIONES, "readwrite");
      const store = transaccion.objectStore(STORE_PUBLICACIONES);

      store.delete(Number(idPublicacion));

      transaccion.oncomplete = () => {
        resolve(true);
      };

      transaccion.onerror = () => {
        reject(transaccion.error);
      };
    } catch (error) {
      reject(error);
    }
  });
}

function obtenerSeleccionDashboard() {
  return new Promise(async (resolve, reject) => {
    try {
      const bd = await abrirBaseDeDatos();
      const transaccion = bd.transaction(STORE_SELECCION, "readonly");
      const store = transaccion.objectStore(STORE_SELECCION);
      const solicitud = store.getAll();

      solicitud.onsuccess = () => {
        resolve(solicitud.result);
      };

      solicitud.onerror = () => {
        reject(solicitud.error);
      };
    } catch (error) {
      reject(error);
    }
  });
}

function guardarSeleccionDashboard(publicacion) {
  return new Promise(async (resolve, reject) => {
    try {
      const bd = await abrirBaseDeDatos();
      const transaccion = bd.transaction(STORE_SELECCION, "readwrite");
      const store = transaccion.objectStore(STORE_SELECCION);

      store.put(publicacion);

      transaccion.oncomplete = () => {
        resolve(true);
      };

      transaccion.onerror = () => {
        reject(transaccion.error);
      };
    } catch (error) {
      reject(error);
    }
  });
}

function eliminarSeleccionDashboard(idPublicacion) {
  return new Promise(async (resolve, reject) => {
    try {
      const bd = await abrirBaseDeDatos();
      const transaccion = bd.transaction(STORE_SELECCION, "readwrite");
      const store = transaccion.objectStore(STORE_SELECCION);

      store.delete(Number(idPublicacion));

      transaccion.oncomplete = () => {
        resolve(true);
      };

      transaccion.onerror = () => {
        reject(transaccion.error);
      };
    } catch (error) {
      reject(error);
    }
  });
}

export {
  obtenerUsuarios,
  inicializarUsuarios,
  obtenerUsuarioActivo,
  guardarUsuarioActivo,
  cerrarSesion,
  loguearUsuario,
  registrarUsuario,
  eliminarUsuarioPorId,
  abrirBaseDeDatos,
  inicializarPublicaciones,
  obtenerPublicaciones,
  registrarPublicacion,
  eliminarPublicacionPorId,
  obtenerSeleccionDashboard,
  guardarSeleccionDashboard,
  eliminarSeleccionDashboard
};