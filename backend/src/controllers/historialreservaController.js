const historialReservaService = require('../services/historialreservaService');

exports.getAllHistorialReservas = async (req, res) => {
    try {
        const historialReservas = await historialReservaService.getAllHistorialReservas();
        res.json(historialReservas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getHistorialReservaById = async (req, res) => {
    try {
        const historialReserva = await historialReservaService.getHistorialReservaById(req.params.id);
        res.json(historialReserva);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.createHistorialReserva = async (req, res) => {
    try {
        const historialReserva = await historialReservaService.createHistorialReserva(req.body);
        res.status(201).json(historialReserva);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateHistorialReserva = async (req, res) => {
    try {
        await historialReservaService.updateHistorialReserva(req.params.id, req.body);
        res.json({ message: 'Historial de reserva actualizado correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.deleteHistorialReserva = async (req, res) => {
    try {
        await historialReservaService.deleteHistorialReserva(req.params.id);
        res.json({ message: 'Historial de reserva eliminado correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
