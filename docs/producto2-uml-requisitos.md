# Producto 2 - UML y requerimientos funcionales

## 1. Introducción

En el Producto 2 del proyecto JobConnect se ha realizado una mejora de la aplicación web desarrollada en el Producto 1. En esta nueva versión se ha mantenido la estructura general de la aplicación, pero se ha ampliado la interacción con el usuario mediante el uso de diferentes APIs de HTML5 y técnicas de programación modular con JavaScript en modo vanilla.

La aplicación permite gestionar usuarios, iniciar sesión, dar de alta publicaciones de tipo oferta o demanda, visualizar información en el dashboard y seleccionar publicaciones mediante arrastrar y soltar. Además, en este producto se ha incorporado persistencia en el propio navegador, utilizando localStorage para la gestión de usuarios y sesión activa, e IndexedDB para el almacenamiento de publicaciones y de la selección realizada en el dashboard.

También se ha implementado un gráfico nativo con Canvas para representar visualmente el número de ofertas y demandas registradas. Todo ello se ha organizado mediante diferentes módulos JavaScript, separando la lógica de almacenamiento, la interacción de cada página y las funciones comunes de interfaz. Este documento resume los componentes principales desarrollados y los requerimientos funcionales asociados a cada uno de ellos, como base para su representación en el diagrama UML del producto.

## 2. Componentes principales

### 2.1 almacenaje.js

Es el módulo principal de persistencia de datos de la aplicación. Se encarga de centralizar las operaciones relacionadas con usuarios, sesión activa, publicaciones y selección del dashboard.

Sus responsabilidades principales son:

- gestionar usuarios mediante `localStorage`
- gestionar el usuario activo
- abrir y preparar la base de datos `IndexedDB`
- almacenar publicaciones
- recuperar publicaciones
- guardar la selección realizada en el dashboard

Este componente actúa como una capa común de acceso a datos para el resto de módulos.

### 2.2 int_2_login.js

Es el módulo encargado de la lógica de la página de login. Controla el formulario de acceso y se comunica con `almacenaje.js` para autenticar al usuario.

Sus tareas principales son:

- inicializar la página de login
- leer los datos introducidos en el formulario
- validar que los campos no estén vacíos
- llamar a la función de login del módulo de almacenamiento
- mostrar mensajes de éxito o error
- actualizar la barra de navegación con el usuario activo

### 2.3 int_4_usuarios.js

Es el módulo que controla la gestión de usuarios dentro de la aplicación.

Sus funciones principales son:

- inicializar la página de usuarios
- cargar usuarios almacenados
- mostrar la tabla de usuarios
- dar de alta nuevos usuarios
- validar campos del formulario
- evitar correos repetidos
- eliminar usuarios existentes
- mostrar mensajes en pantalla

### 2.4 int_3_empleos.js

Es el módulo encargado de la gestión de publicaciones de empleo, tanto ofertas como demandas.

Sus responsabilidades principales son:

- inicializar la página de publicaciones
- cargar publicaciones desde IndexedDB
- mostrar las publicaciones en la tabla
- registrar nuevas publicaciones
- eliminar publicaciones
- dibujar el gráfico de ofertas y demandas mediante Canvas
- mostrar mensajes informativos al usuario

### 2.5 int_1_dashboard.js

Es el módulo correspondiente al dashboard principal de la aplicación.

Sus funciones principales son:

- inicializar el dashboard
- recuperar publicaciones desde IndexedDB
- mostrar indicadores resumen
- generar tarjetas dinámicas de publicaciones
- permitir arrastrar tarjetas
- - permitir soltarlas en una zona de selección y deseleccionarlas arrastrándolas de nuevo al panel superior
- guardar dicha selección en IndexedDB
- recuperar la selección ya guardada

### 2.6 ui.js

Es un módulo auxiliar de interfaz. Se utiliza para centralizar comportamientos comunes visibles en diferentes páginas.

Sus funciones principales son:

- pintar el usuario activo en la barra de navegación
- mostrar si existe sesión iniciada o no
- activar y gestionar el botón de cerrar sesión
- redirigir al login cuando el usuario cierra sesión

## 3. Requerimientos funcionales por componente

### 3.1 Requerimientos de almacenaje.js

1. El sistema debe permitir obtener la lista de usuarios almacenados en `localStorage`.
2. El sistema debe permitir guardar usuarios en `localStorage`.
3. El sistema debe inicializar automáticamente los usuarios base si no existen datos guardados.
4. El sistema debe permitir recuperar el usuario activo almacenado.
5. El sistema debe permitir guardar el usuario activo después de un login correcto.
6. El sistema debe permitir cerrar sesión eliminando el usuario activo.
7. El sistema debe validar las credenciales del usuario para realizar el login.
8. El sistema debe registrar nuevos usuarios evitando correos duplicados.
9. El sistema debe eliminar usuarios por identificador.
10. El sistema debe abrir y preparar la base de datos `IndexedDB`.
11. El sistema debe inicializar las publicaciones base si la base de datos está vacía.
12. El sistema debe recuperar todas las publicaciones almacenadas.
13. El sistema debe registrar nuevas publicaciones en la base de datos.
14. El sistema debe eliminar publicaciones por identificador.
15. El sistema debe recuperar la selección guardada en el dashboard.
16. El sistema debe guardar publicaciones seleccionadas desde el dashboard.

### 3.2 Requerimientos de int_2_login.js

1. La página de login debe inicializar automáticamente los usuarios del sistema si todavía no existen.
2. El formulario de login debe recoger el correo electrónico y la contraseña introducidos por el usuario.
3. El sistema debe validar que ambos campos estén informados antes de intentar el acceso.
4. El sistema debe autenticar al usuario usando el módulo `almacenaje.js`.
5. Si las credenciales son incorrectas, la página debe mostrar un mensaje de error.
6. Si las credenciales son correctas, la página debe mostrar un mensaje de éxito.
7. La barra de navegación debe actualizarse mostrando el usuario logueado.
8. El botón de cerrar sesión debe quedar operativo desde esta pantalla.

### 3.3 Requerimientos de int_4_usuarios.js

1. La página de usuarios debe cargar automáticamente los usuarios almacenados al iniciarse.
2. El sistema debe mostrar todos los usuarios en formato tabla.
3. El formulario de usuarios debe permitir introducir nombre, apellidos, email, contraseña y rol.
4. El sistema debe validar que todos los campos obligatorios estén informados.
5. El sistema debe validar una longitud mínima de contraseña.
6. El sistema no debe permitir registrar dos usuarios con el mismo correo electrónico.
7. El sistema debe permitir crear nuevos usuarios y reflejarlos en la tabla.
8. El sistema debe permitir eliminar usuarios desde la tabla.
9. El sistema debe mostrar mensajes visuales de éxito o error según la acción realizada.

### 3.4 Requerimientos de int_3_empleos.js

1. La página de publicaciones debe cargar automáticamente las publicaciones almacenadas en IndexedDB.
2. El sistema debe permitir registrar publicaciones de tipo oferta o demanda.
3. El formulario debe recoger tipo, título, categoría, autor, ubicación, descripción, fecha y email de contacto.
4. El sistema debe validar que todos los campos obligatorios estén informados.
5. El sistema debe guardar cada nueva publicación en la base de datos del navegador.
6. El sistema debe mostrar las publicaciones en una tabla organizada.
7. El sistema debe permitir eliminar publicaciones desde la propia tabla.
8. El sistema debe generar un gráfico de barras con Canvas.
9. El gráfico debe mostrar la cantidad de ofertas y demandas existentes.
10. El gráfico debe actualizarse automáticamente al añadir o eliminar publicaciones.
11. El sistema debe mostrar mensajes visuales al usuario después de cada operación.

### 3.5 Requerimientos de int_1_dashboard.js

1. El dashboard debe inicializar las publicaciones antes de mostrar el contenido.
2. El sistema debe mostrar un resumen con el número total de ofertas, demandas y usuarios.
3. El sistema debe generar tarjetas dinámicas a partir de las publicaciones almacenadas.
4. Las tarjetas del dashboard deben diferenciar visualmente entre ofertas y demandas.
5. Las tarjetas deben poder arrastrarse mediante la API Drag and Drop.
6. Debe existir una zona de selección donde el usuario pueda soltar publicaciones y desde la cual también pueda    deseleccionarlas arrastrándolas de nuevo al área principal.
7. El sistema debe guardar en IndexedDB las publicaciones soltadas en la zona de selección y actualizar correctamente la información al eliminarlas de esa selección.
8. El dashboard debe recuperar la selección guardada al volver a cargarse.
9. La barra de navegación debe seguir mostrando el usuario activo.

### 3.6 Requerimientos de ui.js

1. El sistema debe mostrar en la barra de navegación si hay o no un usuario activo.
2. Si no existe sesión iniciada, debe aparecer un texto informativo.
3. Si existe sesión iniciada, debe mostrarse el correo del usuario logueado.
4. El botón de cerrar sesión debe mostrarse únicamente cuando exista un usuario activo.
5. El botón de cerrar sesión debe eliminar la sesión actual.
6. Al cerrar sesión, el sistema debe redirigir al usuario a la página de login.

## 4. Relación con el diagrama UML

A nivel UML, el producto puede representarse mediante una organización modular en la que cada archivo JavaScript funciona como un componente con responsabilidades definidas.

El componente central es `almacenaje.js`, ya que ofrece servicios al resto de módulos. Desde el punto de vista del diagrama, se puede representar como el módulo del que dependen:

- `int_2_login.js`
- `int_4_usuarios.js`
- `int_3_empleos.js`
- `int_1_dashboard.js`
- `ui.js`

Por otra parte, `ui.js` también es reutilizado por varios módulos de interfaz, ya que permite actualizar la navegación y controlar la sesión visible del usuario.

Las relaciones principales del UML serían las siguientes:

- `int_2_login.js` usa funciones de `almacenaje.js` para autenticar usuarios.
- `int_4_usuarios.js` usa funciones de `almacenaje.js` para consultar, registrar y eliminar usuarios.
- `int_3_empleos.js` usa funciones de `almacenaje.js` para consultar, registrar y eliminar publicaciones.
- `int_1_dashboard.js` usa funciones de `almacenaje.js` para consultar publicaciones y guardar la selección.
- `ui.js` usa funciones de `almacenaje.js` para mostrar el usuario activo y cerrar sesión.

También puede reflejarse en el diagrama que:

- `int_3_empleos.js` trabaja con la API Canvas.
- `int_1_dashboard.js` trabaja con la API Drag and Drop.
- `almacenaje.js` trabaja con `localStorage` e `IndexedDB`.

### Propuesta de representación UML textual

- `almacenaje.js`
  - `obtenerUsuarios()`
  - `guardarUsuarios(usuarios)`
  - `inicializarUsuarios()`
  - `obtenerUsuarioActivo()`
  - `guardarUsuarioActivo(usuario)`
  - `cerrarSesion()`
  - `loguearUsuario(email, password)`
  - `registrarUsuario(datosUsuario)`
  - `eliminarUsuarioPorId(idUsuario)`
  - `abrirBaseDeDatos()`
  - `inicializarPublicaciones()`
  - `obtenerPublicaciones()`
  - `registrarPublicacion(datosPublicacion)`
  - `eliminarPublicacionPorId(idPublicacion)`
  - `obtenerSeleccionDashboard()`
  - `guardarSeleccionDashboard(publicacion)`

- `int_2_login.js`
  - `inicializarLogin()`
  - `gestionarLogin(evento)`
  - `mostrarMensaje(texto, tipo)`

- `int_4_usuarios.js`
  - `prepararPaginaUsuarios()`
  - `pintarTablaUsuarios()`
  - `gestionarAltaUsuario(evento)`
  - `eliminarUsuario(idUsuario)`
  - `mostrarMensaje(texto, tipo)`
  - `capitalizarTexto(texto)`

- `int_3_empleos.js`
  - `prepararPaginaPublicaciones()`
  - `pintarTablaPublicaciones()`
  - `gestionarAltaPublicacion(evento)`
  - `eliminarPublicacion(idPublicacion)`
  - `dibujarGraficoPublicaciones(publicaciones)`
  - `mostrarMensaje(texto, tipo)`

- `int_1_dashboard.js`
  - `inicializarDashboard()`
  - `pintarResumen()`
  - `pintarPublicaciones()`
  - `pintarSeleccionDashboard()`
  - `crearTarjetaPublicacion(publicacion, draggable)`
  - `configurarZonaDrop()`

- `ui.js`
  - `pintarUsuarioEnNavbar()`
  - `configurarBotonCerrarSesion()`

### Relaciones entre componentes

- `int_2_login.js` --> `almacenaje.js`
- `int_2_login.js` --> `ui.js`
- `int_4_usuarios.js` --> `almacenaje.js`
- `int_4_usuarios.js` --> `ui.js`
- `int_3_empleos.js` --> `almacenaje.js`
- `int_3_empleos.js` --> `ui.js`
- `int_1_dashboard.js` --> `almacenaje.js`
- `int_1_dashboard.js` --> `ui.js`
- `ui.js` --> `almacenaje.js`

## 5. Conclusión

El Producto 2 de JobConnect ha supuesto una evolución importante respecto al Producto 1, ya que la aplicación ha pasado de trabajar con datos en memoria a incorporar persistencia real dentro del navegador. Además, se han añadido nuevas formas de interacción mediante Canvas y Drag and Drop, mejorando tanto la funcionalidad como la experiencia de uso.

La estructura modular desarrollada facilita la comprensión del proyecto, su mantenimiento y su futura ampliación en el Producto 3 y el Producto 4. El módulo `almacenaje.js` actúa como núcleo de persistencia, mientras que cada interfaz se encarga de una responsabilidad concreta. Gracias a ello, el sistema queda mejor organizado, más reutilizable y más alineado con las buenas prácticas de desarrollo frontend en JavaScript.