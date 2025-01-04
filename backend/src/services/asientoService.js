const asientoRepository = require('../repositories/asientoRepository');

exports.getAllAsientos = async () => {
    return await asientoRepository.findAll();
};

exports.getAsientoById = async (id) => {
    const asiento = await asientoRepository.findById(id);
    if (!asiento) throw new Error('Asiento no encontrado');
    return asiento;
};

exports.createAsiento = async (data) => {
    if (!data.numero || !data.estado ) {
        throw new Error('Faltan campos obligatorios');
    }
    return await asientoRepository.create(data);
};

exports.updateAsiento = async (id, data) => {
    const result = await asientoRepository.update(id, data);
    if (result[0] === 0) throw new Error('Asiento no encontrado');
    return result;
};

exports.deleteAsiento = async (id) => {
    const result = await asientoRepository.delete(id);
    if (result === 0) throw new Error('Asiento no encontrado');
    return result;
};
