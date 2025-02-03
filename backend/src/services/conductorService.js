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
    if (!data.dni || !data.telefono || !data.licencia || !data.nombre_conductor) {
        throw new Error('Faltan campos obligatorios');
    }

    const dniExistente = await conductorRepository.findByDni(data.dni);
    if (dniExistente) throw new Error('El DNI ya está registrado');

    return await conductorRepository.create(data);
};

exports.updateConductor = async (id, data) => {
    const conductorExistente = await conductorRepository.findById(id);
    if (!conductorExistente) throw new Error('Conductor no encontrado');
  
    // Agregar log para verificar los datos antes de la actualización
    console.log("Datos a actualizar:", data);
  
    await conductorRepository.update(id, data);
    
    return { message: 'Conductor actualizado correctamente' };
  };
  


exports.deleteConductor = async (id) => {
    const result = await conductorRepository.delete(id);
    if (result === 0) throw new Error('Conductor no encontrado');
    return { message: 'Conductor eliminado correctamente' };
};
