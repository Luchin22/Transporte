const busService = require('../services/busService');

exports.getAllBuses = async (req, res) => {
    try {
        const buses = await busService.getAllBuses();
        res.json(buses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBusById = async (req, res) => {
    try {
        const bus = await busService.getBusById(req.params.id);
        res.json(bus);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.createBus = async (req, res) => {
    try {
        const bus = await busService.createBus(req.body);
        res.status(201).json(bus);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateBus = async (req, res) => {
    try {
        await busService.updateBus(req.params.id, req.body);
        res.json({ message: 'Bus actualizado correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.deleteBus = async (req, res) => {
    try {
        await busService.deleteBus(req.params.id);
        res.json({ message: 'Bus eliminado correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
