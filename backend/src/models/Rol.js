const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const Rol = sequelize.define("Rol", {
    rol_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre_rol: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    permiso:{
        type: DataTypes.STRING,
        allowNull: false,    
        unique: true,

    },
}, {
    tableName: "roles",
    timestamps: false,
});

module.exports = Rol;
