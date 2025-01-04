const { Bus } = require('../models');

const busRepository = {
    findAll: async () => await Bus.findAll(),
    findById: async (id) => await Bus.findByPk(id),
    create: async (data) => await Bus.create(data),
    update: async (id, data) => await Bus.update(data, { where: { id_bus: id } }),
    delete: async (id) => await Bus.destroy({ where: { id_bus:id } }),
};

module.exports = busRepository;
