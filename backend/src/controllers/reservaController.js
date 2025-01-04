const reservaService = require('../services/reservaService');

exports.getAllReservas = async (req, res) => {
    try {
        const reservas = await reservaService.getAllReservas();
        res.json(reservas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getReservaById = async (req, res) => {
    try {
        const reserva = await reservaService.getReservaById(req.params.id);
        res.json(reserva);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.createReserva = async (req, res) => {
    try {
        const reserva = await reservaService.createReserva(req.body);
        res.status(201).json(reserva);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateReserva = async (req, res) => {
    try {
        await reservaService.updateReserva(req.params.id, req.body);
        res.json({ message: 'Reserva actualizada correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.deleteReserva = async (req, res) => {
    try {
        await reservaService.deleteReserva(req.params.id);
        res.json({ message: 'Reserva eliminada correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
