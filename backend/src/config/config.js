const { Sequelize } = require("sequelize");
require("dotenv").config(); // Esto carga las variables del archivo .env

console.log("DATABASE_URL:", process.env.DATABASE_URL); // Verificar que la variable esté correctamente cargada

// Crear la instancia de Sequelize usando la URL de la base de datos directamente
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres", // Especifica explícitamente el dialecto
    logging: false, // Desactivar logging para producción
});

sequelize.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos establecida con éxito.');
    })
    .catch((error) => {
        console.error('No se pudo conectar a la base de datos:', error);
    });

module.exports = sequelize;
