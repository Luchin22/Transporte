const rutaRepository = require('../repositories/rutaRepository');

exports.getAllRutas = async () => {
    return await rutaRepository.findAll();
};

exports.getRutaById = async (id) => {
    const ruta = await rutaRepository.findById(id);
    if (!ruta) throw new Error('Ruta no encontrada');
    return ruta;
};

exports.createRuta = async (data) => {
    if (!data.origen || !data.destino || !data.distancia) {
        throw new Error('Faltan campos obligatorios');
    }
    return await rutaRepository.create(data);
};

exports.updateRuta = async (id, data) => {
    const result = await rutaRepository.update(id, data);
    if (result[0] === 0) throw new Error('Ruta no encontrada');
    return result;
};

exports.deleteRuta = async (id) => {
    const result = await rutaRepository.delete(id);
    if (result === 0) throw new Error('Ruta no encontrada');
    return result;
};
