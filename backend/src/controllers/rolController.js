const rolService = require('../services/rolService');

exports.getAllRoles = async (req, res) => {
    try {
        const roles = await rolService.getAllRoles();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRolById = async (req, res) => {
    try {
        const rol = await rolService.getRolById(req.params.id);
        res.json(rol);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.createRol = async (req, res) => {
    try {
        const rol = await rolService.createRol(req.body);
        res.status(201).json(rol);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateRol = async (req, res) => {
    try {
        await rolService.updateRol(req.params.id, req.body);
        res.json({ message: 'Rol actualizado correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.deleteRol = async (req, res) => {
    try {
        await rolService.deleteRol(req.params.id);
        res.json({ message: 'Rol eliminado correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
