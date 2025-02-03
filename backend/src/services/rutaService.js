const rutaRepository = require('../repositories/rutaRepository');
const { Pool } = require('pg');

exports.getAllRutas = async () => {
    return await rutaRepository.findAll();
};

exports.getRutaById = async (id) => {
    const ruta = await rutaRepository.findById(id);
    if (!ruta) throw new Error('Ruta no encontrada');
    return ruta;
};

exports.createRuta = async (data) => {
    if (!data.origen || !data.destino || !data.distancia || !data.monto ) {
        throw new Error('Faltan campos obligatorios');
    }
    return await rutaRepository.create(data);
};

exports.updateRuta = async (id, data) => {
    const allowedFields = ["origen", "destino", "distancia", "monto"];
    const filteredData = Object.keys(data)
        .filter((key) => allowedFields.includes(key))
        .reduce((obj, key) => {
            obj[key] = data[key];
            return obj;
        }, {});

    if (Object.keys(filteredData).length === 0) {
        throw new Error("No se enviaron campos válidos para actualizar");
    }

    const result = await rutaRepository.update(id, filteredData);
    if (result[0] === 0) throw new Error("Ruta no encontrada");
    return result;
};


exports.deleteRuta = async (id) => {
    const result = await rutaRepository.delete(id);
    if (result === 0) throw new Error('Ruta no encontrada');
    return result;
};
exports.getRutasWithBusCapacity = async () => {
    return await rutaRepository.findAllWithBusCapacity();
};

