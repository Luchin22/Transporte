const { Rol } = require('../models');

const rolRepository = {
    findAll: async () => await Rol.findAll(),
    findById: async (id) => await Rol.findByPk(id),
    create: async (data) => await Rol.create(data),
    update: async (id, data) => await Rol.update(data, { where: {rol_id: id } }),
    delete: async (id) => await Rol.destroy({ where: {rol_id: id } }),
};

module.exports = rolRepository;
