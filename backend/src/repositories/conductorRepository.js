const { Conductor } = require('../models');

const conductorRepository = {
    findAll: async () => await Conductor.findAll(),
    findById: async (id) => await Conductor.findByPk(id),
    create: async (data) => await Conductor.create(data),
    update: async (id, data) => await Conductor.update(data, { where: { id_conductor: id } }),
    delete: async (id) => await Conductor.destroy({ where: { id_conductor: id } }),
    findByDni: async (dni) => await Conductor.findOne({ where: { dni } }),
};

module.exports = conductorRepository;
