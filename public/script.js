
document.addEventListener("DOMContentLoaded", () => {

  const botones = document.querySelectorAll(".nav-link");
  const secciones = document.querySelectorAll(".section");

  botones.forEach(boton => {
    boton.addEventListener("click", () => {

      const destino = boton.dataset.section;

      // Ocultar todas las secciones
      secciones.forEach(seccion => {
        seccion.classList.remove("active");
      });

      // Quitar la selección anterior
      botones.forEach(b => {
        b.classList.remove("active");
      });

      // Mostrar la sección seleccionada
      document.getElementById(destino).classList.add("active");

      // Marcar el botón seleccionado
      boton.classList.add("active");

    });
  });

});

async function cargarLibros() {
  const contenedor = document.getElementById("listaLibros");

  contenedor.textContent = "Cargando libros...";

  try {
    const respuesta = await fetch("/api/libros");

    if (!respuesta.ok) {
      throw new Error("Error al consultar los libros");
    }

    const libros = await respuesta.json();
    const textoBusqueda = document
  .getElementById("buscarLibro")
  .value.toLowerCase().trim();

const librosFiltrados = libros.filter(libro => {
  return (
    libro.titulo.toLowerCase().includes(textoBusqueda) ||
    libro.autor.toLowerCase().includes(textoBusqueda)
  );
});

    contenedor.innerHTML = "";

if (libros.length === 0) {
  contenedor.textContent = "No hay libros registrados.";
  return;
}

if (librosFiltrados.length === 0) {
  contenedor.textContent =
    "No se encontraron libros con esa búsqueda.";
  return;
}

    librosFiltrados.forEach(libro => {
      const tarjeta = document.createElement("div");
      tarjeta.className = "item-card";

      const titulo = document.createElement("h3");
      titulo.textContent = "📖 " + libro.titulo;

      const autor = document.createElement("p");
      autor.textContent = "Autor: " + libro.autor;

      const codigo = document.createElement("p");
      codigo.textContent = "Código: " + libro.id_libro;

      const estado = document.createElement("p");
      estado.textContent = libro.disponible
        ? "🟢 Disponible"
        : "🔴 No disponible";

     
const acciones = document.createElement("div");
acciones.className = "item-actions";

const botonEditar = document.createElement("button");
botonEditar.textContent = "✏️ Editar";

botonEditar.addEventListener("click", () => {
  editarLibro(libro);
});


acciones.appendChild(botonEditar);

const botonEliminar = document.createElement("button");
botonEliminar.textContent = "🗑️ Eliminar";

botonEliminar.addEventListener("click", () => {
  eliminarLibro(libro);
});

acciones.appendChild(botonEliminar);


tarjeta.append(titulo, autor, codigo, estado, acciones);
contenedor.appendChild(tarjeta);
    });


    // Actualizar las estadísticas del inicio
    document.getElementById("totalLibros").textContent =
      libros.length;

    document.getElementById("librosDisponibles").textContent =
      libros.filter(libro => libro.disponible === true).length;

  } catch (error) {
    console.error(error);
    contenedor.textContent =
      "No se pudieron cargar los libros. Revisa el servidor.";
  }
}

// Cargar los libros cuando se abre la página
document.addEventListener("DOMContentLoaded", cargarLibros);

async function cargarUsuarios() {
  const contenedor = document.getElementById("listaUsuarios");

  contenedor.textContent = "Cargando usuarios...";

  try {
    const respuesta = await fetch("/api/usuarios");

    if (!respuesta.ok) {
      throw new Error("Error al consultar los usuarios");
    }

    const usuarios = await respuesta.json();

    contenedor.innerHTML = "";

    if (usuarios.length === 0) {
      contenedor.textContent = "No hay usuarios registrados.";
      return;
    }

    usuarios.forEach(usuario => {
      const tarjeta = document.createElement("div");
      tarjeta.className = "item-card";

      const nombre = document.createElement("h3");
      nombre.textContent = "👤 " + usuario.nombre;

      const correo = document.createElement("p");
      correo.textContent = "Correo: " + usuario.correo;

      const codigo = document.createElement("p");
      codigo.textContent = "Código: " + usuario.id_usuario;

      
const acciones = document.createElement("div");
acciones.className = "item-actions";

const botonEditar = document.createElement("button");
botonEditar.textContent = "✏️ Editar";

botonEditar.addEventListener("click", () => {
  editarUsuario(usuario);
});


acciones.appendChild(botonEditar);

const botonEliminar = document.createElement("button");
botonEliminar.textContent = "🗑️ Eliminar";

botonEliminar.addEventListener("click", async () => {
  const confirmar = confirm(
    "¿Estás seguro de eliminar a " + usuario.nombre + "?"
  );

  if (!confirmar) {
    return;
  }

  try {
    const respuesta = await fetch(
      `/api/usuarios/${usuario.id_usuario}`,
      {
        method: "DELETE"
      }
    );

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(resultado.error || "Error al eliminar.");
    }

    alert("¡Usuario eliminado correctamente!");

    await cargarUsuarios();

  } catch (error) {
    alert(error.message);
  }
});

acciones.appendChild(botonEliminar);

tarjeta.append(nombre, correo, codigo, acciones);
contenedor.appendChild(tarjeta);


    });

    // Actualizar estadística de usuarios
    document.getElementById("totalUsuarios").textContent =
      usuarios.length;

  } catch (error) {
    console.error(error);
    contenedor.textContent =
      "No se pudieron cargar los usuarios. Revisa el servidor.";
  }
}

// Cargar usuarios al abrir la página
document.addEventListener("DOMContentLoaded", cargarUsuarios);

async function cargarPrestamos() {
  const contenedor = document.getElementById("listaPrestamos");

  contenedor.textContent = "Cargando préstamos...";

  try {
    const respuesta = await fetch("/api/prestamos");

    if (!respuesta.ok) {
      throw new Error("Error al consultar los préstamos");
    }

    const prestamos = await respuesta.json();

    contenedor.innerHTML = "";

    if (prestamos.length === 0) {
      contenedor.textContent = "No hay préstamos registrados.";
      return;
    }

    prestamos.forEach(prestamo => {
      const tarjeta = document.createElement("div");
      tarjeta.className = "item-card";

      const titulo = document.createElement("h3");
      titulo.textContent = "📋 Préstamo #" + prestamo.id_prestamo;

      const usuario = document.createElement("p");
      usuario.textContent = "Código de usuario: " + prestamo.id_usuario;

      const libro = document.createElement("p");
      libro.textContent = "Código de libro: " + prestamo.id_libro;

      const fecha = document.createElement("p");
      fecha.textContent = "Fecha de préstamo: " +
        new Date(prestamo.fecha_prestamo).toLocaleDateString("es-CL", {
          timeZone: "UTC"
        });

      const devolucion = document.createElement("p");
      devolucion.textContent = "Fecha de devolución: " +
        new Date(prestamo.fecha_devolucion).toLocaleDateString("es-CL", {
          timeZone: "UTC"
        });

      const estado = document.createElement("p");
      estado.textContent = "Estado: " + prestamo.estado;

      const multa = document.createElement("p");
      multa.textContent = "Multa acumulada: $" +
        prestamo.multa_acumulada;

     
tarjeta.append(
  titulo,
  usuario,
  libro,
  fecha,
  devolucion,
  estado,
  multa
);

// Mostrar botón solo si el préstamo está activo
if (prestamo.estado === "ACTIVO") {
  const botonDevolver = document.createElement("button");

  botonDevolver.textContent = "↩️ Registrar devolución";
  botonDevolver.className = "btn-primary";

  botonDevolver.addEventListener("click", () => {
    devolverLibro(prestamo);
  });

  tarjeta.appendChild(botonDevolver);
}

contenedor.appendChild(tarjeta);

    });

    // Actualizar estadística de préstamos activos
    document.getElementById("prestamosActivos").textContent =
      prestamos.filter(p => p.estado === "ACTIVO").length;

  } catch (error) {
    console.error(error);
    contenedor.textContent =
      "No se pudieron cargar los préstamos. Revisa el servidor.";
  }
}

// Cargar préstamos al abrir la página
document.addEventListener("DOMContentLoaded", cargarPrestamos);

document.getElementById("nuevoLibro").addEventListener("click", () => {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modalBody");

  document.getElementById("modalTitulo").textContent =
    "Registrar nuevo libro";

  modalBody.innerHTML = `
    <form id="formLibro">
      <div>
        <label for="idLibro">Código del libro</label>
        <input id="idLibro" type="number" min="1" required>
      </div>

      <div>
        <label for="tituloLibro">Título</label>
        <input id="tituloLibro" type="text" required>
      </div>

      <div>
        <label for="autorLibro">Autor</label>
        <input id="autorLibro" type="text" required>
      </div>

      <button type="submit" class="btn-primary">
        Guardar libro
      </button>
    </form>
  `;

  modal.hidden = false;

  document.getElementById("formLibro").addEventListener(
    "submit",
    async (evento) => {
      evento.preventDefault();

      const nuevoLibro = {
        id_libro: Number(document.getElementById("idLibro").value),
        titulo: document.getElementById("tituloLibro").value,
        autor: document.getElementById("autorLibro").value
      };

      try {
        const respuesta = await fetch("/api/libros", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(nuevoLibro)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(resultado.error || "Error al guardar.");
        }

        modal.hidden = true;
        alert("¡Libro registrado correctamente!");

        await cargarLibros();

      } catch (error) {
        alert(error.message);
      }
    }
  );
});

document.getElementById("cerrarModal").addEventListener("click", () => {
  document.getElementById("modal").hidden = true;
});

function editarLibro(libro) {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modalBody");

  document.getElementById("modalTitulo").textContent =
    "Editar libro #" + libro.id_libro;

  modalBody.innerHTML = `
    <form id="formEditarLibro">
      <div>
        <label for="editarTitulo">Título</label>
        <input id="editarTitulo" type="text" required>
      </div>

      <div>
        <label for="editarAutor">Autor</label>
        <input id="editarAutor" type="text" required>
      </div>

      <div>
        <label for="editarDisponible">Disponibilidad</label>
        <select id="editarDisponible">
          <option value="true">Disponible</option>
          <option value="false">No disponible</option>
        </select>
      </div>

      <button type="submit" class="btn-primary">
        Guardar cambios
      </button>
    </form>
  `;

  document.getElementById("editarTitulo").value = libro.titulo;
  document.getElementById("editarAutor").value = libro.autor;
  document.getElementById("editarDisponible").value =
    String(libro.disponible);

  modal.hidden = false;

  document.getElementById("formEditarLibro").addEventListener(
    "submit",
    async (evento) => {
      evento.preventDefault();

      const datos = {
        titulo: document.getElementById("editarTitulo").value,
        autor: document.getElementById("editarAutor").value,
        disponible:
          document.getElementById("editarDisponible").value === "true"
      };

      try {
        const respuesta = await fetch(
          `/api/libros/${libro.id_libro}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
          }
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(resultado.error || "Error al actualizar.");
        }

        modal.hidden = true;
        alert("¡Libro actualizado correctamente!");

        await cargarLibros();

      } catch (error) {
        alert(error.message);
      }
    }
  );
}

async function eliminarLibro(libro) {
  const confirmar = confirm(
    `¿Seguro que deseas eliminar "${libro.titulo}"?`
  );

  if (!confirmar) {
    return;
  }

  try {
    const respuesta = await fetch(
      `/api/libros/${libro.id_libro}`,
      {
        method: "DELETE"
      }
    );

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(resultado.error || "Error al eliminar.");
    }

    alert("¡Libro eliminado correctamente!");

    await cargarLibros();

  } catch (error) {
    alert(error.message);
  }
}
document.getElementById("buscarLibro").addEventListener(
  "input",
  cargarLibros
);

document.getElementById("nuevoUsuario").addEventListener("click", () => {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modalBody");

  document.getElementById("modalTitulo").textContent =
    "Registrar nuevo usuario";

  modalBody.innerHTML = `
    <form id="formUsuario">
      <div>
        <label for="idUsuario">Código del usuario</label>
        <input id="idUsuario" type="number" min="1" required>
      </div>

      <div>
        <label for="nombreUsuario">Nombre completo</label>
        <input id="nombreUsuario" type="text" required>
      </div>

      <div>
        <label for="correoUsuario">Correo electrónico</label>
        <input id="correoUsuario" type="email" required>
      </div>

      <button type="submit" class="btn-primary">
        Guardar usuario
      </button>
    </form>
  `;

  modal.hidden = false;

  document.getElementById("formUsuario").addEventListener(
    "submit",
    async (evento) => {
      evento.preventDefault();

      const nuevoUsuario = {
        id_usuario: Number(
          document.getElementById("idUsuario").value
        ),
        nombre: document.getElementById("nombreUsuario").value,
        correo: document.getElementById("correoUsuario").value
      };

      try {
        const respuesta = await fetch("/api/usuarios", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(nuevoUsuario)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(resultado.error || "Error al guardar.");
        }

        modal.hidden = true;
        alert("¡Usuario registrado correctamente!");

        await cargarUsuarios();

      } catch (error) {
        alert(error.message);
      }
    }
  );
});

document.getElementById("nuevoPrestamo").addEventListener(
  "click",
  async () => {
    const modal = document.getElementById("modal");
    const modalBody = document.getElementById("modalBody");

    document.getElementById("modalTitulo").textContent =
      "Registrar nuevo préstamo";

    modalBody.textContent = "Cargando datos...";
    modal.hidden = false;

    try {
      // Consultar usuarios y libros desde MongoDB
      const [respuestaUsuarios, respuestaLibros] = await Promise.all([
        fetch("/api/usuarios"),
        fetch("/api/libros")
      ]);

      if (!respuestaUsuarios.ok || !respuestaLibros.ok) {
        throw new Error("No se pudieron consultar los datos.");
      }

      const usuarios = await respuestaUsuarios.json();
      const libros = await respuestaLibros.json();

      // Mostrar solamente libros disponibles
      const disponibles = libros.filter(
        libro => libro.disponible === true
      );

      if (usuarios.length === 0 || disponibles.length === 0) {
        modalBody.textContent =
          "Necesitas usuarios registrados y libros disponibles.";
        return;
      }

      modalBody.innerHTML = `
        <form id="formPrestamo">
          <div>
            <label for="prestamoUsuario">Seleccionar usuario</label>
            <select id="prestamoUsuario" required></select>
          </div>

          <div>
            <label for="prestamoLibro">Seleccionar libro</label>
            <select id="prestamoLibro" required></select>
          </div>

          <button type="submit" class="btn-primary">
            Registrar préstamo
          </button>
        </form>
      `;

      const selectUsuario =
        document.getElementById("prestamoUsuario");

      const selectLibro =
        document.getElementById("prestamoLibro");

      // Agregar usuarios al formulario
      usuarios.forEach(usuario => {
        const opcion = document.createElement("option");
        opcion.value = usuario.id_usuario;
        opcion.textContent =
          `${usuario.nombre} (Código ${usuario.id_usuario})`;

        selectUsuario.appendChild(opcion);
      });

      // Agregar libros disponibles
      disponibles.forEach(libro => {
        const opcion = document.createElement("option");
        opcion.value = libro.id_libro;
        opcion.textContent =
          `${libro.titulo} (Código ${libro.id_libro})`;

        selectLibro.appendChild(opcion);
      });

      document.getElementById("formPrestamo").addEventListener(
        "submit",
        async (evento) => {
          evento.preventDefault();

          const botonGuardar = evento.currentTarget.querySelector(
            'button[type="submit"]'
          );

          botonGuardar.disabled = true;

          const nuevoPrestamo = {
            id_usuario: Number(selectUsuario.value),
            id_libro: Number(selectLibro.value)
          };

          try {
            const respuesta = await fetch("/api/prestamos", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(nuevoPrestamo)
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
              throw new Error(
                resultado.error || "No se pudo registrar el préstamo."
              );
            }

            modal.hidden = true;

            alert("¡Préstamo registrado correctamente!");

            // Actualizar los datos de nuestra página
            await Promise.all([
              cargarPrestamos(),
              cargarLibros()
            ]);

          } catch (error) {
            alert(error.message);
          } finally {
            botonGuardar.disabled = false;
          }
        }
      );

    } catch (error) {
      console.error(error);
      modalBody.textContent =
        "No se pudieron cargar los usuarios y libros.";
    }
  }
);

async function devolverLibro(prestamo) {
  const confirmar = confirm(
    `¿Confirmas la devolución del préstamo #${prestamo.id_prestamo}?`
  );

  if (!confirmar) {
    return;
  }

  try {
    const respuesta = await fetch(
      `/api/prestamos/${prestamo.id_prestamo}/devolver`,
      {
        method: "PUT"
      }
    );

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        resultado.error || "No se pudo registrar la devolución."
      );
    }

    alert("¡Devolución registrada correctamente!");

    // Actualizar préstamos y disponibilidad de libros
    await Promise.all([
      cargarPrestamos(),
      cargarLibros()
    ]);

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

function editarUsuario(usuario) {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modalBody");

  document.getElementById("modalTitulo").textContent =
    "Editar usuario #" + usuario.id_usuario;

  modalBody.innerHTML = `
    <form id="formEditarUsuario">
      <div>
        <label for="editarNombre">Nombre completo</label>
        <input id="editarNombre" type="text" required>
      </div>

      <div>
        <label for="editarCorreo">Correo electrónico</label>
        <input id="editarCorreo" type="email" required>
      </div>

      <button type="submit" class="btn-primary">
        Guardar cambios
      </button>
    </form>
  `;

  document.getElementById("editarNombre").value = usuario.nombre;
  document.getElementById("editarCorreo").value = usuario.correo;

  modal.hidden = false;

  document.getElementById("formEditarUsuario").addEventListener(
    "submit",
    async (evento) => {
      evento.preventDefault();

      const datos = {
        nombre: document.getElementById("editarNombre").value,
        correo: document.getElementById("editarCorreo").value
      };

      try {
        const respuesta = await fetch(
          `/api/usuarios/${usuario.id_usuario}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
          }
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(resultado.error || "Error al actualizar.");
        }

        modal.hidden = true;
        alert("¡Usuario actualizado correctamente!");

        await cargarUsuarios();

      } catch (error) {
        alert(error.message);
      }
    }
  );
}
