const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const Conductor = sequelize.define("Conductor", {
    id_conductor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre_conductor: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dni: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING(15),
        allowNull: true,
    },
    licencia: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
}, {
    tableName: "conductores",
    timestamps: false,
});

module.exports = Conductor;
