const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const Ruta = require("./Ruta");

const Horario = sequelize.define("Horario", {
    id_horario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_ruta: {
        type: DataTypes.INTEGER,
        references: {
            model: Ruta,
            key: "id_ruta",
        },
    },
    hora_salida: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    hora_llegada: {
        type: DataTypes.TIME,
        allowNull: false,
    },
}, {
    tableName: "horarios",
    timestamps: false,
});

// Relaciones
Ruta.hasMany(Horario, { foreignKey: "id_ruta" });
Horario.belongsTo(Ruta, { foreignKey: "id_ruta" });

module.exports = Horario;
