const asientoService = require('../services/asientoService');

exports.getAllAsientos = async (req, res) => {
    try {
        const asientos = await asientoService.getAllAsientos();
        res.json(asientos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAsientoById = async (req, res) => {
    try {
        const asiento = await asientoService.getAsientoById(req.params.id);
        res.json(asiento);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.createAsiento = async (req, res) => {
    try {
        const asiento = await asientoService.createAsiento(req.body);
        res.status(201).json(asiento);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateAsiento = async (req, res) => {
    try {
        await asientoService.updateAsiento(req.params.id, req.body);
        res.json({ message: 'Asiento actualizado correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.deleteAsiento = async (req, res) => {
    try {
        await asientoService.deleteAsiento(req.params.id);
        res.json({ message: 'Asiento eliminado correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
