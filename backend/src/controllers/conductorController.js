const conductorService = require('../services/conductorService');

exports.getAllConductores = async (req, res) => {
    try {
        const conductores = await conductorService.getAllConductores();
        res.json(conductores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getConductorById = async (req, res) => {
    try {
        const conductor = await conductorService.getConductorById(req.params.id);
        res.json(conductor);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.createConductor = async (req, res) => {
    try {
        const conductor = await conductorService.createConductor(req.body);
        res.status(201).json(conductor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateConductor = async (req, res) => {
    try {
        await conductorService.updateConductor(req.params.id, req.body);
        res.json({ message: 'Conductor actualizado correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.deleteConductor = async (req, res) => {
    try {
        await conductorService.deleteConductor(req.params.id);
        res.json({ message: 'Conductor eliminado correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
