const usuarioRepository = require("../repositories/usuarioRepository");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// Generar tokens de acceso y refresh
const generateTokens = (usuario) => {
    const accessToken = jwt.sign(
        {
            usuario_id: usuario.usuario_id,
            rol: usuario.rol_id,
            nombre: usuario.nombre,
            apellido: usuario.apellido
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" } // Token de acceso expira en 1 hora o el valor en .env
    );

    const refreshToken = jwt.sign(
        {
            usuario_id: usuario.usuario_id,
            rol: usuario.rol_id,
            nombre: usuario.nombre,
            apellido: usuario.apellido
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" } // Refresh token expira en 7 días
    );

    return { accessToken, refreshToken };
};

// Login con generación de tokens
exports.login = async (email, password) => {
    // Buscar el usuario por email
    const usuario = await usuarioRepository.findByEmail(email);
    if (!usuario) {
        console.log("donde es el error");
        throw new Error("Correo electrónico o contraseña incorrectos");
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, usuario.password);
    if (!isPasswordValid) {
        console.log("donde el error");
        throw new Error("Correo electrónico o contraseña incorrectos");
    }


    // Retornar los tokens y la información básica del usuario
    return {
        usuario: {
            usuario_id: usuario.usuario_id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            rol_id: usuario.rol_id,
        },
    };
};

// Renovación de tokens
exports.refreshToken = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const usuario = await usuarioRepository.findById(decoded.usuario_id);

        if (!usuario) throw new Error("Usuario no encontrado");
        if (usuario.refresh_token !== refreshToken)
            throw new Error("Refresh token no válido");

        const tokens = generateTokens(usuario);
        await usuarioRepository.storeRefreshToken(
            usuario.usuario_id,
            tokens.refreshToken
        ); // Actualizar el refresh token en la base de datos

        return tokens;
    } catch (error) {
        throw new Error("Refresh token no válido o expirado");
    }
};

// recuperacion de contrasena
exports.generateResetToken = async (email) => {
    const usuario = await usuarioRepository.findByEmail(email);
    if (!usuario) throw new Error('Usuario no encontrado');

    const resetToken = crypto.randomBytes(32).toString('hex'); // Token seguro de 32 bytes
    const expirationDate = new Date(Date.now() + 3600000); // Expira en 1 hora

    await usuarioRepository.storeResetToken(usuario.usuario_id, resetToken, expirationDate);

    // Aquí podrías enviar el token al email del usuario usando un servicio de email
    return resetToken;
};

exports.resetPassword = async (resetToken, newPassword) => {
    const usuario = await usuarioRepository.findByResetToken(resetToken);
    if (!usuario || usuario.reset_token_expiration < Date.now()) {
        throw new Error('Token inválido o expirado');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await usuarioRepository.updatePassword(usuario.usuario_id, hashedPassword);
    await usuarioRepository.clearResetToken(usuario.usuario_id); // Limpiar el token después del cambio
};