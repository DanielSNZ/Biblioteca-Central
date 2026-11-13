
const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function iniciarServidor() {
  try {
    await client.connect();

    const db = client.db("biblioteca_central");

    console.log("Conectado correctamente a MongoDB");

    
    app.get("/api/libros", async (req, res) => {
      try {
        const libros = await db
          .collection("libros")
          .find({})
          .toArray();

        res.json(libros);
      } catch (error) {
        res.status(500).json({
          error: "No se pudieron obtener los libros"
        });
      }
    });

app.get("/api/usuarios", async (req, res) => {
  try {
    const usuarios = await db
      .collection("usuarios")
      .find({})
      .toArray();

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({
      error: "No se pudieron obtener los usuarios"
    });
  }
});

app.get("/api/prestamos", async (req, res) => {
  try {
    const prestamos = await db
      .collection("prestamos")
      .find({})
      .toArray();

    res.json(prestamos);
  } catch (error) {
    res.status(500).json({
      error: "No se pudieron obtener los préstamos"
    });
  }
});

app.post("/api/libros", async (req, res) => {
  try {
    const { id_libro, titulo, autor } = req.body;

    const id = Number(id_libro);

    if (
      !Number.isInteger(id) ||
      id <= 0 ||
      typeof titulo !== "string" ||
      !titulo.trim() ||
      typeof autor !== "string" ||
      !autor.trim()
    ) {
      return res.status(400).json({
        error: "Debes ingresar un código válido, título y autor."
      });
    }

    const existe = await db.collection("libros").findOne({
      id_libro: id
    });

    if (existe) {
      return res.status(409).json({
        error: "Ya existe un libro con ese código."
      });
    }

    const nuevoLibro = {
      id_libro: id,
      titulo: titulo.trim(),
      autor: autor.trim(),
      disponible: true
    };

    await db.collection("libros").insertOne(nuevoLibro);

    res.status(201).json({
      mensaje: "Libro registrado correctamente",
      libro: nuevoLibro
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "No se pudo registrar el libro."
    });
  }
});

app.put("/api/libros/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { titulo, autor, disponible } = req.body;

    if (
      !Number.isInteger(id) ||
      id <= 0 ||
      typeof titulo !== "string" ||
      !titulo.trim() ||
      typeof autor !== "string" ||
      !autor.trim() ||
      typeof disponible !== "boolean"
    ) {
      return res.status(400).json({
        error: "Los datos del libro no son válidos."
      });
    }

    const resultado = await db.collection("libros").updateOne(
      { id_libro: id },
      {
        $set: {
          titulo: titulo.trim(),
          autor: autor.trim(),
          disponible
        }
      }
    );

    if (resultado.matchedCount === 0) {
      return res.status(404).json({
        error: "No se encontró el libro."
      });
    }

    res.json({
      mensaje: "Libro actualizado correctamente."
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "No se pudo actualizar el libro."
    });
  }
});

app.delete("/api/libros/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "El código del libro no es válido."
      });
    }

    // Evitar eliminar libros que tengan préstamos registrados
    const tienePrestamos = await db.collection("prestamos").findOne({
      id_libro: id
    });

    if (tienePrestamos) {
      return res.status(409).json({
        error: "No puedes eliminar un libro que tiene préstamos registrados."
      });
    }

    const resultado = await db.collection("libros").deleteOne({
      id_libro: id
    });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({
        error: "No se encontró el libro."
      });
    }

    res.json({
      mensaje: "Libro eliminado correctamente."
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "No se pudo eliminar el libro."
    });
  }
});

app.post("/api/usuarios", async (req, res) => {
  try {
    const { id_usuario, nombre, correo } = req.body;
    const id = Number(id_usuario);

    if (
      !Number.isInteger(id) ||
      id <= 0 ||
      typeof nombre !== "string" ||
      !nombre.trim() ||
      typeof correo !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())
    ) {
      return res.status(400).json({
        error: "Ingresa un código válido, nombre y correo."
      });
    }

    const existe = await db.collection("usuarios").findOne({
      id_usuario: id
    });

    if (existe) {
      return res.status(409).json({
        error: "Ya existe un usuario con ese código."
      });
    }

    const nuevoUsuario = {
      id_usuario: id,
      nombre: nombre.trim(),
      correo: correo.trim()
    };

    await db.collection("usuarios").insertOne(nuevoUsuario);

    res.status(201).json({
      mensaje: "Usuario registrado correctamente.",
      usuario: nuevoUsuario
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "No se pudo registrar el usuario."
    });
  }
});


app.post("/api/prestamos", async (req, res) => {
  try {
    const { id_usuario, id_libro } = req.body;

    const idUsuario = Number(id_usuario);
    const idLibro = Number(id_libro);

    if (
      !Number.isInteger(idUsuario) ||
      idUsuario <= 0 ||
      !Number.isInteger(idLibro) ||
      idLibro <= 0
    ) {
      return res.status(400).json({
        error: "Debes seleccionar un usuario y un libro válidos."
      });
    }

    // Verificar que el usuario exista
    const usuario = await db.collection("usuarios").findOne({
      id_usuario: idUsuario
    });

    if (!usuario) {
      return res.status(404).json({
        error: "El usuario no existe."
      });
    }

    // Reservar el libro solo si está disponible
    const resultadoLibro = await db.collection("libros").updateOne(
      { id_libro: idLibro, disponible: true },
      { $set: { disponible: false } }
    );

    if (resultadoLibro.matchedCount === 0) {
      return res.status(409).json({
        error: "El libro no existe o no está disponible."
      });
    }

    try {
      // Obtener el siguiente código de préstamo
      const ultimo = await db.collection("prestamos")
        .find({})
        .sort({ id_prestamo: -1 })
        .limit(1)
        .next();

      const nuevoId = ultimo ? ultimo.id_prestamo + 1 : 1;

      const fechaPrestamo = new Date();
      const fechaDevolucion = new Date(fechaPrestamo);

      fechaDevolucion.setUTCDate(
        fechaDevolucion.getUTCDate() + 7
      );

      const nuevoPrestamo = {
        id_prestamo: nuevoId,
        id_usuario: idUsuario,
        id_libro: idLibro,
        fecha_prestamo: fechaPrestamo,
        fecha_devolucion: fechaDevolucion,
        estado: "ACTIVO",
        multa_acumulada: 0
      };

      await db.collection("prestamos").insertOne(nuevoPrestamo);

      return res.status(201).json({
        mensaje: "Préstamo registrado correctamente.",
        prestamo: nuevoPrestamo
      });

    } catch (error) {
      // Si falla el registro, devolver la disponibilidad
      await db.collection("libros").updateOne(
        { id_libro: idLibro },
        { $set: { disponible: true } }
      );

      throw error;
    }

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "No se pudo registrar el préstamo."
    });
  }
});

app.put("/api/prestamos/:id/devolver", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "El código del préstamo no es válido."
      });
    }

    // Buscar el préstamo activo
    const prestamo = await db.collection("prestamos").findOne({
      id_prestamo: id,
      estado: "ACTIVO"
    });

    if (!prestamo) {
      return res.status(404).json({
        error: "No existe un préstamo activo con ese código."
      });
    }

    // Cambiar el estado del préstamo a DEVUELTO
    const resultado = await db.collection("prestamos").updateOne(
      {
        _id: prestamo._id,
        estado: "ACTIVO"
      },
      {
        $set: {
          estado: "DEVUELTO",
          fecha_devolucion_real: new Date()
        }
      }
    );

    if (resultado.modifiedCount === 0) {
      return res.status(409).json({
        error: "El préstamo ya fue devuelto."
      });
    }

    // Volver a dejar el libro disponible
    await db.collection("libros").updateOne(
      { id_libro: prestamo.id_libro },
      { $set: { disponible: true } }
    );

    res.json({
      mensaje: "Devolución registrada correctamente."
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "No se pudo registrar la devolución."
    });
  }
});


app.put("/api/usuarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre, correo } = req.body;

    if (
      !Number.isInteger(id) ||
      id <= 0 ||
      typeof nombre !== "string" ||
      !nombre.trim() ||
      typeof correo !== "string" ||
      !correo.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())
    ) {
      return res.status(400).json({
        error: "Debes ingresar un nombre y correo válidos."
      });
    }

    const resultado = await db.collection("usuarios").updateOne(
      { id_usuario: id },
      {
        $set: {
          nombre: nombre.trim(),
          correo: correo.trim()
        }
      }
    );

    if (resultado.matchedCount === 0) {
      return res.status(404).json({
        error: "No se encontró el usuario."
      });
    }

    res.json({
      mensaje: "Usuario actualizado correctamente."
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "No se pudo actualizar el usuario."
    });
  }
});

app.delete("/api/usuarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "El código del usuario no es válido."
      });
    }

    const usuario = await db.collection("usuarios").findOne({
      id_usuario: id
    });

    if (!usuario) {
      return res.status(404).json({
        error: "No se encontró el usuario."
      });
    }

    // Verificar si el usuario tiene préstamos registrados
    const prestamo = await db.collection("prestamos").findOne({
      id_usuario: id
    });

    if (prestamo) {
      return res.status(409).json({
        error: "No puedes eliminar este usuario porque tiene préstamos registrados."
      });
    }

    await db.collection("usuarios").deleteOne({
      id_usuario: id
    });

    res.json({
      mensaje: "Usuario eliminado correctamente."
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "No se pudo eliminar el usuario."
    });
  }
});


    app.listen(PORT, () => {
      console.log(
        `Servidor funcionando en http://localhost:${PORT}`
      );
    });

  } catch (error) {
    console.error("Error al conectar MongoDB:", error.message);
  }
}

iniciarServidor();
