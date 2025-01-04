const { Ruta } = require('../models');

const rolRepository = {
    findAll: async () => await Ruta.findAll(),
    findById: async (id) => await Ruta.findByPk(id),
    create: async (data) => await Ruta.create(data),
    update: async (id, data) => await Ruta.update(data, { where: {id_ruta: id } }),
    delete: async (id) => await Ruta.destroy({ where: {id_ruta: id } }),
};

module.exports = rolRepository;
