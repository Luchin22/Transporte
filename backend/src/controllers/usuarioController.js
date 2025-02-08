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
exports.resetPassword = async (req, res) => {
    try {
        const { email, resetCode, newPassword } = req.body;

        // Verificar si el email existe
        const usuario = await usuarioRepository.findByEmail(email);
        if (!usuario) {
            return res.status(400).json({ error: "Correo no registrado" });
        }

        // Verificar el código de recuperación
        if (usuario.reset_token !== resetCode || usuario.reset_token_expiration < new Date()) {
            return res.status(400).json({ error: "Código inválido o expirado" });
        }

        // Encriptar la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar la contraseña y limpiar el código
        await usuarioRepository.updatePassword(usuario.usuario_id, hashedPassword);
        await usuarioRepository.clearResetToken(usuario.usuario_id);

        res.status(200).json({ message: "Contraseña restablecida con éxito" });

    } catch (error) {
        res.status(500).json({ error: "Error al restablecer la contraseña" });
    }
};

// Endpoint para Solicitar el Token de Recuperación
exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Verificar si el email está registrado
        const usuario = await usuarioRepository.findByEmail(email);
        if (!usuario) {
            return res.status(400).json({ error: "Correo no registrado" });
        }

        // Generar un código de 6 dígitos
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expirationDate = new Date(Date.now() + 15 * 60 * 1000); // Expira en 15 minutos

        // Guardar el código en la base de datos
        await usuarioRepository.storeResetToken(usuario.usuario_id, resetCode, expirationDate);

        // Configurar el servicio de correo
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "tucorreo@gmail.com",
                pass: "tupassword"
            }
        });

        // Enviar el código al correo
        await transporter.sendMail({
            from: "noreply@tuapp.com",
            to: email,
            subject: "Código de recuperación de contraseña",
            text: `Tu código de recuperación es: ${resetCode}. Expira en 15 minutos.`
        });

        res.status(200).json({ message: "Código enviado a tu correo" });

    } catch (error) {
        res.status(500).json({ error: "Error al enviar el código" });
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