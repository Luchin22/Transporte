const horarioRepository = require('../repositories/horarioRepository');

exports.getAllHorarios = async () => {
    return await horarioRepository.findAll();
};

exports.getHorarioById = async (id) => {
    const horario = await horarioRepository.findById(id);
    if (!horario) throw new Error('Horario no encontrado');
    return horario;
};

exports.createHorario = async (data) => {
    if (!data.hora_salida || !data.hora_llegada) {
        throw new Error('Faltan campos obligatorios');
    }
    return await horarioRepository.create(data);
};

exports.updateHorario = async (id, data) => {
    const result = await horarioRepository.update(id, data);
    if (result[0] === 0) throw new Error('Horario no encontrado');
    return result;
};

exports.deleteHorario = async (id) => {
    const result = await horarioRepository.delete(id);
    if (result === 0) throw new Error('Horario no encontrado');
    return result;
};
