const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const Reserva = require("./Reserva");
const Usuario = require("./Usuario");
const Asiento = require("./Asiento");
const Bus = require("./Bus");
const Pago = sequelize.define("Pago", {
    id_pago: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_reserva: {
        type: DataTypes.INTEGER,
        references: {
            model: Reserva,
            key: "id_reserva",
        },
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Usuario,
            key: "usuario_id",
        },
    },
    id_bus: {
        type: DataTypes.INTEGER,
        references: {
            model: Bus,
            key: "id_bus",
        },
    },
    id_asiento : {
        type: DataTypes.INTEGER,
        references: {
            model: Asiento,
            key: "id_asiento",
        },
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    fecha_pago: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    metodo_pago: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    estado_pago: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: "pagos",
    timestamps: false,
});

// Relaciones
Reserva.hasOne(Pago, { foreignKey: "id_reserva" });
Pago.belongsTo(Reserva, { foreignKey: "id_reserva" });

Usuario.hasMany(Pago, { foreignKey: "usuario_id" });
Pago.belongsTo(Usuario, { foreignKey: "usuario_id" });

Asiento.hasMany(Pago, { foreignKey: "id_asiento" });
Pago.belongsTo(Asiento, { foreignKey: "id_asiento" });

Bus.hasMany(Pago, { foreignKey: "id_bus" });
Pago.belongsTo(Bus, { foreignKey: "id_bus" });

module.exports = Pago;
