const conductorRepository = require('../repositories/conductorRepository');

exports.getAllConductores = async () => {
    return await conductorRepository.findAll();
};

exports.getConductorById = async (id) => {
    const conductor = await conductorRepository.findById(id);
    if (!conductor) throw new Error('Conductor no encontrado');
    return conductor;
};

exports.createConductor = async (data) => {
    if (!data.dni || !data.telefono || !data.licencia || !data.nombre_conductor ) {
        throw new Error('Faltan campos obligatorios');
    }
    return await conductorRepository.create(data);
};

exports.updateConductor = async (id, data) => {
    const result = await conductorRepository.update(id, data);
    if (result[0] === 0) throw new Error('Conductor no encontrado');
    return result;
};

exports.deleteConductor = async (id) => {
    const result = await conductorRepository.delete(id);
    if (result === 0) throw new Error('Conductor no encontrado');
    return result;
};
