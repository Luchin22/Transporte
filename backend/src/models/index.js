const Usuario = require('./Usuario');
const Bus = require('./Bus');
const Asiento = require('./Asiento');
const Ruta = require('./Ruta');
const Horario = require('./Horario');
const Reserva = require('./Reserva');
const Pago = require('./Pago');
const HistorialReserva = require('./HistorialReserva');
const Rol = require('./Rol');
const Conductor = require('./Conductor');

// Relaciones

// Relación Rol - Usuario
Rol.hasMany(Usuario, { foreignKey: 'rol_id' });
Usuario.belongsTo(Rol, { foreignKey: 'rol_id' });

// Relación Usuario - Reserva
Usuario.hasMany(Reserva, { foreignKey: 'usuario_id' });
Reserva.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Relación Usuario - HistorialReserva
Usuario.hasMany(HistorialReserva, { foreignKey: 'usuario_id' });
HistorialReserva.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Relación Reserva - HistorialReserva
Reserva.hasMany(HistorialReserva, { foreignKey: 'id_reserva' });
HistorialReserva.belongsTo(Reserva, { foreignKey: 'id_reserva' });

// Relación Reserva - Pago
Reserva.hasOne(Pago, { foreignKey: 'id_reserva' });
Pago.belongsTo(Reserva, { foreignKey: 'id_reserva' });

// Relación asiento -Bus
// Relaciones
Bus.hasMany(Asiento, { foreignKey: "id_bus" });
Asiento.belongsTo(Bus, { foreignKey: "id_bus" });




// Relación Ruta - Horario
Ruta.hasMany(Horario, { foreignKey: 'id_ruta' });
Horario.belongsTo(Ruta, { foreignKey: 'id_ruta' });

// Relación Horario - Reserva
Horario.hasMany(Reserva, { foreignKey: 'id_horario' });
Reserva.belongsTo(Horario, { foreignKey: 'id_horario' });

// Relación Bus - Conductor
Bus.hasMany(Conductor, { foreignKey: 'id_bus' });
Conductor.belongsTo(Bus, { foreignKey: 'id_bus' });

// Relacion Bus - Ruta
Bus.hasMany(Ruta, { foreignKey: 'id_bus' });
Ruta.belongsTo(Bus, { foreignKey: 'id_bus' });

Pago.hasMany(HistorialReserva, { foreignKey: "id_pago" });
HistorialReserva.belongsTo(Pago, { foreignKey: "id_pago" });


Usuario.hasMany(Pago, { foreignKey: "usuario_id" });
Pago.belongsTo(Usuario, { foreignKey: "usuario_id" });


Asiento.hasMany(Pago, { foreignKey: "id_asiento" });
Pago.belongsTo(Asiento, { foreignKey: "id_asiento" });

// Relación Conductor - Usuario
Conductor.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Usuario.hasOne(Conductor, { foreignKey: 'usuario_id' });

Bus.hasMany(Horario, { foreignKey: "id_bus" });
Horario.belongsTo(Bus, { foreignKey: "id_bus" });


Bus.hasMany(Pago, { foreignKey: "id_bus" });
Pago.belongsTo(Bus, { foreignKey: "id_bus" });

module.exports = {
  Usuario,
  Rol,
  Bus,
  Asiento,
  Ruta,
  Horario,
  Reserva,
  Pago,
  HistorialReserva,
  Conductor,
};
