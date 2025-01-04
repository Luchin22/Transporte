const pagoService = require('../services/pagoService');

exports.getAllPagos = async (req, res) => {
    try {
        const pagos = await pagoService.getAllPagos();
        res.json(pagos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPagoById = async (req, res) => {
    try {
        const pago = await pagoService.getPagoById(req.params.id);
        res.json(pago);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.createPago = async (req, res) => {
    try {
        const pago = await pagoService.createPago(req.body);
        res.status(201).json(pago);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updatePago = async (req, res) => {
    try {
        await pagoService.updatePago(req.params.id, req.body);
        res.json({ message: 'Pago actualizado correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.deletePago = async (req, res) => {
    try {
        await pagoService.deletePago(req.params.id);
        res.json({ message: 'Pago eliminado correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
