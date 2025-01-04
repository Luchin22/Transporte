const reservaRepository = require('../repositories/reservaRepository');

exports.getAllReservas = async () => {
    return await reservaRepository.findAll();
};

exports.getReservaById = async (id) => {
    const reserva = await reservaRepository.findById(id);
    if (!reserva) throw new Error('Reserva no encontrada');
    return reserva;
};

exports.createReserva = async (data) => {
    if (!data.usuario_id || !data.fecha_reserva) {
        throw new Error('Faltan campos obligatorios');
    }
    return await reservaRepository.create(data);
};

exports.updateReserva = async (id, data) => {
    const result = await reservaRepository.update(id, data);
    if (result[0] === 0) throw new Error('Reserva no encontrada');
    return result;
};

exports.deleteReserva = async (id) => {
    const result = await reservaRepository.delete(id);
    if (result === 0) throw new Error('Reserva no encontrada');
    return result;
};
