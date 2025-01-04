const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const Usuario = require("./Usuario");
const Asiento = require("./Asiento");
const Horario = require("./Horario");

const Reserva = sequelize.define("Reserva", {
    id_reserva: {
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
    id_asiento: {
        type: DataTypes.INTEGER,
        references: {
            model: Asiento,
            key: "id_asiento",
        },
    },
    id_horario: {
        type: DataTypes.INTEGER,
        references: {
            model: Horario,
            key: "id_horario",
        },
    },
    fecha_reserva: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    estado: {
        type: DataTypes.STRING,
        defaultValue: "confirmada",
    },
}, {
    tableName: "reservas",
    timestamps: false,
});

// Relaciones
Usuario.hasMany(Reserva, { foreignKey: "usuario_id" });
Reserva.belongsTo(Usuario, { foreignKey: "usuario_id" });

Asiento.hasOne(Reserva, { foreignKey: "id_asiento" });
Reserva.belongsTo(Asiento, { foreignKey: "id_asiento" });

Horario.hasMany(Reserva, { foreignKey: "id_horario" });
Reserva.belongsTo(Horario, { foreignKey: "id_horario" });

module.exports = Reserva;
