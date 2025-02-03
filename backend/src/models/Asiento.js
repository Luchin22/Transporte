const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const Bus = require("./Bus");

const Asiento = sequelize.define("Asiento", {
    id_asiento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_bus: {
        type: DataTypes.INTEGER,
        references: {
            model: Bus,
            key: "id_bus",
        },
    },
    numero: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    estado: {
        type: DataTypes.STRING
    },
    fecha_asiento: {
        type: DataTypes.STRING,
    },
    hora_salida: {
        type: DataTypes.TIME
    },
    hora_llegada: {
        type: DataTypes.TIME
    }
}, {
    tableName: "asientos",
    timestamps: false,
});

// Relaciones
Bus.hasMany(Asiento, { foreignKey: "id_bus" });
Asiento.belongsTo(Bus, { foreignKey: "id_bus" });

module.exports = Asiento;
