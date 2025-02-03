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
    try {
        if (!data.placa || !data.marca || !data.capacidad || !data.modelo || !data.capacidad_inicial || !data.estado || !data.numero || !data.id_conductor) {
            throw new Error('Faltan campos obligatorios');
        }

        return await busRepository.create(data);
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            throw new Error("La placa ya está registrada. Intente con otra.");
        }
        throw error;
    }
};

exports.updateRoute = async (id, id_ruta) => {
    if (!id_ruta) {
        throw new Error("El id_ruta es obligatorio");
    }
    const result = await busRepository.updateRoute(id, id_ruta);
    if (result[0] === 0) {
        throw new Error(`Bus con id ${id} no encontrado`);
    }
    return { message: `Ruta del bus ${id} actualizada correctamente` };
};

exports.updateBus = async (id, data) => {
    try {
        const result = await Bus.update(data, { where: { id_bus: id } });
        if (result[0] === 0) throw new Error(`Bus con id ${id} no encontrado`);
        console.log(`Bus ${id} actualizado correctamente.`);
    } catch (error) {
        console.error(`Error al actualizar el bus ${id}:`, error.message);
        throw error;
    }
};
exports.updateBusDato = async (id, data) => {
    try {
        const result = await busRepository.updateBusDato(id, data);
        if (result[0] === 0) throw new Error(`Bus con id ${id} no encontrado`);
        return { message: `Bus ${id} actualizado correctamente` };
    } catch (error) {
        console.error(`Error al actualizar el bus ${id}:`, error.message);
        throw error;
    }
};


exports.deleteBus = async (id) => {
    const result = await busRepository.delete(id);
    if (result === 0) throw new Error('Bus no encontrado');
    return result;
};
