const { Horario, Bus, Conductor, Ruta } = require('../models');

const horarioRepository = {
    findAll: async () => await Horario.findAll(),
    findById: async (id) => await Horario.findByPk(id),
    create: async (data) => await Horario.create(data),
    update: async (id, data) => await Horario.update(data, { where: { id_horario: id } }),
    updateHora: async (id, hora_salida, hora_llegada) => {
        return await Horario.update(
            { hora_salida, hora_llegada },
            { where: { id_horario: id } }
        );
    },
    
    delete: async (id) => await Horario.destroy({ where: { id_horario:id } }),
    findAllWithBus: async () => {
        return await Horario.findAll({ 
            include: [
                {
                model: Bus,
                attributes: ['id_bus', 'capacidad','numero', 'estado'],
                include: [
                    {
                    model: Conductor,
                    attributes: ['id_conductor', 'nombre_conductor'],
                    as: 'Conductor',
                    }
                ]
                },
                {
                    model:Ruta,
                    attributes: ['id_ruta', 'origen', 'destino', 'monto'],

                },
            ],
            attributes: ['id_horario', 'hora_salida', 'hora_llegada', 'estado'],
        });
    },
};
module.exports = horarioRepository;
