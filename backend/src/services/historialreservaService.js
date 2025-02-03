const historialReservaRepository = require('../repositories/historialreservaRepository');

exports.getAllHistorialReservas = async () => {
    try {
        return await historialReservaRepository.findAll();
    } catch (error) {
        throw { status: 500, message: 'Error al obtener el historial de reservas', error };
    }
};
exports.getAllReservas = async () => {
    try {
        return await historialReservaRepository.findAllReservas();
    } catch (error) {
        throw { status: 500, message: 'Error al obtener el historial de reservas', error };
    }
    
}



exports.createHistorialReserva = async (data) => {
    try {
        if (!data.id_pago || !data.estado || !data.categoria || !data.usuario_id ) {
            throw { status: 400, message: 'Faltan campos obligatorios' };
        }
        return await historialReservaRepository.create(data);
    } catch (error) {
        throw { status: 500, message: 'Error al crear el historial de reserva', error };
    }
};
exports.createReserva = async (data) => {
    try {
        // Validar los campos obligatorios para una reserva
        if (!data.id_reserva || !data.estado || !data.categoria || !data.usuario_id) {
            throw { status: 400, message: 'Faltan campos obligatorios ' };
        }

        // Llamar al método específico del repositorio para crear solo la reserva
        return await historialReservaRepository.createReserva(data);
    } catch (error) {
        throw { status: 500, message: 'Error al crear la reserva', error };
    }
};

exports.updateHistorialReserva = async (id, data) => {
    try {
        const result = await historialReservaRepository.update(id, data);
        if (result[0] === 0) {
            throw { status: 404, message: 'Historial de reserva no encontrado' };
        }
        return { message: 'Historial de reserva actualizado correctamente', result };
    } catch (error) {
        throw { status: 500, message: 'Error al actualizar el historial de reserva', error };
    }
};

exports.deleteHistorialReserva = async (id) => {
    try {
        const result = await historialReservaRepository.delete(id);
        if (result === 0) {
            throw { status: 404, message: 'Historial de reserva no encontrado' };
        }
        return { message: 'Historial de reserva eliminado correctamente', result };
    } catch (error) {
        throw { status: 500, message: 'Error al eliminar el historial de reserva', error };
    }
};
