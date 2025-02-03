const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const Usuario = require("./Usuario");
const Reserva = require("./Reserva");
const Pago = require("./Pago");

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
    id_pago: {
        type: DataTypes.INTEGER,
        references: {
            model: Pago,
            key: "id_pago",
        },
    },
    fecha_reserva: {
        type: DataTypes.DATE,
       
    },
    
    estado: {
        type: DataTypes.STRING,
       
    },
    categoria: {
        type: DataTypes.STRING,
       
    },
}, {
    tableName: "historial_reservas",
    timestamps: false,
});

// Relaciones
Usuario.hasMany(HistorialReserva, { foreignKey: "usuario_id" });
HistorialReserva.belongsTo(Usuario, { foreignKey: "usuario_id" });

Pago.hasMany(HistorialReserva, { foreignKey: "id_pago" });
HistorialReserva.belongsTo(Pago, { foreignKey: "id_pago" });

Reserva.hasMany(HistorialReserva, { foreignKey: "id_reserva" });
HistorialReserva.belongsTo(Reserva, { foreignKey: "id_reserva" });

module.exports = HistorialReserva;
