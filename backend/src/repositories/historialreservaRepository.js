const { HistorialReserva, Pago, Reserva, Usuario } = require('../models');

const historialreservaRepository = {
    findAll: async () => 
        await HistorialReserva.findAll({
            include: [
                {
                    model: Pago,
                    attributes: ['monto', 'fecha_pago'], // Solo las columnas necesarias
                },
               { 
                
                model: Reserva, // Agregar modelo Reserva si tiene una relación
                attributes: ['monto', 'fecha_reserva'],
                
               },
               { model: Usuario,
                attributes: ['nombre', 'apellido'],
                }
              
            ],
        }),

    findById: async (id) => 
        await HistorialReserva.findByPk(id, {
            include: [
                {
                    model: Pago,
                    attributes: ['monto', 'fecha_pago'], // Solo las columnas necesarias
                },
            ],
        }),

    create: async (data) => await HistorialReserva.create(data),
    createReserva: async (data) => await HistorialReserva.create(data),

    update: async (id, data) => 
        await HistorialReserva.update(data, { where: { id_historial: id } }),

    delete: async (id) => 
        await HistorialReserva.destroy({ where: { id_historial: id } }),
};

module.exports = historialreservaRepository;
