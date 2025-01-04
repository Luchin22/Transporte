const rutaService = require('../services/rutaService');

exports.getAllRutas = async (req, res) => {
    try {
        const rutas = await rutaService.getAllRutas();
        res.json(rutas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRutaById = async (req, res) => {
    try {
        const ruta = await rutaService.getRutaById(req.params.id);
        res.json(ruta);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.createRuta = async (req, res) => {
    try {
        const ruta = await rutaService.createRuta(req.body);
        res.status(201).json(ruta);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateRuta = async (req, res) => {
    try {
        await rutaService.updateRuta(req.params.id, req.body);
        res.json({ message: 'Ruta actualizada correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.deleteRuta = async (req, res) => {
    try {
        await rutaService.deleteRuta(req.params.id);
        res.json({ message: 'Ruta eliminada correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
