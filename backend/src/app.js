require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/config");
const routes = require("./routes");



const app = express();
const PORT = process.env.PORT || 3005;

// Middlewares
app.use(express.json());

// Configuración de CORS
app.use(cors({
    origin: "http://localhost:8081",  // Cambia a la URL de tu frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));


// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Ocurrió un error en el servidor." });
});

// Rutas
app.use("/api", routes);

// Sincronización de Sequelize e inicialización de datos
sequelize.sync({ force: false })
    .then(async () => {
        console.log("Tablas sincronizadas con éxito.");
        

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error al sincronizar las tablas:", error);
    });

module.exports = { app, sequelize };
