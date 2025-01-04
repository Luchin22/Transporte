const { Sequelize } = require("sequelize");
require("dotenv").config(); // Esto carga las variables del archivo .env

console.log("DB_NAME:", process.env.DB_NAME); // Para verificar si las variables se cargan correctamente

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        logging: false, // Desactivar logging para producción
    }
);

module.exports = sequelize;
