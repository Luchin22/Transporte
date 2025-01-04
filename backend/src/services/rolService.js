const rolRepository = require('../repositories/rolRepository');

exports.getAllRoles = async () => {
    return await rolRepository.findAll();
};

exports.getRolById = async (id) => {
    const rol = await rolRepository.findById(id);
    if (!rol) throw new Error('Rol no encontrado');
    return rol;
};

exports.createRol = async (data) => {
    if (!data.nombre_rol) {
        throw new Error('Faltan campos obligatorios');
    }
    return await rolRepository.create(data);
};

exports.updateRol = async (id, data) => {
    const result = await rolRepository.update(id, data);
    if (result[0] === 0) throw new Error('Rol no encontrado');
    return result;
};

exports.deleteRol = async (id) => {
    const result = await rolRepository.delete(id);
    if (result === 0) throw new Error('Rol no encontrado');
    return result;
};
