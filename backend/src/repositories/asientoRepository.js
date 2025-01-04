const { Asiento } = require('../models');

const asientoRepository = {
    findAll: async () => await Asiento.findAll(),
    findById: async (id) => await Asiento.findByPk(id),
    create: async (data) => await Asiento.create(data),
    update: async (id, data) => await Asiento.update(data, { where: { id_asiento:id } }),
    delete: async (id) => await Asiento.destroy({ where: { id_asiento: id } }),
};

module.exports = asientoRepository;
