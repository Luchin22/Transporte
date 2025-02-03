const { Bus } = require('../models');

const busRepository = {
    findAll: async () => await Bus.findAll(),
    findById: async (id) => await Bus.findByPk(id),
    create: async (data) => await Bus.create(data),
    updateBusDato: async (id, data) => {
        return await Bus.update(data, { 
            where: { id_bus: id },
            fields: ['placa', 'marca', 'modelo', 'capacidad', 'estado', 'numero']  // Solo actualiza estos campos
        });
    },
    update: async (id, data) => await Bus.update(data, { where: { id_bus: id } }),
    updateRoute: async (id, id_ruta) => {
        return await Bus.update({ id_ruta }, { where: { id_bus: id } });
    },
    delete: async (id) => await Bus.destroy({ where: { id_bus:id } }),
};

module.exports = busRepository;
