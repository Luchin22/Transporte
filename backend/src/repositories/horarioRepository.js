const { Horario } = require('../models');

const horarioRepository = {
    findAll: async () => await Horario.findAll(),
    findById: async (id) => await Horario.findByPk(id),
    create: async (data) => await Horario.create(data),
    update: async (id, data) => await Horario.update(data, { where: { id_horario: id } }),
    delete: async (id) => await Horario.destroy({ where: { id_horario:id } }),
};

module.exports = horarioRepository;
