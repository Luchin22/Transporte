const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const Ruta = require("./Ruta");
const Bus = require("./Bus");

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
    id_bus: {
        type: DataTypes.INTEGER,
        references: {
            model: Bus,
            key: "id_bus",
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
    estado:   {
        type: DataTypes.STRING,
       
    }
}, {
    tableName: "horarios",
    timestamps: false,
});

// Relaciones
Ruta.hasMany(Horario, { foreignKey: "id_ruta" });
Horario.belongsTo(Ruta, { foreignKey: "id_ruta" });

Bus.hasMany(Horario, { foreignKey: "id_bus" });
Horario.belongsTo(Bus, { foreignKey: "id_bus" });

module.exports = Horario;
