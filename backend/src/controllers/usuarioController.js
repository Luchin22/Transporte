const usuarioService = require('../services/usuarioService');
const authService = require('../services/authService');

// Servicio de login
exports.login = async (req, res) => {
    try {
        
        const { email, password } = req.body;
        const result = await authService.login(email, password);
    
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(401).json({ error: 'Refresh token requerido' });

        const tokens = await authService.refreshToken(refreshToken);
        res.status(200).json(tokens);
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
};

exports.getPerfil = () => {
    json({
        usuario_id: usuario_id,
        nombre: nombre,
        apellido: apellido,
        rol: rol
    });
};

exports.registerAdmin = async (req, res) => {
    try {
        const data = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            email: req.body.email,
            password: req.body.password,
            rol_id: 5// Supongamos que el ID del rol "Dueño" es 1
        };
        const usuario = await usuarioService.createUsuario(data);
        res.status(201).json(usuario);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Endpoint para Solicitar el Token de Recuperación
exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const resetToken = await authService.generateResetToken(email);
        res.status(200).json({ message: 'Token de recuperación generado', resetToken }); // En un entorno real, envía el token por correo electrónico
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Endpoint para Restablecer la Contraseña
exports.resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;
        await authService.resetPassword(resetToken, newPassword);
        res.status(200).json({ message: 'Contraseña actualizada con éxito' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
// Método para crear usuario sin autorización de token
// Nuevo endpoint para crear usuarios sin autenticación (sin token)
exports.createUsuarioSinToken = async (req, res) => {
    try {

        const usuario = await usuarioService.createUsuario(req.body);
      
        res.status(200).json(usuario);
    
    } 
    
     catch (error) {
        
        res.status(400).json({ error: error.message });
      
    }
};
exports.updateUsuarioSinToken = async (req, res) => {
    try {
        const { id } = req.params; // ID del usuario desde la URL
        const { nombre, apellido, telefono } = req.body; // Datos a actualizar desde el body

        // Llama al servicio para actualizar el usuario
        const result = await usuarioService.updateUsuario(id, { nombre, apellido, telefono });

        if (result[0] === 1) {
            res.json({ message: 'Usuario actualizado correctamente' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
};




// -----------------------------------------------------------------------------------

// Servicios de usuarios
exports.getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioService.getAllUsuarios();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};

exports.getUsuarioById = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

     

        const usuario = await usuarioService.getUsuarioById(userId);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
};

exports.createUsuario = async (req, res) => {
    try {
        const usuario = await usuarioService.createUsuario(req.body);
        res.status(201).json(usuario);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateUsuario = async (req, res) => {
    try {
        const result = await usuarioService.updateUsuario(req.params.id, req.body);
        if (result[0] === 1) {
            res.json({ message: 'Usuario actualizado correctamente' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
};

exports.deleteUsuario = async (req, res) => {
    try {
        const result = await usuarioService.deleteUsuario(req.params.id);
        if (result === 1) {
            res.json({ message: 'Usuario eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
};