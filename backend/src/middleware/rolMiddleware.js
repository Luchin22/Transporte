const { Rol } = require('../models');

const roleMiddleware = (requiredPermissions) => async (req, res, next) => {
    try {
        // Extrae el rol del usuario desde el token
        const usuarioRolId = req.user.rol;

        // Busca el rol y sus permisos en la base de datos
        const rol = await Rol.findByPk(usuarioRolId);
        if (!rol) {
            return res.status(403).json({ error: 'Acceso denegado: rol no encontrado' });
        }

        // Imprimir permisos del usuario y los permisos requeridos para la ruta
        console.log("Permisos del rol del usuario:", rol.permisos);
        console.log("Permisos requeridos para la ruta:", requiredPermissions);

        // Verificar si el usuario tiene los permisos requeridos
        const userPermissions = rol.permisos;
        const hasPermission = requiredPermissions.every(permission =>
            userPermissions.includes(permission)
        );

        console.log("¿Tiene permiso?", hasPermission);

        if (!hasPermission) {
            return res.status(403).json({ error: 'Acceso denegado: no tienes permisos para esta acción' });
        }

        next(); // Permitir el acceso si el rol tiene los permisos necesarios
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error de autorización' });
    }
};

module.exports = roleMiddleware;