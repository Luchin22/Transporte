const historialReservaService = require('../services/historialreservaService');

exports.getAllHistorialReservas = async (req, res) => {
    try {
        const historialReservas = await historialReservaService.getAllHistorialReservas();
        res.status(200).json(historialReservas);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Error al obtener el historial de reservas' });
    }
};
exports.getAllReservas = async (req, res) => {
    try {
        const historialReservas = await historialReservaService.getAllReservas();
        res.status(200).json(historialReservas);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Error al obtener el historial de reservas' });
    }
};

exports.getHistorialReservaById = async (req, res) => {
    try {
        const historialReserva = await historialReservaService.getHistorialReservaById(req.params.id);
        res.status(200).json(historialReserva);
    } catch (error) {
        res.status(error.status || 404).json({ message: error.message || 'Historial de reserva no encontrado' });
    }
};

exports.createHistorialReserva = async (req, res) => {
    try {
        const historialReserva = await historialReservaService.createHistorialReserva(req.body);
        res.status(201).json({
            message: 'Historial de reserva creado correctamente',
            historialReserva,
        });
    } catch (error) {
        res.status(error.status || 400).json({ message: error.message || 'Error al crear el historial de reserva' });
    }
};
exports.createReserva = async (req, res) => {
    try {
        const reserva = await historialReservaService.createReserva(req.body);
        res.status(201).json({
            message: 'Reserva creada correctamente',
            reserva,
        });
    } catch (error) {
        res.status(error.status || 400).json({ message: error.message || 'Error al crear la reserva' });
    }
};
exports.updateHistorialReserva = async (req, res) => {
    try {
        await historialReservaService.updateHistorialReserva(req.params.id, req.body);
        res.status(200).json({ message: 'Historial de reserva actualizado correctamente' });
    } catch (error) {
        res.status(error.status || 404).json({ message: error.message || 'Error al actualizar el historial de reserva' });
    }
};

exports.deleteHistorialReserva = async (req, res) => {
    try {
        await historialReservaService.deleteHistorialReserva(req.params.id);
        res.status(200).json({ message: 'Historial de reserva eliminado correctamente' });
    } catch (error) {
        res.status(error.status || 404).json({ message: error.message || 'Error al eliminar el historial de reserva' });
    }
};
