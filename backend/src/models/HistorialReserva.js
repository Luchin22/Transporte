const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const Usuario = require("./Usuario");
const Reserva = require("./Reserva");

const HistorialReserva = sequelize.define("HistorialReserva", {
    id_historial: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Usuario,
            key: "usuario_id",
        },
    },
    id_reserva: {
        type: DataTypes.INTEGER,
        references: {
            model: Reserva,
            key: "id_reserva",
        },
    },
    fecha_reserva: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    estado: {
        type: DataTypes.STRING,
        defaultValue: "completada",
    },
}, {
    tableName: "historial_reservas",
    timestamps: false,
});

// Relaciones
Usuario.hasMany(HistorialReserva, { foreignKey: "usuario_id" });
HistorialReserva.belongsTo(Usuario, { foreignKey: "usuario_id" });

Reserva.hasMany(HistorialReserva, { foreignKey: "id_reserva" });
HistorialReserva.belongsTo(Reserva, { foreignKey: "id_reserva" });

module.exports = HistorialReserva;
