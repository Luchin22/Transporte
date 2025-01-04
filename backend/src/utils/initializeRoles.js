const { Rol } = require('../models');

const initializeRoles = async () => {
    const roles = [
        { nombre: 'Administrador', permisos: ["crear_usuario", "ver_usuario", "editar_usuario", "eliminar_usuario"] },
        { nombre: 'Usuario', permisos: ["ver_usuario", "editar_usuario","crear_usuario"] },
        
    ];

    for (const roleData of roles) {
        const [role, created] = await Rol.findOrCreate({
            where: { nombre: roleData.nombre },
            defaults: roleData
        });
    }
};


module.exports = initializeRoles;