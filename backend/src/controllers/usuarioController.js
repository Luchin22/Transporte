const usuarioService = require('../services/usuarioService');
const authService = require('../services/authService');
const nodemailer = require("nodemailer");
const usuarioRepository = require("../repositories/usuarioRepository");
const bcrypt = require("bcrypt");


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "reservatransporte177@gmail.com",
        pass: "chdd hlrb dcyx ghgd"  // Asegúrate de usar una contraseña de aplicación
    }
});
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
exports.getUsuarioByEmail = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ error: "El email es requerido" });
        }

        const usuario = await usuarioRepository.findByEmail(email.trim().toLowerCase());
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(usuario);
    } catch (error) {
        console.error("❌ Error al buscar usuario por correo:", error);
        res.status(500).json({ error: "Error en el servidor" });
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

        console.log("📩 Email recibido:", email);
        console.log("🔑 Código ingresado:", resetCode);
        console.log("🔒 Nueva contraseña:", newPassword);

        // Buscar el usuario en la BD
        const usuario = await usuarioRepository.findByEmail(email);
        
        if (!usuario) {
            console.log("❌ Usuario no encontrado en la BD:", email);
            return res.status(400).json({ error: "Correo no registrado" });
        }

        console.log("✅ Usuario encontrado:", usuario.email);
        console.log("📌 Código almacenado en BD:", usuario.reset_token);
        console.log("⏳ Expiración del código:", usuario.reset_token_expiration);

        // Verificar si el código está definido en la BD
        if (!usuario.reset_token) {
            console.log("❌ El usuario no tiene un código de recuperación almacenado");
            return res.status(400).json({ error: "No se ha generado un código de recuperación para este usuario." });
        }

        // Verificar si el código coincide
        if (usuario.reset_token.toString() !== resetCode.toString()) {
            console.log("❌ Código incorrecto. Código esperado:", usuario.reset_token);
            return res.status(400).json({ error: "Código inválido o incorrecto." });
        }

        // Verificar si el código ha expirado
        if (new Date(usuario.reset_token_expiration) < new Date()) {
            console.log("❌ Código expirado");
            return res.status(400).json({ error: "El código de recuperación ha expirado." });
        }

        console.log("✅ Código válido, procediendo con cambio de contraseña...");

        // Encriptar la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar la contraseña y limpiar el código de recuperación
        await usuarioRepository.updatePassword(usuario.usuario_id, hashedPassword);
        await usuarioRepository.clearResetToken(usuario.usuario_id);

        console.log("✅ Contraseña actualizada correctamente para usuario:", usuario.email);
        res.status(200).json({ message: "Contraseña restablecida con éxito" });

    } catch (error) {
        console.error("❌ Error al restablecer la contraseña:", error);
        res.status(500).json({ error: "Error al restablecer la contraseña" });
    }
};

// Endpoint para Solicitar el Token de Recuperación
exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Buscar el usuario en la BD
        const usuario = await usuarioRepository.findByEmail(email);
        if (!usuario) {
            console.log("❌ Usuario no encontrado:", email);
            return res.status(400).json({ error: "Correo no registrado" });
        }

        console.log("✅ Usuario encontrado en la BD:", usuario.email);

        // Generar un código de 6 dígitos
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expirationDate = new Date(Date.now() + 15 * 60 * 1000); // Expira en 15 minutos

        await usuarioRepository.storeResetToken(usuario.usuario_id, resetCode, expirationDate);
        console.log("✅ Código generado y almacenado en la BD:", resetCode);

        // Enviar correo
        await transporter.sendMail({
            from: "noreply@tuapp.com",
            to: email,
            subject: "Código de recuperación de contraseña",
            text: `Tu código de recuperación es: ${resetCode}. Expira en 15 minutos.`
        });

        console.log("📩 Correo enviado a:", email);
        res.status(200).json({ message: "Código enviado a tu correo" });

    } catch (error) {
        console.error("❌ Error al enviar el código:", error);
        res.status(500).json({ error: "Error al enviar el código" });
    }
};

// Endpoint para Restablecer la Contraseña
exports.resetPassword = async (req, res) => {
    try {
        const { email, resetCode, newPassword } = req.body;

        console.log("📩 Email recibido:", email);
        console.log("🔑 Código ingresado por el usuario:", resetCode);

        // Buscar el usuario en la BD
        const usuario = await usuarioRepository.findByEmail(email);
        
        if (!usuario) {
            console.log("❌ Usuario no encontrado:", email);
            return res.status(400).json({ error: "Correo no registrado" });
        }

        console.log("✅ Usuario encontrado:", usuario.email);
        console.log("📌 Código almacenado en BD:", usuario.reset_token);
        console.log("⏳ Expiración del código:", usuario.reset_token_expiration);

        // Verificar si el código está definido en la BD
        if (!usuario.reset_token) {
            console.log("❌ El usuario no tiene un código de recuperación almacenado");
            return res.status(400).json({ error: "No se ha generado un código de recuperación para este usuario." });
        }

        // Verificar si el código ingresado coincide con el almacenado
        if (usuario.reset_token.toString() !== resetCode.toString()) {
            console.log("❌ Código incorrecto.");
            console.log("🔎 Código esperado:", usuario.reset_token);
            console.log("🔎 Código ingresado:", resetCode);
            return res.status(400).json({ error: "Código inválido o incorrecto." });
        }

        // Verificar si el código ha expirado
        if (new Date(usuario.reset_token_expiration) < new Date()) {
            console.log("❌ Código expirado");
            return res.status(400).json({ error: "El código de recuperación ha expirado." });
        }

        console.log("✅ Código válido, procediendo con cambio de contraseña...");

        // Encriptar la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar la contraseña y limpiar el código de recuperación
        await usuarioRepository.updatePassword(usuario.usuario_id, hashedPassword);
        await usuarioRepository.clearResetToken(usuario.usuario_id);

        console.log("✅ Contraseña actualizada correctamente para usuario:", usuario.email);
        res.status(200).json({ message: "Contraseña restablecida con éxito" });

    } catch (error) {
        console.error("❌ Error al restablecer la contraseña:", error);
        res.status(500).json({ error: "Error al restablecer la contraseña" });
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