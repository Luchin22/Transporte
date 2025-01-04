const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const Ruta = sequelize.define("Ruta", {
    id_ruta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    origen: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    destino: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    distancia: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    estado: {
        type: DataTypes.STRING,
        defaultValue: "activa",
    },
}, {
    tableName: "rutas",
    timestamps: false,
});

module.exports = Ruta;
