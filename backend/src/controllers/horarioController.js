const horarioService = require('../services/horarioService');

exports.getAllHorarios = async (req, res) => {
    try {
        const horarios = await horarioService.getAllHorarios();
        res.json(horarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getHorarioById = async (req, res) => {
    try {
        const horario = await horarioService.getHorarioById(req.params.id);
        res.json(horario);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.createHorario = async (req, res) => {
    try {
        const horario = await horarioService.createHorario(req.body);
        res.status(201).json(horario);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateHorario = async (req, res) => {
    try {
        await horarioService.updateHorario(req.params.id, req.body);
        res.json({ message: 'Horario actualizado correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.deleteHorario = async (req, res) => {
    try {
        await horarioService.deleteHorario(req.params.id);
        res.json({ message: 'Horario eliminado correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
