const { Conductor } = require('../models');

const conductorRepository = {
    findAll: async () => await Conductor.findAll(),
    findById: async (id) => await Conductor.findByPk(id),
    create: async (data) => await Conductor.create(data),
    update: async (id, data) => await Conductor.update(data, { where: {id_historial: id } }),
    delete: async (id) => await Conductor.destroy({ where: {id_historial: id } }),
};

module.exports = conductorRepository;
