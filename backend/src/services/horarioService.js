const horarioRepository = require('../repositories/horarioRepository');
const { actualizarEstadoBus } = require('../utils/actualizarEstadoBus');

exports.getAllHorarios = async () => {
    return await horarioRepository.findAll();
};

exports.getHorarioById = async (id) => {
    const horario = await horarioRepository.findById(id);
    if (!horario) throw new Error('Horario no encontrado');
    return horario;
};

exports.createHorario = async (data) => {
    if (!data.hora_salida || !data.hora_llegada || !data.id_bus || !data.id_ruta || !data.estado) {
        throw new Error('Faltan campos obligatorios');
    }

    const nuevoHorario = await horarioRepository.create(data);

    // Después de crear el horario, actualizamos el estado del bus
    await actualizarEstadoBus(nuevoHorario);
    return nuevoHorario;
};


exports.updateHorario = async (id, data) => {
    const result = await horarioRepository.update(id, data);
    if (result[0] === 0) throw new Error('Horario no encontrado');
    await actualizarEstadoBus(horarioActualizado);
    return result;
};
exports.updateHora = async (id, hora_salida, hora_llegada) => {
    const result = await horarioRepository.updateHora(id, hora_salida, hora_llegada);
    if (result[0] === 0) throw new Error('Horario no encontrado');
    return { id, hora_salida, hora_llegada };
};


exports.deleteHorario = async (id) => {
    const result = await horarioRepository.delete(id);
    if (result === 0) throw new Error('Horario no encontrado');
    return result;
};

exports.getAllHorariosWithBus = async () => {
    return await horarioRepository.findAllWithBus();
}