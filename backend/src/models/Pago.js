const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const Reserva = require("./Reserva");

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
        defaultValue: "pendiente",
    },
}, {
    tableName: "pagos",
    timestamps: false,
});

// Relaciones
Reserva.hasOne(Pago, { foreignKey: "id_reserva" });
Pago.belongsTo(Reserva, { foreignKey: "id_reserva" });

module.exports = Pago;
