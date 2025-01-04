const historialReservaRepository = require('../repositories/historialreservaRepository');

exports.getAllHistorialReservas = async () => {
    return await historialReservaRepository.findAll();
};

exports.getHistorialReservaById = async (id) => {
    const historialReserva = await historialReservaRepository.findById(id);
    if (!historialReserva) throw new Error('Historial de reserva no encontrado');
    return historialReserva;
};

exports.createHistorialReserva = async (data) => {
    if (!data.usuario_id || !data.id_reserva) {
        throw new Error('Faltan campos obligatorios');
    }
    return await historialReservaRepository.create(data);
};

exports.updateHistorialReserva = async (id, data) => {
    const result = await historialReservaRepository.update(id, data);
    if (result[0] === 0) throw new Error('Historial de reserva no encontrado');
    return result;
};

exports.deleteHistorialReserva = async (id) => {
    const result = await historialReservaRepository.delete(id);
    if (result === 0) throw new Error('Historial de reserva no encontrado');
    return result;
};
