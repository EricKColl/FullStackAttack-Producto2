import { usuarios } from "./datos.js";
import { pintarUsuarioEnNavbar, configurarBotonCerrarSesion } from "./ui.js";

// Elementos del DOM
const formLogin = document.getElementById("form-login");
const emailLogin = document.getElementById("email-login");
const passwordLogin = document.getElementById("password-login");
const mensajeLogin = document.getElementById("mensaje-login");

// Inicializar pantalla login
function inicializarLogin() {
  pintarUsuarioEnNavbar();
  configurarBotonCerrarSesion();
  formLogin.addEventListener("submit", gestionarLogin);
}

// Gestionar envío del formulario
function gestionarLogin(evento) {
  evento.preventDefault();

  const email = emailLogin.value.trim().toLowerCase();
  const password = passwordLogin.value.trim();

  if (!email || !password) {
    mostrarMensaje("Debes completar el correo y la contraseña.", "danger");
    return;
  }

  const usuarioEncontrado = usuarios.find(
    (usuario) => usuario.email === email && usuario.password === password
  );

  if (!usuarioEncontrado) {
    mostrarMensaje("Credenciales incorrectas. Revisa el correo y la contraseña.", "danger");
    return;
  }

  const usuarioParaGuardar = {
    id: usuarioEncontrado.id,
    nombre: usuarioEncontrado.nombre,
    apellidos: usuarioEncontrado.apellidos,
    email: usuarioEncontrado.email,
    rol: usuarioEncontrado.rol
  };

  localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioParaGuardar));

  pintarUsuarioEnNavbar();
  mostrarMensaje(`Login correcto. Bienvenido/a, ${usuarioEncontrado.nombre}.`, "success");
  formLogin.reset();
}

function mostrarMensaje(texto, tipo) {
  mensajeLogin.innerHTML = `
    <div class="alert alert-${tipo}" role="alert">
      ${texto}
    </div>
  `;
}

inicializarLogin();