const busRepository = require('../repositories/busRepository');

exports.getAllBuses = async () => {
    return await busRepository.findAll();
};

exports.getBusById = async (id) => {
    const bus = await busRepository.findById(id);
    if (!bus) throw new Error('Bus no encontrado');
    return bus;
};

exports.createBus = async (data) => {
    if (!data.placa || !data.marca || !data.modelo || !data.capacidad || !data.estado) {
        
    
        throw new Error('Faltan campos obligatorios');
    }
    return await busRepository.create(data);
};

exports.updateBus = async (id, data) => {
    const result = await busRepository.update(id, data);
    if (result[0] === 0) throw new Error('Bus no encontrado');
    return result;
};

exports.deleteBus = async (id) => {
    const result = await busRepository.delete(id);
    if (result === 0) throw new Error('Bus no encontrado');
    return result;
};
