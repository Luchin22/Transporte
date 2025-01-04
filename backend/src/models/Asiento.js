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
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "libre",
    },
}, {
    tableName: "asientos",
    timestamps: false,
});

// Relaciones
Bus.hasMany(Asiento, { foreignKey: "id_bus" });
Asiento.belongsTo(Bus, { foreignKey: "id_bus" });

module.exports = Asiento;
