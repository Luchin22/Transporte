const { Pago, Reserva } = require('../models');

const ReservaRepository = {
    findAll: async () => await Reserva.findAll(),
    findById: async (id) => await Reserva.findByPk(id),
    create: async (data) => await Reserva.create(data),
    update: async (id, data) => await  Reserva.update(data, { where: {id_reserva: id } }),
    delete: async (id) => await Reserva.destroy({ where: {id_reserva: id } }),
};

module.exports = ReservaRepository;
